// IQ Meter Command — Rakib Islam / Ghost Net Edition
const axios = require("axios");

const IQ_COMMENTS = [
  [0,   20,  "🧠 Brain.exe has stopped working 💀", "তোর মাথায় কি সবজি আছে? মানুষের মগজ তো নাই! 🥦"],
  [21,  40,  "🪨 Your IQ is lower than room temperature", "পাথরের থেকেও কম বুদ্ধি তোর! ইট পাথর তোর চেয়ে স্মার্ট 🪨"],
  [41,  60,  "🐑 Average sheep level IQ", "ভেড়ার পালের সাথে থাকিস কেন না? তোর জায়গা ওখানে 🐑"],
  [61,  80,  "😐 Below average, try harder", "একটু পড়ালেখা করলে মানুষ হতে পারবি হয়তো 📚"],
  [81,  100, "😌 Average human — nothing special", "মোটামুটি চলছে, কিন্তু বিশেষ কিছু না 🙂"],
  [101, 120, "🧐 Above average! Decent brain", "বেশ ভালো বুদ্ধি আছে, নষ্ট করিস না 👍"],
  [121, 140, "🔥 Smart! You're doing great", "তুই আসলেই বুদ্ধিমান! সবার থেকে এগিয়ে 🚀"],
  [141, 160, "💡 Genius level achieved!", "জিনিয়াস! তোর মগজ সোনায় মোড়ানো 💎"],
  [161, 180, "🤯 Super genius — are you even human?", "তুই কি সত্যিই মানুষ? এত বুদ্ধি কোথায় পেলি! 🌟"],
  [181, 200, "🚀 Einstein reincarnated!", "আইনস্টাইন ফিরে এসেছে! তুই পৃথিবীর জন্য ভয়ঙ্কর 🌍"],
];

function getComment(iq) {
  for (const [min, max, en, bn] of IQ_COMMENTS) {
    if (iq >= min && iq <= max) return { en, bn };
  }
  return { en: "Off the charts!", bn: "তোর IQ মাপার যন্ত্র এখনো তৈরি হয়নি!" };
}

function iqBar(iq) {
  const pct = Math.min(iq / 200, 1);
  const filled = Math.round(pct * 15);
  const bar = "█".repeat(filled) + "░".repeat(15 - filled);
  return `[${bar}] ${iq}/200`;
}

module.exports = {
  config: {
    name: "iq",
    aliases: ["iqtest", "braintest", "smartmeter"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "IQ test meter for any user" },
    longDescription: { en: "Measure IQ of yourself or any mentioned user with a fun meter and Bengali commentary." },
    category: "fun",
    guide: { en: "{p}iq — Test your IQ\n{p}iq @mention — Test someone's IQ\n{p}iq reply — Test replied user's IQ" }
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

    // Seed-based "consistent" IQ per user (fun but feels real)
    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const iq = (seed % 160) + 30; // Range: 30-189

    const comment = getComment(iq);
    const bar = iqBar(iq);

    const emoji = iq < 60 ? "🪨" : iq < 80 ? "🐑" : iq < 100 ? "😐" : iq < 120 ? "🧐" : iq < 140 ? "🔥" : iq < 160 ? "💡" : "🚀";

    api.setMessageReaction(emoji, event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  🧠 IQ TEST RESULT        ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Name   › ${name}\n` +
      `  ✦ IQ     › ${iq}\n` +
      `  ✦ Meter  › ${bar}\n\n` +
      `  ${emoji} ${comment.en}\n\n` +
      `  💬 বাংলায়:\n  "${comment.bn}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ Just for fun! 😂\n` +
      `  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
