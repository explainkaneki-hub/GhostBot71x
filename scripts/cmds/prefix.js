const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");
const { utils } = global;

function rounded(ctx, x, y, width, height, radius, fill = true, stroke = false) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
}

function drawPrefixCard(globalPfx, threadPfx) {
        const width = 1200;
        const height = 560;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        const colors = ["#00e5ff", "#ff2bd6", "#8b5cf6", "#ffb000", "#00ff9d"];

        const background = ctx.createLinearGradient(0, 0, width, height);
        background.addColorStop(0, "#050613");
        background.addColorStop(0.48, "#16092b");
        background.addColorStop(1, "#030b1d");
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 42; i++) {
                const color = colors[i % colors.length];
                ctx.fillStyle = `${color}55`;
                ctx.shadowColor = color;
                ctx.shadowBlur = 14;
                ctx.fillRect((i * 97) % width, (i * 53) % height, 3, 3);
        }
        ctx.shadowBlur = 0;

        const sweep = ctx.createLinearGradient(0, 0, width, 0);
        sweep.addColorStop(0, "#00e5ff");
        sweep.addColorStop(0.25, "#ff2bd6");
        sweep.addColorStop(0.5, "#8b5cf6");
        sweep.addColorStop(0.75, "#ffb000");
        sweep.addColorStop(1, "#00ff9d");
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, width, 9);
        ctx.fillRect(0, height - 9, width, 9);

        ctx.fillStyle = "rgba(5, 5, 24, 0.88)";
        rounded(ctx, 46, 38, width - 92, height - 76, 30, true, false);
        ctx.strokeStyle = "#ff2bd6";
        ctx.shadowColor = "#00e5ff";
        ctx.shadowBlur = 28;
        ctx.lineWidth = 3;
        rounded(ctx, 46, 38, width - 92, height - 76, 30, false, true);
        ctx.shadowBlur = 0;

        ctx.textAlign = "left";
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 19px monospace";
        ctx.fillText("GHOST NET // COMMAND CONTROL", 88, 92);
        ctx.textAlign = "right";
        ctx.fillStyle = "#00ff9d";
        ctx.font = "bold 16px monospace";
        ctx.fillText("● ONLINE  •  PREFIX LINKED", width - 88, 92);

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ff2bd6";
        ctx.shadowBlur = 20;
        ctx.font = "bold 52px Arial";
        ctx.fillText("PREFIX", width / 2, 168);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#bda7ff";
        ctx.font = "17px monospace";
        ctx.fillText("Your command gateway is ready", width / 2, 202);

        const cards = [
                { x: 88, color: "#00e5ff", label: "SYSTEM PREFIX", value: globalPfx },
                { x: 420, color: "#ff2bd6", label: "THIS GROUP", value: threadPfx },
                { x: 752, color: "#ffb000", label: "COMMAND FORMAT", value: `${threadPfx}help` }
        ];
        for (const card of cards) {
                ctx.fillStyle = "rgba(16, 18, 44, 0.94)";
                rounded(ctx, card.x, 250, 300, 142, 18, true, false);
                ctx.strokeStyle = card.color;
                ctx.shadowColor = card.color;
                ctx.shadowBlur = 16;
                ctx.lineWidth = 2;
                rounded(ctx, card.x, 250, 300, 142, 18, false, true);
                ctx.shadowBlur = 0;
                ctx.textAlign = "left";
                ctx.fillStyle = `${card.color}`;
                ctx.font = "bold 14px monospace";
                ctx.fillText(card.label, card.x + 24, 286);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 32px monospace";
                ctx.fillText(String(card.value).slice(0, 18), card.x + 24, 345);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#d8d5ef";
        ctx.font = "16px monospace";
        ctx.fillText("Type the prefix before any command  •  Example:  " + threadPfx + "spy", width / 2, 455);
        ctx.fillStyle = "#ff79dc";
        ctx.font = "bold 16px monospace";
        ctx.fillText("GHOST BOT  •  MULTI-COLOUR COMMAND NETWORK", width / 2, 500);
        return canvas;
}

module.exports = {
        config: {
                name: "prefix",
                version: "1.4",
                author: "Rakib Islam",
                countDown: 5,
                role: 0,
                description: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
                category: "config",
                guide: {
                        vi: "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn"
                                + "\n   Ví dụ:"
                                + "\n    {pn} #"
                                + "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
                                + "\n   Ví dụ:"
                                + "\n    {pn} # -g"
                                + "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
                        en: "   {pn} <new prefix>: change new prefix in your box chat"
                                + "\n   Example:"
                                + "\n    {pn} #"
                                + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
                                + "\n   Example:"
                                + "\n    {pn} # -g"
                                + "\n\n   {pn} reset: change prefix in your box chat to default"
                }
        },

        langs: {
                vi: {
                        reset: "Đã reset prefix của bạn về mặc định: %1",
                        onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
                        confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
                        confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
                        successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
                        successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
                        myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2"
                },
                en: {
                        reset: "Your prefix has been reset to default: %1",
                        onlyAdmin: "Only admin can change prefix of system bot",
                        confirmGlobal: "Please react to this message to confirm change prefix of system bot",
                        confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
                        successGlobal: "Changed prefix of system bot to: %1",
                        successThisThread: "Changed prefix in your box chat to: %1",
                        myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
                }
        },

        onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
                if (!args[0])
                        return message.SyntaxError();

                if (args[0] == 'reset') {
                        await threadsData.set(event.threadID, null, "data.prefix");
                        return message.reply(getLang("reset", global.GoatBot.config.prefix));
                }

                const newPrefix = args[0];
                const formSet = {
                        commandName,
                        author: event.senderID,
                        newPrefix
                };

                if (args[1] === "-g")
                        if (role < 2)
                                return message.reply(getLang("onlyAdmin"));
                        else
                                formSet.setGlobal = true;
                else
                        formSet.setGlobal = false;

                return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
                        formSet.messageID = info.messageID;
                        global.GoatBot.onReaction.set(info.messageID, formSet);
                });
        },

        onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
                const { author, newPrefix, setGlobal } = Reaction;
                if (event.userID !== author)
                        return;
                if (setGlobal) {
                        global.GoatBot.config.prefix = newPrefix;
                        fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
                        return message.reply(getLang("successGlobal", newPrefix));
                }
                else {
                        await threadsData.set(event.threadID, newPrefix, "data.prefix");
                        return message.reply(getLang("successThisThread", newPrefix));
                }
        },

        onChat: async function ({ event, message, getLang }) {
                if (event.body && event.body.toLowerCase() === "prefix") {
                        const globalPfx = global.GoatBot.config.prefix;
                        const threadPfx = utils.getPrefix(event.threadID);
                        const cacheDir = path.join(__dirname, "cache");
                        const safeThreadID = String(event.threadID).replace(/[^a-z0-9_-]/gi, "_");
                        const imagePath = path.join(cacheDir, `prefix_${safeThreadID}_${Date.now()}.png`);
                        await fs.ensureDir(cacheDir);
                        const image = drawPrefixCard(globalPfx, threadPfx);
                        await fs.writeFile(imagePath, image.toBuffer("image/png"));
                        return message.reply(
                                {
                                        body: `👻 Prefix: ${threadPfx}\nTry: ${threadPfx}help`,
                                        attachment: fs.createReadStream(imagePath)
                                },
                                () => fs.remove(imagePath).catch(() => {})
                        );
                }
        }
};