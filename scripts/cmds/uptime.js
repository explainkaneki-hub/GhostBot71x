const os = require("os");
const fs = require("fs-extra");
const {
  createNeonGif,
  fitText,
  roundRect,
  drawNeonBackground
} = require("../utils/neonGif");

function formatUptime(totalSeconds) {
  const seconds = Math.floor(totalSeconds);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${rest}s`;
}

function drawUptimeFrame(ctx, frame, stats) {
  const width = 1100;
  const height = 620;
  const colors = ["#ff2bd6", "#00e5ff", "#8b5cf6"];
  const pink = frame % 2 ? colors[0] : "#ff00a8";
  drawNeonBackground(ctx, width, height, frame, [pink, colors[1], colors[2]]);

  ctx.fillStyle = "rgba(3, 5, 18, 0.92)";
  roundRect(ctx, 50, 50, width - 100, height - 100, 26, true, false);
  ctx.strokeStyle = pink;
  ctx.shadowColor = pink;
  ctx.shadowBlur = 26;
  ctx.lineWidth = 3;
  roundRect(ctx, 50, 50, width - 100, height - 100, 26, false, true);
  ctx.shadowBlur = 0;

  ctx.textAlign = "left";
  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 17px monospace";
  ctx.fillText("GHOST BOT // LIVE SYSTEM TELEMETRY", 82, 100);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = pink;
  ctx.shadowBlur = 18;
  ctx.font = "bold 48px Arial";
  ctx.fillText("BOT UPTIME", 82, 166);
  ctx.shadowBlur = 0;

  const rows = [
    ["UPTIME", stats.uptime, "#ff75df"],
    ["PING", `${stats.ping} ms`, "#55f5ff"],
    ["OWNER", stats.owner, "#c2a1ff"],
    ["HOST", stats.host, "#ffb0ed"],
    ["NODE", stats.node, "#7df9ff"],
    ["PLATFORM", stats.platform, "#d5bfff"]
  ];
  rows.forEach(([label, value, color], index) => {
    const x = 82 + (index % 2) * 470;
    const y = 224 + Math.floor(index / 2) * 76;
    ctx.fillStyle = "rgba(20, 18, 42, 0.92)";
    roundRect(ctx, x, y, 430, 56, 12, true, false);
    ctx.strokeStyle = `${color}99`;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, 430, 56, 12, false, true);
    ctx.fillStyle = "rgba(210, 205, 240, 0.6)";
    ctx.font = "12px monospace";
    ctx.fillText(label, x + 16, y + 21);
    ctx.fillStyle = "#ffffff";
    fitText(ctx, String(value), 375, 19, "Arial");
    ctx.fillText(String(value), x + 16, y + 43);
  });

  ctx.fillStyle = pink;
  ctx.font = "bold 14px monospace";
  ctx.fillText(`RGB CORE ${String(frame + 1).padStart(2, "0")}  •  ONLINE  •  PORT ${stats.port}`, 82, 510);
  ctx.fillStyle = "#a9a3c9";
  ctx.font = "13px monospace";
  ctx.fillText("Encrypted messaging active  //  Canvas telemetry stream", 82, 542);
  ctx.textAlign = "right";
  ctx.fillStyle = "#00e5ff";
  ctx.fillText("NO SIGNAL LOSS", width - 82, 542);
}

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "4.0",
    author: "Rakibul Hasan",
    role: 0,
    countDown: 2,
    usePrefix: true,
    shortDescription: { en: "Animated RGB neon uptime telemetry" },
    longDescription: { en: "Shows uptime, ping, owner, host, Node and runtime information in an animated GIF." },
    category: "system",
    guide: { en: "{pn} — check live bot telemetry" }
  },

  onStart: async function ({ api, event, message }) {
    let loading;
    let gifPath;
    try {
      loading = await message.reply("⚡ Measuring Ghost Bot telemetry…");
      const started = Date.now();
      try { await api.getCurrentUserID(); } catch (_) {}
      const ping = Math.max(1, Date.now() - started);
      const stats = {
        uptime: formatUptime(process.uptime()),
        ping,
        owner: "Rakibul Hasan",
        host: os.hostname().slice(0, 30),
        node: process.version,
        platform: `${process.platform}/${process.arch}`,
        port: process.env.PORT || "3021"
      };
      gifPath = await createNeonGif({
        prefix: "uptime",
        drawFrame: async (ctx, frame) => drawUptimeFrame(ctx, frame, stats)
      });
      if (loading?.messageID) await api.unsendMessage(loading.messageID).catch(() => {});
      return await message.reply({
        body: `💜 GHOST BOT STATUS\n⏱ Uptime: ${stats.uptime}\n⚡ Ping: ${stats.ping}ms\n👑 Owner: ${stats.owner}\n🖥 Host: ${stats.host}`,
        attachment: fs.createReadStream(gifPath)
      });
    } catch (error) {
      if (loading?.messageID) await api.unsendMessage(loading.messageID).catch(() => {});
      throw error;
    } finally {
      if (gifPath) setTimeout(() => fs.remove(gifPath).catch(() => {}), 15000);
    }
  }
};