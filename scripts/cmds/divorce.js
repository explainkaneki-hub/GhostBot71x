// Divorce Command — Rakib Islam / Ghost Net Edition

const DIVORCE_LINES = [
  "আমরা আর together না। এটাই সত্যি।",
  "এই relationship টা শেষ হওয়াই ভালো ছিল।",
  "যাও, তুমি মুক্ত। আমিও।",
  "Papers signed. It's over. Goodbye.",
  "তোমার সাথে থেকে আমার যা হয়েছে, আর না।",
  "We were never meant to be. Accept it.",
];

const DRAMA_LINES = [
  "😭 আমার বুক ভেঙে গেল...",
  "💔 ৩ বছরের relationship শেষ এভাবে?",
  "😤 Fine! আমি better পাবো!",
  "🥺 তুমি কি একবারো ভাবলে না?",
  "😤 আমি তো জানতামই এমন হবে।",
  "💀 এই দুঃখ আমি সারাজীবন বহন করবো।",
];

module.exports = {
  config: {
    name: "divorce",
    aliases: ["separated", "expartner"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Divorce from your paired partner 💔" },
    longDescription: { en: "Dramatically divorce from your .pair partner with Bengali drama. Fun role-play command." },
    category: "fun",
    guide: { en: "{p}divorce — Divorce your paired partner\n{p}divorce @mention — Divorce a specific person (drama)" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let partnerName = "তোমার partner";
    let senderName = "তুমি";

    try {
      const s = await usersData.get(event.senderID);
      senderName = s?.name?.split(" ")[0] || "তুমি";
    } catch {}

    if (mentioned.length > 0) {
      try {
        const p = await usersData.get(mentioned[0]);
        partnerName = p?.name?.split(" ")[0] || "Unknown";
      } catch {}
    }

    const divorceLine = DIVORCE_LINES[Math.floor(Math.random() * DIVORCE_LINES.length)];
    const dramaLine = DRAMA_LINES[Math.floor(Math.random() * DRAMA_LINES.length)];

    api.setMessageReaction("💔", event.messageID, () => {}, true);

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  💔 DIVORCE PAPERS SIGNED  ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  📜 Official Divorce Notice\n\n` +
      `  From  › ${senderName}\n` +
      `  To    › ${partnerName}\n\n` +
      `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
      `  "${divorceLine}"\n\n` +
      `  ${dramaLine}\n\n` +
      `  ┄┄┄┄ Lawyer Says ┄┄┄┄\n` +
      `  Assets divided: 50/50 ⚖️\n` +
      `  Shared memories: Deleted 🗑️\n` +
      `  Future: ??? 🌌\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  💡 Use .pair to find new partner!\n  — Rakib Islam | Ghost Bot 👻`
    );
  }
};
