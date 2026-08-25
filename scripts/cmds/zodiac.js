const signs = [
  { name: "মেষ (Aries)", dates: "মার্চ ২১ - এপ্রিল ১৯", traits: "সাহসী, উদ্যমী, নেতৃত্বগুণ সম্পন্ন", lucky: "লাল, সংখ্যা ৯", emoji: "♈" },
  { name: "বৃষ (Taurus)", dates: "এপ্রিল ২০ - মে ২০", traits: "ধৈর্যশীল, নির্ভরযোগ্য, জেদি", lucky: "সবুজ, সংখ্যা ৬", emoji: "♉" },
  { name: "মিথুন (Gemini)", dates: "মে ২১ - জুন ২০", traits: "বুদ্ধিমান, কৌতূহলী, যোগাযোগে পটু", lucky: "হলুদ, সংখ্যা ৫", emoji: "♊" },
  { name: "কর্কট (Cancer)", dates: "জুন ২১ - জুলাই ২২", traits: "সহানুভূতিশীল, আবেগপ্রবণ, পরিবারকেন্দ্রিক", lucky: "সাদা, সংখ্যা ২", emoji: "♋" },
  { name: "সিংহ (Leo)", dates: "জুলাই ২৩ - আগস্ট ২২", traits: "আত্মবিশ্বাসী, উদার, নেতৃত্বগুণ", lucky: "সোনালি, সংখ্যা ১", emoji: "♌" },
  { name: "কন্যা (Virgo)", dates: "আগস্ট ২৩ - সেপ্টেম্বর ২২", traits: "বিশ্লেষণী, পরিশ্রমী, বিস্তারিত মনোযোগী", lucky: "নীল, সংখ্যা ৩", emoji: "♍" },
  { name: "তুলা (Libra)", dates: "সেপ্টেম্বর ২৩ - অক্টোবর ২২", traits: "ন্যায়পরায়ণ, কূটনৈতিক, সৌন্দর্যপ্রিয়", lucky: "গোলাপি, সংখ্যা ৭", emoji: "♎" },
  { name: "বৃশ্চিক (Scorpio)", dates: "অক্টোবর ২৩ - নভেম্বর ২১", traits: "রহস্যময়, দৃঢ়প্রতিজ্ঞ, আবেগপ্রবণ", lucky: "কালো, সংখ্যা ৮", emoji: "♏" },
  { name: "ধনু (Sagittarius)", dates: "নভেম্বর ২২ - ডিসেম্বর ২১", traits: "স্বাধীনচেতা, দার্শনিক, অ্যাডভেঞ্চার প্রিয়", lucky: "বেগুনি, সংখ্যা ৩", emoji: "♐" },
  { name: "মকর (Capricorn)", dates: "ডিসেম্বর ২২ - জানুয়ারি ১৯", traits: "উচ্চাকাঙ্ক্ষী, শৃঙ্খলাপরায়ণ, ব্যবহারিক", lucky: "বাদামি, সংখ্যা ৪", emoji: "♑" },
  { name: "কুম্ভ (Aquarius)", dates: "জানুয়ারি ২০ - ফেব্রুয়ারি ১৮", traits: "উদ্ভাবনী, মানবতাবাদী, স্বাধীন", lucky: "আকাশী, সংখ্যা ১১", emoji: "♒" },
  { name: "মীন (Pisces)", dates: "ফেব্রুয়ারি ১৯ - মার্চ ২০", traits: "সৃজনশীল, সহানুভূতিশীল, স্বপ্নবিলাসী", lucky: "সামুদ্রিক নীল, সংখ্যা ১২", emoji: "♓" }
];

module.exports.config = {
  name: "zodiac",
  aliases: ["rashifal", "রাশি", "horoscope2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Zodiac sign info in Bangla ♈" },
  longDescription: { en: "Get info about any zodiac sign in Bangla!" },
  category: "utility-bd",
  guide: { en: "{pn} [sign name] | {pn} random" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || args[0].toLowerCase() === "random") {
    const s = signs[Math.floor(Math.random() * signs.length)];
    return message.reply(`${s.emoji} 𝗭𝗼𝗱𝗶𝗮𝗰 𝗦𝗶𝗴𝗻\n━━━━━━━━━━━━\n🔮 রাশি: ${s.name}\n📅 তারিখ: ${s.dates}\n✨ বৈশিষ্ট্য: ${s.traits}\n🍀 ভাগ্য: ${s.lucky}\n━━━━━━━━━━━━\n🌟 আরেকটা: .zodiac random`);
  }
  const query = args.join(" ").toLowerCase();
  const found = signs.find(s => s.name.toLowerCase().includes(query) || query.includes(s.emoji));
  if (!found) {
    const list = signs.map(s => `${s.emoji} ${s.name}`).join("\n");
    return message.reply(`🔮 রাশিগুলো:\n${list}\n\n💡 উদাহরণ: .zodiac মেষ`);
  }
  return message.reply(`${found.emoji} ${found.name}\n━━━━━━━━━━━━\n📅 ${found.dates}\n✨ ${found.traits}\n🍀 ${found.lucky}`);
};
