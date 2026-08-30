const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");
const { fetchProfile, roundRect } = require("../utils/neonGif");

function targetUid(event, args) {
  return Object.keys(event?.mentions || {})[0]
    || event?.messageReply?.senderID
    || (args?.find(value => /^\d+$/.test(value)) || null)
    || event?.senderID;
}

function createPfpImage(avatar, name, uid) {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const background = ctx.createLinearGradient(0, 0, size, size);
  background.addColorStop(0, "#030712");
  background.addColorStop(0.5, "#18072c");
  background.addColorStop(1, "#061c2e");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  const scale = Math.max(size / avatar.width, size / avatar.height);
  ctx.drawImage(
    avatar,
    (size - avatar.width * scale) / 2,
    (size - avatar.height * scale) / 2,
    avatar.width * scale,
    avatar.height * scale
  );

  const shade = ctx.createLinearGradient(0, size - 230, 0, size);
  shade.addColorStop(0, "rgba(3, 7, 18, 0)");
  shade.addColorStop(1, "rgba(3, 7, 18, 0.94)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, size - 230, size, 230);

  ctx.strokeStyle = "#00e5ff";
  ctx.shadowColor = "#ff2bd6";
  ctx.shadowBlur = 26;
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, size - 36, size - 36);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "left";
  ctx.fillText(String(name || "Facebook User").slice(0, 32), 52, size - 88);
  ctx.fillStyle = "#82f7ff";
  ctx.font = "20px monospace";
  ctx.fillText(`UID  ${uid}`, 54, size - 48);

  ctx.strokeStyle = "#ff2bd6";
  ctx.lineWidth = 5;
  roundRect(ctx, 34, 34, 116, 12, 6, false, true);
  roundRect(ctx, size - 150, size - 46, 116, 12, 6, false, true);
  return canvas;
}

module.exports = {
  config: {
    name: "pp",
    aliases: ["pfp", "avatar", "profilepic", "dp"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "View a user's high-resolution profile picture" },
    longDescription: { en: "Shows your, a replied user's, a mentioned user's, or a UID's profile picture." },
    category: "image",
    guide: { en: "{p}pp [reply | mention | UID]" }
  },

  onStart: async function ({ api, usersData, event, args, message }) {
    const uid = targetUid(event, args);
    let filePath;
    try {
      const profile = await fetchProfile(api, usersData, uid);
      if (!profile.avatar)
        return message.reply(`❌ Profile picture could not be fetched for UID ${uid}.\nTry again later or use ${global.GoatBot.config.prefix}spy ${uid}.`);

      const cacheDir = path.join(process.cwd(), "scripts", "cmds", "cache");
      await fs.ensureDir(cacheDir);
      filePath = path.join(cacheDir, `pp_${String(uid).replace(/[^a-z0-9_-]/gi, "_")}_${Date.now()}.png`);
      const image = createPfpImage(profile.avatar, profile.name || `User ${uid}`, uid);
      await fs.writeFile(filePath, image.toBuffer("image/png"));

      return await message.reply({
        body: `🖼️ ${profile.name || `User ${uid}`}\n🆔 UID: ${uid}\n✨ High-resolution profile picture`,
        attachment: fs.createReadStream(filePath)
      });
    } finally {
      if (filePath) setTimeout(() => fs.remove(filePath).catch(() => {}), 20000);
    }
  }
};