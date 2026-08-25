module.exports = {
  config: {
    name: "rps",
    aliases: ["rockpaperscissors", "pkk"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Rock-Paper-Scissors খেলো bot এর সাথে",
    category: "game",
    guide: { en: "{p}rps <rock|paper|scissors>" }
  },
  onStart: async function ({ message, args }) {
    const map = { r: "rock", rock: "rock", p: "paper", paper: "paper", s: "scissors", scissors: "scissors" };
    const u = map[(args[0] || "").toLowerCase()];
    if (!u) return message.reply("⚠️ Use: rps rock | paper | scissors");
    const opts = ["rock", "paper", "scissors"];
    const b = opts[Math.floor(Math.random() * 3)];
    const ic = { rock: "🪨", paper: "📄", scissors: "✂️" };
    const wins = { rock: "scissors", paper: "rock", scissors: "paper" };
    let r = "🤝 Draw!";
    if (wins[u] === b) r = "🏆 তুমি জিতলে!";
    else if (wins[b] === u) r = "💀 Bot জিতলো!";
    return message.reply(`🎮 𝗥𝗢𝗖𝗞 𝗣𝗔𝗣𝗘𝗥 𝗦𝗖𝗜𝗦𝗦𝗢𝗥𝗦\n━━━━━━━━━━━━━━━━\n👤 তুমি: ${ic[u]} ${u}\n🤖 Bot : ${ic[b]} ${b}\n${r}\n━━━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};
