module.exports = {
  config: {
    name: "dice",
    aliases: ["roll", "dau"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Dice roll করো (default 6 face)",
    category: "game",
    guide: { en: "{p}dice [sides] [count]\nExample: dice 6 2" }
  },
  onStart: async function ({ message, args }) {
    const sides = Math.max(2, Math.min(100, parseInt(args[0]) || 6));
    const count = Math.max(1, Math.min(10, parseInt(args[1]) || 1));
    const ic = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    const display = rolls.map(r => sides === 6 ? ic[r - 1] : `[${r}]`).join(" ");
    return message.reply(`🎲 𝗗𝗜𝗖𝗘 𝗥𝗢𝗟𝗟\n━━━━━━━━━━━━━━\n${display}\n📊 Sum: ${total} (${count}d${sides})\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};
