const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_URLS = [
  (url) => `https://xsaim8x-xxx-api.onrender.com/api/auto?url=${encodeURIComponent(url)}`,
  async (url) => {
    const config = await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json", { timeout: 10000 });
    return `${config.data.api2}/alldlxx?url=${encodeURIComponent(url)}`;
  }
];

function findMedia(data) {
  if (!data) return [];
  if (typeof data === "string" && /^https?:\/\//.test(data)) return [data];
  if (Array.isArray(data)) return data.flatMap(findMedia);
  if (typeof data !== "object") return [];
  const direct = ["url", "download", "download_url", "high_quality", "low_quality", "mediaUrl"];
  const found = direct.flatMap(key => findMedia(data[key]));
  const nested = ["media", "files", "urls", "data", "result"].flatMap(key => findMedia(data[key]));
  return [...new Set([...found, ...nested])];
}

module.exports = {
  config: {
    name: "alldl",
    aliases: ["download"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    category: "media",
    shortDescription: "Download media from a link",
    guide: { en: "{pn} <Facebook/TikTok/Instagram/YouTube media link>" }
  },

  onStart: async function ({ args, event, message, api }) {
    const url = args.find(value => /^https?:\/\//i.test(value));
    if (!url) return message.reply("📥 একটি media link দিন। Example: .alldl https://...");
    const filePath = path.join(__dirname, "cache", `alldl_${event.senderID}_${Date.now()}.bin`);
    try {
      await fs.ensureDir(path.dirname(filePath));
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      let payload;
      for (const makeUrl of API_URLS) {
        try {
          const endpoint = typeof makeUrl === "function" ? await makeUrl(url) : makeUrl;
          const response = await axios.get(endpoint, { timeout: 30000 });
          const links = findMedia(response.data).filter(link => link !== url);
          if (links.length) {
            payload = { data: response.data, link: links[0] };
            break;
          }
        } catch {}
      }
      if (!payload) throw new Error("কোনো working downloader API response দেয়নি");
      const response = await axios.get(payload.link, {
        responseType: "stream",
        timeout: 60000,
        maxContentLength: 45 * 1024 * 1024,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.on("error", reject);
      });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      return message.reply(
        { body: "✅ Media download complete", attachment: fs.createReadStream(filePath) },
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      await fs.remove(filePath).catch(() => {});
      return message.reply(`❌ Download failed: ${error.message}`);
    }
  }
};