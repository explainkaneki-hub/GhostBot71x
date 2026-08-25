const map = {a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"Q",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"};

module.exports.config = {
  name: "smallcaps",
  aliases: ["small", "smcaps", "ছোটহরফ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Small caps text converter ᴀʙᴄ" },
  longDescription: { en: "Convert text to small capital letters!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ").toLowerCase();
  if (!text) return message.reply("📝 ব্যবহার: .smallcaps [text]");
  const converted = text.split("").map(c => map[c] || c).join("");
  return message.reply(`ᴀʙᴄ 𝗦𝗺𝗮𝗹𝗹 𝗖𝗮𝗽𝘀\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n✨ Cool look!`);
};
