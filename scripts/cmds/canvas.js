const fs = require("fs-extra");
const path = require("path");

const COLORS = {
  "default": "196241301102133",
  "blue": "196241301102133",
  "pink": "169463077092846",
  "hotpink": "169463077092846",
  "aqua": "2442142322678320",
  "purple": "234137870477637",
  "coral": "980963458735625",
  "orange": "175615189761153",
  "green": "2136751179887052",
  "lavender": "2058653964378557",
  "red": "2129984390566328",
  "yellow": "174636906462322",
  "teal": "1928399724138152",
  "mango": "930060997172551",
  "berry": "164535220883264",
  "candy": "205488546921017",
  "ocean": "736591620215564",
  "love": "741311439775765",
  "chill": "390127158985345",
  "lofi": "1060619084701625",
  "sky": "3190514984517598",
  "birthday": "621630955405500",
  "earth": "1833559466821043",
  "music": "339021464972092",
  "pride": "1652456634878319",
  "celebration": "627144732056021",
  "monochrome": "788274591712841",
  "dune": "1455149831518874",
  "citrus": "370940413392601",
  "tiedye": "230032715012014"
};

module.exports = {
  config: {
    name: "canvas",
    aliases: ["theme", "gctheme", "settheme", "chatcolor"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: "Group chat এর theme/color পরিবর্তন করো",
    longDescription: "Facebook Messenger এর group chat এর theme color পরিবর্তন করো",
    category: "group",
    guide: {
      en: "{pn} [color name] — theme change করো\n{pn} list — available colors দেখো\n{pn} random — random color set করো\n\nExample:\n.canvas blue\n.canvas pink\n.canvas ocean"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const sub = (args[0] || "").toLowerCase().trim();

    if (!sub || sub === "list") {
      const colorList = Object.keys(COLORS).map(c => `• ${c}`).join("\n");
      return message.reply(
        `🎨 ═══[ CANVAS COLORS ]═══\n\n${colorList}\n\n💡 Usage: .canvas [color name]\nExample: .canvas ocean\n\n🎲 Random: .canvas random`
      );
    }

    let colorID;
    let colorName;

    if (sub === "random") {
      const keys = Object.keys(COLORS);
      colorName = keys[Math.floor(Math.random() * keys.length)];
      colorID = COLORS[colorName];
    } else if (COLORS[sub]) {
      colorID = COLORS[sub];
      colorName = sub;
    } else {
      // Check partial match
      const match = Object.keys(COLORS).find(c => c.includes(sub));
      if (match) {
        colorID = COLORS[match];
        colorName = match;
      } else {
        return message.reply(
          `❌ "${sub}" color পাওয়া যায়নি!\nAvailable colors দেখতে: .canvas list`
        );
      }
    }

    try {
      await api.changeThreadColor(colorID, threadID);
      await api.sendMessage(
        `🎨 Group theme পরিবর্তন হয়েছে!\n✨ Color: ${colorName.toUpperCase()}\n👻 Ghost Bot Canvas System`,
        threadID
      );
    } catch (e) {
      const errMsg = e?.error || e?.message || String(e);
      if (errMsg.includes("permission") || errMsg.includes("admin")) {
        message.reply("❌ Bot কে Group Admin বানাও, তাহলে theme change হবে!");
      } else if (errMsg.includes("Invalid") || errMsg.includes("color")) {
        message.reply(`❌ Color ID টা কাজ করছে না। Facebook update করেছে হয়তো।`);
      } else {
        message.reply(`❌ Error: ${errMsg}`);
      }
    }
  }
};
