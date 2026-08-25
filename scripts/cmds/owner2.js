const fs = require("fs-extra");
const { createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "owner2",
    aliases: ["ownerinfo", "devinfo"],
    version: "1.0",
    author: "Rakib Islam",
    role: 0,
    category: "info",
    shortDescription: "Clean owner information"
  },
  onStart: async function ({ message }) {
    const canvas = createCanvas(1000, 470);
    const ctx = canvas.getContext("2d");
    const bg = ctx.createLinearGradient(0, 0, 1000, 470);
    bg.addColorStop(0, "#0b1026");
    bg.addColorStop(0.5, "#1a1550");
    bg.addColorStop(1, "#071f34");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1000, 470);
    ctx.strokeStyle = "#7df9ff";
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, 960, 430);
    ctx.fillStyle = "#7df9ff";
    ctx.font = "bold 32px Arial";
    ctx.fillText("GHOST NET • OWNER PROFILE", 70, 90);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 54px Arial";
    ctx.fillText("Rakib Islam", 70, 185);
    ctx.font = "26px Arial";
    ctx.fillStyle = "#ccd5ff";
    ctx.fillText("Bot Owner & Developer", 70, 235);
    ctx.fillText("UID: 61575436812912", 70, 290);
    ctx.fillText("Bangladesh • Ghost Net Edition", 70, 345);
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Built with care, code and late-night ideas 👻", 70, 405);
    const file = `${__dirname}/cache/owner2_${Date.now()}.png`;
    await fs.ensureDir(`${__dirname}/cache`);
    await fs.writeFile(file, canvas.toBuffer("image/png"));
    return message.reply(
      { body: "👑 Owner: Rakib Islam\nUID: 61575436812912", attachment: fs.createReadStream(file) },
      () => fs.remove(file).catch(() => {})
    );
  }
};