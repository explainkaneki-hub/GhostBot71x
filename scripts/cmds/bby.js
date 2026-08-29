// Dual-API Hybrid Simi/Baby Bot for GoatBot
// Author: Rakib Islam (ACS RAKIB)

const axios = require("axios");

// Primary API (Your API)
const MY_SIMI_API = process.env.SIMI_API_URL || "https://code-deploy--bd711.replit.app/api";

// Secondary API (Mahmud's Base API Fetcher)
const getMahmudBaseUrl = async () => {
  try {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
  } catch {
    return "";
  }
};

const triggerWords = [
  "baby", "bby", "babu", "bbu", "jan", "janu", "bot",
  "জান", "জানু", "বেবি", "wifey", "hina", "hinata", "বট", "সোনা", "sona"
];

// Hybrid Fetcher Logic
async function getHybridResponse(text, attachments = []) {
  if (!text && attachments.length === 0) return "";

  // Step 1: Check Your Custom API First
  try {
    const myRes = await axios.post(`${MY_SIMI_API}/simi/chat`, { text }, { timeout: 4000 });
    if (myRes.data && myRes.data.message) {
      return myRes.data.message;
    }
  } catch (e) {
    // If not found or error, fall through to Mahmud's API
  }

  // Step 2: Fallback to Mahmud's API if no taught reply in Primary
  try {
    const mahmudBase = await getMahmudBaseUrl();
    if (mahmudBase) {
      const mahmudRes = await axios.post(`${mahmudBase}/api/hinata`, { text, style: 3, attachments }, { timeout: 6000 });
      if (mahmudRes.data && mahmudRes.data.message) {
        return mahmudRes.data.message;
      }
    }
  } catch (e) {
    // Ignore fallback fail
  }

  return "";
}

module.exports.config = {
  name: "baby",
  aliases: ["bby", "bbu", "jan", "janu", "wifey", "bot", "hinata", "hina", "babu", "sona"],
  version: "3.2",
  author: "Rakib Islam",
  countDown: 0,
  role: 0,
  description: "Bangla-English Dual-API Hybrid Simi Chatbot. Only replies on explicit triggers or direct replies.",
  category: "chat",
  guide: {
    en:
      "--- [ BABY CHATBOT COMMANDS ] ---\n" +
      "• {pn} [message] — Chat directly with the bot.\n" +
      "• {pn} teach [question] - [reply1, reply2, ...] — Teach new replies.\n" +
      "• {pn} list — Show all taught questions/triggers.\n" +
      "• {pn} remove [question] - [index] — Remove a reply by index.\n" +
      "• {pn} edit [question] - [index] - [new reply] — Edit an existing reply.\n" +
      "• {pn} teachers — View top teachers leaderboard.\n\n" +
      "Note: Replies only when triggered by words or when you reply directly to its messages."
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const uid = event.senderID;
  const msg = args.join(" ").toLowerCase().trim();

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "I love you", "Type .bby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    // ── TEACH (Always saves to Your API) ──────────────────────────────────
    if (args[0] === "teach") {
      const rest = args.slice(1).join(" ");
      const dashIdx = rest.indexOf(" - ");
      if (dashIdx === -1)
        return api.sendMessage("❌ Format: bby teach [question] - [reply1, reply2, ...]", event.threadID, event.messageID);

      const trigger = rest.slice(0, dashIdx).trim();
      const responses = rest.slice(dashIdx + 3).trim();
      if (!trigger || !responses)
        return api.sendMessage("❌ Format: bby teach [question] - [reply1, reply2, ...]", event.threadID, event.messageID);

      const userName = (await usersData.getName(uid)) || "Unknown User";
      const res = await axios.post(`${MY_SIMI_API}/simi/teach`, {
        trigger,
        responses,
        userID: uid,
        userName
      }, { timeout: 8000 });

      return api.sendMessage(
        `✅ ${res.data.message}\n• 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: "${trigger}"\n• 𝗧𝗲𝗮𝗰𝗵𝗲𝗿: ${userName}\n• 𝗧𝗼𝘁𝗮𝗹: ${res.data.count || 0}`,
        event.threadID,
        event.messageID
      );
    }

    // ── LIST ──────────────────────────────────────────────────────────────
    if (args[0] === "list") {
      const trigger = args.slice(1).join(" ").trim();
      const url = trigger
        ? `${MY_SIMI_API}/simi/list?trigger=${encodeURIComponent(trigger)}`
        : `${MY_SIMI_API}/simi/list`;
      const res = await axios.get(url, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── TEACHERS ──────────────────────────────────────────────────────────
    if (args[0] === "teachers" || args[0] === "teacher") {
      const res = await axios.get(`${MY_SIMI_API}/simi/teachers`, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── REMOVE ────────────────────────────────────────────────────────────
    if (args[0] === "remove" || args[0] === "rm") {
      const rest = args.slice(1).join(" ");
      const dashIdx = rest.indexOf(" - ");
      if (dashIdx === -1)
        return api.sendMessage("❌ Format: bby remove [question] - [index]", event.threadID, event.messageID);

      const trigger = rest.slice(0, dashIdx).trim();
      const index = parseInt(rest.slice(dashIdx + 3).trim(), 10);
      if (!trigger || isNaN(index))
        return api.sendMessage("❌ Format: bby remove [question] - [index]", event.threadID, event.messageID);

      const res = await axios.delete(`${MY_SIMI_API}/simi/remove`, {
        data: { trigger, index },
        timeout: 8000
      });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── EDIT ──────────────────────────────────────────────────────────────
    if (args[0] === "edit") {
      const rest = args.slice(1).join(" ");
      const parts = rest.split(" - ");
      if (parts.length < 3)
        return api.sendMessage("❌ Format: bby edit [question] - [index] - [new reply]", event.threadID, event.messageID);

      const trigger = parts[0].trim();
      const index = parseInt(parts[1].trim(), 10);
      const newResponse = parts.slice(2).join(" - ").trim();
      if (!trigger || isNaN(index) || !newResponse)
        return api.sendMessage("❌ Format: bby edit [question] - [index] - [new reply]", event.threadID, event.messageID);

      const res = await axios.put(`${MY_SIMI_API}/simi/edit`, {
        trigger,
        index,
        newResponse
      }, { timeout: 8000 });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ── CHAT (Direct Command) ─────────────────────────────────────────────
    const botReply = await getHybridResponse(msg, event.attachments || []);
    if (!botReply) return;

    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: uid,
          text: botReply
        });
      }
    }, event.messageID);

  } catch (err) {
    console.error(err);
  }
};

// ── BOTS MESSAGE REPLY HANDLING (বটের মেসেজ টেনে রিপ্লাই করার অংশ) ──────
module.exports.onReply = async ({ api, event }) => {
  if (event.type !== "message_reply") return;
  try {
    const text = (event.body || "").toLowerCase().trim() || "hello";
    const botReply = await getHybridResponse(text, event.attachments || []);
    if (!botReply) return;

    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: botReply
        });
      }
    }, event.messageID);
  } catch (err) {
    console.error(err);
  }
};

// ── GC CHAT LISTENER (সাধারণ চ্যাট মনিটর করার অংশ) ────────────────────────
module.exports.onChat = async ({ api, event }) => {
  try {
    const message = (event.body || "").toLowerCase().trim();
    if (!message && (!event.attachments || event.attachments.length === 0)) return;

    // যদি কেউ বটের মেসেজে রিপ্লাই দেয়, তা onReply হ্যান্ডেল করবে, এখানে স্কিপ হবে
    if (event.type === "message_reply") return;

    // ট্রিগার দিয়ে মেসেজ শুরু হয়েছে কি না চেক
    const triggered = triggerWords.some((w) => message.startsWith(w));

    // 🛑 মূল পরিবর্তন: ট্রিগার ওয়ার্ড না থাকলে বট একেবারেই চুপ থাকবে (Return করে দিবে)
    if (!triggered) return;

    api.setMessageReaction("🪽", event.messageID, () => {}, true);

    // Prefix/Trigger অংশ কেটে শুধু আসল কথাটি বের করা
    let userText = message;
    for (const prefix of triggerWords) {
      if (message.startsWith(prefix)) {
        userText = message.slice(prefix.length).trim();
        break;
      }
    }

    // যদি শুধু Trigger শব্দটাই পাঠায় (যেমন: "baby", "bot", "sona")
    if (!userText && (!event.attachments || event.attachments.length === 0)) {
      const randomMsg = [
        "Bolo baby", "I love you", "ki bolba taratari bolo",
        "আমাকে ডাকলে, আমি কিন্তূ কিস করে দেবো😘", "বলো কি বলবা?🤭", "Eto na deke amar boss Rakib re ekta gf khuje de😾"
      ];
      const randReply = randomMsg[Math.floor(Math.random() * randomMsg.length)];
      return api.sendMessage(randReply, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            text: randReply
          });
        }
      }, event.messageID);
    }

    const botReply = await getHybridResponse(userText, event.attachments || []);
    if (!botReply) return;

    api.sendMessage(botReply, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: botReply
        });
      }
    }, event.messageID);
  } catch (err) {
    console.error(err);
  }
};