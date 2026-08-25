module.exports = {
  config: {
    name: "joke",
    aliases: ["banglajoke", "hashi"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random Bangla joke",
    category: "fun",
    guide: { en: "{p}joke" }
  },
  onStart: async function ({ message }) {
    const jokes = [
      "শিক্ষক: ৫টা প্রাণীর নাম বলো যারা আফ্রিকায় থাকে।\nছাত্র: ৩টা সিংহ আর ২টা হাতি! 😂",
      "মা: পরীক্ষায় কত পেলি?\nছেলে: ৪০ পেয়েছি।\nমা: কম তো!\nছেলে: কম মানে? পাশের জন তো ৩৯ পেয়েছে! 🤓",
      "ডাক্তার: প্রতিদিন ১ কেজি ফল খান।\nরোগী: ১ কেজি কলা খেলে চলবে?\nডাক্তার: চলবে।\nরোগী: তাহলে আমার বউ গাছ বানিয়ে দেবে! 🍌",
      "GF: তুমি আমাকে ভালোবাসো?\nBF: হ্যাঁ।\nGF: কতটা?\nBF: যতটা WiFi এর signal ভালোবাসি! 📶❤️",
      "Father: পড়াশুনা করছিস না কেন?\nSon: বাবা, Einstein ও তো সব সময় পড়েনি!\nFather: তাই বলে মোবাইল চালিয়ে Einstein হয়ে যাবি? 📱",
      "Teacher: তোমার ভবিষ্যৎ কী?\nStudent: Tense.\nTeacher: কেন?\nStudent: কারণ Past কষ্টের, Present কষ্টের, Future ও কষ্টের হবে! 😭",
      "ডাক্তার: রোজ ১০ গ্লাস পানি খান।\nপেশেন্ট: জনাব, আমি তো মাছ না! 🐟",
      "Wife: তুমি আমাকে চাঁদ এনে দাও।\nHusband: চাঁদ লাগবে না, সূর্যই দিচ্ছি, তুমি গরমে ঠান্ডা হবা! ☀️",
      "Boss: তুমি কোম্পানিতে কী contribute করেছ?\nEmployee: WiFi এর data বাচিয়েছি, ৮ ঘণ্টা ঘুমিয়ে! 💼",
      "ছেলে: বাবা, ১০০ টাকা দাও।\nবাবা: কাল দেব।\nছেলে: তাহলে আজকে ৯৯ টাকা দাও, কাল ২০০ টাকা দিও! 💸"
    ];
    const j = jokes[Math.floor(Math.random() * jokes.length)];
    return message.reply(`😂 𝗕𝗔𝗡𝗚𝗟𝗔 𝗝𝗢𝗞𝗘\n━━━━━━━━━━━━━━\n${j}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
