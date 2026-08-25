const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "menu",
    aliases: ["helpmenu","📖"],
    version: "2.0.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: { en: "Interactive button menu" },
    longDescription: { en: "Select command categories using interactive buttons" },
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    
    // ক্যাটাগরিগুলো গুছিয়ে নেওয়া
    const categories = [];
    for (const [name, value] of commands) {
      if (value.config.role > 1 && role < value.config.role) continue;
      const category = value.config.category || "General";
      if (!categories.includes(category)) categories.push(category);
    }

    // মেনু ডিজাইন
    let msg = "╭───── ❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍ ─────╮\n";
    msg += "│  ✨ 𝗜𝗡𝗧𝗘𝗥𝗔𝗖𝗧𝗜𝗩𝗘 𝗠𝗘𝗡𝗨 ✨\n";
    msg += "╰────────── 💠 ──────────╯\n\n";
    msg += "👋 Welcome to Ghost-Net AI Ecosystem.\n";
    msg += "নিচের বাটনগুলো ব্যবহার করে ক্যাটাগরি সিলেক্ট করুন।\n\n";
    msg += "👤 𝗢𝘄𝗻𝗲𝗿: RAKIB ISLAM 🧸\n";
    msg += "⌨️ 𝗣𝗿𝗲𝗳𝗶𝘅: " + prefix;

    // বাটন তৈরি (Quick Replies স্টাইল)
    const buttons = categories.slice(0, 5).map(cat => ({
      content_type: "text",
      title: cat.toUpperCase(),
      payload: `help ${cat}`
    }));

    return message.reply({
      body: msg,
      quick_replies: buttons
    });
  }
};
