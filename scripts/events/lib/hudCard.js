const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");

const WIDTH = 1536;
const HEIGHT = 810;
const CACHE_DIR = path.join(process.cwd(), "scripts", "events", "tmp", "hud");
const BOT_VERSION = "8.0 HUD";

function safe(value, fallback = "Unknown") {
  const text = value === undefined || value === null ? "" : String(value).trim();
  return text || fallback;
}

function fit(value, max = 42) {
  const text = safe(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function enhanceImageUrl(source) {
  try {
    const url = new URL(source);
    url.searchParams.set("type", "large");
    url.searchParams.set("width", "720");
    url.searchParams.set("height", "720");
    return url.toString();
  } catch (_) {
    return source;
  }
}

async function getProfileImage(api, uid) {
  if (!uid || String(uid).startsWith("Unknown")) return null;
  try {
    const result = await api.getUserInfo(String(uid));
    const info = result?.[uid] || result?.[String(uid)] || {};
    const candidates = [info.profileUrl, info.profilePic, info.thumbSrc]
      .filter(Boolean)
      .map(enhanceImageUrl);

    for (const url of candidates) {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 15000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (!response.data || response.data.length < 1000) continue;
        // Normalize to a large square before Canvas draws it. This prevents a
        // tiny thumbnail from being stretched directly onto the card.
        const normalized = await sharp(Buffer.from(response.data))
          .resize(720, 720, { fit: "cover", position: "attention", withoutEnlargement: false })
          .png()
          .toBuffer();
        return await loadImage(normalized);
      } catch (_) {}
    }
  } catch (_) {}
  return null;
}

function roundedPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawText(ctx, value, x, y, size, color = "#fff", weight = "600", align = "left") {
  ctx.font = `${weight} ${size}px Sans`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(fit(value), x, y);
}

function drawPanel(ctx, x, y, width, height, accent, radius = 18) {
  roundedPath(ctx, x, y, width, height, radius);
  const fill = ctx.createLinearGradient(x, y, x + width, y + height);
  fill.addColorStop(0, "#111522e8");
  fill.addColorStop(1, "#090b13ee");
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = `${accent}42`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawBackground(ctx, accent) {
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#060914");
  background.addColorStop(0.52, "#080914");
  background.addColorStop(1, "#120713");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const [x, y, color] of [[180, 110, "#22d3ee"], [1360, 170, "#ff2d91"], [820, 710, accent]]) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 470);
    glow.addColorStop(0, `${color}2c`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  ctx.strokeStyle = "#94a3b81a";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
  }
}

function drawInfoCard(ctx, label, value, x, y, width, accent) {
  drawPanel(ctx, x, y, width, 104, accent, 16);
  drawText(ctx, label.toUpperCase(), x + 24, y + 30, 17, accent === "#ff405d" ? "#ff8c9b" : "#67e8f9", "800");
  drawText(ctx, value, x + 24, y + 69, 27, "#f8fafc", "800");
}

function drawProfile(ctx, profile, data, accent) {
  const cx = 250, cy = 400, radius = 125;
  ctx.save();
  ctx.shadowColor = `${accent}cc`;
  ctx.shadowBlur = 32;
  ctx.beginPath(); ctx.arc(cx, cy, radius + 19, 0, Math.PI * 2);
  ctx.strokeStyle = accent; ctx.lineWidth = 7; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  if (profile) {
    const scale = Math.max((radius * 2) / profile.width, (radius * 2) / profile.height);
    ctx.drawImage(profile, cx - profile.width * scale / 2, cy - profile.height * scale / 2, profile.width * scale, profile.height * scale);
  } else {
    ctx.fillStyle = "#172033"; ctx.fill();
    drawText(ctx, "?", cx, cy, 100, accent, "800", "center");
  }
  ctx.restore();

  drawPanel(ctx, 133, 568, 234, 43, accent, 20);
  drawText(ctx, data.badge, 250, 590, 16, accent, "800", "center");
}

function drawCard(ctx, type, data, profile) {
  const welcome = type === "welcome";
  const accent = welcome ? "#22d3ee" : "#ff405d";
  drawBackground(ctx, accent);

  ctx.save();
  ctx.shadowColor = `${welcome ? "#22d3ee" : "#ff2d91"}70`;
  ctx.shadowBlur = 28;
  roundedPath(ctx, 42, 38, WIDTH - 84, HEIGHT - 76, 30);
  ctx.fillStyle = "#070a14f2"; ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `${welcome ? "#22d3ee" : "#ff2d91"}d0`;
  ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();

  // Reference-style system strip.
  drawText(ctx, `● SYSTEM: ${welcome ? "MEMBER_JOIN_EVENT" : "MEMBER_DEPARTURE"}`, 86, 86, 16, accent, "800");
  drawText(ctx, 'PREFIX: "!"', 458, 86, 16, "#b66bdb", "800");
  drawText(ctx, `STATUS: ${welcome ? "VERIFIED" : "ARCHIVED"}`, 688, 86, 16, welcome ? "#72f1c4" : "#ff9baa", "800");
  drawText(ctx, `BOT_VER: ${BOT_VERSION}`, 1432, 86, 15, "#6d7488", "700", "right");

  drawText(ctx, welcome ? "✦ WELCOME TO THE COMMUNITY • GOOD MORNING" : "✦ GOODBYE FROM THE COMMUNITY • TAKE CARE", 462, 145, 25, welcome ? "#ff6db7" : "#ff7890", "800");
  drawText(ctx, data.name, 462, 205, 47, "#f8fafc", "800");
  drawText(ctx, welcome ? `You are now part of ${fit(data.groupName, 35)}` : `You were a member of ${fit(data.groupName, 35)}`, 462, 258, 24, "#a7afc3", "600");

  drawProfile(ctx, profile, { badge: welcome ? "✦ NEW MEMBER" : "✦ DEPARTED" }, accent);

  const x1 = 462, x2 = 948, cardWidth = 440;
  drawInfoCard(ctx, welcome ? "MEMBER NUMBER" : "REMAINING MEMBERS", welcome ? `#${data.memberNumber}` : `#${data.members}`, x1, 319, cardWidth, accent);
  drawInfoCard(ctx, "USER FB ID", data.uid, x2, 319, cardWidth, accent);
  drawInfoCard(ctx, welcome ? "JOINED TIME" : "DEPARTURE TIME", data.time, x1, 442, cardWidth, accent);
  drawInfoCard(ctx, welcome ? "JOINED DATE" : "DEPARTURE DATE", data.date, x2, 442, cardWidth, accent);

  drawPanel(ctx, x1, 575, 926, 74, accent, 15);
  drawText(ctx, welcome ? "▣ TIP: Type \"help\" to explore commands & group features!" : "▣ NOTICE: This member has departed from the community.", x1 + 24, 612, 20, welcome ? "#67d8ff" : "#ff9baa", "700");
  drawText(ctx, welcome ? "DESIGNED FOR GHOST BOT • ALL RIGHTS RESERVED" : "GHOST BOT COMMUNITY SYSTEM", WIDTH / 2, 738, 13, "#596176", "700", "center");
}

async function createHudCard(type, data, api) {
  await fs.ensureDir(CACHE_DIR);
  const canvas = createCanvas(WIDTH, HEIGHT);
  const profile = await getProfileImage(api, data.uid);
  drawCard(canvas.getContext("2d"), type, data, profile);
  const filePath = path.join(CACHE_DIR, `${type}_${String(data.uid).replace(/[^a-z0-9_-]/gi, "_")}_${Date.now()}.png`);
  await fs.writeFile(filePath, canvas.toBuffer("image/png"));
  return filePath;
}

module.exports = { createHudCard, safe, fit, WIDTH, HEIGHT };