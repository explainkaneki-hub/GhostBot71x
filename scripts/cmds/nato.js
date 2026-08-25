const NATO = {A:"Alpha",B:"Bravo",C:"Charlie",D:"Delta",E:"Echo",F:"Foxtrot",G:"Golf",H:"Hotel",I:"India",J:"Juliet",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",X:"X-ray",Y:"Yankee",Z:"Zulu","0":"Zero","1":"One","2":"Two","3":"Three","4":"Four","5":"Five","6":"Six","7":"Seven","8":"Eight","9":"Nine"};

module.exports.config = {
  name: "nato",
  aliases: ["natoalpha", "phonetic", "ন্যাটো"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "NATO phonetic alphabet 🔤" },
  longDescription: { en: "Convert text to NATO phonetic alphabet!" },
  category: "text-tools",
  guide: { en: "{pn} [text] — e.g: .nato HELLO" }
};

module.exports.onStart = async ({ message, args }) => {
  const text = args.join(" ").toUpperCase();
  if (!text) return message.reply("🔤 ব্যবহার: .nato [text]\n📌 উদাহরণ: .nato HELLO");
  const result = text.split("").map(c => NATO[c] ? `${c} → ${NATO[c]}` : c).join("\n");
  return message.reply(`🔤 𝗡𝗔𝗧𝗢 𝗔𝗹𝗽𝗵𝗮𝗯𝗲𝘁\n━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━\n📡 Clear communication!`);
};
