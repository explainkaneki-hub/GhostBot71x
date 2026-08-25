const fs = require("fs-extra");
const path = require("path");

const DB = path.join(__dirname, "cache", "bot_banned.json");
const OWNER_ID = "61575436812912";

function load() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return { banned: [] }; }
}
function save(d) {
  fs.ensureDirSync(path.dirname(DB));
  fs.writeFileSync(DB, JSON.stringify(d, null, 2));
}
function isAdmin(id) {
  if (String(id) === OWNER_ID) return true;
  return (global.GoatBot?.config?.adminBot || []).map(String).includes(String(id));
}

// Initialize ban list into global on load
;(function initBanList() {
  try {
    global.ghostBotBanned = load().banned || [];
  } catch { global.ghostBotBanned = []; }
})();

module.exports = {
  config: {
    name: "botban",
    aliases: ["bban", "banbot", "blockbot"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 1,
    shortDescription: { en: "Ban/unban users from using the bot globally" },
    longDescription: { en: "Admin can ban any user from using ANY bot command. Banned users get zero response from bot." },
    category: "admin",
    guide: {
      en: "{p}botban add <uid/@mention>  — Ban a user\n{p}botban remove <uid>        — Unban\n{p}botban list                 — See all banned users\n{p}botban check <uid>          — Check if banned\n{p}botban clear               — Clear all bans (owner only)"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    if (!isAdmin(event.senderID)) return;

    const sub = args[0]?.toLowerCase();
    const db = load();
    if (!db.banned) db.banned = [];

    // ─── ADD BAN ───
    if (sub === "add" || sub === "ban") {
      const mentioned = Object.keys(event.mentions || {});
      const uid = String(args[1]?.trim() || mentioned[0] || "");
      if (!uid) return message.reply("❌ UID বা @mention দাও!\n.botban add <uid>");
      if (uid === OWNER_ID) return message.reply("❌ Owner কে ban করা যাবে না!");
      if (db.banned.includes(uid)) return message.reply(`⚠️ ${uid} ইতিমধ্যে banned।`);

      db.banned.push(uid);
      save(db);
      global.ghostBotBanned = db.banned;

      let name = uid;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch {}

      await message.reply(
        `🚫 Bot Ban Applied!\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `  User  › ${name}\n` +
        `  UID   › ${uid}\n` +
        `  By    › ${event.senderID}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `এই user এখন কোনো command use করতে পারবে না।`
      );
      try { api.removeUserFromGroup(uid, event.threadID); } catch {}
      return;
    }

    // ─── REMOVE BAN ───
    if (sub === "remove" || sub === "unban") {
      const mentioned = Object.keys(event.mentions || {});
      const uid = String(args[1]?.trim() || mentioned[0] || "");
      if (!uid) return message.reply("❌ UID দাও! .botban remove <uid>");
      const before = db.banned.length;
      db.banned = db.banned.filter(u => u !== uid);
      if (db.banned.length === before) return message.reply(`⚠️ ${uid} banned list এ নেই।`);
      save(db);
      global.ghostBotBanned = db.banned;
      let name = uid;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch {}
      return message.reply(`✅ Bot Ban Removed:\n  › ${name} (${uid})\nএখন bot use করতে পারবে।`);
    }

    // ─── LIST ───
    if (sub === "list") {
      if (!db.banned.length) return message.reply("📋 কোনো user বর্তমানে bot-banned নেই।");
      const lines = [];
      for (const uid of db.banned) {
        try { const u = await usersData.get(uid); lines.push(`  ${lines.length + 1}. ${u?.name || "Unknown"} — ${uid}`); }
        catch { lines.push(`  ${lines.length + 1}. ${uid}`); }
      }
      return message.reply(`🚫 Bot Banned Users (${db.banned.length}):\n\n${lines.join("\n")}`);
    }

    // ─── CHECK ───
    if (sub === "check") {
      const uid = String(args[1]?.trim() || "");
      if (!uid) return message.reply("❌ UID দাও! .botban check <uid>");
      const banned = db.banned.includes(uid);
      let name = uid;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch {}
      return message.reply(`${banned ? "🚫 Banned" : "✅ Not Banned"}\n\n  User › ${name}\n  UID  › ${uid}`);
    }

    // ─── CLEAR ───
    if (sub === "clear") {
      if (String(event.senderID) !== OWNER_ID) return message.reply("❌ শুধু Owner সব ban clear করতে পারবে।");
      const count = db.banned.length;
      db.banned = [];
      save(db);
      global.ghostBotBanned = [];
      return message.reply(`✅ সব bot ban clear করা হয়েছে। (${count} জন unban হয়েছে)`);
    }

    message.reply(
      `🚫 Bot Ban Commands:\n` +
      `  .botban add <uid>     — Ban\n` +
      `  .botban remove <uid>  — Unban\n` +
      `  .botban list          — List\n` +
      `  .botban check <uid>   — Check\n` +
      `  .botban clear         — Clear all (owner)`
    );
  }
};
