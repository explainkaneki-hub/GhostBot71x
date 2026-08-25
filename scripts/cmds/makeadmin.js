const OWNER_ID = "61575436812912";

function isAdminOrOwner(id) {
  if (String(id) === OWNER_ID) return true;
  return (global.GoatBot?.config?.adminBot || []).map(String).includes(String(id));
}

module.exports = {
  config: {
    name: "makeadmin",
    aliases: ["setadmin", "admin2", "addadmin", "promoteadmin"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Make/remove someone as GC admin (bot must be admin)" },
    longDescription: { en: "Use bot to promote or demote group members as admin. Bot must have admin rights in the group." },
    category: "admin",
    guide: {
      en: "{p}makeadmin @mention        — Make admin\n{p}makeadmin remove @mention  — Remove admin\n{p}makeadmin <uid>            — Make by UID\n{p}makeadmin remove <uid>     — Remove by UID\n\nExample:\n{p}makeadmin @someone"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    if (!isAdminOrOwner(event.senderID)) return;

    if (!event.isGroup) return message.reply("❌ এই command শুধু group এ কাজ করে!");

    const sub = args[0]?.toLowerCase();
    const isDemote = sub === "remove" || sub === "demote" || sub === "kick";

    const mentioned = Object.keys(event.mentions || {});
    let targetID;

    if (isDemote) {
      targetID = String(mentioned[0] || args[1]?.trim() || "");
    } else {
      targetID = String(mentioned[0] || args[0]?.trim() || "");
    }

    if (!targetID || isNaN(targetID)) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  👑 GC Admin Manager  ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .makeadmin @mention         → Promote\n` +
        `  .makeadmin remove @mention  → Demote\n` +
        `  .makeadmin <uid>            → Promote by UID\n\n` +
        `⚠️ Bot কে group admin করতে হবে!`
      );
    }

    if (targetID === String(event.senderID)) return message.reply("❌ নিজেকে promote/demote করা যাবে না!");

    let name = targetID;
    try { const u = await usersData.get(targetID); name = u?.name || targetID; } catch {}

    try {
      await api.changeAdminStatus(event.threadID, targetID, !isDemote);

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.reply(
        `╔══════════════════════╗\n` +
        `║  ${isDemote ? "🔻 Admin Removed" : "👑 Admin Promoted"}     ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ User   › ${name}\n` +
        `  ✦ UID    › ${targetID}\n` +
        `  ✦ Action › ${isDemote ? "❌ Demoted from admin" : "✅ Promoted to admin"}\n` +
        `  ✦ By     › Admin\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(
        `❌ Failed!\n\n` +
        `কারণ: ${err.message}\n\n` +
        `💡 Bot কে আগে group admin করো!`
      );
    }
  }
};
