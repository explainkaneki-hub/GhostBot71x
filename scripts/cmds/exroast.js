const roasts = [
  "তোমার ex ভাবতো যে সে special, কিন্তু এখন দেখা যাচ্ছে সে just একজন regular clown! 🤡",
  "তোমার ex বলেছিল 'তোমাকে ছাড়া থাকতে পারব না' — এখন কিন্তু বেশ ভালোই আছে! 🤣",
  "তোমার ex এর নতুন partner দেখে বুঝলাম, downgrade করতেও কিছু প্রতিভা লাগে! 😂",
  "তোমার ex হলো সেই wifi যেটা কখনো ঠিকমতো কাজ করেনি কিন্তু disconnect করতে দেরি হয়েছিল! 📶😅",
  "তোমার ex এত কষ্ট দিয়েছে, কিন্তু সেটাই তোমাকে stronger বানিয়েছে! 💪",
  "তোমার ex ভেবেছিল তুমি miss করবে — তুমি তো থ্যাংকস গড বলেছ! 😏",
  "Red flag দেখেছিলে, তবুও গিয়েছিলে — এখন lesson শিখেছ! 🚩😂",
  "তোমার ex চলে যাওয়া মানে নতুন ভালো কিছু আসার জায়গা হয়েছে! 🌟"
];

module.exports.config = {
  name: "exroast",
  aliases: ["roastex", "exburn", "এক্স"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Fun ex-partner roast 🔥" },
  longDescription: { en: "Roast your ex (for fun only!) 😂" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const r = roasts[Math.floor(Math.random() * roasts.length)];
  return message.reply(`🔥 𝗘𝘅 𝗥𝗼𝗮𝘀𝘁\n━━━━━━━━━━━━\n${r}\n━━━━━━━━━━━━\n😂 মজার জন্য মাত্র! | আরেকটা: .exroast`);
};
