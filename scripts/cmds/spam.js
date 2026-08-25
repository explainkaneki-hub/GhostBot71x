const fs = require("fs-extra");
const path = require("path");

const SPAM_DATA = path.join(__dirname, "../../data/spamCooldown.json");
const ADMIN_IDS = ["61575436812912"];

module.exports = {
  config: {
    name: "spam",
    aliases: ["flood"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 1,
    shortDescription: "একটি message বারবার পাঠাও",
    longDescription: "Spam/flood a message multiple times in the group",
    category: "group",
    guide: { en: "{pn} [count] [message]\nExample: .spam 5 hello world\nMax: 20 times" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID, messageID } = event;

    const count = parseInt(args[0]);
    const text = args.slice(1).join(" ");

    if (!count || isNaN(count) || count < 1) {
      return message.reply("❌ কতবার spam করবো বলো!\nExample: .spam 5 hello world");
    }
    if (count > 20) return message.reply("❌ Maximum 20 বার করা যাবে!");
    if (!text) return message.reply("❌ কী spam করবো বলো!\nExample: .spam 5 হাহাহা");

    await message.reply(`🌀 Spam শুরু হচ্ছে... (${count}x)`);

    for (let i = 1; i <= count; i++) {
      await new Promise(r => setTimeout(r, 800));
      await api.sendMessage(`[${i}/${count}] ${text}`, threadID);
    }

    await api.sendMessage(`✅ Spam শেষ! ${count}টি message পাঠানো হয়েছে।`, threadID);
  }
};
