const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sh",
    aliases: ["exec", "run"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 2,
    shortDescription: "💻 Shell command execute করো",
    longDescription: "Bot server এ shell command চালাও। শুধুমাত্র bot admin এর জন্য।",
    category: "admin",
    guide: { en: "{pn} <command>\nExample: {pn} ls -la\n{pn} node -v\n{pn} cat package.json" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID } = event;
    const adminList = global.GoatBot?.config?.adminBot || [];
    const masterUID = global.GoatBot?.config?.masterUID || "";
    
    if (!adminList.includes(senderID) && senderID !== masterUID) {
      return message.reply("❌ শুধুমাত্র Bot Admin এই command ব্যবহার করতে পারবে।");
    }

    const cmd = args.join(" ");
    if (!cmd) return message.reply("❌ Command দাও!\nExample: .sh ls -la");

    const dangerousPatterns = [/rm\s+-rf\s+\//, /mkfs/, /dd\s+if=/, /:(){ :|: & };:/];
    if (dangerousPatterns.some(p => p.test(cmd))) {
      return message.reply("⛔ Dangerous command detected! Blocked.");
    }

    await message.reaction("⏳", messageID);
    const sent = await message.reply(`💻 Executing:\n\`${cmd}\`\n\n⌛ Processing...`);

    exec(cmd, { timeout: 30000, maxBuffer: 1024 * 1024 * 5 }, async (error, stdout, stderr) => {
      let output = "";
      if (stdout) output += `✅ OUTPUT:\n${stdout.trim()}`;
      if (stderr) output += `\n⚠️ STDERR:\n${stderr.trim()}`;
      if (error && !stdout && !stderr) output = `❌ ERROR:\n${error.message}`;
      if (!output) output = "✅ Command executed. No output.";

      if (output.length > 3000) {
        const tmpFile = path.join(__dirname, "tmp", `sh_${Date.now()}.txt`);
        fs.ensureDirSync(path.join(__dirname, "tmp"));
        fs.writeFileSync(tmpFile, output);
        await api.sendMessage(
          { body: `💻 Output too long. Sending as file:`, attachment: fs.createReadStream(tmpFile) },
          threadID, messageID
        );
        setTimeout(() => fs.removeSync(tmpFile), 30000);
      } else {
        await message.reply(output);
      }

      api.unsendMessage(sent.messageID).catch(() => {});
      await message.reaction("✅", messageID);
    });
  }
};
