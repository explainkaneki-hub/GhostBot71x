const { sendHudPreview } = require("./lib/hudPreview");

module.exports = {
  config: {
    name: "welcomecard",
    aliases: ["wcard", "welcomeimage"],
    version: "1.0.0",
    author: "ST",
    role: 0,
    category: "fun",
    description: "Generate a Canvas welcome HUD preview"
  },
  onStart: async params => sendHudPreview("welcome", params)
};