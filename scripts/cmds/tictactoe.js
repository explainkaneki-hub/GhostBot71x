module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Tic-Tac-Toe vs bot",
    category: "game",
    guide: { en: "{p}tictactoe   then reply 1-9" }
  },
  onStart: async function ({ message, event, commandName }) {
    const board = Array(9).fill(null);
    const sent = await message.reply(`🎯 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘\n━━━━━━━━━━━━━━\n${render(board)}\nতুমি ❌, Bot ⭕\n💬 Reply with 1-9 to place your move\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
    global.GoatBot.onReply.set(sent.messageID, { commandName, messageID: sent.messageID, author: event.senderID, board });
  },
  onReply: async function ({ message, event, Reply, commandName }) {
    if (event.senderID !== Reply.author) return;
    const pos = parseInt(event.body) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8 || Reply.board[pos]) return message.reply("⚠️ Valid empty position দাও (1-9)");
    Reply.board[pos] = "X";
    let win = checkWin(Reply.board);
    if (!win && Reply.board.includes(null)) {
      // Bot move
      const bp = botMove(Reply.board);
      Reply.board[bp] = "O";
      win = checkWin(Reply.board);
    }
    let msg = `${render(Reply.board)}\n`;
    if (win === "X") { global.GoatBot.onReply.delete(Reply.messageID); return message.reply(msg + "\n🏆 তুমি জিতলে!\n👻 Ghost Net"); }
    if (win === "O") { global.GoatBot.onReply.delete(Reply.messageID); return message.reply(msg + "\n💀 Bot জিতলো!\n👻 Ghost Net"); }
    if (!Reply.board.includes(null)) { global.GoatBot.onReply.delete(Reply.messageID); return message.reply(msg + "\n🤝 Draw!\n👻 Ghost Net"); }
    const sent = await message.reply(msg + "\n💬 Reply with 1-9 for next move");
    global.GoatBot.onReply.set(sent.messageID, { ...Reply, commandName, messageID: sent.messageID });
  }
};

function render(b) {
  const c = b.map((v, i) => v || (i + 1));
  return `┌───┬───┬───┐\n│ ${c[0]} │ ${c[1]} │ ${c[2]} │\n├───┼───┼───┤\n│ ${c[3]} │ ${c[4]} │ ${c[5]} │\n├───┼───┼───┤\n│ ${c[6]} │ ${c[7]} │ ${c[8]} │\n└───┴───┴───┘`;
}
function checkWin(b) {
  const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,c,d] of w) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}
function botMove(b) {
  for (const sym of ["O", "X"]) {
    for (let i = 0; i < 9; i++) {
      if (!b[i]) { b[i] = sym; if (checkWin(b) === sym) { b[i] = null; return i; } b[i] = null; }
    }
  }
  if (!b[4]) return 4;
  const empty = b.map((v, i) => v ? null : i).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}
