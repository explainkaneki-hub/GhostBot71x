const compliments = [
  "তোমার হাসি দেখলে মনে হয় ফুল ফুটেছে! 🌸",
  "তুমি যা বলো সেটা সবসময় মাথায় ঢোকে, কারণ তুমি বুদ্ধিমান! 🧠",
  "তোমার মতো মানুষ খুব কম পাওয়া যায়! 💎",
  "তুমি ভেতর থেকে যতটা সুন্দর, বাইরেও ততটাই! 😊",
  "তোমার সাথে কথা বললে সময় কোথায় যায় বোঝা যায় না! ⏰",
  "তুমি সত্যিই অনেক caring একজন মানুষ! 🤗",
  "তোমার মতো বন্ধু পাওয়া ভাগ্যের বিষয়! 🍀",
  "তোমার ক্রিয়েটিভিটি দেখে অবাক হই! 🎨",
  "তুমি যা করো, ভালো করেই করো! 💪",
  "তোমার positive energy সবাইকে আলোকিত করে! ✨",
  "তুমি যেকোনো পরিস্থিতি সামলাতে পারো! 🦁",
  "তোমার হাসি দুনিয়াকে সুন্দর করে! 😁",
  "তুমি কথা বলো সুন্দর করে, মন ভালো হয়ে যায়! 🎵",
  "তুমি সবার মধ্যে একদম আলাদা! 🌟",
  "তোমার মন যেমন সুন্দর, তুমিও তেমন! 💝"
];

module.exports.config = {
  name: "compliment",
  aliases: ["comp", "প্রশংসা", "praise"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangla compliments 🌸" },
  longDescription: { en: "Send a sweet compliment in Bangla!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ api, event, message, args, usersData }) => {
  const c = compliments[Math.floor(Math.random() * compliments.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "তুমি";
    target = `👤 ${name}, `;
  }
  return message.reply(`💌 𝗖𝗼𝗺𝗽𝗹𝗶𝗺𝗲𝗻𝘁\n━━━━━━━━━━━━\n${target}${c}\n━━━━━━━━━━━━\n🌸 আরেকটা: .compliment`);
};
