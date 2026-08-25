module.exports = {
  config: {
    name: "slot",
    aliases: ["slotmachine", "casino", "gamble"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "🎰 Slot machine — bet করে টাকা জেতো",
    longDescription: "Bet করো এবং slot machine ঘোরাও! Win করলে prize পাবে, lose করলে bet কাটবে।",
    category: "economy",
    guide: { en: "{pn} <amount> — bet করো\nExample: {pn} 5000\n{pn} 10K বা {pn} 1M" }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const balance = userData?.money ?? 0;

    function parseAmt(str) {
      if (!str) return NaN;
      str = str.toLowerCase().replace(/,/g, "");
      if (str.endsWith("b")) return Math.floor(parseFloat(str) * 1_000_000_000);
      if (str.endsWith("m")) return Math.floor(parseFloat(str) * 1_000_000);
      if (str.endsWith("k")) return Math.floor(parseFloat(str) * 1_000);
      return Math.floor(parseFloat(str));
    }

    function fmt(n) {
      if (!n && n !== 0) return "0";
      if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
      if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
      return n.toLocaleString();
    }

    const betArg = args[0];
    if (!betArg) {
      return message.reply(
        `🎰 Slot Machine\n\n` +
        `💰 Balance: ${fmt(balance)} টাকা\n\n` +
        `📖 কিভাবে খেলবে:\n` +
        `.slot <amount>\n` +
        `Example: .slot 5000 বা .slot 10K\n\n` +
        `🏆 Payout Table:\n` +
        `💎💎💎 = Bet × 50 (JACKPOT)\n` +
        `7️⃣7️⃣7️⃣ = Bet × 25 (MEGA WIN)\n` +
        `⭐⭐⭐ = Bet × 15 (BIG WIN)\n` +
        `🍀🍀🍀 = Bet × 12\n` +
        `3 Same = Bet × 8\n` +
        `2 Same = Bet × 2\n` +
        `No match = Lose bet`
      );
    }

    const bet = parseAmt(betArg);
    if (isNaN(bet) || bet <= 0) return message.reply("❌ সঠিক amount দাও!\nExample: .slot 5000 বা .slot 10K");
    if (bet < 100) return message.reply("❌ Minimum bet হলো ১০০ টাকা!");
    if (bet > balance) return message.reply(`❌ তোমার balance কম!\nতোমার কাছে আছে: ${fmt(balance)} টাকা`);
    if (bet > 1_000_000_000) return message.reply("❌ Maximum bet: 1 Billion!");

    const symbols = ["🍒", "🍋", "🍇", "🍉", "💎", "7️⃣", "⭐", "🔔", "🍀"];
    const weights  = [ 5,    5,    4,    4,    1,    2,    2,    4,    3];

    function spin() {
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      for (let i = 0; i < symbols.length; i++) { r -= weights[i]; if (r <= 0) return symbols[i]; }
      return symbols[symbols.length - 1];
    }

    const [a, b, c] = [spin(), spin(), spin()];
    let multiplier = 0, resultMsg = "", resultEmoji = "";

    if (a === b && b === c) {
      if (a === "💎") { multiplier = 50; resultMsg = "💎 DIAMOND JACKPOT!"; resultEmoji = "🎊🎊🎊🎊🎊"; }
      else if (a === "7️⃣") { multiplier = 25; resultMsg = "7️⃣ LUCKY SEVENS!"; resultEmoji = "🎉🎉🎉🎉"; }
      else if (a === "⭐") { multiplier = 15; resultMsg = "⭐ STAR POWER!"; resultEmoji = "✨✨✨"; }
      else if (a === "🍀") { multiplier = 12; resultMsg = "🍀 LUCKY CLOVER!"; resultEmoji = "🎊🎊🎊"; }
      else { multiplier = 8; resultMsg = "🏆 TRIPLE WIN!"; resultEmoji = "🎉🎉"; }
    } else if (a === b || b === c || a === c) {
      multiplier = 2; resultMsg = "✨ PAIR — ছোট জয়!"; resultEmoji = "👍";
    } else {
      multiplier = 0; resultMsg = "💀 কোনো match নেই — bet গেছে!"; resultEmoji = "😔";
    }

    const winAmount = multiplier > 0 ? Math.floor(bet * multiplier) : 0;
    const newBalance = balance - bet + winAmount;
    const diff = newBalance - balance;
    const previousStats = userData.gameStats || {};
    await usersData.set(senderID, {
      money: newBalance,
      gameStats: {
        ...previousStats,
        slot: Number(previousStats.slot || 0) + Math.max(0, diff)
      }
    });

    const diffStr = diff >= 0 ? `+${fmt(diff)}` : `-${fmt(Math.abs(diff))}`;

    return message.reply(
      `🎰 ══ SLOT MACHINE ══\n\n` +
      `┌───────────────────┐\n` +
      `│  ${a}  ┃  ${b}  ┃  ${c}  │\n` +
      `└───────────────────┘\n\n` +
      `${resultEmoji} ${resultMsg}\n\n` +
      (multiplier > 0
        ? `💰 Bet: ${fmt(bet)}\n🏆 Multiplier: ×${multiplier}\n💵 Winnings: ${fmt(winAmount)}\n📈 Net Profit: +${fmt(winAmount - bet)}`
        : `💰 Bet: ${fmt(bet)}\n😔 Lost: -${fmt(bet)}`) +
      `\n\n📊 Balance: ${fmt(balance)} → ${fmt(newBalance)} (${diffStr})\n👻 Ghost Net`
    );
  }
};
