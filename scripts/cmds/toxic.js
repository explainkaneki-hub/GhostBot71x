const axios = require("axios");

const ROASTS = [
  "তুমি এত বোকা যে Google তোমাকে search result থেকে block করে দিয়েছে! 😂",
  "তোমার মাথায় যা আছে সেটা brain না, WiFi router এর box! 📦",
  "তুমি এত slow যে তোমার জন্মদিনের শুভেচ্ছা এখনও আসছে! 🐢",
  "তোমার face দেখে phone এর camera ও blur হয়ে যায়! 📱",
  "তুমি কথা বলা শুরু করলে মানুষ headphone খুলে earplug লাগায়! 🎧",
  "তোমার IQ আর room temperature একই — zero! ❄️",
  "তুমি এত useless যে তোমার shadow ও তোমাকে ছেড়ে চলে যেতে চায়! 👤",
  "তোমার চেহারা দেখলে AI ও এরর দেয়! 🤖",
  "তুমি এত boring যে তোমার diary ও ঘুমিয়ে পড়ে! 📔",
  "তোমার কথা শুনলে মানুষ মনে করে internet বন্ধ হয়ে গেছে! 🌐",
  "ভাই তোমার নামে Google এ search দিলে 'did you mean: mistake?' আসে 😭",
  "তুমি এত পুরনো joke বলো যে ChatGPT ও reject করে! 🚫",
  "তোমার confidence আর তোমার capability এর মধ্যে Mariana Trench আছে! 🌊",
  "তোমাকে দেখলে বাঘও vegetarian হয়ে যায়! 🐯",
  "তুমি এত জঘন্য রান্না করো যে তোমার বিড়ালও অনশন করে! 🐱"
];

module.exports = {
  config: {
    name: "toxic",
    aliases: [],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: "কাউকে roast করো",
    longDescription: "Roast/insult someone with funny toxic messages",
    category: "fun",
    guide: { en: "{pn} @mention — কাউকে roast করো\n{pn} reply — reply করে roast করো" }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { senderID, mentions, messageReply, threadID, messageID } = event;
      const mentionKeys = Object.keys(mentions || {});

      let targetID = null;
      let targetName = "তুমি";

      if (mentionKeys.length > 0) {
        targetID = mentionKeys[0];
        targetName = mentions[targetID]?.replace("@", "") || "তুমি";
      } else if (messageReply?.senderID) {
        targetID = messageReply.senderID;
        targetName = "তুমি";
      } else {
        targetID = senderID;
        targetName = "তুমি নিজেই";
      }

      const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      const roastText = `🔥 @${targetName}\n\n${roast}\n\n💀 Roasted by Ghost Bot 👻`;

      const mention = targetID ? [{ tag: `@${targetName}`, id: targetID }] : [];

      await api.sendMessage({ body: roastText, mentions: mention }, threadID, messageID);
    } catch (e) {
      message.reply("❌ Error: " + e.message);
    }
  }
};
