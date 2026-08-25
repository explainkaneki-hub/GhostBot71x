// Who Asked — Rakib Islam / Ghost Net Edition

const RESPONSES = [
  `🔍 WHO ASKED?\n\nSearching database...\n⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿ 100%\n\n❌ Result: Nobody asked.\n❌ 0 people care.\n❌ 0 f*cks given.\n\nBetter luck next time! 🤡`,
  `📡 Scanning the universe for who asked...\n\n🌍 Earth — না\n🌙 Moon — না\n⭐ Stars — না  \n🌌 Galaxy — না\n\n❌ WHO ASKED = NULL 🗑️`,
  `🤔 WHO ASKED?\n\n[ Processing... ]\n\nChecked:\n✗ তোর বন্ধু\n✗ তোর পরিবার\n✗ তোর ক্লাশের সবাই\n✗ পাড়ার লোকজন\n✗ পুরো বাংলাদেশ\n\n👁️ Result: NOBODY. 🤡`,
  `🚨 WHO ASKED ALERT 🚨\n\n[ Searching... 0% ]\n[ Not found... 0% ]\n[ Still not found... 0% ]\n\nFINAL ANSWER: তোর কথা কেউ শুনতে চায় না ভাই 💀`,
  `📊 WHO ASKED STATISTICS\n\n  Friends who asked   › 0\n  Family who asked    › 0\n  Strangers who asked › 0\n  God who asked       › 0\n  Dogs who asked      › 0\n\n  TOTAL: ZERO 🤡\n\n  Nobody. Not a single soul. 💀`,
  `🔭 Using NASA telescope to find who asked...\n\n🪐 Mars — No\n💫 Andromeda — No\n🌟 Milky Way — No\n☀️ Sun — No\n\n🌌 Universe Report: WHO ASKED = VOID\n\nChalk it up as an L king 👑`,
  `Who Asked Detector™ v9.9\n━━━━━━━━━━━━━━━━\n\n[Scanning group...]\n[Scanning planet...]\n[Scanning space...]\n[Scanning multiverse...]\n\nRESULT: null\n\nError 404: Who Asked Not Found 💀`,
];

const BN_EXTRAS = [
  "তোর কথা কেউ শুনতে চায়নি, শুনছে না, শুনবেও না 🤡",
  "এই group এ তোর opinion এর চাহিদা = শূন্য 📉",
  "কেউ জিজ্ঞেস করে নাই ভাই, কেউ করে নাই 💀",
  "তোর কথা বলার আগে একটু ভাব — কেউ কি চেয়েছে? স্পয়লার: না 🎭",
  "L নাও। শুধু L। পুরোটাই L। 🔴",
  "Ratio + Nobody asked + Touch grass 🌿",
  "আমি যদি প্রতিবার কেউ তোর কথা না শুনতে চাইলে টাকা পেতাম, আমি এতক্ষণে মিলিয়নেয়ার 💸",
];

module.exports = {
  config: {
    name: "whoasked",
    aliases: ["nobody", "nooneasks", "wa", "didask"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Who asked? — কেউ জিজ্ঞেস করে নাই!" },
    longDescription: { en: "Reply to someone's message or mention to tell them nobody asked. Classic internet meme." },
    category: "fun",
    guide: { en: "{p}whoasked — General response\n{p}whoasked reply — Reply to a specific message\n{p}whoasked @mention — Target someone" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let prefix = "";

    if (event.messageReply || mentioned.length > 0) {
      const uid = event.messageReply?.senderID || mentioned[0];
      try {
        const u = await usersData.get(uid);
        prefix = `📢 ${u?.name || "User"}, `;
      } catch { prefix = "📢 "; }
    }

    const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const bnExtra = BN_EXTRAS[Math.floor(Math.random() * BN_EXTRAS.length)];

    api.setMessageReaction("🤡", event.messageID, () => {}, true);

    message.reply(
      `${prefix ? prefix + "\n\n" : ""}${response}\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `💬 "${bnExtra}"\n` +
      `— Rakib Islam | Ghost Bot 👻`
    );
  }
};
