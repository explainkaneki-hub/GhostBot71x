module.exports = {
  config: {
    name: "roast",
    aliases: ["burn"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    countDown: 5,
    shortDescription: "Roast someone (Admin only)",
    longDescription: "Send a brutal roast to someone. Admin/Owner only.",
    category: "admin",
    guide: { en: "{p}roast @user — Roast someone\n{p}roast @user <custom message>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const mentioned = Object.keys(event.mentions || {});
    if (!mentioned.length) return message.reply("Tag someone to roast!\nExample: .roast @name");

    const targetUID = mentioned[0];
    const targetName = event.mentions[targetUID];
    const custom = args.filter(a => !a.startsWith("@")).join(" ").trim();

    const roasts = [
      `${targetName}, তোমার মাথায় কি ঘাস জন্মেছে নাকি? 🌿 এতো বোকামি কোত্থেকে শিখলে?`,
      `${targetName} ভাই, তোমাকে দেখলে মনে হয় জীবনে কোনো ভালো সিদ্ধান্ত নাওনি। 😬`,
      `${targetName}, তোমার বুদ্ধি যদি পানি হতো, মশাও ডুবতো না। 💧`,
      `${targetName} এতো ভুল করো যে, তোমাকে দেখলে error 404 মনে পড়ে। 🖥️`,
      `${targetName}, তুমি কি চেষ্টা করে এত boring হও, নাকি এটা natural talent? 😴`,
      `${targetName} ভাই, তোমার কথা শুনে মনে হয় Copy-Paste করে চলো। 📋`,
      `${targetName}, তোমার presence মানে absence of sense. 🤦`,
      `${targetName} এতদিন বেঁচে থেকে কী শিখলে? Clearly কিছু না। 💀`,
      `${targetName}, WiFi signal-ও তোমার চেয়ে বেশি valuable। 📶`,
      `${targetName} ভাই, তোমার logic শুনলে মাথা ব্যথা করে। 🤕`
    ];

    const roast = custom
      ? `👻 Ghost Bot Roasts ${targetName}:\n\n"${custom}"\n\n💀 — Burned by Ghost Bot`
      : `👻 Ghost Bot Roasts ${targetName}:\n\n${roasts[Math.floor(Math.random() * roasts.length)]}\n\n💀 — Burned by Rakib Islam | Ghost Bot`;

    await message.reply(roast);
    await api.setMessageReaction("🔥", event.messageID, () => {}, true);
  }
};
