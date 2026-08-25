/**
 * @GHOST_NET_RESTART_ENGINE
 * @DESIGN: ULTRA-NEON ANIMATION
 * @AUTHOR: RAKIB ISLAM
 */

const process = require('process');

module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot", "rst"],
    version: "1.0",
    author: "RAKIB ISLAM",
    countDown: 10,
    role: 2, // Admin Only
    category: "system",
    shortDescription: { en: "High-level Neon Restart Animation" }
  },

  onStart: async function ({ message, api, event }) {
    // Stage 1: Initializing
    const stage1 = 
      `╭──────❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍──────╮\n` +
      `│ 🧪 𝗦𝘆𝘀𝘁𝗲𝗺: 𝗜𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘇𝗶𝗻𝗴...\n` +
      `│ 🟢 𝗦𝘁𝗮𝘁𝘂𝘀: [▒▒▒▒▒▒▒▒▒▒] 𝟬%\n` +
      `│ ⚙️ 𝗖𝗼𝗿𝗲: 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗛𝗲𝗮𝗹𝘁𝗵\n` +
      `╰─────────── 💠 ───────────╯`;

    const sent = await message.reply(stage1);

    // Stage 2: Processing (1 second delay)
    setTimeout(async () => {
      const stage2 = 
        `╭──────❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍──────╮\n` +
        `│ ⚡ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀: 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗖𝗹𝗲𝗮𝗻𝗶𝗻𝗴\n` +
        `│ 🟡 𝗦𝘁𝗮𝘁𝘂𝘀: [██████▒▒▒▒] 𝟲𝟱%\n` +
        `│ 🛰️ 𝗡𝗲𝘁𝘄𝗼𝗿𝗸: 𝗥𝗲𝗳𝗿𝗲𝘀𝗵𝗶𝗻𝗴 𝗜𝗣\n` +
        `╰─────────── 💠 ───────────╯`;
      await api.editMessage(stage2, sent.messageID);
    }, 1000);

    // Stage 3: Finalizing (2.5 seconds delay)
    setTimeout(async () => {
      const stage3 = 
        `╭──────❍ 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 ❍──────╮\n` +
        `│ 💎 𝗦𝘆𝘀𝘁𝗲𝗺: 𝗥𝗲𝗯𝗼𝗼𝘁𝗶𝗻𝗴 𝗖𝗼𝗿𝗲\n` +
        `│ 🔵 𝗦𝘁𝗮𝘁𝘂𝘀: [██████████] 𝟭𝟬𝟬%\n` +
        `│ ✅ 𝗥𝗲𝗮𝗱𝘆: 𝗚𝗼𝗱 𝗠𝗼𝗱𝗲 𝗔𝗰𝘁𝗶𝘃𝗲\n` +
        `╰─────────── 💠 ───────────╯\n` +
        `🔱 𝗦𝗲𝗲 𝘆𝗼𝘂 𝗼𝗻 𝘁𝗵𝗲 𝗼𝘁𝗵𝗲𝗿 𝘀𝗶𝗱𝗲, 𝗕𝗼𝘀𝘀!`;
      
      await api.editMessage(stage3, sent.messageID);
      
      // বটের মেইন প্রসেস কিল করা যাতে রিপলিট রিস্টার্ট নেয়
      setTimeout(() => {
        process.exit(1);
      }, 500);
    }, 2500);
  }
};
