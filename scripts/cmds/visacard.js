const { PassThrough } = require("stream");
const axios = require("axios");

function fmt(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function fmtFull(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function cardNum(uid) {
  const d = uid.toString();
  const p1 = "4" + d.slice(0, 3);
  const p2 = d.slice(3, 7) || "7734";
  const p3 = d.slice(7, 11) || "5521";
  const p4 = d.slice(-4);
  return `${p1} ${p2} ${p3} ${p4}`;
}

function expiry() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 4}`;
}

module.exports = {
  config: {
    name: "visacard",
    aliases: ["visa", "vcard"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "💳 Ghost Bot Visa Card",
    longDescription: "তোমার Ghost Bot Visa Card দেখাও — balance সহ।",
    category: "economy",
    guide: { en: "{pn} — নিজের card\n{pn} @mention — অন্যের card" }
  },

  onStart: async function ({ message, event, usersData }) {
    const { senderID, mentions, messageReply } = event;

    let targetID = senderID;
    const mentionKeys = Object.keys(mentions || {});
    if (mentionKeys.length > 0) targetID = mentionKeys[0];
    else if (messageReply?.senderID) targetID = messageReply.senderID;

    const userData = await usersData.get(targetID);
    const name = userData?.name || "Ghost User";
    const balance = userData?.money ?? 0;
    const exp = userData?.exp ?? 0;

    const body =
      `╔════════════════════════╗\n` +
      `║   👻  G H O S T  B O T   ║\n` +
      `║         V  I  S  A         ║\n` +
      `╠════════════════════════╣\n` +
      `║ 💳 ${cardNum(targetID)}\n` +
      `║ 📅 Valid Thru: ${expiry()}\n` +
      `╠════════════════════════╣\n` +
      `║ 👤 ${name.toUpperCase()}\n` +
      `║ 💰 Balance : ${fmtFull(balance)} tk\n` +
      `║ ⭐ EXP     : ${fmtFull(exp)}\n` +
      `╠════════════════════════╣\n` +
      `║   🔵 VISA — Ghost Net 2024  ║\n` +
      `╚════════════════════════╝`;

    try {
      const gif = "https://media.tenor.com/8rXJNQLmEKAAAAAC/visa-card.gif";
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const st = new PassThrough();
      st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch {
      return message.reply(body);
    }
  }
};
