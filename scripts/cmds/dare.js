module.exports = {
  config: {
    name: "dare",
    aliases: ["chyalanj"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Truth or Dare — Dare challenge",
    category: "fun",
    guide: { en: "{p}dare" }
  },
  onStart: async function ({ message }) {
    const list = [
      "Group এ ১০ জন কে 'I love you' message পাঠাও 💌",
      "Mom কে call দিয়ে বলো 'আম্মু তোমাকে অনেক ভালোবাসি' 📞",
      "তোমার last dialed number কে call করো 📞",
      "নিজের cringe selfie তুলে post করো 🤳",
      "৫ মিনিটের জন্য চুপ থাকো ✋",
      "Voice note এ একটা গান গাও 🎤",
      "নিজের একটা embarrassing memory share করো 😅",
      "10 push-up দাও আর video পাঠাও 💪",
      "Best friend এর FB story শেষ ৫টা দেখে review লেখো 👀",
      "৩ জন strange person কে hi message পাঠাও 👋",
      "নিজের room এর photo পাঠাও 🏠",
      "Phone এর battery level + screen time screenshot দাও 📱",
      "একটা তেলেগু গান এর তাল ধরো 🎶",
      "চা/কফি দিয়ে কয়েকটা বিস্কুট খেয়ে video পাঠাও ☕",
      "তোমার 5 favourite emoji বলো এবং কেন 🤔"
    ];
    const d = list[Math.floor(Math.random() * list.length)];
    return message.reply(`🔥 𝗗𝗔𝗥𝗘 𝗖𝗛𝗔𝗟𝗟𝗘𝗡𝗚𝗘\n━━━━━━━━━━━━━━\n⚡ ${d}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
