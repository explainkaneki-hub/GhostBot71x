// Fight Command — Bengali Auto-Fight v3 — Rakib Islam / Ghost Net Edition

const MOVES = [
  { name: "ঘুসি মারলো",       min: 8,  max: 20 },
  { name: "লাথি দিলো",        min: 10, max: 22 },
  { name: "চড় দিলো",         min: 5,  max: 15 },
  { name: "পিঠে মাইর দিলো",   min: 12, max: 25 },
  { name: "মাথায় মারলো",      min: 15, max: 28 },
  { name: "কামড় দিলো",       min: 6,  max: 18 },
  { name: "ধাক্কা দিলো",      min: 8,  max: 16 },
  { name: "বেত মারলো",       min: 10, max: 20 },
  { name: "জুতা মারলো",      min: 7,  max: 19 },
  { name: "হাঁটু দিলো",      min: 12, max: 24 },
  { name: "কনুই দিলো",       min: 13, max: 26 },
  { name: "থুতু দিলো",       min: 1,  max: 5  },
  { name: "দৌড়িয়ে আক্রমণ",   min: 15, max: 30 },
  { name: "চুল ধরে টানলো",    min: 8,  max: 18 },
  { name: "চিমটি কাটলো",      min: 4,  max: 12 },
];

const CRITICAL_MOVES = [
  { name: "💥 ULTRA COMBO!!",   dmg: 35 },
  { name: "🔥 FIRE PUNCH!!",    dmg: 40 },
  { name: "⚡ THUNDER KICK!!",  dmg: 38 },
  { name: "💎 DIAMOND HIT!!",   dmg: 42 },
  { name: "🌪️ TORNADO SLAM!!", dmg: 45 },
  { name: "☠️ DEATH BLOW!!",   dmg: 50 },
];

const MISS_LINES = [
  "কিন্তু মিস করলো! 😂",
  "কিন্তু ফাঁকা গেলো! 🤣",
  "পড়ে গিয়ে নিজেই হাঁটু ছিলে ফেললো! 😅",
  "কিন্তু হাওয়া কাটলো শুধু! 💨",
];

const WIN_LINES = [
  "🏆 CHAMPION! এই group এ আর কেউ নেই তার level এ!",
  "👑 UNDISPUTED WINNER! সালাম দাও সবাই!",
  "💎 GOAT STATUS ACHIEVED! ইতিহাস হয়ে গেলো!",
  "🔥 DESTROYER MODE! শত্রু ধুলোয় মিশে গেছে!",
  "⚡ LEGEND! আজ থেকে এই GC এর boss!",
];

const LOSE_LINES = [
  "😵 KNOCKED OUT! সোজা হাসপাতালে যাও!",
  "💀 COMPLETELY DESTROYED! উঠতে পারবে না!",
  "🤕 GG EZ! আর fight করতে আসিস না!",
  "😂 Pure L নাও। Skill issue.",
  "🗑️ এত সহজে হারলে fight এ কেন আসছিলি?",
];

function hpBar(hp, maxHp = 120) {
  const pct = Math.max(0, hp) / maxHp;
  const filled = Math.round(pct * 10);
  const bar = pct > 0.6 ? "🟩" : pct > 0.3 ? "🟨" : "🟥";
  return (bar.repeat(filled) + "⬛".repeat(10 - filled)).slice(0, 20) + ` ${Math.max(0, hp)}hp`;
}

const activeFights = new Map();

module.exports = {
  config: {
    name: "fight",
    aliases: ["গরম_যুদ্ধ", "যুদ্ধ", "ফাইট"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Auto Bengali fight with HP bars 🥊" },
    longDescription: { en: "Challenge someone to an auto-fight! Bengali moves, HP bars, critical hits, and dramatic reveal!" },
    category: "fun",
    guide: { en: "{p}fight @opponent\n{p}fight @user1 @user2 (watch them fight)\n{p}fight stop — end fight" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, senderID, mentions } = event;

    if (args[0]?.toLowerCase() === "stop") {
      if (activeFights.has(threadID)) {
        clearInterval(activeFights.get(threadID));
        activeFights.delete(threadID);
        return message.reply("🛑 Fight বন্ধ করা হয়েছে!");
      }
      return message.reply("❌ কোনো fight চলছে না।");
    }

    if (activeFights.has(threadID)) {
      return message.reply("⚔️ আগের fight চলছে! বন্ধ করো: .fight stop");
    }

    const mentionedIDs = Object.keys(mentions || {});
    let p1id, p2id;

    if (!mentionedIDs.length) {
      return message.reply("❌ @mention দাও!\n\n.fight @opponent\n.fight @user1 @user2");
    } else if (mentionedIDs.length === 1) {
      p1id = senderID;
      p2id = mentionedIDs[0];
    } else {
      p1id = mentionedIDs[0];
      p2id = mentionedIDs[1];
    }

    if (p1id === p2id) return message.reply("❌ নিজের সাথে নিজে fight করা যাবে না! 😂");

    let p1name = "Fighter 1", p2name = "Fighter 2";
    try { const u = await usersData.get(p1id); p1name = (u?.name || "F1").split(" ")[0]; } catch {}
    try { const u = await usersData.get(p2id); p2name = (u?.name || "F2").split(" ")[0]; } catch {}

    const MAX_HP = 120;
    const p1 = { name: p1name, hp: MAX_HP };
    const p2 = { name: p2name, hp: MAX_HP };
    let round = 0;
    const roundLog = [];

    await message.reply(
      `╔═══════════════════════════╗\n` +
      `║  ⚔️  GHOST NET FIGHT  ⚔️   ║\n` +
      `╚═══════════════════════════╝\n\n` +
      `  🥊 ${p1.name}   VS   ${p2.name} 🥊\n\n` +
      `  ❤️ ${p1.name}: ${hpBar(p1.hp, MAX_HP)}\n` +
      `  ❤️ ${p2.name}: ${hpBar(p2.hp, MAX_HP)}\n\n` +
      `  ⏳ 3 সেকেন্ডে fight শুরু...\n` +
      `  💡 বন্ধ করতে: .fight stop`
    );

    await new Promise(r => setTimeout(r, 3000));

    const iv = setInterval(async () => {
      if (!activeFights.has(threadID)) { clearInterval(iv); return; }
      round++;

      const attacker = round % 2 === 1 ? p1 : p2;
      const defender = round % 2 === 1 ? p2 : p1;

      const isCritical = Math.random() < 0.1;
      const isMiss = !isCritical && Math.random() < 0.12;

      let damage = 0;
      let moveLine = "";

      if (isCritical) {
        const cm = CRITICAL_MOVES[Math.floor(Math.random() * CRITICAL_MOVES.length)];
        damage = cm.dmg;
        moveLine = `${attacker.name}: ${cm.name} ${defender.name}কে! ▶ ${damage} dmg!`;
      } else if (isMiss) {
        const m = MOVES[Math.floor(Math.random() * MOVES.length)];
        moveLine = `${attacker.name} ${m.name} ${defender.name}কে — ${MISS_LINES[Math.floor(Math.random() * MISS_LINES.length)]}`;
      } else {
        const m = MOVES[Math.floor(Math.random() * MOVES.length)];
        damage = Math.floor(Math.random() * (m.max - m.min + 1)) + m.min;
        moveLine = `${attacker.name} ${m.name} ${defender.name}কে! ▶ ${damage} dmg`;
      }

      defender.hp -= damage;
      roundLog.push(`R${round}: ${moveLine}`);

      const finished = defender.hp <= 0 || round >= 14;

      if (round % 3 === 0 || finished) {
        const winner = defender.hp <= 0 ? attacker : (p1.hp >= p2.hp ? p1 : p2);
        const loser = winner === p1 ? p2 : p1;

        if (finished) {
          clearInterval(iv);
          activeFights.delete(threadID);

          const lastFive = roundLog.slice(-5).join("\n  ");

          return api.sendMessage(
            `╔═══════════════════════════╗\n` +
            `║  🏆  FIGHT OVER!  🏆       ║\n` +
            `╚═══════════════════════════╝\n\n` +
            `  ❤️ ${p1.name}: ${hpBar(Math.max(0, p1.hp), MAX_HP)}\n` +
            `  ❤️ ${p2.name}: ${hpBar(Math.max(0, p2.hp), MAX_HP)}\n\n` +
            `  📋 Last Rounds:\n  ${lastFive}\n\n` +
            `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
            `  🏆 WINNER: ${winner.name}\n` +
            `  ${WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)]}\n\n` +
            `  💀 LOSER: ${loser.name}\n` +
            `  ${LOSE_LINES[Math.floor(Math.random() * LOSE_LINES.length)]}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `  — Rakib Islam | Ghost Bot 👻`,
            threadID
          );
        }

        api.sendMessage(
          `⚔️ Round ${round} Status:\n\n` +
          `  ❤️ ${p1.name}: ${hpBar(Math.max(0, p1.hp), MAX_HP)}\n` +
          `  ❤️ ${p2.name}: ${hpBar(Math.max(0, p2.hp), MAX_HP)}\n\n` +
          `  📌 ${moveLine}`,
          threadID
        );
      }
    }, 2500);

    activeFights.set(threadID, iv);
  }
};
