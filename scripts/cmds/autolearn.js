const fs = require("fs-extra");
const path = require("path");

const STATE_FILE = path.join(__dirname, "cache", "autolearn_state.json");
const DATA_FILE  = path.join(__dirname, "cache", "autolearn_data.json");

function loadState() {
  try { return fs.readJsonSync(STATE_FILE); } catch { return { threads: {} }; }
}
function saveState(s) {
  fs.ensureDirSync(path.dirname(STATE_FILE));
  fs.writeJsonSync(STATE_FILE, s, { spaces: 2 });
}
function loadData() {
  try { return fs.readJsonSync(DATA_FILE); } catch { return { threads: {} }; }
}

function getThreadState(state, tid) {
  if (!state.threads[tid]) state.threads[tid] = { teach: true, work: false };
  return state.threads[tid];
}

module.exports = {
  config: {
    name: "autolearn",
    aliases: ["al", "autobby", "autoai"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: "Auto-শিখে reply করে — bby-র মতো কিন্তু group থেকে শিখে",
    longDescription: "Group-এর সব message দেখে শিখে রাখে (teach mode), পরে নিজেই reply করে (work mode).",
    category: "chat",
    guide: {
      en: "{pn} teach on/off  — শেখার mode চালু/বন্ধ\n{pn} work on/off   — reply করার mode চালু/বন্ধ\n{pn} status          — এখন কি mode চলছে\n{pn} count           — কতটা শিখেছে\n{pn} clear           — শেখা data মুছে ফেলো"
    }
  },

  onStart: async function ({ event, message, args, role }) {
    const tid = event.threadID;
    const sub = (args[0] || "").toLowerCase();
    const val = (args[1] || "").toLowerCase();

    const state = loadState();
    const ts    = getThreadState(state, tid);

    if (sub === "teach") {
      if (val === "on") {
        ts.teach = true; saveState(state);
        return message.reply(
          "📚 𝗧𝗘𝗔𝗖𝗛 𝗠𝗢𝗗𝗘 চালু ✅\n\nএখন থেকে group-এর সব message analyze করে শিখে রাখবো। কেউ কিছু বললেই মাথায় ঢুকিয়ে নেবো 🧠"
        );
      } else if (val === "off") {
        ts.teach = false; saveState(state);
        return message.reply(
          "📚 𝗧𝗘𝗔𝗖𝗛 𝗠𝗢𝗗𝗘 বন্ধ ❌\n\nআর নতুন কিছু শিখবো না, আগের শেখা data থাকবে।"
        );
      }
    }

    if (sub === "work") {
      if (val === "on") {
        ts.work = true; saveState(state);
        return message.reply(
          "🤖 𝗪𝗢𝗥𝗞 𝗠𝗢𝗗𝗘 চালু ✅\n\nএখন থেকে group-এর message-এ নিজে নিজে reply দেবো! শেখা কথা আর bby-style মিলিয়ে 😏\n\n⚠️ সব message-এ reply দেবো না — এলোমেলোভাবে কিছু message-এ দেবো।"
        );
      } else if (val === "off") {
        ts.work = false; saveState(state);
        return message.reply(
          "🤖 𝗪𝗢𝗥𝗞 𝗠𝗢𝗗𝗘 বন্ধ ❌\n\nআর automatically reply দেবো না। Teach mode চললে শিখে যাবো।"
        );
      }
    }

    if (sub === "status") {
      const data  = loadData();
      const count = (data.threads[tid] || []).length;
      const teachEmoji = ts.teach ? "🟢 চালু" : "🔴 বন্ধ";
      const workEmoji  = ts.work  ? "🟢 চালু" : "🔴 বন্ধ";
      return message.reply(
        `╭──────[ 🤖 AutoLearn Status ]──────\n` +
        `│ 📚 Teach Mode: ${teachEmoji}\n` +
        `│ 💬 Work Mode:  ${workEmoji}\n` +
        `│ 🧠 শেখা message: ${count}টা\n` +
        `╰────────────────────────────────`
      );
    }

    if (sub === "count") {
      const data  = loadData();
      const count = (data.threads[tid] || []).length;
      return message.reply(`🧠 এই group থেকে এখন পর্যন্ত ${count}টা message শিখেছি!`);
    }

    if (sub === "clear") {
      if (role < 1) return message.reply("❌ এটা admin-দের কাজ!");
      const data = loadData();
      const before = (data.threads[tid] || []).length;
      data.threads[tid] = [];
      fs.ensureDirSync(path.dirname(DATA_FILE));
      fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
      return message.reply(`🗑️ Done! ${before}টা শেখা message মুছে ফেলা হয়েছে।`);
    }

    const teachEmoji = ts.teach ? "🟢" : "🔴";
    const workEmoji  = ts.work  ? "🟢" : "🔴";
    return message.reply(
      `╭──────[ 🤖 AutoLearn Help ]──────\n` +
      `│ ${teachEmoji} Teach: ${ts.teach ? "চালু" : "বন্ধ"} | ${workEmoji} Work: ${ts.work ? "চালু" : "বন্ধ"}\n` +
      `│\n` +
      `│ .autolearn teach on/off\n` +
      `│ .autolearn work on/off\n` +
      `│ .autolearn status\n` +
      `│ .autolearn count\n` +
      `│ .autolearn clear  (admin)\n` +
      `╰─────────────────────────────`
    );
  }
};
