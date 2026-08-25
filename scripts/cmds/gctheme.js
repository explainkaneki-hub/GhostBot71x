// GC Theme + Reaction Changer — Fixed v2 — Rakib Islam / Ghost Net Edition
// Uses valid Facebook thread color IDs only

// Valid Facebook Messenger thread colors (hex IDs Facebook actually accepts)
const FB_COLORS = {
  blue:     "#0084ff",
  teal:     "#44bec7",
  yellow:   "#ffc300",
  red:      "#fa3c4c",
  pink:     "#d696bb",
  indigo:   "#6699cc",
  green:    "#13cf13",
  orange:   "#ff7e29",
  salmon:   "#e68585",
  purple:   "#7646ff",
  aqua:     "#20cef5",
  lime:     "#67b868",
  beige:    "#d4a88c",
  hotpink:  "#ff5ca1",
  lavender: "#a695c7",
};

const THEMES = {
  "🎌 ANIME": [
    { name: "Naruto",       color: FB_COLORS.orange,  emoji: "🍥", desc: "Naruto Uzumaki vibes" },
    { name: "Demon Slayer", color: FB_COLORS.red,      emoji: "🗡️", desc: "Tanjiro's red fire" },
    { name: "One Piece",    color: FB_COLORS.blue,     emoji: "⚓", desc: "Pirates of the grand sea" },
    { name: "Dragon Ball",  color: FB_COLORS.yellow,   emoji: "⚡", desc: "Super Saiyan power" },
    { name: "Tokyo Ghoul",  color: FB_COLORS.red,      emoji: "👁️", desc: "Kaneki's dark world" },
    { name: "AOT",          color: FB_COLORS.indigo,   emoji: "⚔️", desc: "Attack on Titan — beyond the walls" },
    { name: "MHA",          color: FB_COLORS.green,    emoji: "💚", desc: "My Hero Academia — Plus Ultra!" },
    { name: "Bleach",       color: FB_COLORS.indigo,   emoji: "☠️", desc: "Soul Reaper power" },
    { name: "Death Note",   color: FB_COLORS.indigo,   emoji: "📓", desc: "Kira's twisted justice" },
    { name: "JJK",          color: FB_COLORS.purple,   emoji: "🔮", desc: "Jujutsu Kaisen cursed energy" },
    { name: "Re:Zero",      color: FB_COLORS.aqua,     emoji: "💎", desc: "Return by death" },
    { name: "Fairy Tail",   color: FB_COLORS.red,      emoji: "✨", desc: "Magic never dies" },
    { name: "SAO",          color: FB_COLORS.blue,     emoji: "🗡️", desc: "Sword Art Online" },
    { name: "HxH",          color: FB_COLORS.lime,     emoji: "🃏", desc: "Hunter x Hunter — Killua vibes" },
    { name: "Black Clover", color: FB_COLORS.indigo,   emoji: "🍀", desc: "Magic Knight vibes" },
    { name: "Naruto Shippuden", color: FB_COLORS.orange, emoji: "🍥", desc: "Shippuden era power" },
    { name: "FMA",          color: FB_COLORS.orange,   emoji: "⚗️", desc: "Fullmetal alchemist" },
    { name: "Overlord",     color: FB_COLORS.purple,   emoji: "💀", desc: "Ainz Ooal Gown" },
    { name: "Rezero",       color: FB_COLORS.aqua,     emoji: "❄️", desc: "Emilia & Rem" },
    { name: "Vinland",      color: FB_COLORS.teal,     emoji: "⚔️", desc: "Viking spirit" },
  ],

  "⚽ SPORTS": [
    { name: "Football",    color: FB_COLORS.green,   emoji: "⚽", desc: "The beautiful game" },
    { name: "Cricket",     color: FB_COLORS.yellow,  emoji: "🏏", desc: "Cricket fever" },
    { name: "Basketball",  color: FB_COLORS.orange,  emoji: "🏀", desc: "NBA court vibes" },
    { name: "Tennis",      color: FB_COLORS.yellow,  emoji: "🎾", desc: "Ace on the court!" },
    { name: "Swimming",    color: FB_COLORS.blue,    emoji: "🏊", desc: "Pool vibes" },
    { name: "Boxing",      color: FB_COLORS.red,     emoji: "🥊", desc: "Fight night energy" },
    { name: "Racing",      color: FB_COLORS.red,     emoji: "🏎️", desc: "Full throttle speed" },
    { name: "Badminton",   color: FB_COLORS.teal,    emoji: "🏸", desc: "Shuttle speed" },
    { name: "Wrestling",   color: FB_COLORS.red,     emoji: "🤼", desc: "Ring of glory" },
    { name: "Chess",       color: FB_COLORS.beige,   emoji: "♟️", desc: "Checkmate vibes" },
  ],

  "🌿 NATURE": [
    { name: "Forest",      color: FB_COLORS.lime,    emoji: "🌲", desc: "Deep in the woods" },
    { name: "Ocean",       color: FB_COLORS.blue,    emoji: "🌊", desc: "Deep blue sea" },
    { name: "Sunset",      color: FB_COLORS.orange,  emoji: "🌅", desc: "Golden hour magic" },
    { name: "Desert",      color: FB_COLORS.beige,   emoji: "🏜️", desc: "Scorching hot sands" },
    { name: "Snow",        color: FB_COLORS.aqua,    emoji: "❄️", desc: "Winter wonderland" },
    { name: "Volcano",     color: FB_COLORS.red,     emoji: "🌋", desc: "Lava hot power" },
    { name: "Rose Garden", color: FB_COLORS.pink,    emoji: "🌹", desc: "Blooming roses" },
    { name: "Night Sky",   color: FB_COLORS.indigo,  emoji: "🌌", desc: "Stars above us" },
    { name: "Autumn",      color: FB_COLORS.orange,  emoji: "🍂", desc: "Fall season vibes" },
    { name: "Waterfall",   color: FB_COLORS.blue,    emoji: "💦", desc: "Cascading waters" },
    { name: "Sakura",      color: FB_COLORS.pink,    emoji: "🌸", desc: "Cherry blossom season" },
    { name: "Jungle",      color: FB_COLORS.lime,    emoji: "🦜", desc: "Wild and free" },
    { name: "Arctic",      color: FB_COLORS.aqua,    emoji: "🐧", desc: "Frozen tundra" },
  ],

  "🎉 FESTIVAL": [
    { name: "Eid",              color: FB_COLORS.yellow,  emoji: "🕌", desc: "Eid Mubarak!" },
    { name: "Christmas",        color: FB_COLORS.red,     emoji: "🎄", desc: "Merry Christmas!" },
    { name: "Halloween",        color: FB_COLORS.orange,  emoji: "🎃", desc: "Spooky season vibes" },
    { name: "Valentine",        color: FB_COLORS.hotpink, emoji: "💝", desc: "Love is in the air" },
    { name: "New Year",         color: FB_COLORS.yellow,  emoji: "🎆", desc: "Happy New Year!" },
    { name: "Puja",             color: FB_COLORS.orange,  emoji: "🪔", desc: "Festival of lights" },
    { name: "Holi",             color: FB_COLORS.purple,  emoji: "🎨", desc: "Colors of joy" },
    { name: "Birthday",         color: FB_COLORS.hotpink, emoji: "🎂", desc: "Happy Birthday!" },
    { name: "Ramadan",          color: FB_COLORS.purple,  emoji: "🌙", desc: "Holy month blessings" },
    { name: "Pahela Baishakh",  color: FB_COLORS.red,     emoji: "🎊", desc: "Shuvo Nababarsha!" },
  ],

  "😎 VIBE": [
    { name: "Chill",      color: FB_COLORS.purple,  emoji: "😌", desc: "Full relax mode" },
    { name: "Romantic",   color: FB_COLORS.red,     emoji: "💕", desc: "Love vibes activated" },
    { name: "Dark",       color: FB_COLORS.indigo,  emoji: "🌑", desc: "Dark mode ON" },
    { name: "Happy",      color: FB_COLORS.yellow,  emoji: "😊", desc: "Good vibes only" },
    { name: "Sad",        color: FB_COLORS.blue,    emoji: "💙", desc: "Feeling blue" },
    { name: "Angry",      color: FB_COLORS.red,     emoji: "😡", desc: "Rage activated" },
    { name: "Cool",       color: FB_COLORS.aqua,    emoji: "😎", desc: "Ice cold attitude" },
    { name: "Cozy",       color: FB_COLORS.beige,   emoji: "☕", desc: "Coffee + comfort" },
    { name: "Aesthetic",  color: FB_COLORS.lavender,emoji: "🌙", desc: "Soft aesthetic vibes" },
    { name: "Toxic",      color: FB_COLORS.lime,    emoji: "☢️", desc: "Radioactive chaos" },
    { name: "Royal",      color: FB_COLORS.purple,  emoji: "👑", desc: "King/Queen status" },
    { name: "Midnight",   color: FB_COLORS.indigo,  emoji: "🌙", desc: "2AM thoughts" },
  ],

  "🇧🇩 DESI": [
    { name: "Bangladesh",  color: FB_COLORS.green,   emoji: "🇧🇩", desc: "জয় বাংলা!" },
    { name: "Dhaka",       color: FB_COLORS.teal,    emoji: "🏙️", desc: "রাজধানীর রাজত্ব" },
    { name: "Chittagong",  color: FB_COLORS.blue,    emoji: "🌊", desc: "বন্দর নগরী" },
    { name: "Sylhet",      color: FB_COLORS.lime,    emoji: "🍃", desc: "চা বাগান" },
    { name: "Padma",       color: FB_COLORS.blue,    emoji: "🌊", desc: "পদ্মার ঢেউ" },
    { name: "Rickshaw",    color: FB_COLORS.red,     emoji: "🛺", desc: "রিকশা vibes" },
    { name: "Ilish",       color: FB_COLORS.aqua,    emoji: "🐟", desc: "ইলিশ মাছ জিন্দাবাদ" },
    { name: "Biryani",     color: FB_COLORS.orange,  emoji: "🍛", desc: "বিরিয়ানি gang" },
    { name: "Sundarbans",  color: FB_COLORS.lime,    emoji: "🌿", desc: "বাঘের দেশ" },
    { name: "Cox Bazar",   color: FB_COLORS.teal,    emoji: "🏖️", desc: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত" },
  ],

  "🚀 SCI-FI": [
    { name: "Cyberpunk",   color: FB_COLORS.aqua,    emoji: "🌐", desc: "Night City 2077" },
    { name: "Galaxy",      color: FB_COLORS.purple,  emoji: "🌌", desc: "Infinite cosmos" },
    { name: "Matrix",      color: FB_COLORS.lime,    emoji: "💾", desc: "Red pill or blue?" },
    { name: "Space",       color: FB_COLORS.indigo,  emoji: "🚀", desc: "Final frontier" },
    { name: "Neon",        color: FB_COLORS.hotpink, emoji: "🔆", desc: "Neon lights city" },
    { name: "Robot",       color: FB_COLORS.teal,    emoji: "🤖", desc: "AI uprising" },
    { name: "Hacker",      color: FB_COLORS.lime,    emoji: "💻", desc: "Ghost in the shell" },
    { name: "Futuristic",  color: FB_COLORS.aqua,    emoji: "⚡", desc: "Year 3000 vibes" },
  ],

  "💀 DARK": [
    { name: "Death",       color: FB_COLORS.indigo,  emoji: "💀", desc: "Memento mori" },
    { name: "Gothic",      color: FB_COLORS.purple,  emoji: "🦇", desc: "Gothic darkness" },
    { name: "Horror",      color: FB_COLORS.red,     emoji: "🩸", desc: "Pure horror" },
    { name: "Demon",       color: FB_COLORS.red,     emoji: "😈", desc: "Demonic energy" },
    { name: "Abyss",       color: FB_COLORS.indigo,  emoji: "🌑", desc: "Into the void" },
    { name: "Grunge",      color: FB_COLORS.beige,   emoji: "⛓️", desc: "Grunge aesthetic" },
  ],
};

// Flatten all themes with category reference
const ALL_THEMES = [];
for (const [cat, list] of Object.entries(THEMES)) {
  list.forEach(t => ALL_THEMES.push({ ...t, category: cat }));
}

async function applyTheme(api, event, message, theme, num) {
  let colorOk = false, emojiOk = false;
  let colorErr = "", emojiErr = "";

  try {
    await new Promise((res, rej) =>
      api.changeThreadColor(theme.color, event.threadID, e => e ? rej(e) : res())
    );
    colorOk = true;
  } catch (e) { colorErr = e?.message?.substring(0, 80) || "FB rejected this color"; }

  try {
    await new Promise((res, rej) =>
      api.changeThreadEmoji(theme.emoji, event.threadID, e => e ? rej(e) : res())
    );
    emojiOk = true;
  } catch (e) { emojiErr = e?.message?.substring(0, 60) || "Emoji change failed"; }

  api.setMessageReaction(theme.emoji, event.messageID, () => {}, true);

  message.reply(
    `╔══════════════════════════╗\n` +
    `║  🎨 Theme Applied!        ║\n` +
    `╚══════════════════════════╝\n\n` +
    `  ✦ Theme    › #${num} ${theme.emoji} ${theme.name}\n` +
    `  ✦ Category › ${theme.category}\n` +
    `  ✦ Vibe     › "${theme.desc}"\n\n` +
    `  🎨 Color: ${theme.color}\n` +
    `  ✦ Color Status  › ${colorOk ? "✅ Applied!" : `❌ ${colorErr}`}\n` +
    `  ✦ Emoji Status  › ${emojiOk ? "✅ Applied!" : `❌ ${emojiErr}`}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 .gctheme random — নতুন theme\n` +
    `${!colorOk ? "⚠️  Color change needs bot to be GC admin!" : ""}\n` +
    `— Rakib Islam | Ghost Bot 👻`
  );
}

module.exports = {
  config: {
    name: "gctheme",
    aliases: ["gtheme", "grouptheme", "gct"],
    version: "2.5",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Change GC theme + emoji — 80+ themes" },
    longDescription: { en: "Changes Facebook Messenger thread color and emoji for the group." },
    category: "group",
    guide: {
      en: "{p}gctheme <name>     — Apply by name\n{p}gctheme <number>   — Apply by number\n{p}gctheme random    — Random theme\n{p}gctheme list      — All themes\n{p}gctheme <category>— List category\n\nCategories: anime, sports, nature, festival, vibe, desi, sci-fi, dark"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!event.isGroup) return message.reply("❌ এই command শুধু group এ কাজ করে!");

    const input = args.join(" ").trim().toLowerCase();

    if (!input) {
      const lines = Object.entries(THEMES).map(([cat, list]) =>
        `  ${cat}  (${list.length} themes)`
      );
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║  🎨 GC Theme Changer      ║\n` +
        `╚══════════════════════════╝\n\n` +
        `📂 Categories (${ALL_THEMES.length} themes total):\n\n` +
        `${lines.join("\n")}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 Commands:\n` +
        `  .gctheme naruto        — by name\n` +
        `  .gctheme 15            — by number\n` +
        `  .gctheme random        — random\n` +
        `  .gctheme list          — all themes\n` +
        `  .gctheme anime         — by category\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚠️ Bot must be GC admin for color!\n` +
        `— Rakib Islam | Ghost Bot 👻`
      );
    }

    if (input === "random") {
      const t = ALL_THEMES[Math.floor(Math.random() * ALL_THEMES.length)];
      return applyTheme(api, event, message, t, ALL_THEMES.indexOf(t) + 1);
    }

    if (input === "list" || input === "all") {
      const chunks = [];
      let chunk = `🎨 All Themes (${ALL_THEMES.length}):\n━━━━━━━━━━━━━━\n`;
      let lastCat = "";
      for (let i = 0; i < ALL_THEMES.length; i++) {
        const t = ALL_THEMES[i];
        if (t.category !== lastCat) { chunk += `\n${t.category}\n`; lastCat = t.category; }
        chunk += `  ${String(i + 1).padStart(2)}. ${t.emoji} ${t.name}\n`;
        if (chunk.length > 1800) { chunks.push(chunk); chunk = ""; }
      }
      if (chunk) chunks.push(chunk + `\n📌 Use: .gctheme <number> or .gctheme <name>`);
      for (const c of chunks) await message.reply(c);
      return;
    }

    // By number
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= ALL_THEMES.length) {
      return applyTheme(api, event, message, ALL_THEMES[num - 1], num);
    }

    // By exact name (case-insensitive)
    const byName = ALL_THEMES.find(t => t.name.toLowerCase() === input);
    if (byName) return applyTheme(api, event, message, byName, ALL_THEMES.indexOf(byName) + 1);

    // By category
    const catKey = Object.keys(THEMES).find(c => c.toLowerCase().includes(input) || input.includes(c.toLowerCase().replace(/[^a-z]/g, "").slice(0, 5)));
    if (catKey) {
      const list = THEMES[catKey];
      const lines = list.map((t, i) => {
        const idx = ALL_THEMES.findIndex(x => x.name === t.name) + 1;
        return `  ${String(idx).padStart(2)}. ${t.emoji} ${t.name} — "${t.desc}"`;
      });
      return message.reply(
        `${catKey} Themes (${list.length}):\n━━━━━━━━━━━━━━\n` +
        lines.join("\n") +
        `\n\n📌 .gctheme <name> or .gctheme <number>`
      );
    }

    // Partial match
    const partial = ALL_THEMES.filter(t => t.name.toLowerCase().includes(input) || t.desc.toLowerCase().includes(input));
    if (partial.length === 1) {
      return applyTheme(api, event, message, partial[0], ALL_THEMES.indexOf(partial[0]) + 1);
    }
    if (partial.length > 1) {
      return message.reply(
        `🔍 "${input}" matches ${partial.length} themes:\n\n` +
        partial.slice(0, 10).map(t => `  ${t.emoji} ${t.name}`).join("\n") +
        `\n\n📌 Exact name দাও!`
      );
    }

    message.reply(
      `❌ "${input}" নামে কোনো theme নেই!\n\n` +
      `📌 .gctheme list — সব themes দেখো\n` +
      `📌 .gctheme random — random theme\n` +
      `📌 Categories: anime, sports, nature, festival, vibe, desi, sci-fi, dark`
    );
  }
};
