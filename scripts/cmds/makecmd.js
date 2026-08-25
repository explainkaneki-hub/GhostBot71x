const fs = require("fs-extra");
const path = require("path");

const OWNER_ID = "61575436812912";
const CMDS_DIR = path.join(__dirname);

function isAdmin(senderID) {
  if (String(senderID) === OWNER_ID) return true;
  const admins = (global.GoatBot?.config?.adminBot || []).map(String);
  return admins.includes(String(senderID));
}

module.exports = {
  config: {
    name: "makecmd",
    aliases: ["buildcmd", "savecmd"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Create/install a command from GC (admin only)" },
    longDescription: { en: "Reply to any message containing JS code with .makecmd filename to create and load a new command instantly." },
    category: "owner",
    guide: {
      en: "Method 1 — Reply to a code message:\n  .makecmd filename\n\nMethod 2 — Inline:\n  .makecmd filename\n  <paste code here>"
    }
  },

  onStart: async function ({ message, args, event, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData }) {
    if (!isAdmin(event.senderID)) {
      return message.reply("❌ এই command শুধু admin use করতে পারবে!");
    }

    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  ⚡ Command Installer ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 Method 1 (Reply to code):\n` +
        `  Code message এ reply করো:\n` +
        `  › .makecmd filename\n\n` +
        `📌 Method 2 (Inline):\n` +
        `  › .makecmd filename\n` +
        `    (নিচে code paste করো)\n\n` +
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
        `💡 Example: .makecmd weather`
      );
    }

    let fileName = args[0].toLowerCase().replace(/\.js$/i, "").trim();

    if (!fileName.match(/^[a-z0-9_\-]+$/i)) {
      return message.reply("❌ Invalid filename! শুধু letters, numbers, _ এবং - ব্যবহার করো।");
    }

    // --- Get the code ---
    let rawCode = "";

    // Priority 1: replied message body
    const repliedBody = event.messageReply?.body?.trim();
    if (repliedBody && repliedBody.includes("module.exports")) {
      rawCode = repliedBody;
    }

    // Priority 2: inline (lines after first line)
    if (!rawCode) {
      const allLines = event.body.split("\n");
      if (allLines.length > 1) {
        rawCode = allLines.slice(1).join("\n").trim();
      }
    }

    // Strip markdown code fences if present
    rawCode = rawCode
      .replace(/^```(?:javascript|js)?\s*/im, "")
      .replace(/\s*```\s*$/im, "")
      .trim();

    if (!rawCode) {
      return message.reply(
        `⚠️ Code পাওয়া যায়নি!\n\n` +
        `দুটো উপায়ে code দাও:\n` +
        `1️⃣ Code message এ reply করে: .makecmd ${fileName}\n` +
        `2️⃣ Command এর নিচের লাইনে code paste করো`
      );
    }

    if (!rawCode.includes("module.exports")) {
      return message.reply(
        `❌ Valid command code না!\n\n` +
        `Code এ অবশ্যই থাকতে হবে:\n` +
        `  › module.exports = { config: {...} }`
      );
    }

    const filePath = path.join(CMDS_DIR, `${fileName}.js`);
    const fileExists = fs.existsSync(filePath);

    // --- Write the file to disk FIRST ---
    try {
      await fs.outputFile(filePath, rawCode, "utf8");
    } catch (writeErr) {
      return message.reply(`❌ File লেখা যায়নি!\n${writeErr.message}`);
    }

    // --- Then load it via GoatBot's loadScripts ---
    try {
      const { loadScripts } = global.utils;
      const log = global.utils.log;
      const configCommands = global.GoatBot?.configCommands;

      const infoLoad = loadScripts(
        "cmds", `${fileName}.js`, log, configCommands,
        api, threadModel, userModel, dashBoardModel, globalModel,
        threadsData, usersData, dashBoardData, globalData
      );

      if (infoLoad?.status === "success") {
        return message.reply(
          `╔══════════════════════╗\n` +
          `║  ✅ Command Installed! ║\n` +
          `╚══════════════════════╝\n` +
          `  ✦ Name   › .${infoLoad.name}\n` +
          `  ✦ File   › ${fileName}.js\n` +
          `  ✦ Status › ${fileExists ? "Updated ♻️" : "New ✨"}\n` +
          `  ✦ Loaded › Instantly ⚡\n\n` +
          `💡 .${infoLoad.name} এখনই use করতে পারবে!`
        );
      } else {
        const errMsg = infoLoad?.error?.message || "Unknown error";
        return message.reply(
          `╔══════════════════════╗\n` +
          `║  ⚠️ Saved, Load Failed║\n` +
          `╚══════════════════════╝\n` +
          `  ✦ File  › ${fileName}.js ✅ saved\n` +
          `  ✦ Error › ${errMsg}\n\n` +
          `Bot restart করলে .${fileName} কাজ করবে।`
        );
      }
    } catch (loadErr) {
      // File already written — just report it
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  ⚠️ Saved, Not Loaded ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ File  › ${fileName}.js ✅ saved\n` +
        `  ✦ Error › ${loadErr.message}\n\n` +
        `Bot restart করলে .${fileName} কাজ করবে।`
      );
    }
  }
};
