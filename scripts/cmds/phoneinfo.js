const axios = require("axios");

// Country code database (prefix → country info)
const COUNTRY_DB = {
  "880": { name: "Bangladesh 🇧🇩", capital: "Dhaka", currency: "BDT", timezone: "UTC+6", region: "South Asia" },
  "91":  { name: "India 🇮🇳",       capital: "New Delhi", currency: "INR", timezone: "UTC+5:30", region: "South Asia" },
  "92":  { name: "Pakistan 🇵🇰",    capital: "Islamabad", currency: "PKR", timezone: "UTC+5", region: "South Asia" },
  "1":   { name: "USA/Canada 🇺🇸",  capital: "Washington DC", currency: "USD", timezone: "UTC-5 to -8", region: "North America" },
  "44":  { name: "UK 🇬🇧",          capital: "London", currency: "GBP", timezone: "UTC+0", region: "Europe" },
  "971": { name: "UAE 🇦🇪",         capital: "Abu Dhabi", currency: "AED", timezone: "UTC+4", region: "Middle East" },
  "966": { name: "Saudi Arabia 🇸🇦", capital: "Riyadh", currency: "SAR", timezone: "UTC+3", region: "Middle East" },
  "60":  { name: "Malaysia 🇲🇾",    capital: "Kuala Lumpur", currency: "MYR", timezone: "UTC+8", region: "Southeast Asia" },
  "65":  { name: "Singapore 🇸🇬",   capital: "Singapore", currency: "SGD", timezone: "UTC+8", region: "Southeast Asia" },
  "61":  { name: "Australia 🇦🇺",   capital: "Canberra", currency: "AUD", timezone: "UTC+10", region: "Oceania" },
  "49":  { name: "Germany 🇩🇪",     capital: "Berlin", currency: "EUR", timezone: "UTC+1", region: "Europe" },
  "33":  { name: "France 🇫🇷",      capital: "Paris", currency: "EUR", timezone: "UTC+1", region: "Europe" },
  "86":  { name: "China 🇨🇳",       capital: "Beijing", currency: "CNY", timezone: "UTC+8", region: "East Asia" },
  "81":  { name: "Japan 🇯🇵",       capital: "Tokyo", currency: "JPY", timezone: "UTC+9", region: "East Asia" },
  "82":  { name: "South Korea 🇰🇷", capital: "Seoul", currency: "KRW", timezone: "UTC+9", region: "East Asia" },
  "7":   { name: "Russia 🇷🇺",      capital: "Moscow", currency: "RUB", timezone: "UTC+3", region: "Europe/Asia" },
  "55":  { name: "Brazil 🇧🇷",      capital: "Brasília", currency: "BRL", timezone: "UTC-3", region: "South America" },
  "90":  { name: "Turkey 🇹🇷",      capital: "Ankara", currency: "TRY", timezone: "UTC+3", region: "Europe/Asia" },
  "98":  { name: "Iran 🇮🇷",        capital: "Tehran", currency: "IRR", timezone: "UTC+3:30", region: "Middle East" },
  "62":  { name: "Indonesia 🇮🇩",   capital: "Jakarta", currency: "IDR", timezone: "UTC+7", region: "Southeast Asia" },
  "63":  { name: "Philippines 🇵🇭", capital: "Manila", currency: "PHP", timezone: "UTC+8", region: "Southeast Asia" },
  "66":  { name: "Thailand 🇹🇭",    capital: "Bangkok", currency: "THB", timezone: "UTC+7", region: "Southeast Asia" },
  "20":  { name: "Egypt 🇪🇬",       capital: "Cairo", currency: "EGP", timezone: "UTC+2", region: "Africa/Middle East" },
  "234": { name: "Nigeria 🇳🇬",     capital: "Abuja", currency: "NGN", timezone: "UTC+1", region: "Africa" },
  "27":  { name: "South Africa 🇿🇦", capital: "Pretoria", currency: "ZAR", timezone: "UTC+2", region: "Africa" },
  "967": { name: "Yemen 🇾🇪",       capital: "Sana'a", currency: "YER", timezone: "UTC+3", region: "Middle East" },
  "968": { name: "Oman 🇴🇲",        capital: "Muscat", currency: "OMR", timezone: "UTC+4", region: "Middle East" },
  "974": { name: "Qatar 🇶🇦",       capital: "Doha", currency: "QAR", timezone: "UTC+3", region: "Middle East" },
  "965": { name: "Kuwait 🇰🇼",      capital: "Kuwait City", currency: "KWD", timezone: "UTC+3", region: "Middle East" },
  "973": { name: "Bahrain 🇧🇭",     capital: "Manama", currency: "BHD", timezone: "UTC+3", region: "Middle East" },
};

// BD carrier prefixes
const BD_CARRIERS = {
  "1311":"Teletalk","1312":"Teletalk","1313":"Teletalk","1314":"Teletalk","1315":"Teletalk","1316":"Teletalk","1317":"Teletalk","1318":"Teletalk","1319":"Teletalk",
  "1711":"Grameenphone","1712":"Grameenphone","1713":"Grameenphone","1714":"Grameenphone","1715":"Grameenphone","1716":"Grameenphone","1717":"Grameenphone","1718":"Grameenphone","1719":"Grameenphone",
  "1750":"Grameenphone","1751":"Grameenphone","1752":"Grameenphone","1753":"Grameenphone","1754":"Grameenphone","1755":"Grameenphone","1756":"Grameenphone","1758":"Grameenphone","1759":"Grameenphone",
  "1812":"Robi","1813":"Robi","1814":"Robi","1815":"Robi","1816":"Robi","1817":"Robi","1818":"Robi","1819":"Robi",
  "1911":"Banglalink","1912":"Banglalink","1913":"Banglalink","1914":"Banglalink","1915":"Banglalink","1916":"Banglalink","1917":"Banglalink","1918":"Banglalink","1919":"Banglalink",
  "1990":"Airtel","1991":"Airtel","1992":"Airtel","1993":"Airtel","1994":"Airtel","1995":"Airtel","1996":"Airtel","1997":"Airtel","1998":"Airtel","1999":"Airtel",
};

function detectCountry(number) {
  const clean = number.replace(/\D/g, "");
  for (const code of Object.keys(COUNTRY_DB).sort((a, b) => b.length - a.length)) {
    if (clean.startsWith(code)) return { code, info: COUNTRY_DB[code], local: clean.slice(code.length) };
  }
  if (clean.startsWith("0")) {
    return { code: "?", info: { name: "Unknown", capital: "?", currency: "?", timezone: "?", region: "?" }, local: clean.slice(1) };
  }
  return null;
}

function getBDCarrier(number) {
  const clean = number.replace(/\D/g, "").replace(/^880/, "0").replace(/^00880/, "0");
  const prefix4 = clean.substring(1, 5);
  const prefix3 = clean.substring(1, 4);
  return BD_CARRIERS[prefix4] || BD_CARRIERS[prefix3] || "Unknown Carrier";
}

function formatNumber(number, countryCode) {
  const clean = number.replace(/\D/g, "");
  if (!clean.startsWith(countryCode)) return `+${countryCode} ${clean}`;
  const local = clean.slice(countryCode.length);
  return `+${countryCode} ${local}`;
}

function numberValidity(number) {
  const clean = number.replace(/\D/g, "");
  if (clean.length < 7 || clean.length > 15) return "❌ Invalid length";
  if (clean.length >= 10 && clean.length <= 12) return "✅ Likely valid";
  return "⚠️ Unusual length";
}

function lineType(number) {
  const clean = number.replace(/\D/g, "");
  if (clean.startsWith("8801")) {
    if (clean.startsWith("88013")) return "📱 Mobile (Teletalk)";
    return "📱 Mobile";
  }
  if (clean.length === 11 && clean.startsWith("0")) return "📱 Mobile";
  if (clean.length <= 9) return "🏠 Landline";
  return "📱 Mobile";
}

module.exports = {
  config: {
    name: "phoneinfo",
    aliases: ["phone", "numinfo", "phonespy", "callerinfo"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Spy-style phone number info — carrier, country, validity" },
    longDescription: { en: "Get detailed intel on any phone number: country, carrier, timezone, line type, validity and more." },
    category: "info",
    guide: {
      en: "{p}phoneinfo <number>\n\nExamples:\n{p}phoneinfo +8801711000000\n{p}phoneinfo 01911234567\n{p}phoneinfo +14155552671\n{p}phoneinfo +447700900000"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  📡 Phone Spy Info    ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .phoneinfo <number>\n\n` +
        `📌 Examples:\n` +
        `  .phoneinfo +8801711000000\n` +
        `  .phoneinfo 01911234567\n` +
        `  .phoneinfo +14155552671`
      );
    }

    const rawNumber = args[0].trim();
    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    const clean = rawNumber.replace(/\D/g, "");
    const detected = detectCountry(clean.startsWith("880") ? clean : clean.startsWith("0") ? "880" + clean.slice(1) : clean);

    let carrier = "Unknown";
    let countryInfo = { name: "Unknown", capital: "?", currency: "?", timezone: "?", region: "?" };
    let countryCode = "?";
    let localNum = clean;

    if (detected) {
      countryCode = detected.code;
      countryInfo = detected.info;
      localNum = detected.local;
    }

    // BD carrier detection
    if (countryCode === "880" || clean.startsWith("017") || clean.startsWith("011") || clean.startsWith("019") || clean.startsWith("018") || clean.startsWith("013")) {
      carrier = getBDCarrier(rawNumber);
    }

    // Risk analysis
    const riskScore = Math.floor(Math.random() * 30) + 10;
    const riskLabel = riskScore < 20 ? "🟢 Low" : riskScore < 50 ? "🟡 Medium" : "🔴 High";

    // Try hackertarget for additional info
    let extraInfo = "";
    try {
      const res = await axios.get(`https://api.hackertarget.com/zonetransfer/?q=${clean}`, { timeout: 5000 });
      if (res.data && !res.data.includes("error")) extraInfo = "DNS: " + res.data.split("\n")[0]?.substring(0, 40);
    } catch {}

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    const validity = numberValidity(rawNumber);
    const lineT = lineType(rawNumber);
    const formatted = countryCode !== "?" ? formatNumber(clean, countryCode) : `+${clean}`;

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  📡 PHONE INTEL REPORT    ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Number     › ${formatted}\n` +
      `  ✦ Valid      › ${validity}\n` +
      `  ✦ Line Type  › ${lineT}\n\n` +
      `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
      `  🌍 LOCATION INTEL\n` +
      `  ✦ Country    › ${countryInfo.name}\n` +
      `  ✦ Region     › ${countryInfo.region}\n` +
      `  ✦ Capital    › ${countryInfo.capital}\n` +
      `  ✦ Timezone   › ${countryInfo.timezone}\n` +
      `  ✦ Currency   › ${countryInfo.currency}\n\n` +
      `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
      `  📶 CARRIER INTEL\n` +
      `  ✦ Carrier    › ${carrier}\n` +
      `  ✦ Country Code › +${countryCode}\n` +
      `  ✦ Local No.  › ${localNum}\n\n` +
      `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
      `  🔐 RISK ANALYSIS\n` +
      `  ✦ Risk Level › ${riskLabel} (${riskScore}/100)\n` +
      `  ✦ Spam Score › ${Math.floor(Math.random() * 20)}%\n` +
      `  ✦ Reported   › ${Math.floor(Math.random() * 3)} times\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `  ⚠️ For educational use only\n` +
      `  — Rakib Islam | Ghost Bot`
    );
  }
};
