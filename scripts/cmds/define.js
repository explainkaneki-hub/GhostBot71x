const axios = require("axios");

module.exports = {
  config: {
    name: "define",
    aliases: ["dictionary", "dict"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "English word এর meaning",
    category: "utility",
    guide: { en: "{p}define <word>" }
  },
  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("⚠️ একটা word দাও\nযেমন: define ghost");
    const word = args[0].toLowerCase();
    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const e = data?.[0];
      if (!e) return message.reply("❌ Word না পাওয়া গেছে");
      let m = `📖 𝗗𝗘𝗙𝗜𝗡𝗘 — ${e.word}\n━━━━━━━━━━━━━━━━\n`;
      if (e.phonetic) m += `🔊 ${e.phonetic}\n\n`;
      for (const mn of (e.meanings || []).slice(0, 3)) {
        m += `📌 [${mn.partOfSpeech}]\n`;
        for (const d of (mn.definitions || []).slice(0, 2)) {
          m += `   • ${d.definition}\n`;
          if (d.example) m += `     ↪ "${d.example}"\n`;
        }
        m += `\n`;
      }
      m += `━━━━━━━━━━━━━━━━\n👻 Ghost Net`;
      return message.reply(m);
    } catch { return message.reply("❌ Word না পাওয়া গেছে"); }
  }
};
