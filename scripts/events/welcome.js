const fs = require("fs-extra");
const { createHudCard, safe } = require("./lib/hudCard");

module.exports = {
  config: {
    name: "welcome",
    version: "5.0.0",
    author: "ST",
    category: "events"
  },

  onStart: async ({ event, api, threadsData, message }) => {
    if (event?.logMessageType !== "log:subscribe") return;
    const data = event.logMessageData || {};
    const participants = Array.isArray(data.addedParticipants) ? data.addedParticipants : [];
    if (!participants.length || participants.some(item => String(item.userFbId) === String(api.getCurrentUserID()))) return;

    const threadData = await threadsData.get(event.threadID).catch(() => ({}));
    if (threadData?.settings?.sendWelcomeMessage === false || threadData?.data?.premiumHud === false) return;
    const groupName = safe(threadData?.threadName, `Group ${event.threadID}`);
    const members = Array.isArray(threadData?.members)
      ? threadData.members.length
      : (Array.isArray(threadData?.data?.members) ? threadData.data.members.length : "?");
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" });

    for (const participant of participants) {
      const uid = safe(participant?.userFbId, "Unknown UID");
      const name = safe(participant?.fullName, `Member ${uid}`);
      let filePath;
      try {
        filePath = await createHudCard("welcome", {
          uid, name, groupName, members: String(members), time, date,
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