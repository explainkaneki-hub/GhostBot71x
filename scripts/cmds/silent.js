const fs = require("fs-extra");
const path = require("path");

const DB = path.join(__dirname, "cache", "silent_mode.json");
const OWNER_ID = "61575436812912";

function load() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return {}; }
}
function save(d) {
  fs.ensureDirSync(path.dirname(DB));
  fs.writeFileSync(DB, JSON.stringify(d, null, 2));
}
function isAdmin(id) {
  if (String(id) === OWNER_ID) return true;
  return (global.GoatBot?.config?.adminBot || []).map(String).includes(String(id));
}

// Load silent mode state into global on startup
;(function initSilentMode() {
  try {
    const db = load();
    global.ghostSilentMode = db;
  } catch {}
})();

module.exports = {
  config: {
    name: "silent",
    aliases: ["silentmode", "sm", "ghostsilent"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 1,
    shortDescription: { en: "Full silent mode — bot invisible to non-admin/whitelist" },
    longDescription: { en: "When ON: bot completely ignores everyone except admins and whitelisted UIDs. No response, no indication. Bot looks offline to others." },
    category: "owner",
    guide: {
      en: "{p}silent on        — Activate silent mode\n{p}silent off       — Deactivate\n{p}silent status    — Current status\n{p}silent add <uid> — Whitelist a UID\n{p}silent remove <uid> — Remove from whitelist\n{p}silent list      — See whitelist\n{p}silent clear     — Clear whitelist"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    if (!isAdmin(event.senderID)) return;

    const sub = args[0]?.toLowerCase();
    const db = load();
    const tid = event.threadID;
    if (!db[tid]) db[tid] = { enabled: false, whitelist: [] };

    // ─── ON ───
    if (sub === "on") {
      db[tid].enabled = true;
      save(db);
      global.ghostSilentMode = db;
      return message.reply(
        `👻 Silent Mode: ON\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `শুধু admin + whitelist এ থাকা UIDs bot use করতে পারবে।\n` +
        `বাকি সবার কাছে bot মরা 💀\n` +
        `Whitelist add: .silent add <uid>`
      );
    }

    // ─── OFF ───
    if (sub === "off") {
      db[tid].enabled = false;
      save(db);
      global.ghostSilentMode = db;
      return message.reply(`👻 Silent Mode: OFF\nBot এখন সবার জন্য active।`);
    }

    // ─── STATUS ───
    if (!sub || sub === "status") {
      const st = db[tid];
      const wl = st.whitelist || [];
      let wlNames = [];
      for (const uid of wl.slice(0, 5)) {
        try {
          const u = await usersData.get(uid);
          wlNames.push(`  › ${u?.name || uid} (${uid})`);
        } catch { wlNames.push(`  › ${uid}`); }
      }
      return message.reply(
        `👻 Silent Mode Status\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `  State     › ${st.enabled ? "🔴 ON (Silent)" : "🟢 OFF (Active)"}\n` +
        `  Whitelist › ${wl.length} UIDs\n` +
        (wlNames.length ? `\n${wlNames.join("\n")}\n` : "") +
        `━━━━━━━━━━━━━━━━\n` +
        `✅ Silent ON হলে যারা use করতে পারবে:\n` +
        `  👑 Bot Admin (full power)\n` +
        `  🛡️ GC Admin (normal user হিসেবে)\n` +
        `  📋 Whitelist এ থাকা UIDs\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `Cmds: .silent on/off/add/remove/list/clear`
      );
    }

    // ─── ADD to whitelist ───
    if (sub === "add") {
      const uid = args[1]?.trim() || Object.keys(event.mentions || {})[0];
      if (!uid) return message.reply("❌ UID দাও! .silent add <uid>");
      if (!db[tid].whitelist) db[tid].whitelist = [];
      if (db[tid].whitelist.includes(uid)) return message.reply(`⚠️ ${uid} ইতিমধ্যে whitelist এ আছে।`);
      db[tid].whitelist.push(String(uid));
      save(db);
      global.ghostSilentMode = db;
      let name = uid;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch {}
      return message.reply(`✅ Whitelist এ যোগ হয়েছে:\n  › ${name} (${uid})`);
    }

    // ─── REMOVE from whitelist ───
    if (sub === "remove" || sub === "del") {
      const uid = String(args[1]?.trim() || Object.keys(event.mentions || {})[0] || "");
      if (!uid) return message.reply("❌ UID দাও! .silent remove <uid>");
      const before = db[tid].whitelist?.length || 0;
      db[tid].whitelist = (db[tid].whitelist || []).filter(u => u !== uid);
      if (db[tid].whitelist.length === before) return message.reply(`⚠️ ${uid} whitelist এ নেই।`);
      save(db);
      global.ghostSilentMode = db;
      return message.reply(`✅ Whitelist থেকে remove করা হয়েছে: ${uid}`);
    }

    // ─── LIST whitelist ───
    if (sub === "list") {
      const wl = db[tid].whitelist || [];
      if (!wl.length) return message.reply("📋 Whitelist খালি। .silent add <uid> দিয়ে যোগ করো।");
      const lines = [];
      for (const uid of wl) {
        try { const u = await usersData.get(uid); lines.push(`  ${lines.length + 1}. ${u?.name || "Unknown"} (${uid})`); }
        catch { lines.push(`  ${lines.length + 1}. ${uid}`); }
      }
      return message.reply(`📋 Whitelist (${wl.length} UIDs):\n\n${lines.join("\n")}`);
    }

    // ─── CLEAR whitelist ───
    if (sub === "clear") {
      db[tid].whitelist = [];
      save(db);
      global.ghostSilentMode = db;
      return message.reply("✅ Whitelist সম্পূর্ণ clear করা হয়েছে।");
    }

    message.reply("❌ Unknown option। .silent help দেখো।");
  }
};
