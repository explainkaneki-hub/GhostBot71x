const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "meme2",
    aliases: ["randommeme", "jokeimg"],
    version: "2.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random meme/joke image",
    category: "fun",
    guide: { en: "{p}meme2" }
  },

  onStart: async function ({ message, event }) {
    try {
      message.reaction("⏳", event.messageID);
      const memes = [
        "https://i.imgur.com/zoQxUwC.jpg", "https://i.imgur.com/bXVBasN.jpg",
        "https://i.imgur.com/E3bMZMM.jpg", "https://i.imgur.com/pkchwDe.jpg",
        "https://i.imgur.com/PFV6etU.jpg", "https://i.imgur.com/DLElS0y.jpg",
        "https://i.imgur.com/6hufzML.jpg", "https://i.imgur.com/ikevA6M.jpg",
        "https://i.imgur.com/aGuU2tB.jpg", "https://i.imgur.com/tsUsL6B.jpg"
      ];
      const url = memes[Math.floor(Math.random() * memes.length)];
      const tmpPath = path.join(__dirname, `../../tmp/meme2_${Date.now()}.jpg`);
      fs.ensureDirSync(path.dirname(tmpPath));
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
      fs.writeFileSync(tmpPath, res.data);
      message.reaction("😂", event.messageID);
      await message.reply({ body: "😂 Random Meme!", attachment: fs.createReadStream(tmpPath) });
      fs.removeSync(tmpPath);
    } catch (err) {
      message.reaction("❌", event.messageID);
      return message.reply("❌ Failed to fetch meme: " + err.message);
    }
  }
};
