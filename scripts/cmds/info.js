module.exports = {
  config: {
    name: "info",
    aliases: ["botinfo", "about"],
    version: "1.0",
    author: "Rakib Islam",
    role: 0,
    category: "info",
    shortDescription: "Ghost Net bot information"
  },
  onStart: async function ({ message }) {
    return message.reply(
      "👻 GHOST NET BOT\n\n" +
      "⚡ FCA: @cexy/rakibfca\n" +
      "🧩 Commands: 260+\n" +
      "💾 Economy: Persistent SQLite\n" +
      "🎨 Cards: Canvas + Jimp\n" +
      "🎵 Media: Song / TikTok / AllDL\n\n" +
      "👑 Owner: Rakib Islam\n" +
      "🔤 Prefix: ."
    );
  }
};