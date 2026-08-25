const msgs = [
  "তুমি দূরে থাকলেও মনের মধ্যে সবসময় থাকো। অনেক miss করছি। 💙",
  "তোমার সাথে কাটানো প্রতিটা মুহূর্ত মনে পড়ে। আবার দেখা হবে কি? 🌟",
  "রাত হলে তোমার কথা বেশি মনে পড়ে। wish তুমি কাছে থাকতে। 🌙",
  "তুমি নেই, তবুও সব কিছুতে তোমাকে দেখি। 🦋",
  "তোমার হাসি, তোমার কথা — সব মিস করি। 💕",
  "কতদিন কথা হয়নি। তোমার কণ্ঠস্বর শুনতে ইচ্ছে করছে। 📞",
  "তুমি ছাড়া সময় কাটানো কঠিন হয়ে যাচ্ছে। 💔",
  "miss করি মানে ভালোবাসি — এটাই সত্যি। ❤️"
];

module.exports.config = {
  name: "missing",
  aliases: ["miss2", "imiss", "মিস"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Miss you messages in Bangla 💙" },
  longDescription: { en: "Send a heartfelt 'I miss you' message in Bangla." },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "তুমি";
    target = `💙 ${name},\n\n`;
  }
  return message.reply(`💙 𝗠𝗶𝘀𝘀 𝗬𝗼𝘂\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n🌟 আরেকটা: .missing`);
};
