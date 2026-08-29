module.exports = {
  config: {
    name: "autoadd",
    version: "1.1.0",
    author: "ST",
    countDown: 1,
    role: 2,
    description: "Show the status of the automatic group-add helper",
    category: "system"
  },
  onStart: async ({ message }) => {
    return message.reply("Auto-add is disabled for safety. The bot will not add accounts to groups without an explicit admin action.");
  }
};