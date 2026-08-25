const msgs = [
  "তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি। আমার ভালোবাসা কি তুমি গ্রহণ করবে? 💍❤️",
  "প্রতিটি সকালে তোমার কথা মনে পড়ে, প্রতিটি রাতে তোমাকে মিস করি। আমার হবে? 🌹",
  "তুমি না থাকলে এই পৃথিবীটা অসম্পূর্ণ মনে হয়। আমার জীবনে আসবে? 💕",
  "হাজারো মানুষের মাঝে শুধু তোমাকেই খুঁজি। Will you be mine? 🌟",
  "তোমার হাসি দেখলে মনে হয় আর কিছু চাই না। তুমি কি আমার জীবনসঙ্গী হবে? 💝",
  "তোমাকে ছাড়া আমার দিন শুরু হয় না। আমার ভালোবাসা কি accept করবে? 🌸",
  "তুমি আমার জীবনের সেই কবিতা যা বারবার পড়তে চাই। আমার হবে? 📖❤️",
  "আমি তোমাকে ভালোবাসি — এই কথাটা বলতে অনেক সাহস লেগেছে। তোমার উত্তর কী? 💌"
];

module.exports.config = {
  name: "propose",
  aliases: ["prop", "প্রপোজ", "love_msg"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Romantic propose messages 💍" },
  longDescription: { en: "Get a sweet propose message in Bangla!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "প্রিয়";
    target = `💌 ${name},\n\n`;
  }
  return message.reply(`💍 𝗣𝗿𝗼𝗽𝗼𝘀𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n🌹 আরেকটা: .propose`);
};
