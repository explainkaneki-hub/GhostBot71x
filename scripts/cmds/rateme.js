const rates = [
  { score: "10/10", msg: "💯 Perfect! তুমি একদম legend!", emoji: "👑" },
  { score: "9/10", msg: "🌟 Excellent! তুমি অসাধারণ!", emoji: "🌟" },
  { score: "8/10", msg: "😊 Very good! অনেক ভালো!", emoji: "✨" },
  { score: "7/10", msg: "😄 Good! তুমি ভালো মানুষ।", emoji: "💚" },
  { score: "6/10", msg: "🙂 Above average! মন্দ না।", emoji: "💛" },
  { score: "5/10", msg: "😐 Average. আরেকটু চেষ্টা করো।", emoji: "🧡" },
  { score: "4/10", msg: "😅 Below average. উন্নতির জায়গা আছে।", emoji: "🔸" },
  { score: "3/10", msg: "😬 Hmm. অনেক উন্নতি দরকার।", emoji: "😬" },
  { score: "11/10", msg: "💫 Off the charts! তুমি chart break করে ফেলেছ!", emoji: "🚀" },
];

module.exports.config = {
  name: "rateme",
  aliases: ["rate2", "রেট", "rateyou"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Rate yourself or someone randomly 🌟" },
  longDescription: { en: "Get a random rating for yourself or someone else!" },
  category: "game-bd",
  guide: { en: "{pn} | {pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const uid = uids[0] || event.senderID;
  const name = await usersData.getName(uid) || "তুমি";
  const seed = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const r = rates[seed % rates.length];
  return message.reply(`🌟 𝗥𝗮𝘁𝗶𝗻𝗴\n━━━━━━━━━━━━\n${r.emoji} ${name}\n🔢 স্কোর: ${r.score}\n━━━━━━━━━━━━\n${r.msg}`);
};
