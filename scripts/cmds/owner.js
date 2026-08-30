// Owner Command — legacy neon PFP GIF — Ghost Net Edition

const fs = require("fs-extra");
const {
  createNeonGif,
  drawAvatar,
  drawNeonBackground,
  fetchProfile,
  fitText,
  roundRect
} = require("../utils/neonGif");

const OWNER_UID = "61591135723044";
const OWNER_NAME = "Rakibul Hasan";
const BIO = {
  name: OWNER_NAME,
  location: "Bangladesh",
  status: "Building Ghost Bot 🛠️",
  favorite: "Late-night coding and good vibes 🎧",
  hobby: "Gaming, music and travelling 🎮",
  prefix: "! / ."
};

function drawOwnerFrame(ctx, frame, profile) {
  const width = 820;
  const height = 400;
  const neon = ["#ff00ff", "#00ffff", "#ff6600", "#00ff88", "#ffd700", "#ff0055", "#aa00ff", "#00ccff"];
  const c1 = neon[frame % neon.length];
  const c2 = neon[(frame + 3) % neon.length];
  const c3 = neon[(frame + 5) % neon.length];
  const pad = 22;

  drawNeonBackground(ctx, width, height, frame, [c1, c2, c3]);
  ctx.fillStyle = "rgba(4, 0, 18, 0.88)";
  roundRect(ctx, pad, pad, width - pad * 2, height - pad * 2, 24, true, false);

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = c1;
  ctx.shadowColor = c1;
  ctx.shadowBlur = 30;
  roundRect(ctx, pad, pad, width - pad * 2, height - pad * 2, 24, false, true);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = c2;
  ctx.shadowColor = c2;
  ctx.shadowBlur = 14;
  roundRect(ctx, pad + 9, pad + 9, width - pad * 2 - 18, height - pad * 2 - 18, 18, false, true);
  ctx.shadowBlur = 0;

  drawAvatar(ctx, profile.avatar, 102, height / 2, 92, c1);

  const textX = 229;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = c3;
  ctx.font = "bold 13px Arial";
  ctx.shadowColor = c3;
  ctx.shadowBlur = 14;
  ctx.fillText("👻  GHOST NET EDITION", textX, pad + 44);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.shadowColor = c1;
  ctx.shadowBlur = 18;
  ctx.fillText("BOT OWNER PROFILE", textX, pad + 74);
  ctx.shadowBlur = 0;

  const lineGrad = ctx.createLinearGradient(textX, 0, width - pad - 10, 0);
  lineGrad.addColorStop(0, c1);
  lineGrad.addColorStop(1, "transparent");
  ctx.fillStyle = lineGrad;
  ctx.fillRect(textX, pad + 82, width - textX - pad - 10, 1.5);

  const fields = [
    ["👤 Name", BIO.name],
    ["📍 Location", BIO.location],
    ["💭 Status", BIO.status],
    ["⭐ Favorite", BIO.favorite],
    ["🎮 Hobby", BIO.hobby],
    ["🔗 FB", `fb.com/${OWNER_UID}`]
  ];
  let fieldY = pad + 112;
  for (const [label, value] of fields) {
    ctx.fillStyle = "rgba(180, 180, 255, 0.62)";
    ctx.font = "10px monospace";
    ctx.fillText(label, textX, fieldY);
    ctx.fillStyle = "#ffffff";
    fitText(ctx, value, 350, 14, "Arial");
    ctx.shadowColor = c2;
    ctx.shadowBlur = 5;
    ctx.fillText(String(value).slice(0, 43), textX + 118, fieldY);
    ctx.shadowBlur = 0;
    fieldY += 27;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = c3;
  ctx.font = "bold 12px Arial";
  ctx.shadowColor = c3;
  ctx.shadowBlur = 12;
  ctx.fillText("◆  EXCLUSIVE BOT OWNER — Ghost Net Royal  ◆", width / 2, height - 32);
  ctx.shadowBlur = 0;

  [[pad + 2, pad + 2], [width - pad - 14, pad + 2], [pad + 2, height - pad - 14], [width - pad - 14, height - pad - 14]].forEach(([x, y]) => {
    ctx.fillStyle = c1;
    ctx.shadowColor = c1;
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, 12, 12);
    ctx.shadowBlur = 0;
  });
}

module.exports = {
  config: {
    name: "owner",
    aliases: ["rakibboss", "abba", "botowner", "malik", "boss"],
    version: "3.1",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Owner info — Neon PFP animated card 👑" },
    longDescription: { en: "Animated neon GIF card with profile picture and owner info." },
    category: "info",
    guide: { en: "{p}owner" }
  },

  onStart: async function ({ api, usersData, message, event }) {
    let gifPath;
    try {
      if (event?.messageID && typeof message.reaction === "function")
        await message.reaction("⏳", event.messageID).catch(() => {});
      const profile = await fetchProfile(api, usersData, OWNER_UID);
      gifPath = await createNeonGif({
        prefix: "owner",
        width: 820,
        height: 400,
        frames: 14,
        delay: 110,
        drawFrame: async (ctx, frame) => drawOwnerFrame(ctx, frame, profile)
      });
      if (event?.messageID && typeof message.reaction === "function")
        await message.reaction("✅", event.messageID).catch(() => {});
      return await message.reply({
        body: `👋 Hey, I'm ${BIO.name}'s Ghost Bot!\n\n👑 Owner: ${BIO.name}\n🆔 UID: ${OWNER_UID}\n📍 Based in: ${BIO.location}\n💭 Status: ${BIO.status}\n⭐ Favorite: ${BIO.favorite}\n🎮 Hobby: ${BIO.hobby}\n🔗 Facebook: fb.com/${OWNER_UID}\n🔤 Prefix: ${BIO.prefix}\n\n🫶 Made with care for the Ghost Bot family, pookie.`,
        attachment: fs.createReadStream(gifPath)
      });
    } catch (error) {
      if (event?.messageID && typeof message.reaction === "function")
        await message.reaction("✅", event.messageID).catch(() => {});
      throw error;
    } finally {
      if (gifPath) setTimeout(() => fs.remove(gifPath).catch(() => {}), 18000);
    }
  }
};