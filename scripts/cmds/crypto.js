const axios = require("axios");

module.exports = {
  config: {
    name: "crypto",
    aliases: ["coin", "btc", "eth"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Get crypto price",
    category: "utility",
    guide: { en: "{p}crypto <coin>\nExample: {p}crypto bitcoin\n{p}crypto ethereum" }
  },

  onStart: async function ({ message, args }) {
    const coin = args[0]?.toLowerCase() || "bitcoin";
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,bdt&include_24hr_change=true`,
        { timeout: 10000 }
      );
      const data = res.data?.[coin];
      if (!data) return message.reply(`❌ Coin "${coin}" not found!\nTry: bitcoin, ethereum, binancecoin, solana, dogecoin`);

      const change = data.usd_24h_change?.toFixed(2);
      const arrow = change > 0 ? "📈" : "📉";

      await message.reply(
        `👻 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗥𝗜𝗖𝗘\n━━━━━━━━━━━━━━━━\n` +
        `🪙 ${coin.toUpperCase()}\n` +
        `💵 USD: $${data.usd?.toLocaleString()}\n` +
        `💰 BDT: ৳${data.bdt?.toLocaleString()}\n` +
        `${arrow} 24h Change: ${change}%\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ Could not get price for "${coin}". Try: bitcoin, ethereum, dogecoin`);
    }
  }
};
