const msgs = [
  "তোমরা দুজন যেন চাঁদ আর তারার মতো — আলাদা কিন্তু একে অপরকে ছাড়া অসম্পূর্ণ। 🌙⭐",
  "তোমাদের জুটি দেখলে মনে হয় ঈশ্বর নিজে এই match টা বানিয়েছেন। 💕",
  "তোমরা দুজন মিলে একটা সুন্দর গল্প লিখছো। 📖❤️",
  "তোমাদের ভালোবাসা অনেক কিছু শেখায় — কীভাবে ভালোবাসতে হয়। 🌹",
  "তোমরা দুজন একে অপরের জন্যই জন্ম নিয়েছ। 💞",
  "তোমাদের জুটি এতটাই perfect যে ঈর্ষা হয়! 😍",
  "তোমাদের প্রেমের গল্প একটা বইয়ে লেখা উচিত। 📚💕",
  "তোমরা দুজন যেন চা আর বিস্কুট — একসাথে না হলে মজা নেই! ☕🍪"
];

module.exports.config = {
  name: "couple",
  aliases: ["coupleq", "জুটি", "ship3"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Couple appreciation messages 💑" },
  longDescription: { en: "Send a sweet couple message for two people!" },
  category: "বাংলা",
  guide: { en: "{pn} [@person1] [@person2]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  const uids = Object.keys(event.mentions || {});
  let header = "💑 𝗖𝗼𝘂𝗽𝗹𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲";
  if (uids.length >= 2) {
    const n1 = await usersData.getName(uids[0]) || "Person 1";
    const n2 = await usersData.getName(uids[1]) || "Person 2";
    header = `💑 ${n1} & ${n2}`;
  }
  return message.reply(`${header}\n━━━━━━━━━━━━\n${m}\n━━━━━━━━━━━━\n💕 আরেকটা: .couple`);
};
