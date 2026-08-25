module.exports = {
        config: {
                name: "botstatus",
                aliases: ["status", "stats"],
                version: "1.0.0",
                author: "Rakib",
                countDown: 5,
                role: 0,
                description: {
                        en: "Show bot live status, uptime, RAM & ping"
                },
                category: "system",
                guide: {
                        en: "{pn}\n{pn} ping"
                }
        },

        onStart: async function ({ message, event, usersData, threadsData }) {
                message.reaction("⏳", event.messageID);
                const os = require("os");
                const https = require("https");
                const http = require("http");
                const fmtBytes = b => {
                        const u = ["B", "KB", "MB", "GB"];
                        let i = 0;
                        while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
                        return `${b.toFixed(2)} ${u[i]}`;
                };
                const fmtUptime = s => {
                        const d = Math.floor(s / 86400);
                        const h = Math.floor((s % 86400) / 3600);
                        const m = Math.floor((s % 3600) / 60);
                        const sec = Math.floor(s % 60);
                        return `${d}d ${h}h ${m}m ${sec}s`;
                };
                const pingUrl = url => new Promise(resolve => {
                        const start = Date.now();
                        const lib = url.startsWith("https") ? https : http;
                        const req = lib.get(url, { timeout: 8000 }, res => {
                                res.on("data", () => {});
                                res.on("end", () => resolve({ ok: true, ms: Date.now() - start, code: res.statusCode }));
                        });
                        req.on("error", () => resolve({ ok: false, ms: Date.now() - start }));
                        req.on("timeout", () => { req.destroy(); resolve({ ok: false, ms: 8000, timeout: true }); });
                });
                const uptime = process.uptime();
                const sysUptime = os.uptime();
                const mem = process.memoryUsage();
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const cpus = os.cpus();
                const cpuModel = cpus[0]?.model?.trim() || "Unknown CPU";
                const cores = cpus.length;
                const platform = `${os.type()} ${os.arch()}`;
                const node = process.version;
                let renderPing = "N/A";
                const renderUrl = process.env.RENDER_URL || process.env.RENDER_EXTERNAL_URL;
                if (renderUrl) {
                        const p = await pingUrl(renderUrl.replace(/\/$/, "") + "/health");
                        renderPing = p.ok ? `${p.ms}ms (${p.code})` : (p.timeout ? "timeout" : "offline");
                }
                let totalUsers = 0, totalThreads = 0;
                try { totalUsers = (await usersData.getAll()).length; } catch {}
                try { totalThreads = (await threadsData.getAll()).length; } catch {}
                const totalCmds = global.GoatBot?.commands?.size || 0;
                const totalEvents = global.GoatBot?.eventCommands?.size || 0;
                const onReply = global.GoatBot?.onReply?.size || 0;
                const onReaction = global.GoatBot?.onReaction?.size || 0;
                // FCA info
                let activeFca = "fca1", fcaName = "Unknown", fcaAntiban = "?";
                try {
                        const _path = require("path");
                        const _fs = require("fs");
                        const activeFile = _path.join(process.cwd(), "fca-modules", "active.json");
                        activeFca = JSON.parse(_fs.readFileSync(activeFile, "utf8")).active || "fca1";
                        const infoFile = _path.join(process.cwd(), "fca-modules", activeFca, "info.json");
                        const info = JSON.parse(_fs.readFileSync(infoFile, "utf8"));
                        fcaName = info.name || activeFca;
                        fcaAntiban = info.antiban || "?";
                } catch {}
                const msg = `╔═══〘 👻 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 〙═══╗

⚡ 𝗦𝘁𝗮𝘁𝘂𝘀: 🟢 ONLINE
🌀 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${fmtUptime(uptime)}
🖥️ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝗽𝘁𝗶𝗺𝗲: ${fmtUptime(sysUptime)}

╭─❍ 𝗠𝗲𝗺𝗼𝗿𝘆
│ • Bot RAM: ${fmtBytes(mem.rss)}
│ • Heap Used: ${fmtBytes(mem.heapUsed)} / ${fmtBytes(mem.heapTotal)}
│ • System: ${fmtBytes(usedMem)} / ${fmtBytes(totalMem)}
╰─────────

╭─❍ 𝗛𝗼𝘀𝘁
│ • Platform: ${platform}
│ • CPU: ${cpuModel}
│ • Cores: ${cores}
│ • Node: ${node}
╰─────────

╭─❍ 𝗥𝗲𝗻𝗱𝗲𝗿
│ • URL: ${renderUrl ? "configured" : "not set"}
│ • Health Ping: ${renderPing}
╰─────────

╭─❍ 𝗗𝗮𝘁𝗮
│ • Users: ${totalUsers}
│ • Threads: ${totalThreads}
│ • Commands: ${totalCmds}
│ • Events: ${totalEvents}
│ • onReply: ${onReply} | onReaction: ${onReaction}
╰─────────

╭─❍ 𝗙𝗖𝗔 𝗠𝗼𝗱𝘂𝗹𝗲
│ • Active: ${activeFca}
│ • Name: ${fcaName}
│ • Anti-ban: ${fcaAntiban}
╰─────────

👑 Owner: Rakib 🫶
🆔 UID: 61575436812912
╚════════════════════════╝`;
                message.reaction("✅", event.messageID);
                return message.reply(msg);
        }
};