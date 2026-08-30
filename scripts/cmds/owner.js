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

function drawOwnerFrame(ctx, frame, profile) {
  const width = 1100;
  const height = 620;
  const pink = frame % 2 ? "#ff38d1" : "#ff00a8";
  const cyan = frame % 2 ? "#00e5ff" : "#7df9ff";

  drawNeonBackground(ctx, width, height, frame, [pink, cyan, "#9b5cff"]);
  ctx.fillStyle = "rgba(5, 2, 18, 0.86)";
  roundRect(ctx, 48, 48, width - 96, height - 96, 28, true, false);
  ctx.strokeStyle = pink;
  ctx.shadowColor = pink;
  ctx.shadowBlur = 24;
  ctx.lineWidth = 3;
  roundRect(ctx, 48, 48, width - 96, height - 96, 28, false, true);
  ctx.shadowBlur = 0;

  drawAvatar(ctx, profile.avatar, 190, 315, 125, cyan);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = cyan;
  ctx.font = "bold 20px monospace";
  ctx.fillText("GHOST BOT // OWNER ACCESS", 380, 120);
  ctx.fillStyle = "#ffffff";
  fitText(ctx, OWNER_NAME, 620, 52, "Arial");
  ctx.shadowColor = pink;
  ctx.shadowBlur = 18;
  ctx.fillText(OWNER_NAME, 380, 185);
  ctx.shadowBlur = 0;

  const rows = [
    ["ROLE", "BOT OWNER / ADMIN"],
    ["UID", OWNER_UID],
    ["LOCATION", "BANGLADESH"],
    ["STATUS", "ONLINE • BUILDING GHOST BOT"],
    ["PREFIX", "!  or  ."]
  ];
  let y = 245;
  for (const [label, value] of rows) {
    ctx.fillStyle = "rgba(190, 180, 235, 0.62)";
    ctx.font = "14px monospace";
    ctx.fillText(label, 380, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText(value, 520, y);
    y += 46;
  }

  ctx.fillStyle = pink;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText("♡ POOKIE ROYALTY • GHOST NET EDITION ♡", width / 2, height - 82);
  ctx.fillStyle = cyan;
  ctx.font = "14px monospace";
  ctx.fillText(`FRAME ${String(frame + 1).padStart(2, "0")}  //  VERIFIED ADMIN`, width / 2, height - 56);
}

module.exports = {
  config: {
    name: "owner",
    aliases: ["rakibboss", "abba", "botowner", "malik", "boss"],
    version: "4.0",
    author: OWNER_NAME,
    countDown: 3,
    role: 0,
    shortDescription: { en: "Animated neon owner profile" },
    longDescription: { en: "Shows the first admin's UID and profile in an animated neon GIF." },
    category: "info",
    guide: { en: "{p}owner" }
  },

  onStart: async function ({ api, usersData, message }) {
    let gifPath;
    try {
      const profile = await fetchProfile(api, usersData, OWNER_UID);
      gifPath = await createNeonGif({
        prefix: "owner",
        drawFrame: async (ctx, frame) => drawOwnerFrame(ctx, frame, profile)
      });
      return await message.reply({
        body: `👑 ${OWNER_NAME}\n🆔 UID: ${OWNER_UID}\n💗 Ghost Bot owner profile`,
        attachment: fs.createReadStream(gifPath)
      });
    } finally {
      if (gifPath) setTimeout(() => fs.remove(gifPath).catch(() => {}), 15000);
    }
  }
};