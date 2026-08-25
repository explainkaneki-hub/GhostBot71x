const fs = require("fs-extra");
const path = require("path");

const CONFIG = path.join(__dirname, "../../config.json");
const MAIN_OWNER = "61575436812912";

module.exports = {
  config: {
    name: "removeowner",
    aliases: ["delowner", "rmowner"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 3,
    shortDescription: "GC theke bot owner remove koro",
    category: "owner",
    guide: { en: "{p}removeowner <uid | @mention | reply>" }
  },

  onStart: async function ({ message, event, args, api }) {
    const ids = collect(event, args);
    if (!ids.length) return message.reply("⚠️ UID দাও / mention করো / reply করো");

    const cfg = await fs.readJson(CONFIG);
    cfg.adminBot = cfg.adminBot || [];
    const removed = [], notFound = [], protectedIds = [];

    for (const id of ids) {
      const num = String(id);
      if (num === MAIN_OWNER) { protectedIds.push(num); continue; }
      const idx = cfg.adminBot.map(String).indexOf(num);
      if (idx >= 0) { cfg.adminBot.splice(idx, 1); removed.push(num); }
      else notFound.push(num);
    }
    await fs.writeJson(CONFIG, cfg, { spaces: 2 });
    if (global.GoatBot?.config) global.GoatBot.config.adminBot = cfg.adminBot;

    let names = id => id;
    try {
      const info = await api.getUserInfo([...removed, ...notFound, ...protectedIds]);
      names = id => info[id]?.name || id;
    } catch {}

    let m = "👑 𝗢𝗪𝗡𝗘𝗥 𝗥𝗘𝗠𝗢𝗩𝗘\n━━━━━━━━━━━━━━\n";
    if (removed.length) m += `✅ Removed (${removed.length}):\n${removed.map(i => `  • ${names(i)} (${i})`).join("\n")}\n`;
    if (notFound.length) m += `⚠️ Not owner (${notFound.length}):\n${notFound.map(i => `  • ${names(i)} (${i})`).join("\n")}\n`;
    if (protectedIds.length) m += `🛡️ Protected — main owner can't be removed:\n${protectedIds.map(i => `  • ${names(i)}`).join("\n")}\n`;
    m += "\n💀 Ghost Net Edition";
    return message.reply(m);
  }
};

function collect(event, args) {
  const out = [];
  if (event.type === "message_reply") out.push(event.messageReply.senderID);
  for (const id of Object.keys(event.mentions || {})) out.push(id);
  for (const a of args) if (/^\d{6,}$/.test(a)) out.push(a);
  return [...new Set(out)];
}
