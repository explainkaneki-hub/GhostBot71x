module.exports = {
  config: {
    name: "calc",
    aliases: ["calculate", "math"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Calculator — যেকোনো অংক করো",
    category: "utility",
    guide: { en: "{p}calc <expression>\nExample: calc 25 * 4 + 7" }
  },
  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("⚠️ একটা অংক লিখো\nযেমন: calc (25 + 75) / 4");
    const expr = args.join(" ").replace(/[^-+*/%().\d\s]/g, "");
    if (!expr) return message.reply("⚠️ Invalid expression");
    try {
      const r = Function(`"use strict"; return (${expr})`)();
      if (!isFinite(r)) throw new Error("infinity");
      return message.reply(`🧮 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥\n━━━━━━━━━━━━━━\n📝 ${expr}\n= ${r}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    } catch { return message.reply("❌ Calculation failed"); }
  }
};
