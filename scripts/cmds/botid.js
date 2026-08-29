module.exports = {
  config: {
    name: "botid",
    version: "1.0.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    description: "Bot ID user's inbox এ পাঠাবে",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    try {
      const botID = await api.getCurrentUserID();
      const userID = event.senderID;

      await api.sendMessage(
        `🤖 Bot ID\n\n${botID}`,
        userID
      );

      // চাইলে যেখানে command দেওয়া হয়েছে সেখানেও confirmation
      return api.sendMessage(
        "✅ Bot ID তোমার inbox-এ পাঠানো হয়েছে।",
        event.threadID
      );

    } catch (error) {
      console.error("[BOTID] Error:", error);
      return api.sendMessage(
        "❌ Bot ID পাঠাতে সমস্যা হয়েছে।",
        event.threadID
      );
    }
  }
};