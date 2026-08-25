const axios = require("axios");

module.exports = {
  config: {
    name: "ipinfo",
    aliases: ["iplookup"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Public IP address এর details",
    category: "utility",
    guide: { en: "{p}ipinfo <ip>" }
  },
  onStart: async function ({ message, args }) {
    const ip = args[0];
    if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return message.reply("⚠️ Valid IP দাও\nযেমন: ipinfo 8.8.8.8");
    try {
      const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
      if (data.status !== "success") return message.reply("❌ IP info পাওয়া যায়নি");
      return message.reply(`🌐 𝗜𝗣 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━
🔢 IP       : ${data.query}
🌍 Country  : ${data.country} (${data.countryCode})
🏙️ Region   : ${data.regionName}
🏢 City     : ${data.city}
📍 Lat/Lon  : ${data.lat}, ${data.lon}
🕐 Timezone : ${data.timezone}
📡 ISP      : ${data.isp}
🏛️ Org      : ${data.org}
━━━━━━━━━━━━━━━━
👻 Ghost Net`);
    } catch { return message.reply("❌ Lookup failed"); }
  }
};
