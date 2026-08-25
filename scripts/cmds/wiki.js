const axios = require("axios");

module.exports = {
  config: {
    name: "wiki",
    aliases: ["wikipedia"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Wikipedia summary",
    category: "utility",
    guide: { en: "{p}wiki <topic>" }
  },
  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("⚠️ একটা topic দাও\nযেমন: wiki Bangladesh");
    try {
      const q = encodeURIComponent(args.join(" "));
      const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`);
      if (!data?.extract) return message.reply("❌ Topic পাওয়া যায়নি");
      return message.reply(`📖 𝗪𝗜𝗞𝗜 — ${data.title}
━━━━━━━━━━━━━━━━
${data.extract}

🔗 ${data.content_urls?.desktop?.page || ""}
━━━━━━━━━━━━━━━━
👻 Ghost Net`);
    } catch { return message.reply("❌ Topic পাওয়া যায়নি"); }
  }
};
