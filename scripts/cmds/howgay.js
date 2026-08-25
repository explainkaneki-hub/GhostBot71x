// How Gay Meter — Rakib Islam / Ghost Net Edition (Just for fun!)

const COMMENTS = [
  [0,   10,  "💪 Straight as an arrow", "একদম সোজা মানুষ! 📏"],
  [11,  25,  "😏 Slightly questioning", "একটু সন্দেহজনক... কিছু বলার নাই 🤫"],
  [26,  45,  "🌈 Rainbow curious!", "রঙধনু দেখলে একটু বেশি খুশি হস কেন? 🌈"],
  [46,  60,  "🏳️ Certified rainbow", "Pride parade এ দেখা হবে! 🎉"],
  [61,  80,  "💅 Fully iconic", "Fashion icon confirmed। সবাই তোর মতো হতে চায় 💅"],
  [81,  95,  "🌟 Rainbow royalty", "তোর জন্য pride flag এর রং কম পড়ে যাচ্ছে! 👑🌈"],
  [96,  100, "🦄 Unicorn level", "তুই তো পুরাই unicorn ভাই! 🦄✨"],
];

function getComment(score) {
  for (const [min, max, en, bn] of COMMENTS) {
    if (score >= min && score <= max) return { en, bn };
  }
  return { en: "Off the charts!", bn: "মাপা যাচ্ছে না!" };
}

module.exports = {
  config: {
    name: "howgay",
    aliases: ["gaymeter", "rainbow", "pride"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Fun gay meter — just for laughs! 🌈" },
    longDescription: { en: "A fun, harmless meter. No offense intended — just internet humor for everyone!" },
    category: "fun",
    guide: { en: "{p}howgay — নিজের result\n{p}howgay @mention — কারো result" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let uid;
    if (event.messageReply) uid = event.messageReply.senderID;
    else if (mentioned.length > 0) uid = mentioned[0];
    else uid = event.senderID;

    let name = "Unknown";
    try { const u = await usersData.get(uid); name = u?.name || "Unknown"; } catch {}

    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = (seed * 13 + 3) % 101;
    const { en, bn } = getComment(score);

    const filled = Math.round(score / 100 * 15);
    const bar = `[${"🌈".repeat(Math.ceil(filled / 3))}${"⬜".repeat(Math.ceil((15 - filled) / 3))}] ${score}%`;

    api.setMessageReaction("🌈", event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  🌈 RAINBOW METER          ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Name   › ${name}\n` +
      `  ✦ Score  › ${score}%\n` +
      `  ✦ Meter  › ${bar}\n\n` +
      `  ${en}\n  💬 "${bn}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ Just for fun! No offense 😄\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
