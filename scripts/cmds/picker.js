module.exports.config = {
  name: "picker",
  aliases: ["choose2", "random2", "বেছে নাও"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Random choice picker 🎯" },
  longDescription: { en: "Can't decide? Let the bot pick for you!" },
  category: "utility-bd",
  guide: { en: "{pn} [option1] or [option2] or ... — e.g: .picker চা or কফি or জুস" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("🎯 ব্যবহার: .picker [option1] or [option2] ...\n📌 উদাহরণ: .picker চা or কফি or জুস");
  const options = text.split(/ or | Or | OR |,/).map(o => o.trim()).filter(Boolean);
  if (options.length < 2) return message.reply("❌ কমপক্ষে ২টা option দাও। 'or' দিয়ে আলাদা করো।");
  const choice = options[Math.floor(Math.random() * options.length)];
  return message.reply(`🎯 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗶𝗰𝗸𝗲𝗿\n━━━━━━━━━━━━\n🎲 Options: ${options.join(" / ")}\n━━━━━━━━━━━━\n✅ আমার পছন্দ: 🌟 ${choice} 🌟`);
};
