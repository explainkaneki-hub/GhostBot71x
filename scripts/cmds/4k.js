const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "3.1",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    category: "tools",
    shortDescription: "AI image upscaler",
    guide: { en: "{pn} — reply to an image" }
  },
  onStart: async function ({ event, message }) {
    const attachment = event.messageReply?.attachments?.find(item => item.type === "photo");
    if (event.type !== "message_reply" || !attachment?.url) {
      return message.reply("⚠️ একটি image reply করে `.4k` লিখুন।");
    }
    const dir = path.join(__dirname, "cache");
    const file = path.join(dir, `4k_${Date.now()}.png`);
    await fs.ensureDir(dir);
    await message.reply("⏳ Image 4K upscale হচ্ছে...");
    try {
      const result = await axios.post(
        "https://xalman-apis.vercel.app/api/upscale",
        { imageUrl: attachment.url },
        { responseType: "arraybuffer", timeout: 300000 }
      );
      await fs.writeFile(file, Buffer.from(result.data));
      return message.reply(
        { body: "✅ 4K image ready ✨", attachment: fs.createReadStream(file) },
        () => fs.remove(file).catch(() => {})
      );
    } catch (error) {
      await fs.remove(file).catch(() => {});
      return message.reply(`❌ Upscale failed: ${error.response?.status || error.message}`);
    }
  }
};