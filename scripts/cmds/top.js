const fs = require("fs-extra");
const { leaderboardCard, formatMoney } = require("../utils/economyCards");

module.exports = {
  config: {
    name: "top",
    aliases: ["leaderboard", "rankmoney"],
    version: "2.0",
    author: "Rakib Islam",
    role: 0,
    category: "economy",
    guide: { en: "{pn} | {pn} slot | {pn} mine" }
  },

  onStart: async function ({ args, message, usersData }) {
    const game = String(args[0] || "balance").toLowerCase();
    const key = game === "slot" ? "slot" : game === "mine" ? "mine" : "money";
    const all = await usersData.getAll();
    const users = all
      .filter(user => user && (key === "money" || Number(user.gameStats?.[key] || 0) > 0))
      .map(user => ({ ...user, metricValue: key === "money" ? Number(user.money || 0) : Number(user.gameStats[key] || 0) }))
      .sort((a, b) => b.metricValue - a.metricValue)
      .slice(0, 15);
    if (!users.length) return message.reply(`📊 ${game} game-এর কোনো ranking data এখনো নেই।`);
    const card = await leaderboardCard(users, usersData, `${game.toUpperCase()} TOP 15`, key === "money" ? "BALANCE" : `${game.toUpperCase()} SCORE`);
    return message.reply(
      { body: `🏆 ${game === "balance" ? "Balance" : game} Top 15\n${users.map((u, i) => `${i + 1}. ${u.name || u.userID} — ${formatMoney(u.metricValue)}`).join("\n")}`, attachment: fs.createReadStream(card) },
      () => fs.remove(card).catch(() => {})
    );
  }
};