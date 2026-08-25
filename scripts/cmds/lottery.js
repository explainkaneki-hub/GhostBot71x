module.exports.config = {
  name: "lottery",
  aliases: ["lotto", "লটারি", "jackpot"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 10,
  role: 0,
  shortDescription: { en: "Virtual lottery draw 🎰" },
  longDescription: { en: "Try your luck with a virtual lottery!" },
  category: "game-bd",
  guide: { en: "{pn} | {pn} [your numbers 1-50, pick 6]" }
};

module.exports.onStart = async ({ message, args, usersData, event }) => {
  const name = await usersData.getName(event.senderID) || "খেলোয়াড়";
  const winning = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b);

  if (!args[0]) {
    return message.reply(`🎰 𝗟𝗼𝘁𝘁𝗲𝗿𝘆\n━━━━━━━━━━━━\n🎟️ আজকের winning numbers:\n🌟 ${winning.join(" - ")}\n━━━━━━━━━━━━\n💡 নিজের নম্বর দিতে: .lottery 5 12 23 31 40 47\n(১-৫০ থেকে ৬টা নম্বর বাছো)`);
  }

  const picked = args.slice(0, 6).map(Number);
  if (picked.some(n => isNaN(n) || n < 1 || n > 50)) return message.reply("❌ ১-৫০ এর মধ্যে ৬টা সংখ্যা দাও।");
  if (picked.length < 6) return message.reply("❌ ৬টা সংখ্যা দিতে হবে।");

  const matched = picked.filter(n => winning.includes(n)).length;
  const prizes = { 6: "🏆 জ্যাকপট! তুমি কোটিপতি!", 5: "🥇 অসাধারণ! প্রায় জিতে গেছ!", 4: "🥈 দারুণ! ৪টা মিলেছে!", 3: "🥉 ৩টা মিলেছে, মন্দ না!", 2: "😊 ২টা মিলেছে।", 1: "😅 মাত্র ১টা মিলেছে।", 0: "😢 কিছু মেলেনি! আবার চেষ্টা করো।" };

  return message.reply(`🎰 𝗟𝗼𝘁𝘁𝗲𝗿𝘆 𝗥𝗲𝘀𝘂𝗹𝘁\n━━━━━━━━━━━━\n👤 ${name}\n🎟️ তোমার নম্বর: ${picked.join(" - ")}\n🌟 winning: ${winning.join(" - ")}\n━━━━━━━━━━━━\n✅ মিলেছে: ${matched}টা\n${prizes[matched]}`);
};
