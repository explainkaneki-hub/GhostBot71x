// Simp Meter — Rakib Islam / Ghost Net Edition

const SIMP_LEVELS = [
  [0,  15, "🧊 Ice Cold — কোনো feelings নেই", "পাথরের দিলের মানুষ! কেউ কি ভালোবাসতে পারবে না তোকে? 💀"],
  [16, 30, "😎 Chad — simp না, based ছেলে/মেয়ে", "Based! Simp করার দরকার নেই, মানুষ নিজেই আসবে 😎"],
  [31, 50, "🙂 Normal — মোটামুটি ঠিক আছে", "একটু ভালো লাগা থাকা স্বাভাবিক, worry করিস না 🙂"],
  [51, 70, "👀 Suspicious — একটু বেশি দেখাচ্ছে", "ব্যাপার কি? কাউকে নিয়ে একটু বেশিই ভাবছিস মনে হয়! 👀"],
  [71, 85, "💘 Certified Simp — admit কর", "ভাই/আপু admit করে ফেল! Simp হওয়া লজ্জার না 💘"],
  [86, 95, "🤡 Pro Simp — সবাই জানে শুধু তুই জানিস না", "তোর simp-ness দেখে পুরো group হাসছে 🤡"],
  [96, 100,"👑 ULTIMATE SIMP KING/QUEEN — Hall of Fame", "🚨 SIMP ALERT 🚨 তোর জন্য আলাদা museum বানানো দরকার! 🏆"],
];

function getLevel(score) {
  for (const [min, max, label, comment] of SIMP_LEVELS) {
    if (score >= min && score <= max) return { label, comment };
  }
  return SIMP_LEVELS[SIMP_LEVELS.length - 1];
}

function simpBar(score) {
  const filled = Math.round(score / 100 * 15);
  return `[${"💗".repeat(Math.ceil(filled/3))}${"🖤".repeat(Math.ceil((15-filled)/3))}] ${score}%`;
}

module.exports = {
  config: {
    name: "simp",
    aliases: ["simpmeter", "simpcheck", "simptest"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Simp meter — কতটুকু simp তুই?" },
    longDescription: { en: "Check simp level of yourself or any user. Funny Bengali + English commentary." },
    category: "fun",
    guide: { en: "{p}simp — নিজের simp score\n{p}simp @mention — কারো simp score\n{p}simp reply — replied user এর score" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let uid, name;

    if (event.messageReply) {
      uid = event.messageReply.senderID;
    } else if (mentioned.length > 0) {
      uid = mentioned[0];
    } else {
      uid = event.senderID;
    }

    try { const u = await usersData.get(uid); name = u?.name || "Unknown"; }
    catch { name = "Unknown"; }

    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = seed % 101;
    const { label, comment } = getLevel(score);
    const bar = simpBar(score);

    const emoji = score < 30 ? "😎" : score < 60 ? "🙂" : score < 80 ? "💘" : score < 95 ? "🤡" : "👑";
    api.setMessageReaction(emoji, event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  💘 SIMP METER RESULT     ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Name    › ${name}\n` +
      `  ✦ Score   › ${score}%\n` +
      `  ✦ Meter   › ${bar}\n\n` +
      `  ${emoji} ${label}\n\n` +
      `  💬 রায়:\n  "${comment}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ Just for fun! 😂\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
