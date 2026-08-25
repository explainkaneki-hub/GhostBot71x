const answers = [
  "হ্যাঁ, অবশ্যই! ✅", "না, একদমই না! ❌", "সম্ভবত হ্যাঁ। 🤔", "সম্ভবত না। 😐",
  "নিশ্চিত নই, পরে জিজ্ঞেস করো। ⏳", "এটা নির্ভর করে তোমার উপর। 💭",
  "অবশ্যই হ্যাঁ! 🌟", "মোটেই না! 😤", "ভালো সম্ভাবনা আছে। 🍀",
  "চেষ্টা করে দেখো। 💪", "এখন না, হয়তো পরে। ⌛", "জাদুর বল বলছে: হ্যাঁ! 🔮",
  "সব লক্ষণ না বলছে। 🚫", "হয়তো। 🤷", "স্বপ্নেও না! 😂",
  "এই প্রশ্নের উত্তর মহাবিশ্ব জানে। 🌌"
];

module.exports.config = {
  name: "magic8",
  aliases: ["jadu", "জাদুবল", "8b"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Magic 8 ball in Bangla 🔮" },
  longDescription: { en: "Ask any yes/no question and get a mystical answer!" },
  category: "game-bd",
  guide: { en: "{pn} [question]" }
};

module.exports.onStart = async ({ message, args }) => {
  const q = args.join(" ");
  if (!q) return message.reply("🔮 একটা প্রশ্ন করো!\n📌 উদাহরণ: .magic8 আমি কি পাস করব?");
  const ans = answers[Math.floor(Math.random() * answers.length)];
  return message.reply(`🔮 𝗠𝗮𝗴𝗶𝗰 𝟴 𝗕𝗮𝗹𝗹\n━━━━━━━━━━━━\n❓ ${q}\n━━━━━━━━━━━━\n🎱 জাদুর উত্তর: ${ans}`);
};
