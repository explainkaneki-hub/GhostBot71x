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

function drawPookieFrame(ctx, frame, profile) {
  const width = 1000;
  const height = 560;
  const pink = frame % 2 ? "#ff72dc" : "#ff2bbd";
  const hotPink = frame % 3 ? "#ff0f9f" : "#ffb3ed";

  drawNeonBackground(ctx, width, height, frame, [pink, "#ffb3ed", "#8c4dff"]);
  ctx.fillStyle = "rgba(22, 2, 24, 0.90)";
  roundRect(ctx, 40, 40, width - 80, height - 80, 32, true, false);
  ctx.strokeStyle = pink;
  ctx.shadowColor = pink;
  ctx.shadowBlur = 28;
  ctx.lineWidth = 4;
  roundRect(ctx, 40, 40, width - 80, height - 80, 32, false, true);
  ctx.shadowBlur = 0;

  ctx.textAlign = "center";
  ctx.fillStyle = hotPink;
  ctx.font = "bold 18px monospace";
  ctx.fillText("♡  P O O K I E   M O D E  ♡", width / 2, 92);
  ctx.fillStyle = "#fff7fd";
  ctx.shadowColor = hotPink;
  ctx.shadowBlur = 18;
  ctx.font = "bold 42px Arial";
  ctx.fillText("Rakibul Hasan", width / 2, 148);
  ctx.shadowBlur = 0;

  drawAvatar(ctx, profile.avatar, 500, 290, 92, pink);
  ctx.fillStyle = "#ffc9f2";
  ctx.font = "bold 22px Arial";
  ctx.fillText("the cute boss behind Ghost Bot", width / 2, 420);
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px monospace";
  ctx.fillText(`UID  •  ${OWNER_UID}`, width / 2, 458);
  ctx.fillStyle = hotPink;
  ctx.font = "bold 18px Arial";
  ctx.fillText(frame % 2 ? "✨ stay soft, stay iconic ✨" : "💗 coded with love & neon 💗", width / 2, 510);
}

module.exports = {
  config: {
    name: "owner2",
    aliases: ["ownerinfo", "devinfo", "pookieowner"],
    version: "2.0",
    author: OWNER_NAME,
    countDown: 3,
    role: 0,
    category: "info",
    shortDescription: "Pookie-style animated owner GIF",
    guide: "{p}owner2"
  },

  onStart: async function ({ api, usersData, message }) {
    let gifPath;
    try {
      const profile = await fetchProfile(api, usersData, OWNER_UID);
      gifPath = await createNeonGif({
        prefix: "owner2",
        width: 1000,
        height: 560,
        drawFrame: async (ctx, frame) => drawPookieFrame(ctx, frame, profile)
      });
      return await message.reply({
        body: `💗 Pookie owner mode\n👑 ${OWNER_NAME}\n🆔 UID: ${OWNER_UID}`,
        attachment: fs.createReadStream(gifPath)
      });
    } finally {
      if (gifPath) setTimeout(() => fs.remove(gifPath).catch(() => {}), 15000);
    }
  }
};