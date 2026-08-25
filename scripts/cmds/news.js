const axios = require("axios");

module.exports = {
  config: {
    name: "news",
    aliases: ["খবর", "headline"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Latest news headlines",
    category: "utility",
    guide: { en: "{p}news — Get latest news\n{p}news <topic> — Search news" }
  },

  onStart: async function ({ message, args }) {
    const topic = args.join(" ").trim() || "Bangladesh";
    try {
      await message.reply(`👻 Fetching news about: "${topic}"...`);

      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&country=bd&max=5&apikey=free`,
        { timeout: 10000 }
      ).catch(() => null);

      let newsText = "";

      if (res?.data?.articles?.length) {
        newsText = res.data.articles.slice(0, 5).map((a, i) =>
          `${i + 1}. ${a.title}\n   🔗 ${a.url}`
        ).join("\n\n");
      } else {
        // Fallback: use RSS-to-JSON
        const rss = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/world/rss.xml&count=5`,
          { timeout: 10000 }
        );
        if (rss.data?.items) {
          newsText = rss.data.items.slice(0, 5).map((a, i) =>
            `${i + 1}. ${a.title}\n   📅 ${a.pubDate?.split("T")[0]}`
          ).join("\n\n");
        }
      }

      if (!newsText) return message.reply("❌ No news found. Try again!");

      await message.reply(
        `👻 𝗟𝗔𝗧𝗘𝗦𝗧 𝗡𝗘𝗪𝗦\n━━━━━━━━━━━━━━━━\n${newsText}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply("❌ News fetch failed. Try again!");
    }
  }
};
