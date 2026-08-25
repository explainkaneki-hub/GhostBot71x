module.exports = {
  config: {
    name: "kick2",
    aliases: ["remove2", "removemember"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    countDown: 5,
    shortDescription: "Kick user from group (Admin only)",
    longDescription: "Kick a tagged user from the group. Admin only.",
    category: "admin",
    guide: { en: "{p}kick2 @user <reason>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const mentioned = Object.keys(event.mentions || {});
    if (!mentioned.length) return message.reply("Tag someone to kick!\n.kick2 @name");

    const targetUID = mentioned[0];
    const targetName = event.mentions[targetUID];
    const reason = args.filter(a => !a.startsWith("@")).join(" ").trim() || "Admin decision";

    try {
      await message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 — 𝗞𝗜𝗖𝗞\n━━━━━━━━━━━━━━━━\n` +
        `👤 User: ${targetName}\n❌ Reason: ${reason}\n` +
        `━━━━━━━━━━━━━━━━\n💀 Goodbye! — Rakib Islam`
      );
      await api.removeUserFromGroup(targetUID, event.threadID);
    } catch (err) {
      message.reply(`❌ Could not kick: ${err.message}\n(Bot needs admin permission)`);
    }
  }
};
