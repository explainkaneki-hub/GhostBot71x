module.exports = {
  config: {
    name: "groupadmin",
    aliases: ["promote", "demote"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 1,
    shortDescription: "GC e Facebook admin add/remove",
    longDescription: "Bot ke Facebook GC admin baniye add/remove kora jay direct GC theke",
    category: "box chat",
    guide: { en: "{p}groupadmin [add | remove] <@mention | reply | uid>\n{p}groupadmin list" }
  },

  onStart: async function ({ message, event, args, api }) {
    const sub = (args[0] || "").toLowerCase();
    if (sub === "list" || sub === "l") {
      try {
        const t = await api.getThreadInfo(event.threadID);
        const adminIds = t.adminIDs.map(a => a.id);
        const info = await api.getUserInfo(adminIds);
        let m = "👑 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡𝗦\n━━━━━━━━━━━━━━━━\n";
        adminIds.forEach((id, i) => m += `${i + 1}. ${info[id]?.name || "?"}\n   UID: ${id}\n`);
        m += `\n📦 Total: ${adminIds.length}\n💀 Ghost Net Edition`;
        return message.reply(m);
      } catch (e) { return message.reply(`❌ ${e.message}`); }
    }

    const ids = collect(event, args.slice(1));
    if (!["add", "a", "+", "promote", "remove", "r", "-", "demote"].includes(sub) || !ids.length) {
      return message.reply("⚠️ Use:\n• groupadmin add @user\n• groupadmin remove @user\n• groupadmin list");
    }

    const adminMode = ["add", "a", "+", "promote"].includes(sub);
    const results = [];
    let names = id => id;
    try {
      const info = await api.getUserInfo(ids);
      names = id => info[id]?.name || id;
    } catch {}

    for (const uid of ids) {
      try {
        await api.changeAdminStatus(event.threadID, uid, adminMode);
        results.push(`✅ ${adminMode ? "Promoted" : "Demoted"}: ${names(uid)} (${uid})`);
      } catch (e) {
        results.push(`❌ ${names(uid)}: ${e.message?.slice(0, 60) || "failed"}`);
      }
    }
    return message.reply(`👑 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 — ${adminMode ? "PROMOTE" : "DEMOTE"}\n━━━━━━━━━━━━━━━━\n${results.join("\n")}\n\n💀 Ghost Net Edition`);
  }
};

function collect(event, args) {
  const out = [];
  if (event.type === "message_reply") out.push(event.messageReply.senderID);
  for (const id of Object.keys(event.mentions || {})) out.push(id);
  for (const a of args) if (/^\d{6,}$/.test(a)) out.push(a);
  return [...new Set(out)];
}
