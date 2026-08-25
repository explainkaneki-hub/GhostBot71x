const msgs = ["এসো, একটু কাছে থাকি। 🫂💕", "virtual cuddle পাঠালাম! 🤗🌸", "তোমাকে cuddle করতে ইচ্ছে করছে! 💝", "নাও একটা warm cuddle! 🫂❤️", "একটু ভালো লাগাচ্ছি। cuddle! 🤗💙"];

module.exports.config = {
  name: "cuddle",
  aliases: ["cuddlebd", "কোলে", "snuggle"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Send a virtual cuddle 🫂" },
  longDescription: { en: "Cuddle someone virtually!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`🫂 𝗖𝘂𝗱𝗱𝗹𝗲\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`🫂 ${sender}, ${m}`);
};
