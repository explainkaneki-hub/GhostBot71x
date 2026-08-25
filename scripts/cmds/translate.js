const axios = require("axios");

module.exports = {
  config: {
    name: "translate",
    aliases: ["tr", "anubad"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "যেকোনো ভাষায় translate করো",
    longDescription: "Default Bangla. Format: tr [lang] <text>\nExample: tr en নমস্কার",
    category: "utility",
    guide: { en: "{p}translate [lang] <text>" }
  },
  onStart: async function ({ message, args, event }) {
    if (!args.length && event.type !== "message_reply") return message.reply("⚠️ Use:\ntr <text>\ntr en <text>\ntr bn <text>");
    let lang = "bn", text;
    if (args[0] && args[0].length === 2 && /^[a-z]{2}$/i.test(args[0])) {
      lang = args[0]; text = args.slice(1).join(" ");
    } else text = args.join(" ");
    if (!text && event.type === "message_reply") text = event.messageReply.body;
    if (!text) return message.reply("⚠️ Translate করার মতো কিছু দাও");
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
      const { data } = await axios.get(url);
      const result = (data?.[0] || []).map(p => p[0]).join("");
      const detected = data?.[2] || "?";
      return message.reply(`🌐 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗘\n━━━━━━━━━━━━━━━━\n📥 [${detected}] ${text.slice(0, 200)}\n📤 [${lang}] ${result}\n━━━━━━━━━━━━━━━━\n👻 Ghost Net`);
    } catch { return message.reply("❌ Translation failed"); }
  }
};
