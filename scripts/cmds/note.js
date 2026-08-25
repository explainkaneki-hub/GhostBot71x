const fs = require("fs-extra");
const path = require("path");

const DB = path.join(__dirname, "cache", "notes.json");
fs.ensureFileSync(DB);

module.exports = {
  config: {
    name: "note",
    aliases: ["notes"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "ব্যক্তিগত note save/list/delete",
    category: "utility",
    guide: { en: "{p}note add <text>\n{p}note list\n{p}note del <number>\n{p}note clear" }
  },
  onStart: async function ({ message, event, args }) {
    let db = {}; try { db = await fs.readJson(DB); } catch {}
    db[event.senderID] = db[event.senderID] || [];
    const list = db[event.senderID];
    const sub = (args[0] || "list").toLowerCase();

    if (sub === "add" || sub === "a") {
      const t = args.slice(1).join(" ");
      if (!t) return message.reply("⚠️ note লেখা লাগবে");
      list.push({ t, at: Date.now() });
      await fs.writeJson(DB, db, { spaces: 2 });
      return message.reply(`✅ Note #${list.length} save হলো\n📝 ${t}`);
    }
    if (sub === "del" || sub === "d") {
      const n = parseInt(args[1]) - 1;
      if (isNaN(n) || !list[n]) return message.reply("⚠️ ভুল number");
      const r = list.splice(n, 1)[0];
      await fs.writeJson(DB, db, { spaces: 2 });
      return message.reply(`🗑️ Delete হলো: ${r.t}`);
    }
    if (sub === "clear" || sub === "c") {
      db[event.senderID] = [];
      await fs.writeJson(DB, db, { spaces: 2 });
      return message.reply("🗑️ সব note delete হলো");
    }
    if (!list.length) return message.reply("📝 কোনো note নেই\nUse: note add <text>");
    let m = `📝 𝗧𝗨𝗠𝗔𝗥 𝗡𝗢𝗧𝗘𝗦\n━━━━━━━━━━━━━━━━\n`;
    list.forEach((n, i) => m += `${i + 1}. ${n.t}\n`);
    m += `━━━━━━━━━━━━━━━━\n👻 Ghost Net`;
    return message.reply(m);
  }
};
