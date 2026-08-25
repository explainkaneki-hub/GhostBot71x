const fs = require("fs-extra");
const path = require("path");

const DISABLED_FILE = path.join(__dirname, "../../data/disabledCmds.json");

const getDisabled = () => { try { return fs.readJsonSync(DISABLED_FILE); } catch { return {}; } };
const saveDisabled = d => fs.writeJsonSync(DISABLED_FILE, d, { spaces: 2 });

// Check if a command is disabled in a thread
function isDisabled(threadID, cmdName) {
  const data = getDisabled();
  return (data[threadID] || []).includes(cmdName.toLowerCase());
}

// Make this available globally for other commands to check
global.isCommandDisabled = isDisabled;

module.exports = {
  config: {
    name: "cmdoff",
    aliases: ["cmdon", "togglecmd", "disablecmd", "enablecmd"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 1,
    shortDescription: "Command on/off করো",
    longDescription: "যেকোনো command এই group এ on বা off করো",
    category: "admin",
    guide: {
      en: ".cmdoff [command name] — command বন্ধ করো\n.cmdon [command name] — command চালু করো\n.cmdoff list — বন্ধ করা commands দেখো\n.cmdoff all — সব বন্ধ করা commands চালু করো"
    }
  },

  onStart: async function ({ api, event, args, message, commandName }) {
    const { threadID, messageID } = event;
    const data = getDisabled();
    if (!data[threadID]) data[threadID] = [];

    const sub = args[0]?.toLowerCase();
    const isTurnOff = commandName === "cmdoff";

    if (!sub || sub === "list") {
      const list = data[threadID] || [];
      if (!list.length) return message.reply("✅ এই group এ সব command চালু আছে।");
      return message.reply(`🚫 বন্ধ করা commands (${list.length}টি):\n${list.map((c,i) => `${i+1}. .${c}`).join("\n")}\n\nচালু করতে: .cmdon [name]`);
    }

    if (sub === "all" && !isTurnOff) {
      data[threadID] = [];
      saveDisabled(data);
      return message.reply("✅ সব command আবার চালু করা হয়েছে!");
    }

    const targetCmd = sub;

    if (["cmdoff","cmdon","togglecmd"].includes(targetCmd)) {
      return message.reply("❌ এই command টি on/off করা যাবে না!");
    }

    if (!isTurnOff) {
      if (!data[threadID].includes(targetCmd)) {
        return message.reply(`⚠️ .${targetCmd} ইতোমধ্যে চালু আছে!`);
      }
      data[threadID] = data[threadID].filter(c => c !== targetCmd);
      saveDisabled(data);
      return message.reply(`✅ .${targetCmd} command চালু করা হয়েছে! ✨`);
    }

    if (data[threadID].includes(targetCmd)) {
      return message.reply(`⚠️ .${targetCmd} ইতোমধ্যে বন্ধ আছে!`);
    }
    data[threadID].push(targetCmd);
    saveDisabled(data);
    return message.reply(`🚫 .${targetCmd} command এই group এ বন্ধ করা হয়েছে!\nআবার চালু করতে: .cmdon ${targetCmd}`);
  }
};
