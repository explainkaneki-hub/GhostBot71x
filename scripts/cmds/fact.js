module.exports = {
  config: {
    name: "fact",
    aliases: ["tothha", "factbn"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random Bangla মজার তথ্য",
    category: "fun",
    guide: { en: "{p}fact" }
  },
  onStart: async function ({ message }) {
    const facts = [
      "অক্টোপাসের ৩টা হৃদয় থাকে! 🐙",
      "মৌমাছিরা গণিত বুঝতে পারে — ০ এর ধারণা ও জানে। 🐝",
      "Bangla ভাষায় সবচেয়ে বড় শব্দ হলো: 'প্রত্যুদ্‌গমনার্থপ্রস্তুতিকরণার্থে'। 📚",
      "মানুষের পেটের acid এতটাই শক্তিশালী যে metal blade গলিয়ে দিতে পারে! 🦠",
      "Banana আসলে berry — strawberry না! 🍌",
      "Honey কখনো নষ্ট হয় না — ৩০০০ বছর পুরোনো honey ও খাওয়া যায়। 🍯",
      "চাঁদে hoof print আজও আছে — কারণ wind নেই। 👨‍🚀",
      "বাঘের চামড়ার নিচেও ডোরা আছে — শুধু লোমে না। 🐯",
      "Bangladesh এ ৫০০+ নদী আছে। 🌊",
      "Eiffel Tower গরমে ১৫ cm পর্যন্ত উচ্চতা বাড়ে। 🗼",
      "মানুষ একদিনে গড়ে ১০০০+ চিন্তা করে। 🧠",
      "বানর কলা খাওয়ার সময় খোসা আগে ছিলে নেয় — উল্টো দিক থেকে! 🐒",
      "Cow এর best friend থাকে — যাদের আলাদা করলে depressed হয়। 🐄",
      "Dolphin ঘুমানোর সময় মস্তিষ্কের অর্ধেক জাগ্রত রাখে। 🐬",
      "Pineapple এ একটা enzyme আছে যা তোমার জিহ্বা খায় — তাই jhajh kore! 🍍"
    ];
    return message.reply(`💡 𝗗𝗔𝗥𝗨𝗡 𝗙𝗔𝗖𝗧\n━━━━━━━━━━━━━━\n${facts[Math.floor(Math.random() * facts.length)]}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
