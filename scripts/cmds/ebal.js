const fs = require("fs-extra");
const { leaderboardCard, formatMoney } = require("../utils/economyCards");

module.exports = {
  config: {
    name: "ebal",
    aliases: ["topmoney", "etop"],
    version: "1.0",
    author: "Rakib Islam",
    role: 0,
    category: "economy",
    shortDescription: "Cyberpunk top 10 balance"
  },
  onStart: async function ({ message, usersData }) {
    const users = (await usersData.getAll())
      .filter(user => user && Number(user.money || 0) > 0)
      .map(user => ({ ...user, metricValue: Number(user.money || 0) }))
      .sort((a, b) => b.metricValue - a.metricValue)
      .slice(0, 10);
    if (!users.length) return message.reply("📊 Balance data নেই।");
    const card = await leaderboardCard(users, usersData, "CYBER BALANCE TOP 10", "BALANCE");
    return message.reply(
      { body: users.map((u, i) => `${i + 1}. ${u.name || u.userID} — ৳${formatMoney(u.metricValue)}`).join("\n"), attachment: fs.createReadStream(card) },
      () => fs.remove(card).catch(() => {})
    );
  }
};