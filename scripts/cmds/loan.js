module.exports.config = {
  name: "loan",
  aliases: ["emi", "loanemi", "ঋণ"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Loan/EMI calculator 💳" },
  longDescription: { en: "Calculate monthly EMI for any loan!" },
  category: "utility-bd",
  guide: { en: "{pn} [amount] [interest%] [months] — e.g: .loan 100000 12 24" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || !args[1] || !args[2]) return message.reply("💳 ব্যবহার: .loan [ঋণের পরিমাণ] [সুদের হার%] [মাসের সংখ্যা]\n📌 উদাহরণ: .loan 100000 12 24");

  const principal = parseFloat(args[0]);
  const annualRate = parseFloat(args[1]);
  const months = parseInt(args[2]);

  if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || months <= 0) return message.reply("❌ সঠিক সংখ্যা দাও।");

  const monthlyRate = annualRate / 100 / 12;
  let emi;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return message.reply(`💳 𝗟𝗼𝗮𝗻 / 𝗘𝗠𝗜 𝗖𝗮𝗹𝗰\n━━━━━━━━━━━━\n💰 ঋণ: ৳${principal.toLocaleString()}\n📈 সুদ: ${annualRate}% বার্ষিক\n📅 মেয়াদ: ${months} মাস\n━━━━━━━━━━━━\n💵 মাসিক EMI: ৳${emi.toFixed(2)}\n💸 মোট পরিশোধ: ৳${totalPayment.toFixed(2)}\n📊 মোট সুদ: ৳${totalInterest.toFixed(2)}\n━━━━━━━━━━━━\n💡 ঋণ কম রাখো, সঞ্চয় বেশি করো!`);
};
