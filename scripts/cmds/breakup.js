const msgs = [
  "আমরা যতদিন একসাথে ছিলাম, সে স্মৃতি চিরকাল থাকবে। কিন্তু এখন আলাদা হওয়াটাই ভালো। বিদায়। 💔",
  "তোমাকে ভুলতে পারব না, কিন্তু ভুলতে চেষ্টা করব। ভালো থেকো। 🖤",
  "আমাদের পথ আলাদা। তোমার জীবন সুন্দর হোক, এই কামনাই করি। 🌸",
  "যা হয়ে গেছে তা আর ফেরানো সম্ভব নয়। goodbye. 🌊",
  "তুমি ভালো মানুষ, কিন্তু আমাদের মিল হচ্ছে না। চলো আলাদা হই। 🍂",
  "এই সম্পর্ক আর বহন করতে পারছি না। তোমার ভালো হোক। 💧",
  "কিছু সম্পর্ক শেষ করা কষ্টের, কিন্তু না করলে আরও কষ্ট। বিদায়। 🌙",
  "তোমার জীবনে যে সুখ আমি দিতে পারিনি, অন্য কেউ দিক। 💔"
];

module.exports.config = {
  name: "breakup",
  aliases: ["brkp", "breakupmsg", "বিদায়"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Breakup messages in Bangla 💔" },
  longDescription: { en: "Get a graceful breakup message in Bangla." },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  return message.reply(`💔 𝗕𝗿𝗲𝗮𝗸𝘂𝗽 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━\n${m}\n━━━━━━━━━━━━\n🌊 আরেকটা: .breakup`);
};
