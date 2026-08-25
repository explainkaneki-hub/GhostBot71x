module.exports = {
  config: {
    name: "quiz",
    aliases: ["banglaquiz"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random Bangla GK quiz",
    category: "game",
    guide: { en: "{p}quiz" }
  },
  onStart: async function ({ message, event, commandName }) {
    const Q = [
      { q: "বাংলাদেশের রাজধানী কী?", o: ["Dhaka", "Chittagong", "Khulna", "Sylhet"], a: 0 },
      { q: "জাতীয় ফুল কোনটি?", o: ["গোলাপ", "শাপলা", "জবা", "পদ্ম"], a: 1 },
      { q: "১৯৭১ সালে কোন তারিখে স্বাধীনতা ঘোষণা হয়?", o: ["১৬ ডিসেম্বর", "২৬ মার্চ", "১ জানুয়ারি", "৭ মার্চ"], a: 1 },
      { q: "বাংলাদেশের জাতীয় পশু কী?", o: ["গরু", "বাঘ", "হাতি", "হরিণ"], a: 1 },
      { q: "কোন নদী বাংলাদেশে নেই?", o: ["Padma", "Jamuna", "Nile", "Meghna"], a: 2 },
      { q: "বাংলাদেশ কত সালে স্বাধীন হয়?", o: ["1947", "1952", "1971", "1990"], a: 2 },
      { q: "বাংলা বছরের প্রথম মাস কোনটি?", o: ["চৈত্র", "বৈশাখ", "শ্রাবণ", "মাঘ"], a: 1 },
      { q: "কোন জেলা চা এর জন্য বিখ্যাত?", o: ["Rangpur", "Sylhet", "Barishal", "Rajshahi"], a: 1 }
    ];
    const x = Q[Math.floor(Math.random() * Q.length)];
    const opts = x.o.map((t, i) => `${["A", "B", "C", "D"][i]}. ${t}`).join("\n");
    const sent = await message.reply(`❓ 𝗤𝗨𝗜𝗭\n━━━━━━━━━━━━━━\n${x.q}\n\n${opts}\n💬 Reply with A/B/C/D (15s)\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, ans: x.a, options: x.o });
    setTimeout(() => {
      if (global.GoatBot.onReply.has(sent.messageID)) {
        global.GoatBot.onReply.delete(sent.messageID);
        message.reply(`⏰ Time over! Answer: ${["A","B","C","D"][x.a]}. ${x.o[x.a]}`);
      }
    }, 15000);
  },
  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const u = (event.body || "").trim().toUpperCase();
    const idx = ["A", "B", "C", "D"].indexOf(u);
    if (idx < 0) return message.reply("⚠️ A/B/C/D দাও");
    global.GoatBot.onReply.delete(Reply.messageID);
    if (idx === Reply.ans) return message.reply(`🏆 ঠিক উত্তর! ${Reply.options[Reply.ans]}\n👻 Ghost Net`);
    return message.reply(`❌ ভুল! সঠিক answer: ${["A","B","C","D"][Reply.ans]}. ${Reply.options[Reply.ans]}\n👻 Ghost Net`);
  }
};
