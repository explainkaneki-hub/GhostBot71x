const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const WIDTH = 1536;
const HEIGHT = 810;
const CACHE_DIR = path.join(process.cwd(), "scripts", "events", "tmp", "hud");

function safe(value, fallback = "Unknown") {
  const text = value === undefined || value === null ? "" : String(value).trim();
  return text || fallback;
}

function fit(text, max = 34) {
  const value = safe(text);
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

async function getProfileImage(api, uid) {
  try {
    const info = await new Promise((resolve, reject) => {
      api.getUserInfo(String(uid), (error, result) => error ? reject(error) : resolve(result?.[uid]));
    });
    if (!info?.thumbSrc) return null;
    const response = await axios.get(info.thumbSrc, { responseType: "arraybuffer", timeout: 15000 });
    return await loadImage(Buffer.from(response.data));
  } catch (_) {
    return null;
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function text(ctx, value, x, y, size, color = "#fff", weight = "600", align = "left") {
  ctx.font = `${weight} ${size}px Sans`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(fit(value, 52), x, y);
}

function labelValue(ctx, label, value, x, y, accent) {
  text(ctx, label.toUpperCase(), x, y, 17, "#8f91aa", "600");
  text(ctx, value, x, y + 30, 25, "#f7f7ff", "700");
}

function drawBackground(ctx, accent) {
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#05050b");
  background.addColorStop(0.5, "#100912");
  background.addColorStop(1, "#05050b");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (const [x, y, color] of [[180, 100, "#ff176f"], [1350, 720, accent], [800, 380, "#8b21ff"]]) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 420);
    glow.addColorStop(0, `${color}33`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  ctx.strokeStyle = "#ffffff0d";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
  }
}

function drawCard(ctx, type, data, profile) {
  const accent = type === "welcome" ? "#ff2d91" : "#ff405d";
  drawBackground(ctx, accent);
  ctx.shadowColor = `${accent}55`;
  ctx.shadowBlur = 35;
  roundRect(ctx, 62, 56, WIDTH - 124, HEIGHT - 112, 34);
  ctx.fillStyle = "#090912e8";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2;
  ctx.stroke();

  text(ctx, type === "welcome" ? "WELCOME • NEW MEMBER" : "GOODBYE • MEMBER DEPARTURE", 118, 125, 31, "#fff", "800");
  text(ctx, type === "welcome" ? "A new signal has entered the group network" : "A member has left the group network", 118, 166, 19, "#a7a8bd", "500");
  text(ctx, type === "welcome" ? "ONLINE" : "DEPARTED", 1400, 125, 17, accent, "800", "right");

  const cx = 292, cy = 390, radius = 130;
  ctx.save();
  ctx.shadowColor = accent; ctx.shadowBlur = 28;
  ctx.beginPath(); ctx.arc(cx, cy, radius + 17, 0, Math.PI * 2);
  ctx.strokeStyle = accent; ctx.lineWidth = 8; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  if (profile) {
    const scale = Math.max((radius * 2) / profile.width, (radius * 2) / profile.height);
    ctx.drawImage(profile, cx - profile.width * scale / 2, cy - profile.height * scale / 2, profile.width * scale, profile.height * scale);
  } else {
    ctx.fillStyle = "#211026"; ctx.fill();
    text(ctx, "?", cx, cy, 100, accent, "800", "center");
  }
  ctx.restore();

  text(ctx, type === "welcome" ? "WELCOME" : "GOODBYE", cx, 580, 18, accent, "800", "center");
  text(ctx, data.name, cx, 625, 31, "#fff", "800", "center");
  text(ctx, type === "welcome" ? "NEW MEMBER" : "DEPARTED", cx, 666, 16, "#a7a8bd", "600", "center");

  const x = 540, y = 250, gapX = 430, gapY = 120;
  labelValue(ctx, "Group name", data.groupName, x, y, accent);
  labelValue(ctx, "Remaining members", data.members, x + gapX, y, accent);
  labelValue(ctx, "FB UID", data.uid, x, y + gapY, accent);
  labelValue(ctx, type === "welcome" ? "Join time" : "Departure time", data.time, x + gapX, y + gapY, accent);
  labelValue(ctx, type === "welcome" ? "Join date" : "Departure date", data.date, x, y + gapY * 2, accent);
  labelValue(ctx, "Event", type === "welcome" ? "Joined group" : "Left group", x + gapX, y + gapY * 2, accent);

  roundRect(ctx, 540, 625, 790, 88, 18);
  ctx.fillStyle = `${accent}14`; ctx.fill();
  ctx.strokeStyle = `${accent}55`; ctx.stroke();
  text(ctx, type === "welcome" ? data.message : data.message, 575, 669, 22, "#f5f3fb", "600");
}

async function createHudCard(type, data, api) {
  await fs.ensureDir(CACHE_DIR);
  const canvas = createCanvas(WIDTH, HEIGHT);
  const profile = await getProfileImage(api, data.uid);
  drawCard(canvas.getContext("2d"), type, data, profile);
  const filePath = path.join(CACHE_DIR, `${type}_${data.uid}_${Date.now()}.png`);
  await fs.writeFile(filePath, canvas.toBuffer("image/png"));
  return filePath;
}

module.exports = { createHudCard, safe, fit };