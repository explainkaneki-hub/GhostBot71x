const fs = require("fs");
const path = require("path");

const CMDS_DIR = path.join(__dirname);
const OWNER_ID = "61575436812912";
const CHUNK = 19500;

function isAdmin(senderID) {
  if (String(senderID) === OWNER_ID) return true;
  const admins = (global.GoatBot?.config?.adminBot || []).map(String);
  return admins.includes(String(senderID));
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

module.exports = {
  config: {
    name: "file",
    aliases: ["getfile", "sourcecode", "src"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Get full source code of any command (admin only)" },
    longDescription: { en: "Shows the complete raw source code of any command directly in chat" },
    category: "utility",
    guide: { en: "{p}file <command name>\nExample: {p}file pin" }
  },

  onStart: async function ({ message, args, event }) {
    if (!isAdmin(event.senderID)) {
      return message.reply("❌ এই command শুধু admin use করতে পারবে!");
    }

    if (!args[0]) {
      return message.reply(
        `╔══════════════════╗\n` +
        `║  📁 File Command  ║\n` +
        `╚══════════════════╝\n\n` +
        `  ✦ Usage   › .file <command>\n` +
        `  ✦ Example › .file pin\n` +
        `  ✦ Example › .file help\n\n` +
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
        `💡 Admin only — full source code দেখাবে`
      );
    }

    const cmdName = args[0].toLowerCase().replace(/\.js$|\.txt$/i, "");
    const jsPath = path.join(CMDS_DIR, `${cmdName}.js`);

    if (!fs.existsSync(jsPath)) {
      const all = fs.readdirSync(CMDS_DIR)
        .filter(f => f.endsWith(".js"))
        .map(f => f.replace(".js", "").toLowerCase());
      const similar = all.filter(f => f.includes(cmdName) || cmdName.includes(f)).slice(0, 5);
      const hint = similar.length ? `\n\n💡 এরকম আছে:\n${similar.map(s => `› .file ${s}`).join("\n")}` : "";
      return message.reply(`❌ "${cmdName}" নামে কোনো command নেই!${hint}`);
    }

    const code = fs.readFileSync(jsPath, "utf8");
    const lines = code.split("\n").length;
    const sizeKB = (fs.statSync(jsPath).size / 1024).toFixed(2);

    const header =
      `╔══════════════════════╗\n` +
      `║   📄 Source Code       ║\n` +
      `╚══════════════════════╝\n` +
      `  ✦ Command › .${cmdName}\n` +
      `  ✦ Lines   › ${lines} | Size › ${sizeKB} KB\n` +
      `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;

    if ((header + code).length <= CHUNK) {
      return message.reply(header + code);
    }

    const totalParts = Math.ceil(code.length / CHUNK);

    await message.reply(
      header +
      `📋 বড় file — ${totalParts} part এ আসবে\n\n` +
      code.substring(0, CHUNK) +
      `\n\n━━━ Part 1 / ${totalParts} ━━━`
    );

    let offset = CHUNK;
    let part = 2;
    while (offset < code.length) {
      await sleep(1500);
      const chunk = code.substring(offset, offset + CHUNK);
      await message.reply(
        `━━━ Part ${part} / ${totalParts} ━━━\n\n` +
        chunk +
        (offset + CHUNK >= code.length ? `\n\n✅ .${cmdName} — সম্পূর্ণ code পাঠানো হয়েছে` : `\n\n━━━ Part ${part} / ${totalParts} ━━━`)
      );
      offset += CHUNK;
      part++;
    }
  }
};
