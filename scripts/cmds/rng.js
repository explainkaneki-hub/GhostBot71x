module.exports.config = {
  name: "rng",
  aliases: ["random3", "randnum", "র‍্যান্ডম"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Random number generator 🎲" },
  longDescription: { en: "Generate a random number within any range!" },
  category: "utility-bd",
  guide: { en: "{pn} [min] [max] — e.g: .rng 1 100" }
};

module.exports.onStart = async ({ message, args }) => {
  const min = parseInt(args[0]) || 1;
  const max = parseInt(args[1]) || 100;
  if (min >= max) return message.reply("❌ সর্বনিম্ন সংখ্যা সর্বোচ্চ থেকে ছোট হতে হবে।");
  if (max - min > 1000000) return message.reply("❌ range বেশি বড়। সর্বোচ্চ ১০ লাখ পার্থক্য।");
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  return message.reply(`🎲 𝗥𝗮𝗻𝗱𝗼𝗺 𝗡𝘂𝗺𝗯𝗲𝗿\n━━━━━━━━━━━━\n📊 Range: ${min} → ${max}\n🎯 ফলাফল: ${result}\n━━━━━━━━━━━━\n🔄 আবার: .rng ${min} ${max}`);
};
