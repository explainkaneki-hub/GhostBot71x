const axios = require("axios");

module.exports = {
  config: {
    name: "qrcode",
    aliases: ["qr"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "QR code বানাও যেকোনো text/link এর",
    category: "utility",
    guide: { en: "{p}qrcode <text or url>" }
  },
  onStart: async function ({ message, args, event }) {
    if (!args.length) return message.reply("⚠️ Text/URL দাও\nযেমন: qrcode https://google.com");
    const txt = args.join(" ");
    await message.reaction("⏳", event.messageID);
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(txt)}`;
      const img = (await axios.get(url, { responseType: "stream" })).data;
      await message.reaction("✅", event.messageID);
      return message.reply({ body: `📱 𝗤𝗥 𝗖𝗢𝗗𝗘\n━━━━━━━━━━━━━━\n📝 ${txt.slice(0, 100)}\n━━━━━━━━━━━━━━\n👻 Ghost Net`, attachment: img });
    } catch { return message.reply("❌ QR generation failed"); }
  }
};
