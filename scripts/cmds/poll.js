module.exports = {
  config: {
    name: "poll",
    aliases: ["vote", "ভোট"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Create a poll",
    category: "utility",
    guide: { en: "{p}poll <question> | option1 | option2 | option3\nExample: {p}poll Best OS? | Windows | Linux | Mac" }
  },

  onStart: async function ({ api, message, args, event, commandName }) {
    const input = args.join(" ");
    const parts = input.split("|").map(p => p.trim());
    if (parts.length < 3) return message.reply("Usage: .poll <question> | option1 | option2\nExample: .poll Best food? | Rice | Bread | Noodles");

    const question = parts[0];
    const options = parts.slice(1);
    const nums = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

    const optStr = options.map((o, i) => `${nums[i]} ${o}`).join("\n");
    const msg = await message.reply(
      `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗣𝗢𝗟𝗟\n━━━━━━━━━━━━━━━━\n` +
      `❓ ${question}\n\n${optStr}\n\n` +
      `React with a number to vote!\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );
  }
};
