const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "2.0",
    author: "Rakib Islam",
    role: 0,
    usePrefix: true,
    shortDescription: {
      en: "Check bot uptime with ping and image"
    },
    longDescription: {
      en: "Display how long the bot is running along with ping time and a custom image"
    },
    category: "system",
    guide: {
      en: "{pn} → check bot uptime with ping"
    }
  },

  onStart() {},

  onChat: async function ({ event, message, args, commandName }) {
    const prefix = global.GoatBot.config.prefix || "/";
    const body = event.body?.trim() || "";
    if (!body.startsWith(prefix + commandName) && !this.config.aliases.some(a => body.startsWith(prefix + a))) return;

    const imagePath = path.join(__dirname, "uptime_animation.gif");

    try {
      const pingMsg = await message.reply("⚡ Checking ping...");
      const start = Date.now();
      await new Promise(res => setTimeout(res, 100));
      const ping = Date.now() - start;

      const uptime = Math.floor(process.uptime()); // in seconds
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = uptime % 60;
      const upTimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const canvas = createCanvas(1000, 500);
      const ctx = canvas.getContext("2d");

      const bgUrl = "https://i.imgur.com/b4rDlP9.png";
      const background = await loadImage(bgUrl);
      const encoder = new GIFEncoder(canvas.width, canvas.height);
      const output = fs.createWriteStream(imagePath);
      encoder.createReadStream().pipe(output);
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(120);
      encoder.setQuality(8);

      // A short polished loop: moving glow, progress bar, and status dots.
      for (let frame = 0; frame < 16; frame++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const glowX = 90 + ((canvas.width - 180) * frame) / 15;
        const glow = ctx.createRadialGradient(glowX, 80, 0, glowX, 80, 190);
        glow.addColorStop(0, "rgba(255,255,255,0.26)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(7, 12, 30, 0.58)";
        ctx.fillRect(38, 38, 924, 424);
        ctx.strokeStyle = "rgba(255, 205, 92, 0.75)";
        ctx.lineWidth = 3;
        ctx.strokeRect(38, 38, 924, 424);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
        ctx.fillText("BOT UPTIME", 75, 105);
        ctx.font = "bold 42px Arial";
        ctx.fillText(`Uptime: ${upTimeStr}`, 75, 195);
        ctx.fillText(`Ping: ${ping}ms`, 75, 275);
        ctx.fillText("Owner: Rakib Islam", 75, 355);

        ctx.shadowColor = "transparent";
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(75, 410, 850, 12);
        ctx.fillStyle = "#ffd05a";
        ctx.fillRect(75, 410, 850 * ((frame + 1) / 16), 12);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      await new Promise((resolve, reject) => {
        output.once("finish", resolve);
        output.once("error", reject);
      });

      await message.unsend(pingMsg.messageID);

      await message.reply({
        body: `
━━━━━━━━━━━━━━
𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒 ✅
╭─╼━━━━━━━━╾─╮
│ 💤 Uptime : ${upTimeStr}
│ ⚡ Ping   : ${ping}ms
│ 👑 Owner  : Zefox
╰─━━━━━━━━━╾─╯
━━━━━━━━━━━━━━
        `,
        attachment: fs.createReadStream(imagePath)
      });

    } catch (err) {
      console.error("❌ Error in uptime command:", err);
      await message.reply(
        "⚠️ Failed to generate uptime."
      );
    } finally {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
  }
};
