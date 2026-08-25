const axios = require("axios");

module.exports = {
  config: {
    name: "trivia",
    aliases: ["q"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Play trivia quiz",
    category: "games",
    guide: { en: "{p}trivia — Get a random trivia question" }
  },

  onStart: async function ({ message, commandName }) {
    try {
      const res = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple", { timeout: 10000 });
      const q = res.data?.results?.[0];
      if (!q) return message.reply("❌ Could not get trivia question. Try again!");

      const question = q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
      const correct = q.correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
      const wrong = q.incorrect_answers.map(a => a.replace(/&quot;/g, '"').replace(/&#039;/g, "'"));
      const all = [...wrong, correct].sort(() => Math.random() - 0.5);
      const letters = ["A", "B", "C", "D"];

      let optStr = all.map((a, i) => `${letters[i]}. ${a}`).join("\n");
      const correctLetter = letters[all.indexOf(correct)];

      const msg = await message.reply(
        `👻 𝗧𝗥𝗜𝗩𝗜𝗔 𝗤𝗨𝗜𝗭\n━━━━━━━━━━━━━━━━\n` +
        `📚 Category: ${q.category}\n🎯 Difficulty: ${q.difficulty}\n\n` +
        `❓ ${question}\n\n${optStr}\n\n` +
        `Reply with A, B, C, or D!\n━━━━━━━━━━━━━━━━\n— Rakib Islam | GoatBot`
      );

      global.GoatBot.onReply.set(msg.messageID, {
        commandName,
        messageID: msg.messageID,
        correctLetter,
        correct,
        author: event?.senderID
      });
    } catch (err) {
      message.reply("❌ Trivia error. Try again!");
    }
  },

  onReply: async function ({ event, message, Reply }) {
    const ans = event.body?.toUpperCase().trim();
    if (ans === Reply.correctLetter) {
      await message.reply(`✅ Correct! 🎉\n💡 Answer was: ${Reply.correct}\n\n🏆 Well done! — GoatBot`);
    } else {
      await message.reply(`❌ Wrong! The correct answer was: ${Reply.correctLetter}. ${Reply.correct}\n\nBetter luck next time! — GoatBot`);
    }
    global.GoatBot.onReply.delete(Reply.messageID);
  }
};
