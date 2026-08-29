const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "spy",
  aliases: ["userinfo", "👀", "spyuser"],
  version: "2.1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  description: "ইউজারের সমস্ত ডিটেইলস নিয়ে সাইবারপাঙ্ক স্টাইলের ইমেজ কার্ড তৈরি করে।",
  category: "utility",
  guide: "{p}spy [mention / reply / UID / blank]"
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  // ১. ইউজার আইডি ডিটেক্ট করা
  let targetID = senderID;
  if (type === "message_reply" && messageReply) {
    targetID = messageReply.senderID;
  } else if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (args[0] && !isNaN(args[0])) {
    targetID = args[0].trim();
  }

  let loadingMsg;
  try {
    loadingMsg = await api.sendMessage("🔍 Scanning network... Generating Cyberpunk Intel Card...", threadID, messageID);
  } catch (e) {}

  try {
    // ২. ইউজার ডাটা সেফলি ফেচ করা
    let name = "Unknown Operative";
    let gender = "Non-Binary";
    let profileUrl = `https://facebook.com/${targetID}`;

    try {
      const userInfo = await api.getUserInfo(targetID);
      if (userInfo && userInfo[targetID]) {
        const userData = userInfo[targetID];
        name = userData.name || name;
        gender = userData.gender === 2 ? "Male" : userData.gender === 1 ? "Female" : gender;
        profileUrl = userData.profileUrl || profileUrl;
      }
    } catch (err) {
      console.log("UserInfo fetch error, using default fallback.");
    }

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc154284ec5d72581985f80b2a3d08595`;

    // ৩. ক্যানভাস ব্যাকগ্রাউন্ড ও সাইজ সেটআপ
    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");

    // Cyberpunk Dark Background
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Lines (Cyberpunk Aesthetic)
    ctx.strokeStyle = "rgba(0, 243, 255, 0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Outer Cyber Neon Border
    ctx.strokeStyle = "#00f3ff";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Corner Decorators (Tech Cut Corner Effect)
    ctx.fillStyle = "#ff0055";
    ctx.fillRect(15, 15, 20, 5);
    ctx.fillRect(15, 15, 5, 20);
    ctx.fillRect(canvas.width - 35, canvas.height - 20, 20, 5);
    ctx.fillRect(canvas.width - 20, canvas.height - 35, 5, 20);

    // Header Title
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#ff0055";
    ctx.fillText("SYSTEM // TARGET INTEL REPORT", 320, 75);

    // Profile Picture Frame & Avatar Loading
    try {
      const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatarImg = await loadImage(Buffer.from(response.data, "binary"));
      
      // Neon Glow Frame for Avatar
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 100, 220, 220);

      ctx.drawImage(avatarImg, 50, 100, 220, 220);
    } catch (e) {
      // Fallback Box
      ctx.fillStyle = "#161625";
      ctx.fillRect(50, 100, 220, 220);
      ctx.fillStyle = "#ff0055";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("NO AVATAR", 100, 210);
    }

    // Status Badge
    ctx.fillStyle = "#00f3ff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("STATUS: SUBJECT TRACKED", 50, 355);

    // Details Data (Intel Fields)
    const displayUrl = profileUrl.length > 30 ? profileUrl.substring(0, 30) + "..." : profileUrl;
    const fields = [
      { label: "SUBJECT NAME", value: name, color: "#ffffff" },
      { label: "TARGET UID", value: targetID, color: "#00f3ff" },
      { label: "GENDER IDENTITY", value: gender, color: "#ff0055" },
      { label: "CLEARANCE LEVEL", value: "LEVEL-3 OPERATIVE", color: "#ffe600" },
      { label: "NETWORK LOCATOR", value: displayUrl, color: "#00f3ff" }
    ];

    let startY = 135;
    fields.forEach((field) => {
      // Label
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(field.label, 320, startY);

      // Value Text
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = field.color;
      ctx.fillText(field.value, 320, startY + 24);

      // Separator Line
      ctx.strokeStyle = "rgba(0, 243, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(320, startY + 34);
      ctx.lineTo(930, startY + 34);
      ctx.stroke();

      startY += 62;
    });

    // Footer Watermark
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(0, 243, 255, 0.6)";
    ctx.fillText("ACS RAKIB INTEGRATED SYSTEMS // GHOST-NET INTEL V2.0", 320, 450);

    // ৪. ফাইল সেভ ও সেন্ড করা
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const cachePath = path.join(cacheDir, `spy_${targetID}_${Date.now()}.png`);
    
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(cachePath, buffer);

    if (loadingMsg && loadingMsg.messageID) {
      api.unsendMessage(loadingMsg.messageID);
    }

    return api.sendMessage(
      {
        body: `🚨 **[ SPY REPORT GENERATED ]**\n👤 **Subject:** ${name}\n🆔 **UID:** ${targetID}`,
        attachment: fs.createReadStream(cachePath)
      },
      threadID,
      () => {
        setTimeout(() => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }, 3000);
      },
      messageID
    );

  } catch (error) {
    console.error("SPY COMMAND ERROR:", error);
    if (loadingMsg && loadingMsg.messageID) {
      api.unsendMessage(loadingMsg.messageID);
    }
    return api.sendMessage("❌ ইউজারের সাইবারপাঙ্ক ইনফো কার্ড তৈরি করতে ব্যর্থ হয়েছে!", threadID, messageID);
  }
};