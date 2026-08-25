const fs = require("fs-extra");
const path = require("path");

const CONFIG = path.join(__dirname, "../../config.json");

module.exports = {
  config: {
    name: "addowner",
    aliases: ["addbotowner"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 3,
    shortDescription: "GC theke bot er owner add koro",
    longDescription: "Main owner kindly use this only. Add somebody to global adminBot list.",
    category: "owner",
    guide: { en: "{p}addowner <uid | @mention | reply>" }
  },

  onStart: async function ({ message, event, args, api }) {
    const ids = collect(event, args);
    if (!ids.length) return message.reply("⚠️ UID দাও / mention করো / reply করো");

    const cfg = await fs.readJson(CONFIG);
    cfg.adminBot = cfg.adminBot || [];
    const added = [], already = [];

    for (const id of ids) {
      const num = String(id);
      if (cfg.adminBot.map(String).includes(num)) already.push(num);
      else { cfg.adminBot.push(Number(num)); added.push(num); }
    }
    await fs.writeJson(CONFIG, cfg, { spaces: 2 });
    if (global.GoatBot?.config) global.GoatBot.config.adminBot = cfg.adminBot;

    let names = "";
    try {
      const info = await api.getUserInfo([...added, ...already]);
      names = id => info[id]?.name || id;
    } catch { names = id => id; }

    let m = "👑 𝗢𝗪𝗡𝗘𝗥 𝗔𝗗𝗗\n━━━━━━━━━━━━━━\n";
    if (added.length) m += `✅ Added (${added.length}):\n${added.map(i => `  • ${names(i)} (${i})`).join("\n")}\n`;
    if (already.length) m += `⚠️ Already owner (${already.length}):\n${already.map(i => `  • ${names(i)} (${i})`).join("\n")}\n`;
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
