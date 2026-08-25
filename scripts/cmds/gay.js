const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay",
    aliases: [],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Find out who's gay 😳",
    longDescription: "Add a gay filter to someone's avatar",
    category: "fun",
    guide: "{pn} @mention or reply",
  },

  onStart: async function ({ message, event, usersData }) {
    let uid;
    const mention = Object.keys(event.mentions);

    // UID নির্ধারণ (reply, mention বা self)
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (mention.length > 0) {
      uid = mention[0];
    } else {
      uid = event.senderID;
    }

    const url = await usersData.getAvatarUrl(uid);
    const img = await new DIG.Gay().getImage(url);
    const pathSave = `${__dirname}/tmp/gay.png`;

    fs.writeFileSync(pathSave, Buffer.from(img));

    let body = "🏳️‍🌈 Look... I found a gay!";
    if (!mention[0] && event.type !== "message_reply") {
      body = "😳 Baka! You’re gay!\n(You forgot to mention or reply someone)";
    }

    message.reply(
      {
        body,
        attachment: fs.createReadStream(pathSave),
      },
      () => fs.unlinkSync(pathSave)
    );
  },

  // 🟢 No Prefix Trigger — Admin exempt
  onChat: async function ({ api, event, message, usersData }) {
    if (!event.body) return;
    const text = event.body.toLowerCase().trim();
    if (!text.includes("gay")) return;

    // ── Bot admin exempt ──
    const botAdmins = global.GoatBot?.adminBot || [];
    if (botAdmins.includes(event.senderID)) return;

    // ── Group admin exempt ──
    if (event.isGroup) {
      try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const adminIDs = (threadInfo.adminIDs || []).map(a => a.uid);
        if (adminIDs.includes(event.senderID)) return;
      } catch {}
    }

    // ── Trigger ──
    let uid;
    const mention = Object.keys(event.mentions);

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (mention.length > 0) {
      uid = mention[0];
    } else {
      uid = event.senderID;
    }

    try {
      const url = await usersData.getAvatarUrl(uid);
      const img = await new DIG.Gay().getImage(url);
      const pathSave = `${__dirname}/tmp/gay${Date.now()}.png`;
      fs.writeFileSync(pathSave, Buffer.from(img));
      message.reply(
        {
          body: "🏳️‍🌈 Look... I found a gay! 😂",
          attachment: fs.createReadStream(pathSave),
        },
        () => { try { fs.unlinkSync(pathSave); } catch {} }
      );
    } catch {}
  },
};
