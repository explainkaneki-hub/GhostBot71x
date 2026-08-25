module.exports.config = {
  name: "shipcalc",
  aliases: ["ship2", "compatibility", "মিল"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Love compatibility calculator 💑" },
  longDescription: { en: "Check love compatibility between two people!" },
  category: "game-bd",
  guide: { en: "{pn} [@person1] [@person2]" }
};

module.exports.onStart = async ({ event, message, args, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  let name1, name2;
  if (uids.length >= 2) {
    name1 = await usersData.getName(uids[0]) || "Person 1";
    name2 = await usersData.getName(uids[1]) || "Person 2";
  } else if (args.length >= 2) {
    name1 = args[0]; name2 = args.slice(1).join(" ");
  } else {
    return message.reply("💑 ব্যবহার: .shipcalc [@person1] [@person2]\nঅথবা: .shipcalc [নাম১] [নাম২]");
  }

  const seed = (name1 + name2).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const pct = (seed % 101);
  const bar = "❤️".repeat(Math.round(pct / 10)) + "🖤".repeat(10 - Math.round(pct / 10));

  let msg;
  if (pct >= 90) msg = "💯 Perfect match! তোমরা soul mates! 😍";
  else if (pct >= 70) msg = "😊 অনেক ভালো মিল! প্রেম করে ফেলো! 💕";
  else if (pct >= 50) msg = "🤔 ঠিকঠাক মিল। চেষ্টা করলে হবে! 💪";
  else if (pct >= 30) msg = "😅 একটু কঠিন হবে, তবে impossible না।";
  else msg = "😢 মিল কম। বন্ধু থাকো! 🤝";

  return message.reply(`💑 𝗦𝗵𝗶𝗽 𝗖𝗮𝗹𝗰\n━━━━━━━━━━━━\n💕 ${name1} ❤️ ${name2}\n━━━━━━━━━━━━\n${bar}\n🔢 মিল: ${pct}%\n━━━━━━━━━━━━\n${msg}`);
};
