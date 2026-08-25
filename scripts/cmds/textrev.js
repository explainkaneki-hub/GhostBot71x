module.exports.config = {
  name: "textrev",
  aliases: ["reverse2", "উল্টো", "fliptext"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Reverse any text 🔄" },
  longDescription: { en: "Reverse a word, sentence or any text!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("🔄 ব্যবহার: .textrev [text]");
  const reversed = text.split("").reverse().join("");
  return message.reply(`🔄 𝗥𝗲𝘃𝗲𝗿𝘀𝗲𝗱 𝗧𝗲𝘅𝘁\n━━━━━━━━━━━━\n📝 আসল: ${text}\n🔁 উল্টো: ${reversed}\n━━━━━━━━━━━━\n✨ Cool right?`);
};
