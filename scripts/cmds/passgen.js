module.exports.config = {
  name: "passgen",
  aliases: ["password2", "genpass", "পাসওয়ার্ড"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Strong password generator 🔑" },
  longDescription: { en: "Generate a strong random password!" },
  category: "utility-bd",
  guide: { en: "{pn} [length] — e.g: .passgen 16" }
};

module.exports.onStart = async ({ message, args }) => {
  const length = Math.min(Math.max(parseInt(args[0]) || 12, 6), 32);
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = upper + lower + nums + special;

  let pass = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    nums[Math.floor(Math.random() * nums.length)],
    special[Math.floor(Math.random() * special.length)]
  ];
  for (let i = pass.length; i < length; i++) {
    pass.push(all[Math.floor(Math.random() * all.length)]);
  }
  pass = pass.sort(() => Math.random() - 0.5).join("");

  const strength = length >= 16 ? "🟢 শক্তিশালী" : length >= 12 ? "🟡 মাঝারি" : "🔴 দুর্বল";
  return message.reply(`🔑 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗼𝗿\n━━━━━━━━━━━━\n🔒 পাসওয়ার্ড:\n\`${pass}\`\n📏 দৈর্ঘ্য: ${length} অক্ষর\n💪 শক্তি: ${strength}\n━━━━━━━━━━━━\n⚠️ এটা কোথাও save করো, কাউকে দেখিও না!`);
};
