const fs = require("fs-extra");
const path = require("path");
const STATE = path.join(__dirname, "cache", "mathq_state.json");
function load() { try { return fs.readJsonSync(STATE); } catch { return {}; } }
function save(d) { fs.ensureDirSync(path.dirname(STATE)); fs.writeJsonSync(STATE, d, { spaces: 2 }); }

function genQuestion(level) {
  const ops = level === "hard" ? ["+", "-", "*"] : ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, ans;
  if (level === "easy") { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; }
  else if (level === "medium") { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 50) + 10; }
  else { a = Math.floor(Math.random() * 20) + 2; b = Math.floor(Math.random() * 20) + 2; }
  if (op === "+") ans = a + b;
  else if (op === "-") { if (a < b) [a, b] = [b, a]; ans = a - b; }
  else ans = a * b;
  return { q: `${a} ${op} ${b} = ?`, ans };
}

module.exports.config = {
  name: "mathq",
  aliases: ["mathquiz", "গণিত", "mathgame"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Quick math challenge game ➕" },
  longDescription: { en: "Test your math speed! Easy/Medium/Hard levels." },
  category: "game-bd",
  guide: { en: "{pn} [easy/medium/hard] | {pn} ans [answer]" }
};

module.exports.onStart = async ({ event, args, message }) => {
  const tid = event.threadID;
  let data = load();

  if (args[0] === "ans") {
    const q = data[tid];
    if (!q) return message.reply("❓ কোনো প্রশ্ন নেই। আগে .mathq easy দিয়ে শুরু করো!");
    const ans = parseInt(args[1]);
    if (isNaN(ans)) return message.reply("❌ সংখ্যায় উত্তর দাও। যেমন: .mathq ans 42");
    if (ans === q.ans) {
      delete data[tid]; save(data);
      return message.reply(`✅ সঠিক! উত্তর: ${q.ans} 🎉\n🌟 আরেকটা: .mathq easy/medium/hard`);
    }
    return message.reply(`❌ ভুল! আবার চেষ্টা করো। .mathq ans [উত্তর]`);
  }

  const level = args[0] || "easy";
  if (!["easy", "medium", "hard"].includes(level)) return message.reply("❌ easy / medium / hard এর মধ্যে বেছে নাও।");
  const { q, ans } = genQuestion(level);
  data[tid] = { ans };
  save(data);
  const emoji = level === "easy" ? "🟢" : level === "medium" ? "🟡" : "🔴";
  return message.reply(`➕ 𝗠𝗮𝘁𝗵 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲 ${emoji}\n━━━━━━━━━━━━\n❓ ${q}\n━━━━━━━━━━━━\n💡 উত্তর দিতে: .mathq ans [সংখ্যা]`);
};
