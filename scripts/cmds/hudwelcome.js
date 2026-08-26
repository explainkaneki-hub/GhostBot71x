module.exports = {
  config: {
    name: "hudwelcome",
    aliases: ["hud", "premiumwelcome"],
    version: "1.0.0",
    author: "ST",
    role: 1,
    category: "config",
    description: "Enable or disable the premium Canvas welcome/leave HUD"
  },
  onStart: async ({ args, event, threadsData, message }) => {
    const value = String(args[0] || "").toLowerCase();
    if (!["on", "off"].includes(value)) {
      return message.reply("Use: hudwelcome on | hudwelcome off");
    }
    const thread = await threadsData.get(event.threadID);
    const data = thread.data || {};
    data.premiumHud = value === "on";
    await threadsData.set(event.threadID, { data });
    return message.reply(`Premium welcome/leave HUD ${value === "on" ? "enabled" : "disabled"}.`);
  }
};