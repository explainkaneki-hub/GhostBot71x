const fs = require("fs-extra");
const { createHudCard, safe } = require("./lib/hudCard");

module.exports = {
  config: {
    name: "welcome",
    version: "5.0.0",
    author: "ST",
    category: "events"
  },

  onStart: async ({ event, api, threadsData, usersData, message }) => {
    if (event?.logMessageType !== "log:subscribe") return;
    const data = event.logMessageData || {};
    const participants = Array.isArray(data.addedParticipants) ? data.addedParticipants : [];
    if (!participants.length || participants.some(item => String(item.userFbId) === String(api.getCurrentUserID()))) return;

    const threadData = await threadsData.get(event.threadID).catch(() => ({}));
    if (threadData?.settings?.sendWelcomeMessage === false || threadData?.data?.premiumHud === false) return;
    let liveInfo = {};
    try {
      if (!String(event.threadID).includes("@")) liveInfo = await api.getThreadInfo(event.threadID);
    } catch (_) {}
    const groupName = safe(liveInfo.threadName || threadData?.threadName, `Group ${event.threadID}`);
    const members = Number(liveInfo.participantIDs?.length || threadData?.members?.length || threadData?.data?.members?.length || 0) || "?";
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka", weekday: "short", day: "2-digit", month: "short", year: "numeric" });

    for (const [index, participant] of participants.entries()) {
      const uid = safe(participant?.userFbId, "Unknown UID");
      let name = safe(participant?.fullName, "");
      if (!name && usersData) {
        try { name = safe(await usersData.getName(uid), ""); } catch (_) {}
      }
      name = safe(name, `Member ${uid}`);
      const memberNumber = members === "?" ? "?" : Math.max(1, Number(members) - participants.length + index + 1);
      let filePath;
      try {
        filePath = await createHudCard("welcome", {
          uid, name, groupName, memberNumber: String(memberNumber), members: String(members), time, date,
          profile: participant,
          message: `Welcome ${name} — enjoy your stay in ${groupName}`
        }, api);
        await api.sendMessage({
          body: `Welcome ${name} to ${groupName}!`,
          mentions: [{ tag: name, id: uid }],
          attachment: fs.createReadStream(filePath)
        }, event.threadID);
      } catch (error) {
        await message.reply(`Welcome ${name}!`).catch(() => {});
      } finally {
        if (filePath) await fs.remove(filePath).catch(() => {});
      }
    }
  }
};