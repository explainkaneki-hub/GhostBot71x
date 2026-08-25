const fs = require("fs-extra");
const path = require("path");

const CONFIG = path.join(__dirname, "../../config.json");
const MAIN_OWNER = "61575436812912";

module.exports = {
  config: {
    name: "listowners",
    aliases: ["owners", "ownerlist"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Bot er sob owner list",
    category: "owner",
    guide: { en: "{p}listowners" }
  },

  onStart: async function ({ message, api }) {
    const cfg = await fs.readJson(CONFIG);
    const list = (cfg.adminBot || []).map(String);
    if (!list.length) return message.reply("⚠️ কোনো owner নেই!");

    let names = {};
    try { names = await api.getUserInfo(list); } catch {}

    let m = "👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗟𝗜𝗦𝗧\n━━━━━━━━━━━━━━━━\n";
    list.forEach((id, i) => {
      const tag = id === MAIN_OWNER ? " 🔱 [MAIN]" : "";
      m += `${i + 1}. ${names[id]?.name || "Unknown"}${tag}\n   UID: ${id}\n`;
    });
    m += `\n📦 Total: ${list.length}\n💀 Ghost Net Edition`;
    return message.reply(m);
  }
};
