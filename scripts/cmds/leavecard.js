const { sendHudPreview } = require("./lib/hudPreview");

module.exports = {
  config: {
    name: "leavecard",
    aliases: ["lcard", "goodbyeimage"],
    version: "1.0.0",
    author: "ST",
    role: 0,
    category: "fun",
    description: "Generate a Canvas leave HUD preview"
  },
  onStart: async params => sendHudPreview("leave", params)
};