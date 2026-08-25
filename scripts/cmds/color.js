const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "color",
    aliases: ["colour", "hex"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Get color info from hex code",
    category: "utility",
    guide: { en: "{p}color #FF5733\n{p}color random" }
  },

  onStart: async function ({ message, args }) {
    let hex = args[0]?.replace("#", "") || "";
    if (args[0]?.toLowerCase() === "random") {
      hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    }
    if (!hex || hex.length !== 6) return message.reply("Usage: .color #FF5733 or .color random");

    try {
      const res = await axios.get(`https://www.thecolorapi.com/id?hex=${hex}`, { timeout: 10000 });
      const c = res.data;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgUrl = `https://dummyimage.com/300x200/${hex}/${hex}.png`;
      const filePath = path.join(cacheDir, `color_${Date.now()}.png`);
      const imgRes = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 10000 });
      const writer = fs.createWriteStream(filePath);
      imgRes.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      await message.reply({
        body: `👻 𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━\n` +
          `🎨 Name: ${c?.name?.value || hex}\n` +
          `🔵 HEX: #${hex.toUpperCase()}\n` +
          `🔴 RGB: ${c?.rgb?.value || "N/A"}\n` +
          `🟡 HSL: ${c?.hsl?.value || "N/A"}\n` +
          `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });
      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 10000);
    } catch (err) {
      message.reply(`❌ Color info failed for #${hex}`);
    }
  }
};
