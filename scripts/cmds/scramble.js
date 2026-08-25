const words = [
  { word: "DHAKA", hint: "বাংলাদেশের রাজধানী" },
  { word: "CRICKET", hint: "বাংলাদেশের জনপ্রিয় খেলা" },
  { word: "HILSHA", hint: "বাংলাদেশের জাতীয় মাছ" },
  { word: "MANGO", hint: "গ্রীষ্মের ফল" },
  { word: "TIGER", hint: "সুন্দরবনের রাজা" },
  { word: "RIVER", hint: "বাংলাদেশের প্রাণ" },
  { word: "MOSQUE", hint: "মুসলমানদের উপাসনালয়" },
  { word: "JACKFRUIT", hint: "বাংলাদেশের জাতীয় ফল" },
  { word: "PADMA", hint: "বাংলাদেশের বিখ্যাত নদী" },
  { word: "SUNDARBAN", hint: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন" },
  { word: "RICKSHAW", hint: "ঢাকার বিখ্যাত যানবাহন" },
  { word: "HILSA", hint: "রুপালি মাছ" },
];

const pending = {};

function shuffle(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}

module.exports.config = {
  name: "scramble",
  aliases: ["অক্ষরখেলা", "unscramble"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Word scramble game 🔤" },
  longDescription: { en: "Unscramble the letters to find the word!" },
  category: "game-bd",
  guide: { en: "{pn} | {pn} ans [answer]" }
};

module.exports.onStart = async ({ event, message, args }) => {
  const tid = event.threadID;
  if (args[0] === "ans") {
    const q = pending[tid];
    if (!q) return message.reply("❓ কোনো খেলা চলছে না। .scramble দিয়ে শুরু করো!");
    const guess = args.slice(1).join("").toUpperCase();
    if (guess === q.word) {
      delete pending[tid];
      return message.reply(`✅ সঠিক! শব্দটা ছিল: ${q.word} 🎉\n🌟 আরেকটা: .scramble`);
    }
    return message.reply(`❌ ভুল! আবার চেষ্টা করো। Hint: ${q.hint}\n💡 .scramble ans [উত্তর]`);
  }

  const w = words[Math.floor(Math.random() * words.length)];
  let scrambled = shuffle(w.word);
  while (scrambled === w.word) scrambled = shuffle(w.word);
  pending[tid] = w;
  return message.reply(`🔤 𝗦𝗰𝗿𝗮𝗺𝗯𝗹𝗲\n━━━━━━━━━━━━\n🔀 অক্ষরগুলো: ${scrambled}\n💡 Hint: ${w.hint}\n━━━━━━━━━━━━\n🎯 উত্তর: .scramble ans [word]`);
};
