const msgs = ["মাথায় আদর দিলাম 👋💙", "নাও একটা ছোট্ট pat! 🫶", "তুমি ভালো আছো, pat pat! 🤲", "এই pat টা ভালোবাসার। 💕"];

module.exports.config = {
  name: "pat2",
  aliases: ["headpat", "আদর", "patpat"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Pat someone on the head 🫶" },
  longDescription: { en: "Give someone a gentle head pat!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const sender = await usersData.getName(event.senderID) || "কেউ";
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  if (uids.length > 0) {
    const receiver = await usersData.getName(uids[0]) || "তুমি";
    return message.reply(`🫶 𝗣𝗮𝘁 𝗣𝗮𝘁\n━━━━━━━━━━━━\n${sender} → ${receiver}\n${m}`);
  }
  return message.reply(`🫶 ${sender}, ${m}`);
};
