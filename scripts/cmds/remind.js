module.exports = {
  config: {
    name: "remind",
    aliases: ["mindrakho"],
    version: "1.0",
    author: "Rakib",
    countDown: 2,
    role: 0,
    shortDescription: "নির্দিষ্ট সময়ে reminder পাঠাবে",
    longDescription: "Format: remind <time><s/m/h> <message>\nExample: remind 30s coffee\nremind 5m gym",
    category: "utility",
    guide: { en: "{p}remind <number><s|m|h> <message>" }
  },
  onStart: async function ({ message, event, args, api }) {
    if (args.length < 2) return message.reply("⚠️ Use: remind 5m গান শোনার সময়\n(s=sec, m=min, h=hour)");
    const m = args[0].match(/^(\d+)(s|m|h)$/i);
    if (!m) return message.reply("⚠️ সময় এর format ভুল\nযেমন: 30s, 5m, 2h");
    const ms = parseInt(m[1]) * { s: 1000, m: 60000, h: 3600000 }[m[2].toLowerCase()];
    if (ms > 86400000 * 7) return message.reply("⚠️ সর্বোচ্চ ৭ দিন পর্যন্ত");
    const txt = args.slice(1).join(" ");
    let name = "তুমি";
    try { name = (await api.getUserInfo(event.senderID))[event.senderID].name; } catch {}
    await message.reply(`⏰ Reminder set হলো!\n📝 "${txt}"\n⏳ ${args[0]} পর reminder পাবে\n👻 Ghost Net`);
    setTimeout(() => {
      api.sendMessage({ body: `⏰ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥\n━━━━━━━━━━━━━━\n👤 ${name}\n📝 ${txt}\n━━━━━━━━━━━━━━\n👻 Ghost Net`, mentions: [{ tag: name, id: event.senderID }] }, event.threadID);
    }, ms);
  }
};
