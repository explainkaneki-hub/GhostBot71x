const fs = require("fs-extra");
const { createHudCard, safe } = require("../../events/lib/hudCard");

async function sendHudPreview(type, { args, event, api, message, threadsData, usersData }) {
  const uid = Object.keys(event.mentions || {})[0] || event.messageReply?.senderID || event.senderID;
  let threadData = {};
  try { threadData = await threadsData.get(event.threadID); } catch (_) {}

  let threadInfo = {};
  try {
    if (!String(event.threadID).includes("@")) threadInfo = await api.getThreadInfo(event.threadID);
  } catch (_) {}

  const groupName = safe(threadInfo.threadName || threadData.threadName, `Group ${event.threadID}`);
  const members = Number(threadInfo.participantIDs?.length || threadData.members?.length || event.participantIDs?.length || 0) || "?";
  let name = safe(event.senderName, `Member ${uid}`);
  try { name = safe(await usersData.getName(uid), name); } catch (_) {}
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const filePath = await createHudCard(type, {
    uid: safe(uid, "Unknown UID"),
    name,
    groupName,
    memberNumber: members === "?" ? "?" : String(members),
    members: String(members),
    time,
    date,
    message: type === "welcome"
      ? `Welcome ${name} — enjoy your stay in ${groupName}`
      : `${name} has departed. This is a preview card.`,
  }, api);

  try {
    await message.reply({
      body: type === "welcome" ? `Welcome card preview for ${name}` : `Leave card preview for ${name}`,
      attachment: fs.createReadStream(filePath)
    });
  } finally {
    await fs.remove(filePath).catch(() => {});
  }
}

module.exports = { sendHudPreview };