const map = {a:"4",b:"8",c:"(",d:"D",e:"3",f:"F",g:"9",h:"H",i:"1",j:"J",k:"K",l:"1",m:"M",n:"N",o:"0",p:"P",q:"Q",r:"R",s:"5",t:"7",u:"U",v:"V",w:"W",x:"X",y:"Y",z:"2"};

module.exports.config = {
  name: "leet",
  aliases: ["l33t", "h4ck"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Leet speak / hacker text 🔡" },
  longDescription: { en: "Convert text to leet speak (h4ck3r style)!" },
  category: "text-tools",
  guide: { en: "{pn} [text]" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ");
  if (!text) return message.reply("🔡 ব্যবহার: .leet [text]\n📌 উদাহরণ: .leet hello");
  const converted = text.split("").map(c => map[c.toLowerCase()] || c).join("");
  return message.reply(`🔡 𝗟𝗲𝗲𝘁 𝗦𝗽𝗲𝗮𝗸\n━━━━━━━━━━━━\n${converted}\n━━━━━━━━━━━━\n💻 H4ck3r m0d3!`);
};
