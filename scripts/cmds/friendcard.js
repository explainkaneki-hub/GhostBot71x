// Friend Circle Card — Ghost Net Edition (Fixed v2.2)
// .friend @mention1 @mention2 ... OR .friend uid1 uid2 uid3
// Supports 1 to 20+ friends in a single beautiful card
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

// ──────────── Bengali Font Setup ────────────
// Download করুন: https://fonts.google.com/noto/specimen/Noto+Sans+Bengali
// ফাইলটা রাখুন: fonts/NotoSansBengali-Regular.ttf
const FONT_PATH = path.join(__dirname, "fonts", "NotoSansBengali-Regular.ttf");
if (fs.existsSync(FONT_PATH)) {
  registerFont(FONT_PATH, { family: "NotoSansBengali" });
}
const MAIN_FONT = fs.existsSync(FONT_PATH) ? "NotoSansBengali" : "Arial";

// ──────────── Friendship Quotes ────────────
// Bengali quotes removed to avoid box rendering if font is missing
// Once you add the font file, Bengali will work fine
const QUOTES_ENGLISH = [
  "A real friend walks in when the rest of the world walks out.",
  "Friends are the family we choose for ourselves.",
  "Good friends make the bad times better and the best times unforgettable.",
  "A friend is someone who knows all your stories. A best friend helped you write them.",
  "Friendship is the golden thread that ties hearts together.",
  "True friends are never apart — maybe in distance, but never in heart.",
  "Life is better with true friends by your side.",
  "Friends make the journey worth taking.",
  "Friends don't let friends go through tough times alone.",
  "Ghost Net er bondhu ra shobar sera! 👻",
  "Eksonge hasa, eksonge thaka — etai amader bondhumo.",
  "Bondhu mane shudhu pashe thaka noy, mone thaka.",
  "Valo bondhu hole jibon ta sundor hoye jay.",
  "Shobcheye kothin shomoye pashe thakay prokrito bondhumo."
];

const QUOTES_BENGALI = [
  "ভালো বন্ধু হলো জীবনের সবচেয়ে বড় সম্পদ।",
  "বন্ধুত্ব হলো এমন একটা বন্ধন যা দূরত্ব ভুলিয়ে দেয়।",
  "তুমি কাছে না থাকলেও মনে থাকো সবসময়।",
  "ভালো বন্ধু পেলে জীবনটা সুন্দর হয়ে যায়।",
  "এই পৃথিবীতে তোমার মতো বন্ধু পেয়ে আমি ভাগ্যবান।",
  "বন্ধু মানে শুধু পাশে থাকা নয়, মনে থাকা।",
  "বন্ধুত্ব কোনো চুক্তি না, এটা হৃদয়ের টান।",
  "তোমার হাসি দেখলে আমিও হাসি — এটাই বন্ধুত্ব।",
  "Ghost Net এর বন্ধুরা সেরা বন্ধু! 👻",
  "একসাথে হাসা, একসাথে পড়া — এটাই আমাদের বন্ধুত্ব।",
  "সবচেয়ে কঠিন সময়ে পাশে থাকাই প্রকৃত বন্ধুত্ব।"
];

function randomQuote() {
  const hasBengaliFont = fs.existsSync(FONT_PATH);
  const pool = hasBengaliFont
    ? [...QUOTES_ENGLISH, ...QUOTES_BENGALI]
    : QUOTES_ENGLISH;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ──────────── Load avatar (FIXED) ────────────
async function loadAvatar(uid) {
  // Try multiple Facebook CDN endpoints
  const urls = [
    `https://graph.facebook.com/${uid}/picture?type=large&width=512&height=512`,
    `https://profile.ak.fbcdn.net/hprofile-ak-xpf1/${uid}_n.jpg`,
    `https://lookaside.fbsbx.com/platform/profilepic/?id=${uid}&width=512&height=512`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 8000,
        maxRedirects: 5,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.facebook.com/",
        },
      });
      // Check it's actually an image (not an HTML error page)
      const contentType = res.headers["content-type"] || "";
      if (!contentType.includes("image")) continue;
      if (res.data.byteLength < 500) continue; // too small = error response
      return await loadImage(Buffer.from(res.data));
    } catch {
      // try next url
    }
  }

  // Fallback: colored circle with initial letter or 👤
  return makeFallbackAvatar(uid);
}

async function makeFallbackAvatar(uid) {
  const c = createCanvas(200, 200);
  const x = c.getContext("2d");
  const colors = [
    "#FA8BFF","#2BD2FF","#2BFF88","#FFD700",
    "#FF6B6B","#a78bfa","#f97316","#ec4899",
  ];
  x.fillStyle = colors[parseInt(uid.slice(-1)) % colors.length] || "#2BD2FF";
  x.beginPath();
  x.arc(100, 100, 100, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = "rgba(0,0,0,0.25)";
  x.beginPath();
  x.arc(100, 80, 40, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(100, 160, 60, 0, Math.PI * 2);
  x.fill();
  return await loadImage(c.toBuffer());
}

// ──────────── Draw circular clipped image ────────────
function drawCircleAvatar(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// ──────────── Draw ring around circle ────────────
function drawRing(ctx, cx, cy, r, color1, color2) {
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

// ──────────── Wrap text (supports Bengali) ────────────
function wrapText(ctx, text, maxWidth) {
  // Split by spaces but keep emoji/Bengali word boundaries
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ──────────── Main card generator ────────────
async function buildFriendCard(ownerData, friendsData, ownerAvatar, friendAvatars) {
  const count = friendsData.length;

  const W = 1000;
  const avatarR =
    count <= 4 ? 58 : count <= 9 ? 48 : count <= 16 ? 40 : 34;
  const colCount =
    count <= 4 ? Math.min(count + 1, 5) : count <= 9 ? 4 : count <= 16 ? 5 : 6;
  const totalPeople = count + 1;
  const rows = Math.ceil(totalPeople / colCount);
  const avatarZoneH = rows * (avatarR * 2 + 60) + 40;
  const H = 130 + avatarZoneH + 120;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // ── Background ──
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f0c29");
  bg.addColorStop(0.5, "#302b63");
  bg.addColorStop(1, "#24243e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const dotColors = [
    "rgba(250,139,255,0.12)",
    "rgba(43,210,255,0.1)",
    "rgba(43,255,136,0.08)",
  ];
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * W,
      Math.random() * H,
      Math.random() * 60 + 20,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = dotColors[i % 3];
    ctx.fill();
  }

  // ── Title bar ──
  ctx.save();
  const titleGrad = ctx.createLinearGradient(0, 0, W, 0);
  titleGrad.addColorStop(0, "rgba(250,139,255,0.2)");
  titleGrad.addColorStop(0.5, "rgba(43,210,255,0.2)");
  titleGrad.addColorStop(1, "rgba(43,255,136,0.15)");
  ctx.fillStyle = titleGrad;
  ctx.roundRect(20, 16, W - 40, 80, 18);
  ctx.fill();
  ctx.restore();

  ctx.font = `bold 34px ${MAIN_FONT}, Arial`;
  ctx.textAlign = "center";
  const titleGrad2 = ctx.createLinearGradient(0, 16, W, 96);
  titleGrad2.addColorStop(0, "#FA8BFF");
  titleGrad2.addColorStop(0.5, "#2BD2FF");
  titleGrad2.addColorStop(1, "#2BFF88");
  ctx.fillStyle = titleGrad2;
  ctx.fillText("👥 Friend Circle", W / 2, 64);

  ctx.font = `bold 14px ${MAIN_FONT}, Arial`;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText("👻 Ghost Net Edition  •  Rakib Islam", W / 2, 86);

  // ── People grid ──
  const allPeople = [
    { data: ownerData, avatar: ownerAvatar, isOwner: true },
    ...friendsData.map((d, i) => ({
      data: d,
      avatar: friendAvatars[i],
      isOwner: false,
    })),
  ];

  const startY = 130;
  const cellH = avatarR * 2 + 62;
  const cellW = W / colCount;

  for (let i = 0; i < allPeople.length; i++) {
    const person = allPeople[i];
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const cx = cellW * col + cellW / 2;
    const cy = startY + row * cellH + avatarR + 10;

    const ringColors = [
      ["#FFD700", "#ff8c00"],
      ["#FA8BFF", "#2BD2FF"],
      ["#2BD2FF", "#2BFF88"],
      ["#2BFF88", "#FFD700"],
      ["#FF6B6B", "#FA8BFF"],
      ["#a78bfa", "#2BD2FF"],
      ["#f97316", "#FFD700"],
    ];
    const rc = person.isOwner
      ? ringColors[0]
      : ringColors[(i % (ringColors.length - 1)) + 1];

    ctx.save();
    ctx.shadowColor = rc[0];
    ctx.shadowBlur = 18;
    drawRing(ctx, cx, cy, avatarR, rc[0], rc[1]);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 10;
    drawCircleAvatar(ctx, person.avatar, cx, cy, avatarR);
    ctx.restore();

    if (person.isOwner) {
      ctx.font = `${Math.round(avatarR * 0.55)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("👑", cx, cy - avatarR + 4);
    }

    const name = (person.data?.name || "Unknown").slice(0, 14);
    const nameFontSize = Math.max(11, Math.min(16, Math.floor(avatarR * 0.34)));
    ctx.font = `bold ${nameFontSize}px ${MAIN_FONT}, Arial`;
    ctx.textAlign = "center";
    ctx.fillStyle = person.isOwner ? "#FFD700" : "#e8e8ff";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 6;
    ctx.fillText(name, cx, cy + avatarR + 18);
    ctx.shadowBlur = 0;

    if (person.isOwner) {
      ctx.font = `bold ${nameFontSize - 2}px ${MAIN_FONT}, Arial`;
      ctx.fillStyle = "#FA8BFF";
      ctx.fillText("(Owner)", cx, cy + avatarR + 34);
    }
  }

  // ── Quote section ──
  const quoteY = startY + rows * cellH + 18;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.strokeStyle = "rgba(43,210,255,0.3)";
  ctx.lineWidth = 1;
  ctx.roundRect(30, quoteY, W - 60, 80, 14);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const quote = randomQuote();
  ctx.font = `italic 16px ${MAIN_FONT}, Arial`;
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.textAlign = "center";
  const lines = wrapText(ctx, `❝ ${quote} ❞`, W - 100);
  const lineH = 24;
  const totalQuoteH = lines.length * lineH;
  const quoteStartY = quoteY + 40 - totalQuoteH / 2;
  for (let li = 0; li < lines.length; li++) {
    ctx.fillText(lines[li], W / 2, quoteStartY + li * lineH);
  }

  // ── Bottom bar ──
  const barY = quoteY + 86;
  ctx.font = `bold 13px ${MAIN_FONT}, Arial`;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "center";
  ctx.fillText(
    `👥 ${totalPeople} People  •  👻 Ghost Net Bot  •  Prefix: .`,
    W / 2,
    barY + 18
  );

  return canvas.toBuffer("image/jpeg", { quality: 0.96 });
}

module.exports = {
  config: {
    name: "friend",
    aliases: ["friendcard", "friendcircle", "fcircle", "fcard"],
    version: "2.2",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: { en: "👥 Friend Circle Card" },
    longDescription: { en: "Create a beautiful friendship card." },
    category: "utility",
    guide: { en: ".friend @mention" },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    await fs.ensureDir(CACHE);
    const uids = new Set();
    for (const uid of Object.keys(event.mentions || {})) uids.add(uid);
    for (const arg of args) {
      const cleaned = arg.replace(/[^0-9]/g, "");
      if (cleaned.length >= 10 && cleaned.length <= 20) uids.add(cleaned);
    }

    if (uids.size === 0)
      return message.reply("💡 @mention অথবা UID ব্যবহার করুন।");
    if (uids.size > 24) return message.reply("❌ সর্বোচ্চ ২৪ জন সম্ভব।");

    await message.reaction("⏳", event.messageID);

    try {
      const ownerUID = event.senderID;
      const ownerData = (await usersData.get(ownerUID)) || { name: "User" };
      const friendUIDs = [...uids];

      const friendsData = await Promise.all(
        friendUIDs.map(async (uid) => {
          return (await usersData.get(uid)) || { name: `User ${uid.slice(-4)}` };
        })
      );

      const [ownerAvatar, ...friendAvatars] = await Promise.all([
        loadAvatar(ownerUID),
        ...friendUIDs.map((uid) => loadAvatar(uid)),
      ]);

      const cardBuffer = await buildFriendCard(
        ownerData,
        friendsData,
        ownerAvatar,
        friendAvatars
      );
      const outPath = path.join(CACHE, `friend_${Date.now()}.jpg`);
      await fs.writeFile(outPath, cardBuffer);

      await message.reply({
        body: `👥 Friend Circle তৈরি হয়েছে!\n👑 Owner: ${ownerData.name}`,
        attachment: fs.createReadStream(outPath),
      });

      await message.reaction("✅", event.messageID);
      setTimeout(() => {
        try { fs.unlinkSync(outPath); } catch {}
      }, 30000);
    } catch (err) {
      console.error(err);
      message.reply("❌ সমস্যা হয়েছে: " + err.message);
    }
  },
};