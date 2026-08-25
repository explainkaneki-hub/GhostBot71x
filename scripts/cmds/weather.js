const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    aliases: ["abohawa", "wt"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "যেকোনো শহরের আবহাওয়া",
    category: "utility",
    guide: { en: "{p}weather <city>\nExample: weather Dhaka" }
  },
  onStart: async function ({ message, args }) {
    const city = args.join(" ").trim() || "Dhaka";
    try {
      const geo = (await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).data?.results?.[0];
      if (!geo) return message.reply(`❌ "${city}" শহর পাওয়া যায়নি`);
      const w = (await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`)).data?.current;
      const codes = { 0: "☀️ Clear", 1: "🌤️ Mostly clear", 2: "⛅ Partly cloudy", 3: "☁️ Cloudy", 45: "🌫️ Foggy", 48: "🌫️ Foggy", 51: "🌦️ Light drizzle", 61: "🌧️ Light rain", 63: "🌧️ Rain", 65: "⛈️ Heavy rain", 71: "🌨️ Snow", 80: "🌧️ Showers", 95: "⛈️ Thunder" };
      const cond = codes[w.weather_code] || "🌍 Unknown";
      return message.reply(`🌍 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 — ${geo.name}, ${geo.country}
━━━━━━━━━━━━━━━━━━
${cond}
🌡️ Temp     : ${w.temperature_2m}°C
💧 Humidity : ${w.relative_humidity_2m}%
💨 Wind     : ${w.wind_speed_10m} km/h
━━━━━━━━━━━━━━━━━━
👻 Ghost Net`);
    } catch (e) { return message.reply(`❌ Weather API failed: ${e.message}`); }
  }
};
