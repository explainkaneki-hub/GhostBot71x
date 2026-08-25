module.exports = {
  config: {
    name: "truth",
    aliases: ["sotti"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Truth or Dare — Truth question",
    category: "fun",
    guide: { en: "{p}truth" }
  },
  onStart: async function ({ message }) {
    const list = [
      "তোমার last crush এর নাম কী?",
      "এ পর্যন্ত সবচেয়ে বড় মিথ্যা কী বলেছ?",
      "চুরি করে কখনো কিছু খেয়েছ?",
      "তোমার সবচেয়ে বড় ভয় কী?",
      "Class এ কাকে পছন্দ করো?",
      "Mom কে বকা দিয়েছ কখনো?",
      "তোমার last Google search কী ছিল?",
      "তুমি কতবার online পরীক্ষায় ফাঁকি দিয়েছ?",
      "কোন celebrity কে date করতে চাও?",
      "Friend এর GF/BF কে কখনো crush করেছ?",
      "তোমার জীবনের সবচেয়ে cringe moment কী?",
      "কতদিন না গোসল করে কাটিয়েছ?",
      "Phone এ কার DM সবচেয়ে বেশি check করো?",
      "নিজের কোন অভ্যাসটা সবচেয়ে বাজে?",
      "কাউকে block করে আবার unblock করেছ?"
    ];
    const t = list[Math.floor(Math.random() * list.length)];
    return message.reply(`💜 𝗧𝗥𝗨𝗧𝗛 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━\n❓ ${t}\n━━━━━━━━━━━━━━\n💀 Ghost Net`);
  }
};
