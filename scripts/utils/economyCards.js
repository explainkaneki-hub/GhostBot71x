const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const CACHE_DIR = path.join(process.cwd(), "scripts", "cmds", "cache");

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US");
}

async function avatar(usersData, uid) {
  try {
    const user = await usersData.get(uid);
    if (!user?.thumbSrc) return null;
    const response = await require("axios").get(user.thumbSrc, { responseType: "arraybuffer", timeout: 10000 });
    return loadImage(Buffer.from(response.data));
  } catch (_) {
    return null;
  }
}

async function balanceCard(user, uid, usersData, title = "BALANCE") {
  await fs.ensureDir(CACHE_DIR);
  const canvas = createCanvas(1000, 560);
  const ctx = canvas.getContext("2d");
  const background = ctx.createLinearGradient(0, 0, 1000, 560);
  background.addColorStop(0, "#080812");
  background.addColorStop(1, "#1a0821");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1000, 560);
  ctx.strokeStyle = "#ff2d91";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, 952, 512);
  ctx.fillStyle = "#ff2d91";
  ctx.font = "800 28px Sans";
  ctx.fillText(title, 62, 82);
  ctx.fillStyle = "#fff";
  ctx.font = "800 38px Sans";
  ctx.fillText(String(user?.name || `User ${uid}`).slice(0, 30), 62, 175);
  ctx.fillStyle = "#aaa7bd";
  ctx.font = "600 22px Sans";
  ctx.fillText(`UID: ${uid}`, 62, 220);
  ctx.fillText(`BALANCE: ৳${formatMoney(user?.money)}`, 62, 280);
  ctx.fillText(`EXP: ${formatMoney(user?.exp)}`, 62, 325);
  const image = await avatar(usersData, uid);
  if (image) {
    ctx.save();
    ctx.beginPath(); ctx.arc(820, 280, 135, 0, Math.PI * 2); ctx.clip();
    const scale = Math.max(270 / image.width, 270 / image.height);
    ctx.drawImage(image, 820 - image.width * scale / 2, 280 - image.height * scale / 2, image.width * scale, image.height * scale);
    ctx.restore();
  }
  const file = path.join(CACHE_DIR, `balance_${uid}_${Date.now()}.png`);
  await fs.writeFile(file, canvas.toBuffer("image/png"));
  return file;
}

async function leaderboardCard(users, usersData, title = "TOP 15", metric = "SCORE") {
  await fs.ensureDir(CACHE_DIR);
  const canvas = createCanvas(1200, 760);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#080812";
  ctx.fillRect(0, 0, 1200, 760);
  ctx.fillStyle = "#ff2d91";
  ctx.font = "800 34px Sans";
  ctx.fillText(title, 60, 70);
  ctx.fillStyle = "#9291aa";
  ctx.font = "600 18px Sans";
  ctx.fillText(metric, 970, 70);
  users.forEach((user, index) => {
    const y = 112 + index * 41;
    ctx.fillStyle = index < 3 ? "#ff2d91" : "#81758d";
    ctx.font = "800 22px Sans";
    ctx.fillText(`#${index + 1}`, 62, y);
    ctx.fillStyle = "#f5f3fb";
    ctx.font = "600 21px Sans";
    ctx.fillText(String(user.name || user.userID).slice(0, 38), 150, y);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    ctx.fillText(formatMoney(user.metricValue), 1080, y);
    ctx.textAlign = "left";
  });
  const file = path.join(CACHE_DIR, `leaderboard_${Date.now()}.png`);
  await fs.writeFile(file, canvas.toBuffer("image/png"));
  return file;
}

module.exports = { formatMoney, fullMoney: formatMoney, balanceCard, leaderboardCard };