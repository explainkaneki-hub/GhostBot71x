module.exports = {
  config: {
    name: "ship",
    aliases: ["jorbandi"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "দুজনের ship percentage",
    category: "fun",
    guide: { en: "{p}ship @user1 @user2" }
  },
  onStart: async function ({ message, event, api }) {
    const m = Object.keys(event.mentions || {});
    if (m.length < 2) return message.reply("⚠️ ২ জনকে mention করো\nযেমন: ship @ছেলে @মেয়ে");
    let n1 = "?", n2 = "?";
    try { const i = await api.getUserInfo(m); n1 = i[m[0]]?.name || "?"; n2 = i[m[1]]?.name || "?"; } catch {}
    const seed = (parseInt(m[0]) + parseInt(m[1])) % 1000;
    const score = (seed * 17 + 7) % 101;
    const bars = "█".repeat(Math.floor(score / 5)) + "░".repeat(20 - Math.floor(score / 5));
    const v = score >= 90 ? "💖 PERFECT MATCH!" : score >= 70 ? "💕 Great couple" : score >= 40 ? "💞 মন্দ না" : score >= 20 ? "💔 কঠিন" : "☠️ ভুলে যাও";
    return message.reply(`💘 𝗦𝗛𝗜𝗣 𝗖𝗛𝗘𝗖𝗞\n━━━━━━━━━━━━━━━━\n${n1} ❤ ${n2}\n${bars} ${score}%\n${v}\n━━━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
