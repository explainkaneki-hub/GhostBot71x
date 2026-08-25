const alldl = require("./alldl");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["ttdl", "tikdl"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    category: "media",
    shortDescription: "TikTok video downloader",
    guide: { en: "{pn} <TikTok link>" }
  },
  onStart: async function (context) {
    const url = context.args.find(value => /^https?:\/\//i.test(value));
    if (!url || !/tiktok\.com/i.test(url)) {
      return context.message.reply("📥 একটি valid TikTok link দিন।");
    }
    return alldl.onStart({ ...context, args: [url] });
  }
};