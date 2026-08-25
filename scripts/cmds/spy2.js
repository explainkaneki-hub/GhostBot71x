const fs = require("fs-extra");
const { balanceCard } = require("../utils/economyCards");

module.exports = {
  config: {
    name: "spy2",
    aliases: ["cyberspy", "usercard"],
    version: "1.0",
    author: "Rakib Islam",
    role: 0,
    category: "info",
    shortDescription: "Cyberpunk user information card"
  },
  onStart: async function ({ event, message, usersData }) {
    const uid = Object.keys(event.mentions || {})[0] || event.messageReply?.senderID || event.senderID;
    const user = await usersData.get(uid);
    const card = await balanceCard(user, uid, usersData, "CYBER SPY");
    return message.reply(
      { body: `🕵️ ${user?.name || "Unknown"}\nUID: ${uid}\nEXP: ${Number(user?.exp || 0).toLocaleString()}`, attachment: fs.createReadStream(card) },
      () => fs.remove(card).catch(() => {})
    );
  }
};