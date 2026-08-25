const fs = require("fs-extra");
const path = require("path");

const cfgFile = path.join(__dirname, "../../ghostConfig.json");

module.exports = {
  config: {
    name: "antilink2",
    aliases: ["al2", "nolink"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    shortDescription: "Anti-link protection (Admin only)",
    category: "admin",
    guide: { en: "{p}antilink2 on/off — Toggle anti-link for this group" }
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const toggle = args[0]?.toLowerCase();
    if (!["on", "off"].includes(toggle)) return message.reply("Usage: .antilink2 on/off");

    const enable = toggle === "on";
    const tData = (await threadsData.get(event.threadID, "data")) || {};
    tData.antilink2 = enable;
    await threadsData.set(event.threadID, tData, "data");

    await message.reply(
      `👻 Anti-Link Protection: ${enable ? "🟢 ENABLED" : "🔴 DISABLED"}\n` +
      `${enable ? "Anyone who sends links will be warned automatically!" : "Links are now allowed."}\n` +
      `— Rakib Islam | Ghost Bot`
    );
  },

  onChat: async function ({ event, message, api, threadsData }) {
    try {
      const tData = (await threadsData.get(event.threadID, "data")) || {};
      if (!tData.antilink2) return;

      const body = event.body || "";
      const linkRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
      if (!linkRegex.test(body)) return;

      const threadInfo = await api.getThreadInfo(event.threadID);
      const isAdmin = threadInfo.adminIDs.some(a => a.id === event.senderID);
      if (isAdmin) return;

      await message.reply(
        `⚠️ Links are not allowed in this group!\n` +
        `👤 ${event.senderID}\n` +
        `Please follow group rules.\n— Ghost Bot`
      );
    } catch (e) {}
  }
};
