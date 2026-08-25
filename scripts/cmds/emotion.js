const emotions = [
  { name: "সুখী 😊", quote: "এই মুহূর্তে সুখী থাকা মানে জীবনকে ভালোবাসা। সুখী থাকো সবসময়!" },
  { name: "দুঃখী 😢", quote: "কষ্টগুলো একদিন গল্প হয়ে যাবে। এখন কাঁদলেও পরে হাসবে।" },
  { name: "রাগী 😤", quote: "রাগ সাময়িক, কিন্তু এর পরিণতি দীর্ঘস্থায়ী। একটু থামো।" },
  { name: "একা 🌙", quote: "একা থাকা মানে দুর্বল নয়। নিজের সাথে সময় কাটানো সবচেয়ে দামি।" },
  { name: "চিন্তিত 😟", quote: "চিন্তা করা বন্ধ করো, সমাধান খোঁজো। তুমি পারবে।" },
  { name: "অনুপ্রাণিত 🔥", quote: "এই শক্তি ধরে রাখো! তুমি আজ যা শুরু করবে, কাল সেটাই তোমার সাফল্য।" },
  { name: "ক্লান্ত 😩", quote: "বিশ্রাম নাও, কিন্তু ছেড়ে দিও না। বিশ্রামের পর আবার উঠে দাঁড়াবে।" },
  { name: "ভালো আছি 🙂", quote: "ভালো থাকা সবচেয়ে বড় নেয়ামত। এভাবেই থাকো।" },
];

module.exports.config = {
  name: "emotion",
  aliases: ["feel", "মন", "feeling"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Express your emotion with a quote 💭" },
  longDescription: { en: "Pick how you feel and get an emotional quote!" },
  category: "বাংলা",
  guide: { en: "{pn} [সুখী/দুঃখী/রাগী/একা/চিন্তিত/অনুপ্রাণিত/ক্লান্ত]" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) {
    const e = emotions[Math.floor(Math.random() * emotions.length)];
    return message.reply(`💭 𝗘𝗺𝗼𝘁𝗶𝗼𝗻\n━━━━━━━━━━━━\n${e.name}\n${e.quote}\n━━━━━━━━━━━━\n💡 .emotion [অনুভূতি]`);
  }
  const q = args.join(" ").toLowerCase();
  const found = emotions.find(e => e.name.toLowerCase().includes(q));
  const e = found || emotions[Math.floor(Math.random() * emotions.length)];
  return message.reply(`💭 ${e.name}\n━━━━━━━━━━━━\n${e.quote}`);
};
