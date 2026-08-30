const fs = require("fs-extra");
const {
  createNeonGif,
  drawAvatar,
  drawNeonBackground,
  fetchProfile,
  fitText,
  roundRect
} = require("../utils/neonGif");

const number = value => Number(value || 0).toLocaleString("en-US");
const valueOf = (profile, key) => profile?.[key] ?? profile?.data?.[key] ?? 0;

function drawSpyFrame(ctx, frame, profile, stats) {
  const width = 1100;
  const height = 640;
  const pink = frame % 2 ? "#ff29ca" : "#ff007f";
  const cyan = frame % 2 ? "#00e5ff" : "#54f7ff";
  drawNeonBackground(ctx, width, height, frame, [pink, cyan, "#7c4dff"]);

  ctx.fillStyle = "rgba(4, 4, 18, 0.90)";
  roundRect(ctx, 42, 42, width - 84, height - 84, 26, true, false);
  ctx.strokeStyle = pink;
  ctx.shadowColor = pink;
  ctx.shadowBlur = 26;
  ctx.lineWidth = 3;
  roundRect(ctx, 42, 42, width - 84, height - 84, 26, false, true);
  ctx.shadowBlur = 0;

  ctx.textAlign = "left";
  ctx.fillStyle = cyan;
  ctx.font = "bold 17px monospace";
  ctx.fillText("GHOST NET // CYBER INTEL SCANNER", 78, 92);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  fitText(ctx, stats.name, 620, 36, "Arial");
  ctx.shadowColor = pink;
  ctx.shadowBlur = 15;
  ctx.fillText(stats.name, 78, 145);
  ctx.shadowBlur = 0;

  drawAvatar(ctx, profile.avatar, 175, 360, 118, pink);
  ctx.fillStyle = cyan;
  ctx.font = "bold 15px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SUBJECT VERIFIED", 175, 525);
  ctx.fillStyle = "#a7a4c4";
  ctx.font = "13px monospace";
  ctx.fillText(`ID ${stats.uid}`, 175, 550);

  const cards = [
    ["BALANCE", `৳${number(stats.money)}`, pink],
    ["EXP", number(stats.exp), cyan],
    ["LEVEL", number(stats.level), "#b78cff"],
    ["MONEY RANK", `#${stats.moneyRank}`, "#ff9fe8"],
    ["EXP RANK", `#${stats.expRank}`, "#73f5ff"],
    ["TOTAL USERS", number(stats.totalUsers), "#d7b5ff"]
  ];
  const startX = 355;
  const startY = 208;
  cards.forEach(([label, value, color], index) => {
    const x = startX + (index % 2) * 310;
    const y = startY + Math.floor(index / 2) * 92;
    ctx.fillStyle = "rgba(18, 15, 40, 0.92)";
    roundRect(ctx, x, y, 282, 70, 12, true, false);
    ctx.strokeStyle = `${color}aa`;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, 282, 70, 12, false, true);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(220,215,250,0.62)";
    ctx.font = "12px monospace";
    ctx.fillText(label, x + 18, y + 23);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px Arial";
    fitText(ctx, value, 245, 23, "Arial");
    ctx.fillText(value, x + 18, y + 52);
  });

  ctx.fillStyle = "rgba(190,185,230,0.7)";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`UID  ${stats.uid}`, 355, 518);
  ctx.fillText(`GENDER  ${stats.gender}`, 355, 546);
  ctx.fillText(`PROFILE  ${stats.profileUrl}`, 355, 574);
  ctx.fillStyle = pink;
  ctx.textAlign = "right";
  ctx.font = "bold 14px monospace";
  ctx.fillText(`LIVE FRAME ${String(frame + 1).padStart(2, "0")}  •  PFP HD`, width - 78, height - 70);
}

module.exports = {
  config: {
    name: "spy",
    aliases: ["userinfo", "👀", "spyuser"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    description: "Animated cyberpunk profile intelligence with balance and rank",
    category: "utility",
    guide: "{p}spy [reply / mention / UID / blank]"
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const uid = Object.keys(event.mentions || {})[0]
      || event.messageReply?.senderID
      || (args[0] && /^\d+$/.test(args[0]) ? args[0] : null)
      || event.senderID;
    let loading;
    let gifPath;
    try {
      loading = await message.reply("🔍 Scanning profile, balance and rank…");
      const profile = await fetchProfile(api, usersData, uid);
      const allUsers = await usersData.getAll().catch(() => []);
      const money = Number(valueOf(profile, "money"));
      const exp = Number(valueOf(profile, "exp"));
      const level = Number(valueOf(profile, "level") || Math.floor(exp / 1000) + 1);
      const moneyRank = Math.max(1, allUsers.filter(Boolean).sort((a, b) => Number(b.money || 0) - Number(a.money || 0)).findIndex(user => String(user.userID) === String(uid)) + 1);
      const expRank = Math.max(1, allUsers.filter(Boolean).sort((a, b) => Number(b.exp || 0) - Number(a.exp || 0)).findIndex(user => String(user.userID) === String(uid)) + 1);
      const stats = {
        uid,
        name: String(profile.name || `User ${uid}`).slice(0, 40),
        money,
        exp,
        level,
        moneyRank,
        expRank,
        totalUsers: allUsers.length,
        gender: profile.gender === 2 ? "MALE" : profile.gender === 1 ? "FEMALE" : "UNKNOWN",
        profileUrl: String(profile.profileUrl || `facebook.com/${uid}`).replace(/^https?:\/\//, "").slice(0, 42)
      };

      gifPath = await createNeonGif({
        prefix: "spy",
        drawFrame: async (ctx, frame) => drawSpyFrame(ctx, frame, profile, stats)
      });
      if (loading?.messageID) await api.unsendMessage(loading.messageID).catch(() => {});
      return await message.reply({
        body: `🕵️ ${stats.name}\n🆔 UID: ${uid}\n💰 Balance: ৳${number(money)}\n🏆 Money rank: #${moneyRank} • EXP rank: #${expRank}`,
        attachment: fs.createReadStream(gifPath)
      });
    } catch (error) {
      if (loading?.messageID) await api.unsendMessage(loading.messageID).catch(() => {});
      throw error;
    } finally {
      if (gifPath) setTimeout(() => fs.remove(gifPath).catch(() => {}), 15000);
    }
  }
};