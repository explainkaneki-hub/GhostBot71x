const SUPPORTED_FONTS = new Set(["default", "bold", "mono", "smallcaps"]);

module.exports = {
  config: {
    name: "font",
    aliases: ["replyfont", "fontstyle"],
    version: "1.0.0",
    author: "ST",
    role: 1,
    category: "config",
    description: "Choose the Unicode style used by font-aware replies"
  },
  onStart: async ({ args, message, threadsData, event }) => {
    const style = String(args[0] || "").toLowerCase();
    if (!style || style === "list") return message.reply("Available fonts: default, bold, mono, smallcaps\nUse: font bold");
    if (!SUPPORTED_FONTS.has(style)) return message.reply("Unknown font. Choose: default, bold, mono, smallcaps");
    const thread = await threadsData.get(event.threadID);
    const data = thread.data || {};
    data.replyFont = style;
    await threadsData.set(event.threadID, { data });
    return message.reply(`Reply font set to: ${style}`);
  }
};