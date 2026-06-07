import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 4173);
const host = /^[a-z0-9.:-]+$/i.test(process.env.HOST || "") ? process.env.HOST : "0.0.0.0";
const defaultBookmarkFile = process.env.BOOKMARK_FILE || "";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const wikipediaCache = new Map();
const compoundPublicSuffixes = new Set([
  "com.au",
  "com.br",
  "com.cn",
  "com.hk",
  "com.sg",
  "com.tw",
  "co.jp",
  "co.kr",
  "co.nz",
  "co.uk",
  "co.in",
  "gov.cn",
  "net.cn",
  "org.cn",
]);

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function serveStatic(req, res) {
  const requestedPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const cleanPath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(publicDir, cleanPath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    const ext = path.extname(filePath);
    res.writeHead(200, { "content-type": mimeTypes.get(ext) || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) return null;
  return parsed;
}

function coreDomainName(host = "") {
  const labels = String(host || "")
    .toLowerCase()
    .replace(/^www\./, "")
    .split(".")
    .filter(Boolean);
  if (!labels.length) return "";
  if (labels.length === 1) return labels[0];
  const suffix = labels.slice(-2).join(".");
  if (compoundPublicSuffixes.has(suffix) && labels.length >= 3) return labels[labels.length - 3];
  return labels[labels.length - 2];
}

function cleanSnippet(value = "") {
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 BookmarkOrganizer/1.0",
        accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Wikipedia returned ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

function wikipediaUrl(language, title) {
  return `https://${language}.wikipedia.org/wiki/${encodeURIComponent(String(title || "").replaceAll(" ", "_"))}`;
}

async function searchWikipediaLanguage(language, query) {
  const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("format", "json");
  url.searchParams.set("srlimit", "3");
  url.searchParams.set("srsearch", query);
  const payload = await fetchJsonWithTimeout(url, 1500);
  const results = Array.isArray(payload?.query?.search) ? payload.query.search : [];
  if (!results.length) return null;
  const normalizedQuery = query.toLowerCase();
  const preferred =
    results.find((item) => String(item.title || "").toLowerCase().includes(normalizedQuery)) || results[0];
  return {
    query,
    language,
    title: preferred.title || "",
    snippet: cleanSnippet(preferred.snippet || ""),
    url: wikipediaUrl(language, preferred.title || query),
  };
}

async function lookupWikipediaDomain(host = "") {
  const query = coreDomainName(host);
  if (!query || query.length < 2 || /^\d+$/.test(query)) return null;
  if (wikipediaCache.has(query)) return wikipediaCache.get(query);

  const lookup = (async () => {
    const settled = await Promise.allSettled(
      ["zh", "en"].map((language) => searchWikipediaLanguage(language, query)),
    );
    for (const result of settled) {
      if (result.status === "fulfilled" && result.value) {
        return result.value;
      }
    }
    return null;
  })();

  wikipediaCache.set(query, lookup);
  return lookup;
}

function wikipediaMetadata(wikipedia) {
  if (!wikipedia) return {};
  return {
    wikipediaQuery: wikipedia.query,
    wikipediaLanguage: wikipedia.language,
    wikipediaTitle: wikipedia.title,
    wikipediaSnippet: wikipedia.snippet,
    wikipediaUrl: wikipedia.url,
  };
}

async function attemptFetch(url, method, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 BookmarkOrganizer/1.0",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    return {
      ok: response.ok,
      statusCode: response.status,
      finalUrl: response.url,
      statusText: response.statusText,
    };
  } finally {
    clearTimeout(timer);
  }
}

function decodeEntities(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)));
}

function extractMeta(html) {
  const head = html.slice(0, 180000);
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionMatch = head.match(
    /<meta[^>]+(?:name|property)=["'](?:description|og:description|twitter:description)["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  );
  const keywordsMatch = head.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  return {
    pageTitle: decodeEntities((titleMatch?.[1] || "").replace(/<[^>]+>/g, " ").trim()),
    description: decodeEntities((descriptionMatch?.[1] || "").trim()),
    keywords: decodeEntities((keywordsMatch?.[1] || "").trim()),
  };
}

function extractPageText(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(h1|h2|h3|p|li|article|section|main|div|span|a)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(cleaned)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

function extractKeywordsFromText(text) {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "this",
    "that",
    "you",
    "your",
    "are",
    "was",
    "have",
    "has",
    "not",
    "all",
    "can",
    "home",
    "page",
    "login",
    "sign",
    "更多",
    "首页",
    "登录",
    "注册",
    "关于",
    "我们",
    "使用",
    "产品",
    "服务",
    "网站",
  ]);
  const counts = new Map();
  const tokens = text.toLowerCase().match(/[\p{Script=Han}]{2,}|[a-z0-9][a-z0-9-]{2,}/gu) || [];
  for (const token of tokens) {
    if (stopWords.has(token) || token.length > 32) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 24)
    .map(([token]) => token);
}

async function analyzeOne(item, options = {}) {
  const startedAt = Date.now();
  const includeText = Boolean(options.includeText);
  let parsed = null;
  let wikipediaPromise = null;
  try {
    parsed = normalizeUrl(item.url);
    if (!parsed) {
      return {
        id: item.id,
        url: item.url,
        ok: false,
        state: "skipped",
        host: "",
        detail: "不是普通网页链接",
        ms: Date.now() - startedAt,
      };
    }
    wikipediaPromise = lookupWikipediaDomain(parsed.hostname).catch(() => null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    try {
      const response = await fetch(parsed.href, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 BookmarkOrganizer/1.0",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      const contentType = response.headers.get("content-type") || "";
      let metadata = {};
      if (contentType.includes("text/html") || contentType.includes("application/xhtml")) {
        const html = await response.text();
        metadata = extractMeta(html);
        if (includeText) {
          const pageText = extractPageText(html);
          metadata.pageText = pageText;
          metadata.pageKeywords = extractKeywordsFromText(pageText);
        }
      }
      const wikipedia = await wikipediaPromise;
      return {
        id: item.id,
        url: item.url,
        ok: response.ok,
        state: response.ok ? "valid" : "review",
        statusCode: response.status,
        finalUrl: response.url,
        host: new URL(response.url).hostname,
        contentType,
        ...metadata,
        ...wikipediaMetadata(wikipedia),
        detail: response.statusText || "",
        ms: Date.now() - startedAt,
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    const wikipedia = wikipediaPromise ? await wikipediaPromise : null;
    return {
      id: item.id,
      url: item.url,
      ok: false,
      state: "review",
      host: parsed?.hostname || "",
      ...wikipediaMetadata(wikipedia),
      detail: error?.name === "AbortError" ? "页面元信息读取超时" : error?.message || "无法读取页面元信息",
      ms: Date.now() - startedAt,
    };
  }
}

async function deepAnalyzeOne(item) {
  return analyzeOne(item, { includeText: true });
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function classifyWithLocalLlm(item, categories, profile) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  const model = process.env.OLLAMA_MODEL || "qwen2.5:7b";
  try {
    const prompt = [
      "你是浏览器书签自动分类器。请只从给定分类中选择一个最合适分类。",
      `用户行业和职业：${profile || "未提供"}`,
      `可选分类：${categories.join("、")}`,
      "请返回严格 JSON：{\"category\":\"分类名\",\"reason\":\"20字以内理由\"}",
      `标题：${item.title || ""}`,
      `域名：${item.host || ""}`,
      `URL：${item.url || ""}`,
      `页面内容：${String(item.text || "").slice(0, 5000)}`,
    ].join("\n");
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.1 },
      }),
    });
    if (!response.ok) throw new Error(`Ollama 返回 ${response.status}`);
    const payload = await response.json();
    const parsed = parseJsonFromText(payload.response);
    const category = parsed?.category;
    if (!categories.includes(category)) {
      return { id: item.id, category: "待整理", reason: "模型没有返回有效分类" };
    }
    return { id: item.id, category, reason: parsed?.reason || "本地模型判断" };
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(item) {
  const startedAt = Date.now();
  try {
    const parsed = normalizeUrl(item.url);
    if (!parsed) {
      return {
        id: item.id,
        url: item.url,
        state: "skipped",
        label: "不支持检测",
        detail: "不是普通网页链接",
        ms: Date.now() - startedAt,
      };
    }

    let result = await attemptFetch(parsed.href, "HEAD", 6500);
    if ([405, 403, 501].includes(result.statusCode)) {
      result = await attemptFetch(parsed.href, "GET", 8000);
    }

    let state = "valid";
    let label = "正常";
    if ([401, 403, 429].includes(result.statusCode)) {
      state = "review";
      label = "需确认";
    } else if (result.statusCode >= 400) {
      state = "invalid";
      label = "可能失效";
    }

    return {
      id: item.id,
      url: item.url,
      state,
      label,
      statusCode: result.statusCode,
      finalUrl: result.finalUrl,
      detail: result.statusText || "",
      ms: Date.now() - startedAt,
    };
  } catch (error) {
    const message = error?.name === "AbortError" ? "连接超时" : error?.message || "无法访问";
    const review = /certificate|ssl|tls|self signed|timeout/i.test(message);
    return {
      id: item.id,
      url: item.url,
      state: review ? "review" : "invalid",
      label: review ? "需确认" : "可能失效",
      detail: message,
      ms: Date.now() - startedAt,
    };
  }
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/local-bookmarks") {
      if (!existsSync(defaultBookmarkFile)) {
        sendJson(res, 404, { ok: false, message: "没有找到默认书签文件" });
        return;
      }
      const content = await readFile(defaultBookmarkFile, "utf8");
      sendJson(res, 200, {
        ok: true,
        filename: path.basename(defaultBookmarkFile),
        content,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/check-links") {
      const payload = await readRequestJson(req);
      const items = Array.isArray(payload.items) ? payload.items.slice(0, 120) : [];
      const results = await mapWithConcurrency(items, 8, checkOne);
      sendJson(res, 200, { ok: true, results });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/analyze-links") {
      const payload = await readRequestJson(req);
      const items = Array.isArray(payload.items) ? payload.items.slice(0, 80) : [];
      const results = await mapWithConcurrency(items, 6, analyzeOne);
      sendJson(res, 200, { ok: true, results });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/deep-analyze-links") {
      const payload = await readRequestJson(req);
      const items = Array.isArray(payload.items) ? payload.items.slice(0, 48) : [];
      const results = await mapWithConcurrency(items, 4, deepAnalyzeOne);
      sendJson(res, 200, { ok: true, results });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/llm-classify") {
      const payload = await readRequestJson(req);
      const categories = Array.isArray(payload.categories) ? payload.categories.slice(0, 40) : [];
      const items = Array.isArray(payload.items) ? payload.items.slice(0, 12) : [];
      if (!categories.length || !items.length) {
        sendJson(res, 200, { ok: true, results: [] });
        return;
      }
      try {
        const results = await mapWithConcurrency(items, 2, (item) =>
          classifyWithLocalLlm(item, categories, payload.profile || ""),
        );
        sendJson(res, 200, { ok: true, results });
      } catch (error) {
        sendJson(res, 200, {
          ok: false,
          message:
            "本地大模型不可用。请确认 Ollama 已运行，并已安装模型 qwen2.5:7b，或设置 OLLAMA_MODEL。",
          detail: error?.message || "",
          results: [],
        });
      }
      return;
    }

    if (req.method === "GET") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { ok: false, message: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error?.message || "Server error" });
  }
});

server.listen(port, host, () => {
  console.log(`Bookmark organizer is running at http://localhost:${port}`);
});
