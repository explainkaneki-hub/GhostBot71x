// Fake GF/BF Generator — Rakib Islam / Ghost Net Edition

const GF_NAMES = ["Sakura Chan","Hina ✨","Mia 💕","Rina 🌸","Aisha 💖","Nadia 🌹","Zara 💎","Luna 🌙","Sofia ❤️","Aria 🦋","Meera 💜","Lena 🌺","Nova 🌟","Lily 🌼","Riya 💓"];
const BF_NAMES = ["Aryan 😎","Rafi 💪","Zayan 🔥","Rohan 🌟","Amir 👑","Riyad 💎","Fahim 🎯","Nabil ⚡","Omar 🌙","Ziad 🗡️","Hasan 🔰","Kabir 🐉","Rayan 🌊","Tanvir 💫","Sakib 🎭"];

const PERSONALITIES = ["Caring & Sweet 🥰","Funny & Playful 😂","Loyal & Honest 💎","Smart & Ambitious 🧠","Shy but Cute 🌸","Bold & Confident 😎","Creative & Artistic 🎨","Sporty & Active 🏃","Calm & Peaceful 🌿","Romantic & Loving 💕","Mysterious & Quiet 🌙","Cheerful & Bubbly ✨"];

const HOBBIES = ["Gaming 🎮","Cooking 🍳","Drawing 🎨","Reading 📚","Music 🎵","Dancing 💃","Photography 📸","Traveling ✈️","Working out 💪","Watching anime 🎌","Writing poetry ✍️","Gardening 🌸"];

const LOVE_MSGS = [
  "তুমি ছাড়া আমার দিন শুরু হয় না 💕",
  "তোমার কথা মনে হলেই হাসি চলে আসে 😊",
  "তুমি আমার সব থেকে বড় weakness 🥺",
  "তোমার সাথে থাকলে সব ঠিক লাগে 🌸",
  "I miss you already even though you're here 💎",
  "তুমি আমার স্বপ্নের মানুষ 🌙",
  "তোমার হাসি দেখলে আমার দিন ভালো হয়ে যায় ✨",
];

module.exports = {
  config: {
    name: "fakegf",
    aliases: ["fakebf", "fakepartner", "virtualpartner", "mygf2", "mybf2"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Generate a fake GF/BF profile — fun simulator 💕" },
    longDescription: { en: "Generate a funny fake girlfriend or boyfriend profile with personality, hobbies, and love messages." },
    category: "fun",
    guide: { en: "{p}fakegf — Get a fake GF\n{p}fakebf — Get a fake BF\n{p}fakegf @user — Generate for someone" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const isBF = event.body?.toLowerCase().includes("bf") || args[0]?.toLowerCase() === "bf";
    const mentioned = Object.keys(event.mentions || {});

    let requesterName = "তুই";
    const uid = mentioned[0] || event.senderID;
    try {
      const u = await usersData.get(uid);
      requesterName = u?.name?.split(" ")[0] || "তুই";
    } catch {}

    const seed = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const names = isBF ? BF_NAMES : GF_NAMES;
    const name = names[seed % names.length];
    const personality = PERSONALITIES[(seed * 3) % PERSONALITIES.length];
    const hobby1 = HOBBIES[(seed * 5) % HOBBIES.length];
    const hobby2 = HOBBIES[(seed * 7 + 2) % HOBBIES.length];
    const loveMsg = LOVE_MSGS[(seed * 11) % LOVE_MSGS.length];

    const age = 18 + (seed % 8);
    const height = isBF ? `${165 + (seed % 20)} cm` : `${155 + (seed % 15)} cm`;
    const compatibility = 70 + (seed % 30);

    const stars = "⭐".repeat(Math.round(compatibility / 20));

    api.setMessageReaction("💕", event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  💕 ${isBF ? "FAKE BF" : "FAKE GF"} GENERATOR       ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  💌 For: ${requesterName}\n\n` +
      `  ┄┄┄┄┄┄ PROFILE ┄┄┄┄┄┄\n` +
      `  ✦ Name          › ${name}\n` +
      `  ✦ Age           › ${age} years\n` +
      `  ✦ Height        › ${height}\n` +
      `  ✦ Personality   › ${personality}\n` +
      `  ✦ Hobbies       › ${hobby1}, ${hobby2}\n\n` +
      `  ┄┄┄┄ COMPATIBILITY ┄┄┄┄\n` +
      `  ✦ Match Score   › ${compatibility}%\n` +
      `  ✦ Rating        › ${stars}\n\n` +
      `  💬 ${name} বলছে:\n  "${loveMsg}"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ This is fictional — just for fun! 😂\n` +
      `  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
