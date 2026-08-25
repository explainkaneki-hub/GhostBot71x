const MORSE = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
  K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
  U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----."," ":"/"
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]));

module.exports.config = {
  name: "morse",
  aliases: ["morsecode", "মোর্স"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Morse code encoder/decoder 📡" },
  longDescription: { en: "Convert text to Morse code or decode Morse to text." },
  category: "utility-bd",
  guide: { en: "{pn} encode [text] | {pn} decode [morse]" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("📡 ব্যবহার:\n.morse encode [text]\n.morse decode [morse code]\n📌 উদাহরণ: .morse encode HELLO");

  const mode = args[0].toLowerCase();
  const input = args.slice(1).join(" ").toUpperCase();

  if (mode === "encode") {
    if (!input) return message.reply("❌ এনকোড করার জন্য text দাও।");
    const encoded = input.split("").map(c => MORSE[c] || "?").join(" ");
    return message.reply(`📡 𝗠𝗼𝗿𝘀𝗲 𝗘𝗻𝗰𝗼𝗱𝗲\n━━━━━━━━━━━━\n📝 টেক্সট: ${input}\n🔊 মোর্স: ${encoded}\n━━━━━━━━━━━━\n💡 .morse decode দিয়ে ডিকোড করো`);
  }

  if (mode === "decode") {
    const morseInput = args.slice(1).join(" ");
    if (!morseInput) return message.reply("❌ ডিকোড করার জন্য morse code দাও।");
    const decoded = morseInput.split(" / ").map(word =>
      word.split(" ").map(ch => MORSE_REV[ch] || "?").join("")
    ).join(" ");
    return message.reply(`📡 𝗠𝗼𝗿𝘀𝗲 𝗗𝗲𝗰𝗼𝗱𝗲\n━━━━━━━━━━━━\n🔊 মোর্স: ${morseInput}\n📝 টেক্সট: ${decoded}\n━━━━━━━━━━━━\n✅ Ghost Net Edition`);
  }

  return message.reply("❌ encode অথবা decode লিখো।");
};
