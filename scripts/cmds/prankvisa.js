const fs = require("fs-extra");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "prankvisa",
    aliases: ["fakevisa", "prankcard"],
    version: "1.0",
    author: "Rakib Islam",
    role: 0,
    category: "fun",
    shortDescription: "RGB animated prank Visa card"
  },
  onStart: async function ({ message, event }) {
    const dir = `${__dirname}/cache`;
    const file = `${dir}/prankvisa_${event.senderID}_${Date.now()}.gif`;
    await fs.ensureDir(dir);
    const width = 900, height = 520;
    const encoder = new GIFEncoder(width, height);
    const writer = fs.createWriteStream(file);
    encoder.createReadStream().pipe(writer);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(100);
    encoder.setQuality(8);
    const colors = ["#ff0055", "#00f5ff", "#7dff00", "#ff00ff", "#ffd166"];
    for (let frame = 0; frame < 18; frame++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#060817");
      gradient.addColorStop(1, "#25104d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = colors[frame % colors.length];
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 24;
      ctx.lineWidth = 8;
      ctx.strokeRect(22, 22, width - 44, height - 44);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 45px Arial";
      ctx.fillText("GHOST NET", 70, 100);
      ctx.font = "bold 30px Arial";
      ctx.fillText("PRANK VISA CARD", 70, 145);
      ctx.font = "bold 42px monospace";
      ctx.fillText("4444 1337 0000 2026", 70, 270);
      ctx.font = "26px Arial";
      ctx.fillText("RAKIB • NOT A REAL BANK CARD", 70, 355);
      ctx.fillStyle = "#ffd166";
      ctx.font = "bold 34px Arial";
      ctx.fillText("BALANCE: ∞ TK (JUST FOR FUN)", 70, 420);
      encoder.addFrame(ctx);
    }
    encoder.finish();
    await new Promise((resolve, reject) => {
      writer.once("finish", resolve);
      writer.once("error", reject);
    });
    return message.reply(
      { body: "😂 তোমার RGB Prank Visa Card ready — এটা real card না!", attachment: fs.createReadStream(file) },
      () => fs.remove(file).catch(() => {})
    );
  }
};