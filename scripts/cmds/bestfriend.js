const msgs = [
  "তুমি শুধু বন্ধু নও, তুমি আমার পরিবারের একটা অংশ। 🤝💙",
  "হাজার মানুষের মাঝে তুমিই সেই একজন যে সত্যিটা বলো। ❤️",
  "বিপদে পাশে থাকা মানুষই আসল বন্ধু — আর তুমিই সেই মানুষ। 🦁",
  "তোমার সাথে পাগলামি করার কেউ নেই, তুমি না থাকলে জীবন boring। 😂💕",
  "তুমি আমার secrets জানো, তবুও পাশে আছো — এটাই বন্ধুত্ব। 🤫❤️",
  "দূরে থাকলেও মনের কাছাকাছি আছো সবসময়। 🌟",
  "তোমার মতো বন্ধু পাওয়া সত্যিই ভাগ্যের বিষয়। 🍀",
  "আমরা হয়তো সবসময় কথা বলি না, কিন্তু তুমি সবসময় মনে থাকো। 💙"
];

module.exports.config = {
  name: "bestfriend",
  aliases: ["bff", "bdoost", "বন্ধু", "friend3"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Best friend appreciation messages 🤝" },
  longDescription: { en: "Show your BFF some love with a Bangla message!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "বন্ধু";
    target = `💙 ${name},\n\n`;
  }
  return message.reply(`🤝 𝗕𝗲𝘀𝘁 𝗙𝗿𝗶𝗲𝗻𝗱\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n💙 আরেকটা: .bestfriend`);
};
