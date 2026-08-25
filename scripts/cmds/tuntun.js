const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "tuntun",
                version: "1.7",
                author: "Rakib Islam",
                role: 1,
                category: "fun",
                cooldown: 10,
                guide: {
                        en: "{pn} [mention/reply/UID]",
                        bn: "{pn} [মেনশন/রিপ্লাই/UID]",
                        vi: "{pn} [mention/reply/UID]"
                }
        },

        langs: {
                bn: {
                        noTarget: "• বেবি, কাকে tuntun বানাবে? মেনশন, রিপ্লাই বা UID দাও",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Effect tuntun successful"
                },
                en: {
                        noTarget: "• Baby, mention, reply, or provide UID of the target",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Effect tuntun successful"
                },
                vi: {
                        noTarget: "• Cưng ơi, hãy đề cập, phản hồi hoặc cung cấp UID",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Hiệu ứng tuntun thành công"
                }
        },

        onStart: async function ({ api, event, args, getLang }) {
    // 18+ Whitelist check
    const _wlFile = require("path").join(process.cwd(), "data/whitelist18.json");
    let _wlData = {}; try { _wlData = require("fs-extra").readJsonSync(_wlFile); } catch {}
    const _isWhitelisted = (_wlData[event.threadID] || []).includes(event.senderID);
    const _botAdmins = (global.GoatBot?.config?.adminBot || ["61575436812912"]);
    const _isAdmin = _botAdmins.includes(event.senderID);
    if (!_isAdmin && !_isWhitelisted) {
      return message.reply("🔞 এই command টি শুধুমাত্র admin এবং whitelisted users ব্যবহার করতে পারবে!\nAdmin whitelist করতে: .whitelist18 add @mention");
    }


                const { threadID, messageID, messageReply, mentions } = event;
                let id2 = messageReply?.senderID || Object.keys(mentions)[0] || args[0];

                if (!id2) return api.sendMessage(getLang("noTarget"), threadID, messageID);

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                const filePath = path.join(cacheDir, `clown_${id2}_${Date.now()}.png`);

                try {
                        api.setMessageReaction("⏳", messageID, () => { }, true);

                        const apiUrl = await baseApiUrl();
                        const url = `${apiUrl}/api/dig?type=tuntun&user=${id2}`;

                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        api.sendMessage({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, threadID, (err) => {
                                if (!err) {
                                        api.setMessageReaction("🪽", messageID, () => { }, true);
                                }
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        }, messageID);

                } catch (err) {
                        api.setMessageReaction("❌", messageID, () => { }, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        api.sendMessage(getLang("error", err.message || "API Error"), threadID, messageID);
                }
        }
};
