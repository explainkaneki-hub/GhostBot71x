const fs = require("fs-extra");
const path = require("path");

const WL_FILE = path.join(__dirname, "../../data/whitelist18.json");
const ADMIN_IDS = ["61575436812912"];

const getWL = () => { try { return fs.readJsonSync(WL_FILE); } catch { return {}; } };
const saveWL = d => fs.writeJsonSync(WL_FILE, d, { spaces: 2 });

module.exports = {
  config: {
    name: "whitelist18",
    aliases: ["18add", "18remove", "18wl", "adultlist"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 1,
    shortDescription: "18+ command এর জন্য whitelist manage করো",
    longDescription: "Admin 18+ content access দিতে বা নিতে পারবে নির্দিষ্ট users এর কাছ থেকে",
    category: "admin",
    guide: {
      en: "{pn} add @mention — 18+ access দাও\n{pn} remove @mention — 18+ access নাও\n{pn} list — whitelist দেখো\n{pn} clear — সব clear করো"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID, mentions, messageID } = event;
    const sub = (args[0] || "").toLowerCase();
    const wl = getWL();

    if (!wl[threadID]) wl[threadID] = [];

    const mentionKeys = Object.keys(mentions || {});
    const targetID = mentionKeys[0] || (event.messageReply?.senderID);

    if (sub === "list") {
      const list = wl[threadID] || [];
      if (!list.length) return message.reply("📋 এই group এ কেউ 18+ whitelist এ নেই।");
      return message.reply(`🔞 18+ Whitelist (${list.length} জন):\n${list.map((id, i) => `${i+1}. ${id}`).join("\n")}`);
    }

    if (sub === "clear") {
      wl[threadID] = [];
      saveWL(wl);
      return message.reply("✅ এই group এর 18+ whitelist clear হয়েছে।");
    }

    if (!targetID) return message.reply("❌ কাকে add/remove করবো? @mention করো অথবা reply দাও।");

    if (sub === "add") {
      if (wl[threadID].includes(targetID)) return message.reply("⚠️ এই user ইতোমধ্যে whitelist এ আছে।");
      wl[threadID].push(targetID);
      saveWL(wl);
      const mentionTag = mentionKeys[0] ? mentions[mentionKeys[0]] : targetID;
      await api.sendMessage({
        body: `✅ @${mentionTag?.replace("@","")||targetID} কে 18+ content এর জন্য whitelist করা হয়েছে! 🔞`,
        mentions: mentionKeys[0] ? [{ tag: `@${mentions[mentionKeys[0]]?.replace("@","")}`, id: mentionKeys[0] }] : []
      }, threadID, messageID);
    }

    else if (sub === "remove") {
      if (!wl[threadID].includes(targetID)) return message.reply("⚠️ এই user whitelist এ নেই।");
      wl[threadID] = wl[threadID].filter(id => id !== targetID);
      saveWL(wl);
      message.reply(`✅ ${targetID} কে 18+ whitelist থেকে remove করা হয়েছে।`);
    }

    else {
      message.reply("❓ Usage:\n.whitelist18 add @mention\n.whitelist18 remove @mention\n.whitelist18 list\n.whitelist18 clear");
    }
  }
};
