const axios = require("axios");

module.exports = {
  config: {
    name: "domaininfo",
    aliases: ["whois", "domain", "siteinfo"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    shortDescription: { en: "Domain/website info — WHOIS, IP, server, status" },
    longDescription: { en: "Look up domain WHOIS data, server IP, hosting info, HTTP status, and SSL details for any website." },
    category: "info",
    guide: {
      en: "{p}domaininfo <domain>\n\nExamples:\n{p}domaininfo google.com\n{p}domaininfo facebook.com\n{p}domaininfo github.com"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🌐 Domain Info Tool  ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .domaininfo <domain>\n\n` +
        `📌 Examples:\n` +
        `  .domaininfo google.com\n` +
        `  .domaininfo facebook.com\n` +
        `  .domaininfo github.com`
      );
    }

    let domain = args[0].trim().toLowerCase()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0];

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const results = await Promise.allSettled([
      // WHOIS via HackerTarget (free, no key)
      axios.get(`https://api.hackertarget.com/whois/?q=${domain}`, { timeout: 12000 }),
      // IP lookup
      axios.get(`https://api.hackertarget.com/dnslookup/?q=${domain}`, { timeout: 8000 }),
      // HTTP status check
      axios.get(`https://api.hackertarget.com/httpheaders/?q=https://${domain}`, { timeout: 8000 }),
      // IP geolocation
      axios.get(`https://ipapi.co/json/?q=${domain}`, { timeout: 8000 }),
    ]);

    const whoisRaw = results[0].status === "fulfilled" ? results[0].value.data || "" : "";
    const dnsRaw = results[1].status === "fulfilled" ? results[1].value.data || "" : "";
    const headersRaw = results[2].status === "fulfilled" ? results[2].value.data || "" : "";

    // Parse WHOIS
    const extractField = (data, ...keys) => {
      for (const key of keys) {
        const match = data.match(new RegExp(`${key}[:\\s]+(.+)`, "i"));
        if (match) return match[1].trim().substring(0, 60);
      }
      return "Unknown";
    };

    const registrar = extractField(whoisRaw, "Registrar", "registrar");
    const created = extractField(whoisRaw, "Creation Date", "Created", "Registered");
    const expires = extractField(whoisRaw, "Registry Expiry Date", "Expiry Date", "Expires");
    const updated = extractField(whoisRaw, "Updated Date", "Last Updated");
    const status = extractField(whoisRaw, "Domain Status");
    const nameservers = whoisRaw.match(/Name Server[:\s]+(.+)/gi)?.slice(0, 2)
      .map(l => l.replace(/Name Server[:\s]+/i, "").trim()).join(", ") || "Unknown";

    // Parse DNS
    const ipMatch = dnsRaw.match(/(\d+\.\d+\.\d+\.\d+)/);
    const ip = ipMatch ? ipMatch[1] : "Unknown";

    // Parse HTTP headers
    const serverMatch = headersRaw.match(/Server: (.+)/i);
    const server = serverMatch ? serverMatch[1].trim() : "Unknown";

    // Check SSL (simple)
    const hasHttps = headersRaw.includes("HTTP/") && !headersRaw.toLowerCase().includes("connection refused");

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    message.reply(
      `╔══════════════════════╗\n` +
      `║  🌐 Domain Info       ║\n` +
      `╚══════════════════════╝\n\n` +
      `  ✦ Domain     › ${domain}\n` +
      `  ✦ IP         › ${ip}\n` +
      `  ✦ Server     › ${server}\n` +
      `  ✦ Registrar  › ${registrar}\n` +
      `  ✦ Created    › ${created}\n` +
      `  ✦ Expires    › ${expires}\n` +
      `  ✦ Updated    › ${updated}\n` +
      `  ✦ Status     › ${status.substring(0, 40)}\n` +
      `  ✦ NS         › ${nameservers}\n` +
      `  ✦ HTTPS      › ${hasHttps ? "✅ Yes" : "❌ No"}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `— Rakib Islam | Ghost Bot`
    );
  }
};
