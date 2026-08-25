const axios = require("axios");

const CURRENCIES = {
  USD: "🇺🇸 US Dollar", EUR: "🇪🇺 Euro", GBP: "🇬🇧 British Pound",
  BDT: "🇧🇩 Bangladeshi Taka", INR: "🇮🇳 Indian Rupee", PKR: "🇵🇰 Pakistani Rupee",
  SAR: "🇸🇦 Saudi Riyal", AED: "🇦🇪 UAE Dirham", MYR: "🇲🇾 Malaysian Ringgit",
  SGD: "🇸🇬 Singapore Dollar", CAD: "🇨🇦 Canadian Dollar", AUD: "🇦🇺 Australian Dollar",
  JPY: "🇯🇵 Japanese Yen", CNY: "🇨🇳 Chinese Yuan", KWD: "🇰🇼 Kuwaiti Dinar",
  QAR: "🇶🇦 Qatari Riyal", OMR: "🇴🇲 Omani Rial", TRY: "🇹🇷 Turkish Lira",
  THB: "🇹🇭 Thai Baht", IDR: "🇮🇩 Indonesian Rupiah"
};

module.exports = {
  config: {
    name: "currency",
    aliases: ["convert", "fx", "exchange"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Real-time currency converter" },
    longDescription: { en: "Convert between currencies using live exchange rates. Free, no API key needed." },
    category: "utility",
    guide: {
      en: "{p}currency <amount> <FROM> to <TO>\n\nExamples:\n{p}currency 100 USD to BDT\n{p}currency 50 EUR to INR\n{p}currency 1000 BDT to SAR\n\n{p}currency list — দেখো supported currencies"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const input = args.join(" ").toUpperCase().trim();

    if (!input || input === "LIST") {
      const list = Object.entries(CURRENCIES)
        .map(([k, v]) => `  ${k} — ${v}`)
        .join("\n");
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  💱 Currency Converter ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .currency 100 USD to BDT\n` +
        `  .currency 50 EUR to INR\n\n` +
        `💰 Supported Currencies:\n${list}`
      );
    }

    const match = input.match(/^(\d+(?:\.\d+)?)\s+([A-Z]{3})\s+(?:TO|→|-)\s+([A-Z]{3})$/);
    if (!match) {
      return message.reply(
        `❌ Format সঠিক নয়!\n\n` +
        `✅ সঠিক format:\n` +
        `  .currency 100 USD to BDT\n` +
        `  .currency 50 EUR to INR`
      );
    }

    const [, amountStr, from, to] = match;
    const amount = parseFloat(amountStr);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const res = await axios.get(
        `https://api.frankfurter.app/latest?from=${from}&to=${to}&amount=${amount}`,
        { timeout: 10000 }
      );

      if (!res.data?.rates?.[to]) throw new Error("Rate not found");

      const rate = res.data.rates[to];
      const baseRate = (rate / amount).toFixed(6);
      const fromName = CURRENCIES[from] || from;
      const toName = CURRENCIES[to] || to;

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.reply(
        `╔══════════════════════╗\n` +
        `║  💱 Currency Converted ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ From  › ${amount.toLocaleString()} ${from}\n` +
        `  ✦ To    › ${rate.toLocaleString()} ${to}\n\n` +
        `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
        `  ${fromName}\n  → ${toName}\n\n` +
        `  ✦ Rate  › 1 ${from} = ${baseRate} ${to}\n` +
        `  ✦ Date  › ${res.data.date}\n` +
        `  ✦ Src   › Frankfurter (ECB)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(
        `❌ Currency convert হয়নি!\n\n` +
        `কারণ: ${from} বা ${to} supported নয়\n` +
        `supported list দেখতে: .currency list`
      );
    }
  }
};
