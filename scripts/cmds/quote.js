const axios = require("axios");

module.exports = {
  config: {
    name: "quote",
    aliases: ["bani"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random motivational quote",
    category: "utility",
    guide: { en: "{p}quote" }
  },
  onStart: async function ({ message }) {
    try {
      const { data } = await axios.get("https://zenquotes.io/api/random");
      const q = data?.[0];
      if (q?.q) return message.reply(`💭 𝗤𝗨𝗢𝗧𝗘\n━━━━━━━━━━━━━━\n"${q.q}"\n— ${q.a}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    } catch {}
    const off = [
      ["The only way to do great work is to love what you do.", "Steve Jobs"],
      ["Be yourself; everyone else is already taken.", "Oscar Wilde"],
      ["In the middle of difficulty lies opportunity.", "Einstein"],
      ["Life is what happens when you're busy making other plans.", "John Lennon"]
    ];
    const [q, a] = off[Math.floor(Math.random() * off.length)];
    return message.reply(`💭 𝗤𝗨𝗢𝗧𝗘\n━━━━━━━━━━━━━━\n"${q}"\n— ${a}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};
