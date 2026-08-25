module.exports.config = {
  name: "repeat",
  aliases: ["echo", "rpt", "পুনরাবৃত্তি"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Repeat text N times 🔁" },
  longDescription: { en: "Repeat any text multiple times!" },
  category: "text-tools",
  guide: { en: "{pn} [times] [text] — e.g: .repeat 3 হাসো" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || !args[1]) return message.reply("🔁 ব্যবহার: .repeat [সংখ্যা] [টেক্সট]\n📌 উদাহরণ: .repeat 3 হাসো");
  const times = parseInt(args[0]);
  if (isNaN(times) || times < 1 || times > 20) return message.reply("❌ ১-২০ বার পর্যন্ত repeat করা যাবে।");
  const text = args.slice(1).join(" ");
  const result = Array(times).fill(text).join("\n");
  return message.reply(`🔁 𝗥𝗲𝗽𝗲𝗮𝘁 𝗫${times}\n━━━━━━━━━━━━\n${result}`);
};
