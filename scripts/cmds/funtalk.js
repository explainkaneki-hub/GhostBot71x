const lines = [
  "আমি lazy না, energy save করছি। 🔋",
  "ঘুম হলো সবচেয়ে সস্তা vacation। 😴✈️",
  "আমার diet plan: যা খাই তা খাই, পরে ভাবব। 🍔",
  "দুনিয়ার সবচেয়ে কঠিন কাজ: সকাল ৬টায় ঘুম থেকে ওঠা। 😩",
  "Monday হলো সপ্তাহের villain। 😠",
  "বৃষ্টিতে ভেজা romantic — মশার কামড়ে না। 🦟",
  "পেট ভরা থাকলে পৃথিবী সুন্দর। 🍛",
  "exam এর আগের রাত = Netflix + অনুশোচনা। 😭📺",
  "সবচেয়ে বড় মিথ্যা: '5 minutes and I'll be ready!' ⏰",
  "আমি রোজ ব্যায়াম করব — আগামীকাল থেকে। 💪 (প্রতিদিন একই কথা)",
  "WiFi না থাকলে মনে হয় দুনিয়া শেষ হয়ে গেছে। 📶",
  "ব্যাংকে টাকা নেই, কিন্তু Reels দেখার সময় আছে। 😂",
  "আমার চোখ বন্ধ কিন্তু ঘুমাচ্ছি না — চিন্তা করছি! 🤔",
  "সবাই বলে 'পানি খাও' — আমি বলি 'চা খাও'। ☕",
  "Love at first sight হয় না, Love at first food হয়। 🍕❤️"
];

module.exports.config = {
  name: "funtalk",
  aliases: ["funline", "oneliner", "হাস্যকর"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Random funny one-liners in Bangla 😂" },
  longDescription: { en: "Get a random funny Bangla one-liner!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const l = lines[Math.floor(Math.random() * lines.length)];
  return message.reply(`😂 𝗙𝘂𝗻𝗻𝘆 𝗟𝗶𝗻𝗲\n━━━━━━━━━━━━\n${l}\n━━━━━━━━━━━━\n😆 আরেকটা: .funtalk`);
};
