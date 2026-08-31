const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoderv2");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const CACHE_DIR = path.join(process.cwd(), "scripts", "cmds", "cache");
const profilePageUrlCache = new Map();

function roundRect(ctx, x, y, width, height, radius, fill = true, stroke = false) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function fitText(ctx, text, maxWidth, initialSize, family = "Arial") {
  let size = initialSize;
  const value = String(text ?? "");
  while (size > 12) {
    ctx.font = `bold ${size}px ${family}`;
    if (ctx.measureText(value).width <= maxWidth) return size;
    size -= 1;
  }
  ctx.font = `bold ${size}px ${family}`;
  return size;
}

function hexToRgb(hex) {
  const value = String(hex).replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) || 0,
    parseInt(value.slice(2, 4), 16) || 0,
    parseInt(value.slice(4, 6), 16) || 0
  ];
}

function drawNeonBackground(ctx, width, height, frame, colors = ["#ff2bd6", "#00e5ff", "#8b5cf6"]) {
  const [pink, cyan, purple] = colors;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#05020d");
  gradient.addColorStop(0.52, "#10051c");
  gradient.addColorStop(1, "#020712");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(150, 130, 255, 0.08)";
  for (let x = 0; x <= width; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y <= height; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const sweepX = 80 + ((width - 160) * frame) / 17;
  const glow = ctx.createRadialGradient(sweepX, 70, 0, sweepX, 70, 220);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  glow.addColorStop(0.25, `${pink}30`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 38; i++) {
    const x = (i * 83 + frame * 17) % width;
    const y = (i * 47 + frame * 9) % height;
    const [r, g, b] = hexToRgb(i % 2 ? cyan : purple);
    ctx.fillStyle = `rgba(${r},${g},${b},${0.18 + (i % 4) * 0.04})`;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.strokeStyle = pink;
  ctx.shadowColor = pink;
  ctx.shadowBlur = 22;
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  ctx.shadowBlur = 0;
}

function enhanceImageUrl(source) {
  try {
    const url = new URL(source);
    url.searchParams.set("type", "large");
    url.searchParams.set("width", "1024");
    url.searchParams.set("height", "1024");
    return url.toString();
  } catch (_) {
    return source;
  }
}

function imageCandidates(profile, uid) {
  const sources = [profile, profile?.data, profile?.profile, profile?.user]
    .filter(value => value && typeof value === "object");
  const imageFields = [
    "thumbSrc",
    "profilePic",
    "profilePicture",
    "bigImageSrc",
    "largeProfilePicture",
    "profile_picture",
    "avatar",
    "imageUrl",
    "photoUrl"
  ];
  const values = sources.flatMap(source => imageFields.map(field => source[field]));
  const urls = values
    .map(value => typeof value === "string" ? value : value?.uri || value?.url || value?.source)
    .filter(value => typeof value === "string" && /^https?:\/\//i.test(value))
    .filter(value => /\/picture|fbcdn|fbsbx|scontent|profile[_-]?pic|avatar|image/i.test(value))
    // Keep signed Facebook URLs untouched first; changing their query string
    // can invalidate the signature before the CDN request is made.
    .flatMap(value => [value, enhanceImageUrl(value)]);
  const profileUrl = sources
    .map(source => source.profileUrl || source.profileURL)
    .find(value => typeof value === "string" && /\/picture|fbcdn|fbsbx|scontent|profile[_-]?pic/i.test(value));
  if (profileUrl) urls.push(profileUrl);
  if (uid) urls.push(`https://graph.facebook.com/${encodeURIComponent(uid)}/picture?type=large&width=1024&height=1024`);
  return [...new Set(urls)];
}

function decodeFacebookUrl(value) {
  return String(value)
    .replace(/\\u0025/gi, "%")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u003d/gi, "=")
    .replace(/\\u002f/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");
}

function highResolutionVariants(url) {
  const decoded = decodeFacebookUrl(url);
  const variants = [decoded];
  if (/ctp=s\d+x\d+/i.test(decoded)) {
    variants.unshift(decoded.replace(/ctp=s\d+x\d+/i, "ctp=s1024x1024"));
    variants.push(decoded.replace(/ctp=s\d+x\d+/i, "ctp=s960x960"));
  }
  return variants;
}

function extractProfilePageImageUrls(html) {
  const source = String(html);
  const patterns = [
    /"(?:profilePic[^"]*)"\s*:\s*\{\s*"uri"\s*:\s*"([^"]+)"/gi,
    /"profile_picture_for_sticky_bar"\s*:\s*\{\s*"uri"\s*:\s*"([^"]+)"/gi,
    /"profile_picture"\s*:\s*\{\s*"uri"\s*:\s*"([^"]+)"/gi
  ];
  const urls = [];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const url = decodeFacebookUrl(match[1]);
      if (/^https?:\/\/(?:scontent|.*fbcdn|.*fbsbx)/i.test(url))
        urls.push(...highResolutionVariants(url));
    }
  }
  return [...new Set(urls)];
}

async function fetchProfilePageImageUrls(profile, uid, cookie) {
  const sources = [profile, profile?.data, profile?.profile, profile?.user]
    .filter(value => value && typeof value === "object");
  const profileUrl = sources
    .map(source => source.profileUrl || source.profileURL)
    .find(value => typeof value === "string" && /^https?:\/\/(?:www\.)?facebook\.com\//i.test(value));
  if (!profileUrl) return [];

  const cacheKey = `${uid}:${profileUrl}`;
  const cached = profilePageUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.urls;

  try {
    const response = await axios.get(profileUrl, {
      responseType: "text",
      timeout: 15000,
      maxContentLength: 32 * 1024 * 1024,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,application/xhtml+xml",
        ...(cookie ? { Cookie: cookie } : {})
      }
    });
    const urls = extractProfilePageImageUrls(response.data);
    profilePageUrlCache.set(cacheKey, { urls, expiresAt: Date.now() + 10 * 60 * 1000 });
    return urls;
  } catch (_) {
    profilePageUrlCache.set(cacheKey, { urls: [], expiresAt: Date.now() + 60 * 1000 });
    return [];
  }
}

function getSessionCookie(api) {
  try {
    const appState = typeof api?.getAppState === "function" ? api.getAppState() : [];
    if (!Array.isArray(appState)) return "";
    return appState
      .filter(item => item && item.key && item.value)
      .map(item => `${item.key}=${item.value}`)
      .join("; ");
  } catch (_) {
    return "";
  }
}

async function loadAvatar(profile, uid, requestOptions = {}, preferredUrls = []) {
  for (const url of [...new Set([...preferredUrls, ...imageCandidates(profile, uid)])]) {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        maxContentLength: 12 * 1024 * 1024,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "image/avif,image/webp,image/apng,image/jpeg,image/png,*/*;q=0.8",
          Referer: "https://www.facebook.com/",
          ...(requestOptions.cookie ? { Cookie: requestOptions.cookie } : {})
        }
      });
      const input = Buffer.from(response.data);
      const metadata = await sharp(input).metadata();
      if (!metadata.format || !metadata.width || !metadata.height || input.length < 1000) continue;
      const stats = await sharp(input).stats();
      const rgb = stats.channels.slice(0, 3);
      const isWhitePlaceholder = rgb.length === 3
        && rgb.every(channel => channel.min >= 180 && channel.mean >= 215 && channel.max - channel.min <= 56);
      if (isWhitePlaceholder) continue;
      const normalized = await sharp(input)
        .rotate()
        .resize(1024, 1024, {
          fit: "cover",
          position: "attention",
          kernel: sharp.kernel.lanczos3,
          withoutEnlargement: false
        })
        .modulate({ saturation: 1.04 })
        .sharpen({ sigma: 1.15, m1: 0.8, m2: 2 })
        .png({ compressionLevel: 6 })
        .toBuffer();
      return await loadImage(normalized);
    } catch (_) {}
  }
  return null;
}

async function fetchAvatar(api, uid, profileHint = {}) {
  const profile = { ...profileHint };
  try {
    const result = await api.getUserInfo(uid);
    Object.assign(profile, result?.[uid] || result?.[String(uid)] || result || {});
  } catch (_) {}
  const cookie = getSessionCookie(api);
  const preferredUrls = await fetchProfilePageImageUrls(profile, uid, cookie);
  return loadAvatar(profile, uid, { cookie }, preferredUrls);
}

async function fetchProfile(api, usersData, uid) {
  const profile = {};
  try {
    const result = await api.getUserInfo(uid);
    Object.assign(profile, result?.[uid] || result || {});
  } catch (_) {}
  try {
    const local = await usersData.get(uid);
    for (const [key, value] of Object.entries(local || {})) {
      if (profile[key] === undefined || profile[key] === null || profile[key] === "") profile[key] = value;
    }
  } catch (_) {}

  const cookie = getSessionCookie(api);
  const preferredUrls = await fetchProfilePageImageUrls(profile, uid, cookie);
  const avatar = await loadAvatar(profile, uid, { cookie }, preferredUrls);
  return { ...profile, userID: uid, avatar };
}

function drawAvatar(ctx, avatar, x, y, radius, accent = "#ff2bd6") {
  for (let ring = 3; ring >= 1; ring--) {
    ctx.beginPath();
    ctx.arc(x, y, radius + ring * 8, 0, Math.PI * 2);
    ctx.strokeStyle = ring === 1 ? accent : "rgba(0,229,255,0.7)";
    ctx.lineWidth = 2;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.clip();
  if (avatar) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const scale = Math.max((radius * 2) / avatar.width, (radius * 2) / avatar.height);
    ctx.drawImage(
      avatar,
      x - (avatar.width * scale) / 2,
      y - (avatar.height * scale) / 2,
      avatar.width * scale,
      avatar.height * scale
    );
  } else {
    const fallback = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    fallback.addColorStop(0, "#3c0b60");
    fallback.addColorStop(1, "#062f4f");
    ctx.fillStyle = fallback;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.fillStyle = accent;
    ctx.font = "bold 52px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("👻", x, y);
  }
  ctx.restore();
}

async function createNeonGif({ prefix = "neon", width = 1100, height = 620, frames = 18, delay = 100, drawFrame }) {
  await fs.ensureDir(CACHE_DIR);
  const outputPath = path.join(CACHE_DIR, `${prefix}_${Date.now()}_${process.pid}.gif`);
  const encoder = new GIFEncoder(width, height);
  const output = fs.createWriteStream(outputPath);
  encoder.createReadStream().pipe(output);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(delay);
  encoder.setQuality(8);

  for (let frame = 0; frame < frames; frame++) {
    const canvas = createCanvas(width, height);
    await drawFrame(canvas.getContext("2d"), frame, frames);
    encoder.addFrame(canvas.getContext("2d"));
  }
  encoder.finish();
  await new Promise((resolve, reject) => {
    output.once("finish", resolve);
    output.once("error", reject);
  });
  return outputPath;
}

module.exports = {
  CACHE_DIR,
  createNeonGif,
  drawAvatar,
  drawNeonBackground,
  fetchAvatar,
  fetchProfile,
  fitText,
  roundRect
};