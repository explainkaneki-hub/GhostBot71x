const fs = require("fs-extra");
const { createHudCard, safe } = require("./lib/hudCard");

module.exports = {
  config: {
    name: "leave",
    version: "5.0.0",
    author: "ST",
    category: "events"
  },

  onStart: async ({ event, api, threadsData, usersData, message }) => {
    if (event?.logMessageType !== "log:unsubscribe") return;
    const data = event.logMessageData || {};
    const uid = safe(data.leftParticipantFbId, "Unknown UID");
    if (uid === String(api.getCurrentUserID())) return;
    const threadData = await threadsData.get(event.threadID).catch(() => ({}));
    if (threadData?.settings?.sendLeaveMessage === false || threadData?.data?.premiumHud === false) return;
    let liveInfo = {};
    try {
      if (!String(event.threadID).includes("@")) liveInfo = await api.getThreadInfo(event.threadID);
    } catch (_) {}
    const groupName = safe(liveInfo.threadName || threadData?.threadName, `Group ${event.threadID}`);
    const members = Number(liveInfo.participantIDs?.length || threadData?.members?.length || 0) || "?";
    let name = `Member ${uid}`;
    try { name = safe(await usersData.getName(uid), name); } catch (_) {}
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" });
    let filePath;
    try {
      filePath = await createHudCard("leave", {
        uid, name, groupName, memberNumber: "—", members: String(members), time, date,
        message: `${name} has departed. The group wishes you well.`
      }, api);
      await api.sendMessage({
        body: `Goodbye ${name}.`,
        mentions: [{ tag: name, id: uid }],
        attachment: fs.createReadStream(filePath)
      }, event.threadID);
    } catch (_) {
      await message.reply(`Goodbye ${name}.`).catch(() => {});
    } finally {
      if (filePath) await fs.remove(filePath).catch(() => {});
    }
  }
};