module.exports = {
  config: {
    name: "mine",
    aliases: ["mines", "minigame"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: "Mines mini game",
    guide: { en: "{pn} <bet> [1-9]" }
  },

  onStart: async function ({ event, args, message, usersData }) {
    const parse = value => {
      const match = String(value || "").toLowerCase().match(/^(\d+(?:\.\d+)?)(k|m|b)?$/);
      if (!match) return NaN;
      return Math.floor(Number(match[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[match[2]] || 1));
    };
    const user = await usersData.get(event.senderID);
    const balance = Number(user?.money || 0);
    const bet = parse(args[0]);
    if (!Number.isFinite(bet) || bet < 100) {
      return message.reply("💣 Use: .mine 1000 [1-9]\nMinimum bet: 100");
    }
    if (bet > balance) return message.reply(`❌ Balance কম। তোমার কাছে ৳${balance.toLocaleString()} আছে।`);
    const selected = Math.min(9, Math.max(1, Number(args[1]) || Math.floor(Math.random() * 9) + 1));
    const mine = Math.floor(Math.random() * 9) + 1;
    const win = selected !== mine;
    const reward = win ? bet * 2 : 0;
    const nextBalance = balance - bet + reward;
    const diff = nextBalance - balance;
    const stats = user.gameStats || {};
    await usersData.set(event.senderID, {
      money: nextBalance,
      gameStats: { ...stats, mine: Number(stats.mine || 0) + Math.max(0, diff) }
    });
    return message.reply(
      `💣 MINE GAME\n\n` +
      `Grid: [1] [2] [3] [4] [5] [6] [7] [8] [9]\n` +
      `তুমি বেছেছ: ${selected}\n` +
      (win ? `✅ Safe! +৳${reward.toLocaleString()}` : `💥 Mine hit! -৳${bet.toLocaleString()}`) +
      `\n📊 Balance: ৳${balance.toLocaleString()} → ৳${nextBalance.toLocaleString()}\n` +
      `🏆 Top দেখতে: .top mine`
    );
  }
};