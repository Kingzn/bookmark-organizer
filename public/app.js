const fallbackCategory = "待整理";
const pendingCategory = "待分析";
const tones = ["teal", "blue", "coral", "amber", "green", "violet"];

const linkCategoryRules = [
  { name: "AI模型与助手", keywords: ["openai", "chatgpt", "claude", "gemini", "grok", "kimi", "deepseek", "qwen", "大语言", "llm", "模型", "智能体", "agent", "prompt", "ai assistant"] },
  { name: "AI图像视频创作", keywords: ["midjourney", "stable diffusion", "comfyui", "runway", "pika", "绘画", "生图", "视频生成", "ai video", "image generation", "aigc"] },
  { name: "AI编程与开发助手", keywords: ["cursor", "trae", "copilot", "windsurf", "cline", "代码助手", "ai coding", "ide", "mcp", "agentic coding"] },
  { name: "设计素材与创意资源", keywords: ["adobe", "shutterstock", "freepik", "pixabay", "unsplash", "depositphotos", "素材", "图片", "图库", "矢量", "插画", "icon", "图标", "behance", "dribbble", "graphics", "graphic design", "image editing", "creative software", "设计软件", "创意软件"] },
  { name: "品牌字体与配色", keywords: ["font", "fonts", "字体", "配色", "color", "palette", "logo", "brand", "品牌", "规范", "ui gradients", "色彩"] },
  { name: "3D与数字内容", keywords: ["thingiverse", "ultimaker", "cura", "3d", "模型", "打印", "stl", "c4d", "blender", "cgtrader", "turbosquid", "cg", "render"] },
  { name: "健康医疗与科研", keywords: ["health", "medical", "medicine", "healthcare", "biotech", "pharma", "genomics", "gene", "cell", "protein", "pubmed", "ncbi", "clinical", "fda", "健康", "医疗", "医学", "科研", "论文", "文献", "临床", "指南"] },
  { name: "在线转换与实用工具", keywords: ["convert", "converter", "compress", "pdf", "ocr", "resize", "download", "tester", "generator", "utility", "utilities", "tool", "在线", "转换", "压缩", "识别", "生成器", "测试", "实用程序"] },
  { name: "营销与增长", keywords: ["marketing", "seo", "ads", "analytics", "campaign", "social media marketing", "content marketing", "营销", "广告", "海报", "活动", "增长", "crm"] },
  { name: "建站域名与云服务", keywords: ["wordpress", "wix", "domain", "hosting", "dns", "cloudflare", "aliyun", "腾讯云", "vercel", "netlify", "建站", "域名", "服务器", "ssl"] },
  { name: "开发技术与开源项目", keywords: ["github", "gitlab", "gitee", "stackoverflow", "developer", "docs", "api", "npm", "docker", "python", "javascript", "wireshark", "microsoft learn", "sdk", "software development", "programming", "open source", "open-source", "developer platform", "软件开发", "编程", "开源"] },
  { name: "课程教程与知识库", keywords: ["教程", "课程", "学习", "academy", "khan", "wiki", "知乎", "csdn", "cnblogs", "bilibili", "文档", "learn", "manual", "training"] },
  { name: "办公协作与公司系统", keywords: ["trello", "office", "oa", "dashboard", "admin", "workspace", "工作台", "客户中心", "控制台", "公司", "企业", "协同", "项目管理"] },
  { name: "邮箱账号与登录入口", keywords: ["mail", "gmail", "qq.com", "163.com", "alimail", "accounts", "login", "signin", "登录", "邮箱", "收件箱", "account"] },
  { name: "社交博客与内容平台", keywords: ["facebook", "instagram", "twitter", "x.com", "weibo", "renren", "sina", "blog", "wordpress", "博客", "社区", "论坛", "小红书", "social networking", "social media", "microblogging", "社交网络", "社交媒体"] },
  { name: "影音娱乐与游戏", keywords: ["netflix", "youtube", "music", "video", "movie", "game", "游戏", "电影", "音乐", "视频", "podcast", "bilibili"] },
  { name: "网络与安全", keywords: ["security", "cybersecurity", "vpn", "proxy", "privacy", "password", "firewall", "安全", "隐私", "密码", "网络", "防火墙"] },
  { name: "政务金融与生活服务", keywords: ["gov", "government", "bank", "finance", "insurance", "tax", "credit", "real estate", "政府", "政务", "银行", "金融", "保险", "信用", "登记", "税务", "生活服务"] },
  { name: "新闻媒体与资讯", keywords: ["news", "media", "newspaper", "magazine", "press", "newsletter", "新闻", "媒体", "资讯", "日报", "杂志"] },
  { name: "电商购物与消费", keywords: ["shop", "store", "mall", "amazon", "taobao", "jd.com", "tmall", "ecommerce", "retail", "购物", "电商", "商城", "订单", "零售"] },
];

const domainCategoryRules = [
  { category: "设计素材与创意资源", domains: ["adobe.com", "stock.adobe.com", "shutterstock.com", "freepik.com", "pixabay.com", "unsplash.com", "depositphotos.com", "behance.net", "dribbble.com"] },
  { category: "3D与数字内容", domains: ["thingiverse.com", "ultimaker.com", "cgtrader.com", "turbosquid.com"] },
  { category: "AI模型与助手", domains: ["openai.com", "chatgpt.com", "claude.ai", "gemini.google.com", "deepseek.com", "kimi.moonshot.cn"] },
  { category: "开发技术与开源项目", domains: ["github.com", "gitlab.com", "gitee.com", "stackoverflow.com", "npmjs.com", "developer.mozilla.org", "learn.microsoft.com"] },
  { category: "营销与增长", domains: ["analytics.google.com"] },
  { category: "邮箱账号与登录入口", domains: ["mail.google.com", "gmail.com", "mail.qq.com", "mail.163.com", "qiye.aliyun.com"] },
  { category: "社交博客与内容平台", domains: ["instagram.com"] },
];

const state = {
  bookmarks: [],
  categories: [pendingCategory],
  fileName: "",
  checking: false,
  classifying: false,
};

const $ = (selector) => document.querySelector(selector);
const elements = {
  industry: $("#industryInput"),
  role: $("#roleInput"),
  profileState: $("#profileState"),
  fileName: $("#fileName"),
  importState: $("#importState"),
  fileInput: $("#fileInput"),
  classifyBtn: $("#classifyBtn"),
  classifyHint: $("#classifyHint"),
  classifyProgress: $("#classifyProgress"),
  classifyProgressBar: $("#classifyProgressBar"),
  classifyProgressPercent: $("#classifyProgressPercent"),
  classifyProgressMeta: $("#classifyProgressMeta"),
  classifyProgressCurrent: $("#classifyProgressCurrent"),
  useLocalLlm: $("#useLocalLlm"),
  exportBtn: $("#exportBtn"),
  checkInvalidBtn: $("#checkInvalidBtn"),
  invalidProgress: $("#invalidProgress"),
  invalidProgressBar: $("#invalidProgressBar"),
  invalidProgressPercent: $("#invalidProgressPercent"),
  invalidProgressMeta: $("#invalidProgressMeta"),
  invalidProgressCurrent: $("#invalidProgressCurrent"),
  reviewBtn: $("#reviewBtn"),
  statusLine: $("#statusLine"),
  totalBookmarks: $("#totalBookmarks"),
  categoryCount: $("#categoryCount"),
  reviewCount: $("#reviewCount"),
  invalidCount: $("#invalidCount"),
  deleteCount: $("#deleteCount"),
  visibleCount: $("#visibleCount"),
  categoryBoard: $("#categoryBoard"),
  bookmarkRows: $("#bookmarkRows"),
  search: $("#searchInput"),
  categoryFilter: $("#categoryFilter"),
  statusFilter: $("#statusFilter"),
  reviewDialog: $("#reviewDialog"),
  reviewList: $("#reviewList"),
  reviewSummary: $("#reviewSummary"),
  markDeleteBtn: $("#markDeleteBtn"),
  stripIcons: $("#stripIcons"),
};

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value || "";
  return textarea.value;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clampPercent(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function shortTitle(value) {
  const text = String(value || "").trim();
  if (!text) return "准备处理";
  return text.length > 48 ? `${text.slice(0, 48)}...` : text;
}

function updateProgress(kind, { done, total, current, label }) {
  const prefix = kind === "classify" ? "classify" : "invalid";
  const panel = elements[`${prefix}Progress`];
  const bar = elements[`${prefix}ProgressBar`];
  const percentText = elements[`${prefix}ProgressPercent`];
  const meta = elements[`${prefix}ProgressMeta`];
  const currentText = elements[`${prefix}ProgressCurrent`];
  const percent = clampPercent(done, total);

  panel.classList.remove("hidden");
  bar.style.width = `${percent}%`;
  bar.parentElement.setAttribute("aria-valuenow", String(percent));
  percentText.textContent = `${percent}%`;
  meta.textContent = `${label} ${Math.min(done, total)} / ${total}`;
  currentText.textContent = current || "准备处理";
}

function setWorkingButton(button, label, done, total) {
  const percent = clampPercent(done, total);
  button.classList.add("is-working");
  button.disabled = true;
  button.textContent = `${label} ${percent}%`;
}

function clearWorkingButton(button, label, disabled) {
  button.classList.remove("is-working");
  button.textContent = label;
  button.disabled = disabled;
}

function resetProgress(kind) {
  const prefix = kind === "classify" ? "classify" : "invalid";
  const panel = elements[`${prefix}Progress`];
  const bar = elements[`${prefix}ProgressBar`];
  const percentText = elements[`${prefix}ProgressPercent`];
  const meta = elements[`${prefix}ProgressMeta`];
  const currentText = elements[`${prefix}ProgressCurrent`];
  panel.classList.add("hidden");
  bar.style.width = "0%";
  bar.parentElement.setAttribute("aria-valuenow", "0");
  percentText.textContent = "0%";
  meta.textContent = kind === "classify" ? "分类进度" : "检测进度";
  currentText.textContent = "等待开始";
}

function parseAttributes(raw) {
  const attrs = {};
  const attrRegex = /([A-Z_:-]+)\s*=\s*"([^"]*)"/gi;
  let match;
  while ((match = attrRegex.exec(raw))) {
    attrs[match[1].toUpperCase()] = decodeHtml(match[2]);
  }
  return attrs;
}

function parseBookmarks(html) {
  const tokenRegex = /<DT><(H3|A)\b([^>]*)>([\s\S]*?)<\/\1>|<DL><p>|<\/DL><p>/gi;
  const stack = [];
  const bookmarks = [];
  const folders = [];
  let pendingFolder = null;
  let match;
  let id = 1;

  while ((match = tokenRegex.exec(html))) {
    const token = match[0].toLowerCase();
    if (match[1] === "H3") {
      const name = decodeHtml(match[3].replace(/<[^>]*>/g, "")).trim() || "未命名文件夹";
      const attrs = parseAttributes(match[2]);
      pendingFolder = name;
      folders.push({ name, path: [...stack, name].join("/"), attrs });
      continue;
    }
    if (match[1] === "A") {
      const attrs = parseAttributes(match[2]);
      const url = attrs.HREF || "";
      const title = decodeHtml(match[3].replace(/<[^>]*>/g, "")).trim() || url || "未命名书签";
      bookmarks.push({
        id: `b${id++}`,
        title,
        url,
        attrs,
        originalFolder: stack.join("/"),
        category: pendingCategory,
        categoryReason: "",
        categoryConfidence: 0,
        categoryProgress: 0,
        analysis: null,
        status: "unchecked",
        statusLabel: "未检测",
        statusDetail: "",
        deleted: false,
        host: getHost(url),
      });
      continue;
    }
    if (token === "<dl><p>") {
      if (pendingFolder) {
        stack.push(pendingFolder);
        pendingFolder = null;
      }
      continue;
    }
    if (token === "</dl><p>") {
      stack.pop();
    }
  }

  return { bookmarks, folders };
}

function getHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return "";
  }
}

function hasProfile() {
  return elements.industry.value.trim().length > 0 && elements.role.value.trim().length > 0;
}

function needsServerRuntime() {
  return window.location.protocol === "file:";
}

function profileMissingText() {
  const missing = [];
  if (!elements.industry.value.trim()) missing.push("行业");
  if (!elements.role.value.trim()) missing.push("职业");
  return missing.join("和");
}

function profileText() {
  return `${elements.industry.value} ${elements.role.value}`.toLowerCase();
}

function baseLinkText(bookmark) {
  const analysis = bookmark.analysis || {};
  return [
    bookmark.title,
    bookmark.url,
    bookmark.host,
    analysis.pageTitle,
    analysis.description,
    analysis.keywords,
    Array.isArray(analysis.pageKeywords) ? analysis.pageKeywords.join(" ") : "",
    analysis.pageText,
    analysis.finalUrl,
    analysis.contentType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function wikipediaText(bookmark) {
  const analysis = bookmark.analysis || {};
  return [
    analysis.wikipediaQuery,
    analysis.wikipediaTitle,
    analysis.wikipediaSnippet,
    analysis.wikipediaUrl,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function linkText(bookmark) {
  return [baseLinkText(bookmark), wikipediaText(bookmark)].filter(Boolean).join(" ");
}

function scoreBookmark(bookmark, rule, profile) {
  const text = baseLinkText(bookmark);
  const wiki = wikipediaText(bookmark);
  let score = 0;
  const matched = [];
  for (const keyword of rule.keywords) {
    const normalized = keyword.toLowerCase();
    if (text.includes(normalized)) {
      score += 6;
      matched.push(keyword);
    }
    if (wiki.includes(normalized)) {
      score += 4;
      if (!matched.includes(`维基百科:${keyword}`)) matched.push(`维基百科:${keyword}`);
    }
    if (profile.includes(normalized)) score += 2;
  }
  if (profile.includes(rule.name.toLowerCase())) score += 3;
  if (bookmark.analysis?.pageTitle) score += 1;
  if (bookmark.analysis?.wikipediaTitle) score += 1;
  return { score, matched };
}

function domainCategory(bookmark) {
  const hosts = [bookmark.host, bookmark.analysis?.host, getHost(bookmark.analysis?.finalUrl || "")]
    .filter(Boolean)
    .map((host) => host.toLowerCase().replace(/^www\./, ""));
  for (const rule of domainCategoryRules) {
    for (const host of hosts) {
      if (rule.domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
        return rule.category;
      }
    }
  }
  return "";
}

function chooseCategory(bookmark, profile) {
  const hasBodyText = Boolean(bookmark.analysis?.pageText);
  const analyzed = Boolean(bookmark.analysis) || !/^https?:\/\//i.test(bookmark.url);
  const domainMatch = domainCategory(bookmark);
  if (domainMatch) {
    return {
      category: domainMatch,
      confidence: 100,
      progress: 100,
      reason: `域名优先：${bookmark.host || bookmark.analysis?.host || "已识别站点"}`,
    };
  }

  let winner = { name: fallbackCategory, score: 0, matched: [] };
  for (const rule of linkCategoryRules) {
    const result = scoreBookmark(bookmark, rule, profile);
    if (result.score > winner.score) {
      winner = { name: rule.name, score: result.score, matched: result.matched };
    }
  }
  if (winner.score < 4) {
    return {
      category: fallbackCategory,
      confidence: winner.score,
      progress: hasBodyText || !/^https?:\/\//i.test(bookmark.url) ? 100 : analyzed ? 55 : 25,
      reason: hasBodyText ? "页面正文没有足够明确的分类信号" : "链接标题和域名没有足够明确的分类信号",
    };
  }
  return {
    category: winner.name,
    confidence: winner.score,
    progress: hasBodyText || !/^https?:\/\//i.test(bookmark.url) ? 100 : analyzed ? 60 : 45,
    reason: winner.matched.some((item) => item.startsWith("维基百科:"))
      ? `维基百科命中：${[...new Set(winner.matched.map((item) => item.replace(/^维基百科:/, "")))]
          .slice(0, 4)
          .join("、")}`
      : winner.matched.length
        ? `${hasBodyText ? "正文命中" : "命中"}：${winner.matched.slice(0, 4).join("、")}`
      : "根据链接页面信息判断",
  };
}

function applyDetectedCategories(bookmarks = state.bookmarks) {
  const profile = profileText();
  for (const bookmark of bookmarks) {
    const result = chooseCategory(bookmark, profile);
    bookmark.category = result.category;
    bookmark.categoryReason = result.reason;
    bookmark.categoryConfidence = result.confidence;
    bookmark.categoryProgress = result.progress;
  }
  state.categories = buildCategoriesFromBookmarks();
}

function resetClassificationState() {
  for (const bookmark of state.bookmarks) {
    bookmark.category = pendingCategory;
    bookmark.categoryReason = "等待链接识别";
    bookmark.categoryConfidence = 0;
    bookmark.categoryProgress = 0;
    bookmark.analysis = null;
  }
  state.categories = buildCategoriesFromBookmarks();
}

async function classifyBookmarks() {
  if (!hasProfile()) {
    setStatus("请先填写行业和职业。");
    return;
  }
  if (needsServerRuntime()) {
    setStatus("自动分类需要后端服务。请用线上地址或 http://localhost:4173 打开应用，不要直接打开 HTML 文件。");
    updateClassifyAvailability();
    return;
  }
  if (state.classifying) return;
  state.classifying = true;
  setWorkingButton(elements.classifyBtn, "识别中", 0, 1);

  resetClassificationState();
  const localOnly = state.bookmarks.filter(
    (bookmark) => !bookmark.deleted && !/^https?:\/\//i.test(bookmark.url),
  );
  applyDetectedCategories(localOnly);
  render();

  const targets = state.bookmarks.filter(
    (bookmark) => !bookmark.deleted && /^https?:\/\//i.test(bookmark.url) && !bookmark.analysis,
  );
  updateProgress("classify", {
    done: 0,
    total: Math.max(targets.length * 2, 1),
    current: targets.length ? `第一遍准备读取：${shortTitle(targets[0].title)}` : "没有需要联网读取的链接，使用本地链接信息完成分类",
    label: "分类进度",
  });
  setWorkingButton(elements.classifyBtn, "第一遍", 0, Math.max(targets.length * 2, 1));
  const chunkSize = 12;
  let analyzed = 0;
  for (let start = 0; start < targets.length; start += chunkSize) {
    const chunk = targets.slice(start, start + chunkSize);
    updateProgress("classify", {
      done: analyzed,
      total: targets.length * 2,
      current: `第一遍：${shortTitle(chunk[0]?.title)} 至 ${shortTitle(chunk[chunk.length - 1]?.title)}`,
      label: "分类进度",
    });
    setWorkingButton(elements.classifyBtn, "第一遍", analyzed, targets.length * 2);
    setStatus(
      `第一遍：读取链接标题、页面描述和维基百科域名结果 ${analyzed + 1}-${Math.min(analyzed + chunk.length, targets.length)} / ${targets.length}`,
    );
    const response = await fetch("/api/analyze-links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: chunk.map(({ id, url }) => ({ id, url })) }),
    });
    const payload = await response.json();
    for (const result of payload.results || []) {
      const bookmark = state.bookmarks.find((item) => item.id === result.id);
      if (!bookmark) continue;
      bookmark.analysis = result;
      if (result.host) bookmark.host = getHost(result.finalUrl || result.url || bookmark.url) || bookmark.host;
    }
    analyzed += chunk.length;
    applyDetectedCategories(chunk);
    updateProgress("classify", {
      done: analyzed,
      total: targets.length * 2,
      current: `第一遍完成 ${analyzed} 条链接识别`,
      label: "分类进度",
    });
    setWorkingButton(elements.classifyBtn, "第一遍", analyzed, targets.length * 2);
    render();
  }

  const secondPassTargets = targets;
  const secondTotal = Math.max(targets.length * 2, 1);
  let reviewed = 0;
  for (let start = 0; start < secondPassTargets.length; start += 30) {
    const chunk = secondPassTargets.slice(start, start + 30);
    const done = targets.length + reviewed;
    updateProgress("classify", {
      done,
      total: secondTotal,
      current: `第二遍正文复核：${shortTitle(chunk[0]?.title)} 至 ${shortTitle(chunk[chunk.length - 1]?.title)}`,
      label: "分类进度",
    });
    setWorkingButton(elements.classifyBtn, "第二遍", done, secondTotal);
    setStatus(
      `第二遍：读取页面正文并减少待整理 ${reviewed + 1}-${Math.min(reviewed + chunk.length, secondPassTargets.length)} / ${secondPassTargets.length}`,
    );
    const response = await fetch("/api/deep-analyze-links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: chunk.map(({ id, url }) => ({ id, url })) }),
    });
    const payload = await response.json();
    for (const result of payload.results || []) {
      const bookmark = state.bookmarks.find((item) => item.id === result.id);
      if (!bookmark) continue;
      bookmark.analysis = { ...(bookmark.analysis || {}), ...result };
      if (result.host) bookmark.host = getHost(result.finalUrl || result.url || bookmark.url) || bookmark.host;
    }
    reviewed += chunk.length;
    applyDetectedCategories(chunk);
    updateProgress("classify", {
      done: targets.length + reviewed,
      total: secondTotal,
      current: `第二遍已复核 ${reviewed} 条低置信度链接`,
      label: "分类进度",
    });
    setWorkingButton(elements.classifyBtn, "第二遍", targets.length + reviewed, secondTotal);
    render();
  }

  const llmTargets = elements.useLocalLlm.checked
    ? state.bookmarks.filter(
        (bookmark) =>
          !bookmark.deleted &&
          bookmark.category !== pendingCategory &&
          (bookmark.category === fallbackCategory || bookmark.categoryConfidence < 8),
      )
    : [];
  const finalTotal = secondTotal + llmTargets.length;
  if (llmTargets.length) {
    updateProgress("classify", {
      done: secondTotal,
      total: finalTotal,
      current: `本地大模型复核：准备处理 ${llmTargets.length} 条难分类书签`,
      label: "分类进度",
    });
    setWorkingButton(elements.classifyBtn, "模型复核", secondTotal, finalTotal);
    setStatus(`本地大模型复核：正在处理 ${llmTargets.length} 条难分类书签。`);
    let llmDone = 0;
    for (let start = 0; start < llmTargets.length; start += 12) {
      const chunk = llmTargets.slice(start, start + 12);
      const response = await fetch("/api/llm-classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile: profileText(),
          categories: linkCategoryRules.map((rule) => rule.name).concat(fallbackCategory),
          items: chunk.map((bookmark) => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            host: bookmark.host,
            text: linkText(bookmark).slice(0, 5000),
          })),
        }),
      });
      const payload = await response.json();
      for (const result of payload.results || []) {
        const bookmark = state.bookmarks.find((item) => item.id === result.id);
        if (!bookmark || !result.category || result.category === fallbackCategory) continue;
        bookmark.category = result.category;
        bookmark.categoryReason = `本地大模型复核：${result.reason || "根据页面正文判断"}`;
        bookmark.categoryConfidence = Math.max(bookmark.categoryConfidence, 12);
        bookmark.categoryProgress = 100;
      }
      llmDone += chunk.length;
      state.categories = buildCategoriesFromBookmarks();
      updateProgress("classify", {
        done: secondTotal + llmDone,
        total: finalTotal,
        current: payload.ok === false ? payload.message || "本地大模型不可用，已跳过复核" : `本地大模型已复核 ${llmDone} / ${llmTargets.length} 条`,
        label: "分类进度",
      });
      setWorkingButton(elements.classifyBtn, "模型复核", secondTotal + llmDone, finalTotal);
      render();
      if (payload.ok === false) break;
    }
  }

  state.classifying = false;
  updateProgress("classify", {
    done: finalTotal,
    total: finalTotal,
    current: `两遍分类完成：已自动创建 ${detectedCategoryCount()} 个分类，待整理 ${fallbackCount()} 条`,
    label: "分类进度",
  });
  clearWorkingButton(elements.classifyBtn, "按链接自动分类", !state.bookmarks.length || !hasProfile());
  setStatus(`两遍分类完成：已自动创建 ${detectedCategoryCount()} 个分类，待整理 ${fallbackCount()} 条。`);
  render();
}

function buildCategoriesFromBookmarks() {
  const counts = new Map();
  for (const bookmark of state.bookmarks) {
    if (bookmark.deleted) continue;
    counts.set(bookmark.category, (counts.get(bookmark.category) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => {
      if (a[0] === pendingCategory) return 1;
      if (b[0] === pendingCategory) return -1;
      if (a[0] === fallbackCategory) return 1;
      if (b[0] === fallbackCategory) return -1;
      return b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN");
    })
    .map(([category]) => category);
}

function detectedCategoryCount() {
  return state.categories.filter((category) => category !== pendingCategory).length;
}

function fallbackCount() {
  return state.bookmarks.filter((bookmark) => !bookmark.deleted && bookmark.category === fallbackCategory).length;
}

function loadHtml(content, filename) {
  const parsed = parseBookmarks(content);
  state.bookmarks = parsed.bookmarks;
  state.fileName = filename || "书签文件";
  elements.fileName.textContent = state.fileName;
  elements.importState.textContent = String(state.bookmarks.length);
  updateClassifyAvailability();
  elements.checkInvalidBtn.disabled = !state.bookmarks.length;
  elements.exportBtn.disabled = !state.bookmarks.length;
  state.categories = [pendingCategory];
  resetProgress("classify");
  resetProgress("invalid");
  if (hasProfile()) {
    setStatus(`已导入 ${state.bookmarks.length} 条书签，正在准备按链接分类。`);
  } else {
    setStatus(`已导入 ${state.bookmarks.length} 条书签。请先填写${profileMissingText()}，再按链接自动分类。`);
  }
  if (hasProfile()) {
    classifyBookmarks().catch((error) => {
      state.classifying = false;
      clearWorkingButton(elements.classifyBtn, "按链接自动分类", !state.bookmarks.length || !hasProfile());
      updateProgress("classify", {
        done: 0,
        total: 1,
        current: `分类中断：${error.message}`,
        label: "分类进度",
      });
      setStatus(error.message);
    });
  }
  render();
}

function setStatus(message) {
  elements.statusLine.textContent = message;
}

function statusClass(status) {
  return status === "valid" || status === "review" || status === "invalid" ? status : "";
}

function statusLabel(bookmark) {
  if (bookmark.deleted) return "已移除";
  return bookmark.statusLabel || "未检测";
}

function bookmarkProgressHtml(bookmark) {
  const percent = Math.max(0, Math.min(100, Math.round(bookmark.categoryProgress || 0)));
  return `
    <div class="mini-progress" aria-label="分类进度 ${percent}%">
      <div>
        <span>分类</span>
        <strong>${percent}%</strong>
      </div>
      <i><b style="width: ${percent}%"></b></i>
    </div>
  `;
}

function filteredBookmarks() {
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.categoryFilter.value;
  const status = elements.statusFilter.value;
  return state.bookmarks.filter((bookmark) => {
    if (bookmark.deleted && status !== "deleted") return false;
    if (category && bookmark.category !== category) return false;
    if (status && bookmark.status !== status) return false;
    if (!query) return true;
    return `${bookmark.title} ${bookmark.url} ${bookmark.originalFolder} ${bookmark.category}`
      .toLowerCase()
      .includes(query);
  });
}

function updateProfileState() {
  const ready = hasProfile();
  elements.profileState.textContent = ready ? "已填写" : "待填写";
  updateClassifyAvailability();
}

function updateClassifyAvailability() {
  const hasBookmarks = state.bookmarks.length > 0;
  const ready = hasProfile();
  const serverReady = !needsServerRuntime();
  elements.classifyBtn.disabled = state.classifying || !ready || !hasBookmarks || !serverReady;
  if (!hasBookmarks) {
    elements.classifyHint.textContent = "先导入书签，并填写行业和职业后才能开始两遍分类。";
  } else if (!serverReady) {
    elements.classifyHint.textContent = "自动分类需要后端服务。请打开线上应用，或先运行本地服务后访问 http://localhost:4173。";
  } else if (!ready) {
    elements.classifyHint.textContent = `已导入书签；请先填写${profileMissingText()}，用于决定分类权重。`;
  } else if (state.classifying) {
    elements.classifyHint.textContent = "正在执行两遍分类：先读链接元信息和维基百科域名结果，再读页面正文文案。";
  } else {
    elements.classifyHint.textContent = "第一遍读标题、域名、网页描述和维基百科搜索结果；维基百科慢或失败会跳过，不阻塞分类。";
  }
}

function renderStats() {
  const active = state.bookmarks.filter((bookmark) => !bookmark.deleted);
  const categoriesInUse = new Set(
    active.map((bookmark) => bookmark.category).filter((category) => category !== pendingCategory),
  );
  const review = active.filter((bookmark) => bookmark.status === "review").length;
  const invalid = active.filter((bookmark) => bookmark.status === "invalid").length;
  const deleted = state.bookmarks.filter((bookmark) => bookmark.deleted).length;
  elements.totalBookmarks.textContent = String(active.length);
  elements.categoryCount.textContent = String(categoriesInUse.size);
  elements.reviewCount.textContent = String(review);
  elements.invalidCount.textContent = String(invalid);
  elements.deleteCount.textContent = `${deleted} 删除`;
  elements.reviewBtn.disabled = review + invalid === 0;
}

function renderFilters() {
  const current = elements.categoryFilter.value;
  elements.categoryFilter.innerHTML = '<option value="">全部分类</option>';
  for (const category of state.categories) {
    const count = state.bookmarks.filter((bookmark) => !bookmark.deleted && bookmark.category === category).length;
    if (!count) continue;
    const option = document.createElement("option");
    option.value = category;
    option.textContent = `${category} (${count})`;
    elements.categoryFilter.append(option);
  }
  if ([...elements.categoryFilter.options].some((option) => option.value === current)) {
    elements.categoryFilter.value = current;
  }
}

function renderBoard() {
  elements.categoryBoard.innerHTML = "";
  const visible = filteredBookmarks();
  const grouped = new Map();
  for (const category of state.categories) grouped.set(category, []);
  for (const bookmark of visible) {
    if (!grouped.has(bookmark.category)) grouped.set(bookmark.category, []);
    grouped.get(bookmark.category).push(bookmark);
  }

  for (const [index, category] of state.categories.entries()) {
    const items = grouped.get(category) || [];
    if (!items.length && state.bookmarks.length) continue;
    const column = document.createElement("article");
    column.className = "category-column";
    column.dataset.category = category;
    column.dataset.tone = tones[index % tones.length];
    column.innerHTML = `
      <div class="column-head">
        <h3>${escapeHtml(category)}</h3>
        <span>${items.length}</span>
      </div>
      <div class="card-list"></div>
    `;
    const list = column.querySelector(".card-list");
    column.addEventListener("dragover", (event) => event.preventDefault());
    column.addEventListener("drop", (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData("text/plain");
      const bookmark = state.bookmarks.find((item) => item.id === id);
      if (bookmark) {
        bookmark.category = category;
        render();
      }
    });

    for (const bookmark of items.slice(0, 20)) {
      const card = document.createElement("div");
      card.className = `bookmark-card ${bookmark.deleted ? "deleted" : ""}`;
      card.draggable = true;
      card.dataset.id = bookmark.id;
      card.innerHTML = `
        <strong>${escapeHtml(bookmark.title)}</strong>
        <span>${escapeHtml(bookmark.host || bookmark.url)}</span>
        <span>${escapeHtml(bookmark.categoryReason || "等待链接识别")}</span>
        ${bookmarkProgressHtml(bookmark)}
        <span class="status-pill ${statusClass(bookmark.status)}">${escapeHtml(statusLabel(bookmark))}</span>
      `;
      card.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", bookmark.id);
      });
      list.append(card);
    }
    elements.categoryBoard.append(column);
  }
}

function renderRows() {
  const visible = filteredBookmarks();
  elements.visibleCount.textContent = String(visible.length);
  elements.bookmarkRows.innerHTML = "";
  const page = visible.slice(0, 260);
  for (const bookmark of page) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="row-title">
          <a href="${escapeHtml(bookmark.url)}" target="_blank" rel="noreferrer">${escapeHtml(bookmark.title)}</a>
          <small>${escapeHtml(bookmark.url)}</small>
        </div>
      </td>
      <td></td>
      <td>
        <span>${escapeHtml(bookmark.categoryReason || "等待链接识别")}</span>
        ${bookmarkProgressHtml(bookmark)}
      </td>
      <td><span class="status-pill ${statusClass(bookmark.status)}">${escapeHtml(statusLabel(bookmark))}</span></td>
    `;
    const select = document.createElement("select");
    select.className = "row-category";
    for (const category of state.categories) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      select.append(option);
    }
    select.value = bookmark.category;
    select.addEventListener("change", () => {
      bookmark.category = select.value;
      render();
    });
    row.children[1].append(select);
    elements.bookmarkRows.append(row);
  }
}

function renderReviewDialog() {
  const candidates = state.bookmarks.filter(
    (bookmark) => !bookmark.deleted && ["invalid", "review"].includes(bookmark.status),
  );
  const groups = [
    {
      status: "invalid",
      title: "可能失效",
      note: "访问失败或返回错误，默认勾选删除。",
    },
    {
      status: "review",
      title: "需确认",
      note: "链接有跳转、限制或超时，需要你再判断。",
    },
  ];
  elements.reviewSummary.textContent = `${candidates.length} 条需要你决定是否移除，已按链接状态分组。`;
  elements.reviewList.innerHTML = "";
  for (const group of groups) {
    const items = candidates.filter((bookmark) => bookmark.status === group.status);
    if (!items.length) continue;
    const section = document.createElement("section");
    section.className = "review-group";
    section.innerHTML = `
      <div class="review-group-head">
        <div>
          <h4>${escapeHtml(group.title)}</h4>
          <p>${escapeHtml(group.note)}</p>
        </div>
        <span class="status-pill ${statusClass(group.status)}">${items.length} 条</span>
      </div>
    `;
    for (const bookmark of items) {
      const item = document.createElement("label");
      item.className = "review-item";
      item.innerHTML = `
        <input type="checkbox" value="${escapeHtml(bookmark.id)}" ${bookmark.status === "invalid" ? "checked" : ""} />
        <span class="review-main">
          <strong>${escapeHtml(bookmark.title)}</strong>
          <span>${escapeHtml(bookmark.url)}</span>
          <span>${escapeHtml(bookmark.statusDetail || "")}</span>
        </span>
        <span class="status-pill ${statusClass(bookmark.status)}">${escapeHtml(statusLabel(bookmark))}</span>
      `;
      section.append(item);
    }
    elements.reviewList.append(section);
  }
}

function render() {
  updateProfileState();
  renderStats();
  renderFilters();
  renderBoard();
  renderRows();
}

async function checkInvalidLinks() {
  const targets = state.bookmarks.filter(
    (bookmark) => !bookmark.deleted && /^https?:\/\//i.test(bookmark.url),
  );
  if (!targets.length || state.checking) return;
  state.checking = true;
  updateProgress("invalid", {
    done: 0,
    total: targets.length,
    current: `准备检测：${shortTitle(targets[0]?.title)}`,
    label: "检测进度",
  });
  setWorkingButton(elements.checkInvalidBtn, "检查中", 0, targets.length);

  const chunkSize = 60;
  let checked = 0;
  for (let start = 0; start < targets.length; start += chunkSize) {
    const chunk = targets.slice(start, start + chunkSize);
    updateProgress("invalid", {
      done: checked,
      total: targets.length,
      current: `正在检测：${shortTitle(chunk[0]?.title)} 至 ${shortTitle(chunk[chunk.length - 1]?.title)}`,
      label: "检测进度",
    });
    setWorkingButton(elements.checkInvalidBtn, "检查中", checked, targets.length);
    setStatus(`正在检查 ${checked + 1}-${Math.min(checked + chunk.length, targets.length)} / ${targets.length}`);
    const response = await fetch("/api/check-links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: chunk.map(({ id, url }) => ({ id, url })) }),
    });
    const payload = await response.json();
    for (const result of payload.results || []) {
      const bookmark = state.bookmarks.find((item) => item.id === result.id);
      if (!bookmark) continue;
      bookmark.status = result.state;
      bookmark.statusLabel = result.label;
      bookmark.statusDetail = [result.statusCode, result.detail].filter(Boolean).join(" ");
    }
    checked += chunk.length;
    updateProgress("invalid", {
      done: checked,
      total: targets.length,
      current: `已完成 ${checked} 条链接检测`,
      label: "检测进度",
    });
    setWorkingButton(elements.checkInvalidBtn, "检查中", checked, targets.length);
    render();
  }
  state.checking = false;
  const invalid = state.bookmarks.filter((bookmark) => bookmark.status === "invalid").length;
  const review = state.bookmarks.filter((bookmark) => bookmark.status === "review").length;
  updateProgress("invalid", {
    done: targets.length,
    total: targets.length,
    current: `检测完成：${invalid} 条可能失效，${review} 条需确认`,
    label: "检测进度",
  });
  clearWorkingButton(elements.checkInvalidBtn, "检查无效标签", !state.bookmarks.length);
  setStatus(`检查完成：${invalid} 条可能失效，${review} 条需确认。`);
}

function exportBookmarks() {
  const stripIcons = elements.stripIcons.checked;
  const active = state.bookmarks.filter((bookmark) => !bookmark.deleted);
  const grouped = new Map();
  for (const category of state.categories) grouped.set(category, []);
  for (const bookmark of active) {
    if (!grouped.has(bookmark.category)) grouped.set(bookmark.category, []);
    grouped.get(bookmark.category).push(bookmark);
  }

  const now = Math.floor(Date.now() / 1000);
  const lines = [
    "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    "<!-- This file can be imported by Chrome, Edge, Safari, Firefox and other browsers. -->",
    "<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">",
    "<TITLE>Bookmarks</TITLE>",
    "<H1>Bookmarks</H1>",
    "<DL><p>",
    `    <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}" PERSONAL_TOOLBAR_FOLDER="true">收藏夹栏</H3>`,
    "    <DL><p>",
  ];

  for (const [category, items] of grouped) {
    if (!items.length) continue;
    lines.push(`        <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">${escapeHtml(category)}</H3>`);
    lines.push("        <DL><p>");
    for (const bookmark of items) {
      const attrs = { ...bookmark.attrs };
      if (stripIcons) {
        delete attrs.ICON;
        delete attrs.ICON_URI;
      }
      attrs.HREF = bookmark.url;
      attrs.ADD_DATE = attrs.ADD_DATE || String(now);
      const attrText = Object.entries(attrs)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(" ");
      lines.push(`            <DT><A ${attrText}>${escapeHtml(bookmark.title)}</A>`);
    }
    lines.push("        </DL><p>");
  }
  lines.push("    </DL><p>", "</DL><p>");

  const blob = new Blob([lines.join("\n")], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `bookmarks_bar_organized_${new Date().toISOString().slice(0, 10)}.html`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function bindEvents() {
  elements.industry.addEventListener("input", updateProfileState);
  elements.role.addEventListener("input", updateProfileState);
  elements.classifyBtn.addEventListener("click", () => {
    classifyBookmarks().catch((error) => {
      state.classifying = false;
      clearWorkingButton(elements.classifyBtn, "按链接自动分类", !state.bookmarks.length || !hasProfile());
      updateProgress("classify", {
        done: 0,
        total: 1,
        current: `分类中断：${error.message}`,
        label: "分类进度",
      });
      setStatus(error.message);
    });
  });
  elements.fileInput.addEventListener("change", async () => {
    const file = elements.fileInput.files?.[0];
    if (!file) return;
    loadHtml(await file.text(), file.name);
  });
  elements.search.addEventListener("input", render);
  elements.categoryFilter.addEventListener("change", render);
  elements.statusFilter.addEventListener("change", render);
  elements.checkInvalidBtn.addEventListener("click", () => {
    checkInvalidLinks().catch((error) => {
      state.checking = false;
      clearWorkingButton(elements.checkInvalidBtn, "检查无效标签", !state.bookmarks.length);
      updateProgress("invalid", {
        done: 0,
        total: 1,
        current: `检测中断：${error.message}`,
        label: "检测进度",
      });
      setStatus(error.message);
    });
  });
  elements.reviewBtn.addEventListener("click", () => {
    renderReviewDialog();
    elements.reviewDialog.showModal();
  });
  elements.markDeleteBtn.addEventListener("click", () => {
    const selected = [...elements.reviewList.querySelectorAll("input:checked")].map((input) => input.value);
    for (const id of selected) {
      const bookmark = state.bookmarks.find((item) => item.id === id);
      if (bookmark) bookmark.deleted = true;
    }
    renderReviewDialog();
    render();
  });
  elements.exportBtn.addEventListener("click", exportBookmarks);
}

bindEvents();
render();
