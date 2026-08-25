module.exports.config = {
  name: "bmi",
  aliases: ["bmicalc", "বিএমআই"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "BMI calculator 💪" },
  longDescription: { en: "Calculate your Body Mass Index (BMI) easily." },
  category: "utility-bd",
  guide: { en: "{pn} [weight_kg] [height_cm] — e.g: .bmi 65 170" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || !args[1]) {
    return message.reply(`💪 𝗕𝗠𝗜 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗼𝗿\n━━━━━━━━━━━━\n📝 ব্যবহার: .bmi [ওজন কেজি] [উচ্চতা সেমি]\n📌 উদাহরণ: .bmi 65 170`);
  }

  const weight = parseFloat(args[0]);
  const heightCm = parseFloat(args[1]);

  if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
    return message.reply("❌ সঠিক সংখ্যা দাও! যেমন: .bmi 65 170");
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const bmiFixed = bmi.toFixed(1);

  let category, emoji, advice;
  if (bmi < 18.5) {
    category = "কম ওজন (Underweight)";
    emoji = "😟";
    advice = "বেশি করে পুষ্টিকর খাবার খাও এবং ডাক্তারের পরামর্শ নাও।";
  } else if (bmi < 25) {
    category = "স্বাভাবিক (Normal)";
    emoji = "😊✅";
    advice = "তুমি স্বাস্থ্যকর অবস্থায় আছো! এই অভ্যাস বজায় রাখো।";
  } else if (bmi < 30) {
    category = "বেশি ওজন (Overweight)";
    emoji = "😐";
    advice = "একটু ব্যায়াম করো এবং খাবারে সতর্ক থাকো।";
  } else {
    category = "স্থূলতা (Obese)";
    emoji = "😟";
    advice = "অবশ্যই ডাক্তারের পরামর্শ নাও এবং জীবনযাত্রা পরিবর্তন করো।";
  }

  return message.reply(`💪 𝗕𝗠𝗜 𝗥𝗲𝘀𝘂𝗹𝘁\n━━━━━━━━━━━━\n⚖️ ওজন: ${weight} কেজি\n📏 উচ্চতা: ${heightCm} সেমি\n🔢 BMI: ${bmiFixed}\n${emoji} অবস্থা: ${category}\n━━━━━━━━━━━━\n💡 ${advice}`);
};
