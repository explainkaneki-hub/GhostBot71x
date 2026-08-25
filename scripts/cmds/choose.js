module.exports = {
  config: {
    name: "choose",
    aliases: ["pick", "select"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Comma দিয়ে options — bot একটা choose করবে",
    category: "fun",
    guide: { en: "{p}choose option1, option2, option3" }
  },
  onStart: async function ({ message, args }) {
    const opts = args.join(" ").split(",").map(s => s.trim()).filter(Boolean);
    if (opts.length < 2) return message.reply("⚠️ অন্তত ২টা option দাও comma দিয়ে\nযেমন: choose চা, কফি, কোক");
    const pick = opts[Math.floor(Math.random() * opts.length)];
    return message.reply(`🎲 𝗖𝗛𝗢𝗢𝗦𝗘\n━━━━━━━━━━━━━━\nOptions: ${opts.join(", ")}\n👉 আমি বলি: ${pick}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
