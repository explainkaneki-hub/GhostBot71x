module.exports.config = {
  name: "mirror",
  aliases: ["flip2", "আয়না", "mirrortext"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Mirror/flip text left-right 🪞" },
  longDescription: { en: "Flip text like a mirror reflection!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("🪞 ব্যবহার: .mirror [text]");
  const flipped = text.split("").reverse().join("");
  return message.reply(`🪞 𝗠𝗶𝗿𝗿𝗼𝗿 𝗧𝗲𝘅𝘁\n━━━━━━━━━━━━\n📝 আসল: ${text}\n🪞 আয়না: ${flipped}\n━━━━━━━━━━━━\n✨ Cool!`);
};
