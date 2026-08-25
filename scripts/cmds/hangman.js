module.exports = {
  config: {
    name: "hangman",
    aliases: ["hng"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "Hangman game — letter guess",
    category: "game",
    guide: { en: "{p}hangman   then reply with a letter" }
  },
  onStart: async function ({ message, event, commandName }) {
    const words = ["javascript", "bangladesh", "facebook", "ghost", "neon", "rakib", "computer", "chocolate", "diamond", "magic"];
    const w = words[Math.floor(Math.random() * words.length)];
    const masked = w.split("").map(() => "_").join(" ");
    const sent = await message.reply(`🎯 𝗛𝗔𝗡𝗚𝗠𝗔𝗡\n━━━━━━━━━━━━━━\n🔤 ${masked}\n❤️ Lives: 6\n💬 Reply this message with one letter\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, word: w, lives: 6, guessed: [], state: w.split("").map(() => "_") });
  },
  onReply: async function ({ message, event, Reply, commandName }) {
    if (event.senderID !== Reply.author) return;
    const l = event.body.trim().toLowerCase();
    if (l.length !== 1 || !/[a-z]/.test(l)) return message.reply("⚠️ একটা letter দাও");
    if (Reply.guessed.includes(l)) return message.reply("⚠️ এই letter আগে guess হয়েছে");
    Reply.guessed.push(l);
    let hit = false;
    Reply.word.split("").forEach((c, i) => { if (c === l) { Reply.state[i] = c; hit = true; } });
    if (!hit) Reply.lives--;
    const won = !Reply.state.includes("_");
    const lost = Reply.lives <= 0;
    if (won) {
      global.GoatBot.onReply.delete(Reply.messageID);
      return message.reply(`🏆 জিতলে! Word: ${Reply.word}\n👻 Ghost Net`);
    }
    if (lost) {
      global.GoatBot.onReply.delete(Reply.messageID);
      return message.reply(`💀 Hanged! Word ছিল: ${Reply.word}\n👻 Ghost Net`);
    }
    const sent = await message.reply(`🔤 ${Reply.state.join(" ")}\n❤️ Lives: ${Reply.lives}\n📝 Used: ${Reply.guessed.join(", ")}\n💬 Reply this message with another letter`);
    global.GoatBot.onReply.set(sent.messageID, { ...Reply, commandName, messageID: sent.messageID });
  }
};
