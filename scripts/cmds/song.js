const fs = require("fs-extra");
const path = require("path");
const ytSearch = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  config: {
    name: "song",
    aliases: ["music", "sing"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: "YouTube song downloader",
    guide: { en: "{pn} <song name or YouTube link>" }
  },

  onStart: async function ({ args, event, message, api }) {
    const query = args.join(" ").trim();
    if (!query) return message.reply("🎵 Song name বা YouTube link দিন।");
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `song_${event.senderID}_${Date.now()}.mp3`);
    let video;

    try {
      await fs.ensureDir(cacheDir);
      video = ytdl.validateURL(query)
        ? { url: query, title: "YouTube song", timestamp: "" }
        : (await ytSearch(query)).videos[0];
      if (!video?.url) throw new Error("Song পাওয়া যায়নি");
      if (video.seconds && video.seconds > 600) {
        return message.reply("❌ ১০ মিনিটের বেশি song download করা যাবে না।");
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      await message.reply(`🎧 Downloading: ${video.title || "song"}`);
      await new Promise((resolve, reject) => {
        const stream = ytdl(video.url, {
          quality: "highestaudio",
          filter: "audioonly",
          highWaterMark: 1 << 25
        });
        ffmpeg(stream)
          .audioCodec("libmp3lame")
          .audioBitrate(128)
          .format("mp3")
          .on("end", resolve)
          .on("error", reject)
          .save(filePath);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      return message.reply(
        { body: `🎵 ${video.title || "Song"}\n✅ Download complete`, attachment: fs.createReadStream(filePath) },
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      await fs.remove(filePath).catch(() => {});
      return message.reply(`❌ Song download failed: ${error.message || "YouTube blocked the request"}`);
    }
  }
};