const OWNER_ID = "61575436812912";

// Category display config
const CAT_CONFIG = {
  "ai":              { icon: "🤖", label: "AI Chat",          order: 1  },
  "AI":              { icon: "🤖", label: "AI Chat",          order: 1  },
  "ai-image":        { icon: "🎨", label: "AI Image Gen",     order: 2  },
  "image generator": { icon: "🖼️", label: "Image Generator",  order: 3  },
  "image":           { icon: "🖼️", label: "Image Tools",      order: 4  },
  "utility":         { icon: "🔧", label: "Utility",          order: 5  },
  "utility-bd":      { icon: "🇧🇩", label: "Utility BD",      order: 6  },
  "info":            { icon: "ℹ️", label: "Info / Lookup",    order: 7  },
  "info-bd":         { icon: "🇧🇩", label: "Info BD",         order: 8  },
  "fun":             { icon: "😂", label: "Fun",              order: 9  },
  "বাংলা":           { icon: "🇧🇩", label: "বাংলা",           order: 10 },
  "game":            { icon: "🎮", label: "Games",            order: 11 },
  "game-bd":         { icon: "🎮", label: "Games BD",         order: 12 },
  "social":          { icon: "❤️", label: "Social / Love",    order: 13 },
  "love":            { icon: "💕", label: "Love",             order: 13 },
  "LOVE":            { icon: "💕", label: "Love",             order: 13 },
  "anime":           { icon: "🌸", label: "Anime",            order: 14 },
  "media":           { icon: "🎵", label: "Media / DL",       order: 15 },
  "text-tools":      { icon: "✍️", label: "Text Tools",       order: 16 },
  "box chat":        { icon: "💬", label: "Chat Modes",       order: 17 },
  "chat":            { icon: "💬", label: "Chat",             order: 17 },
  "prank":           { icon: "😈", label: "Prank",            order: 18 },
  "economy":         { icon: "💰", label: "Economy",          order: 19 },
  "rank":            { icon: "🏆", label: "Rank",             order: 20 },
  "admin":           { icon: "🛡️", label: "Admin Tools",      order: 21 },
  "group":           { icon: "👥", label: "Group Mgmt",       order: 21 },
  "system":          { icon: "⚙️", label: "System",           order: 22 },
  "owner":           { icon: "👑", label: "Owner Only",       order: 23 },
  "free fire":       { icon: "🔥", label: "Free Fire",        order: 24 },
  "18+":             { icon: "🔞", label: "18+",              order: 25 },
  "tools":           { icon: "🛠️", label: "Tools",            order: 5  },
  "convert":         { icon: "🔄", label: "Convert",          order: 5  },
  "design":          { icon: "🎨", label: "Design",           order: 4  },
  "custom":          { icon: "⚙️", label: "Custom",           order: 22 },
  "without prefix":  { icon: "⚡", label: "No Prefix",        order: 26 },
  "noprefix":        { icon: "⚡", label: "No Prefix",        order: 26 },
  "contacts admin":  { icon: "📞", label: "Contact Admin",    order: 27 },
  "config":          { icon: "⚙️", label: "Config",           order: 22 },
  "information":     { icon: "ℹ️", label: "Information",      order: 7  },
  "marry":           { icon: "💍", label: "Marry",            order: 13 },
};

function getDefaultCat(cat) {
  return CAT_CONFIG[cat] || { icon: "📦", label: cat || "Other", order: 99 };
}

function roleLabel(role) {
  if (role >= 2) return "👑";
  if (role === 1) return "🛡️";
  return "👤";
}

function buildCategories() {
  const cmds = global.GoatBot?.commands;
  if (!cmds) return null;

  const catMap = {};
  for (const [, cmd] of cmds) {
    const cfg = cmd.config;
    if (!cfg?.name) continue;
    const cat = (cfg.category || "other").toLowerCase();
    const catKey = cfg.category || "other";
    if (!catMap[catKey]) catMap[catKey] = [];
    catMap[catKey].push({
      name: cfg.name,
      role: cfg.role || 0,
      aliases: cfg.aliases || [],
      desc: typeof cfg.shortDescription === "object"
        ? (cfg.shortDescription.en || cfg.shortDescription.vi || "")
        : (cfg.shortDescription || ""),
      isPremium: !!cfg.isPremium,
      countDown: cfg.countDown || 0,
    });
  }

  // Sort commands within each category alphabetically
  for (const cat of Object.keys(catMap)) {
    catMap[cat].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sort categories by order
  const sorted = Object.entries(catMap).sort((a, b) => {
    const oA = getDefaultCat(a[0]).order;
    const oB = getDefaultCat(b[0]).order;
    return oA !== oB ? oA - oB : a[0].localeCompare(b[0]);
  });

  return sorted;
}

module.exports = {
  config: {
    name: "adminhelp",
    aliases: ["ahelp", "allcmds", "cmdlist", "commands"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Admin-only full command list organized by category" },
    longDescription: { en: "Shows all ~500 bot commands organized by category. Reply with category number to see commands. Owner only." },
    category: "owner",
    guide: { en: "{p}adminhelp         — Show all categories\n{p}adminhelp <number> — See commands in that category\n{p}adminhelp search <name> — Search a command\n{p}adminhelp stats   — Show command statistics" }
  },

  onStart: async function ({ message, event, args }) {
    const isOwner = String(event.senderID) === OWNER_ID;
    const isAdmin = isOwner || (global.GoatBot?.config?.adminBot || []).map(String).includes(String(event.senderID));
    if (!isAdmin) return message.reply("❌ শুধু Admin দেখতে পারবে!\n— Ghost Bot");

    const categories = buildCategories();
    if (!categories) return message.reply("❌ Command list load করা যায়নি।");

    const sub = args[0]?.toLowerCase();

    // === STATS ===
    if (sub === "stats") {
      const totalCmds = categories.reduce((s, [, arr]) => s + arr.length, 0);
      const ownerCmds = categories.reduce((s, [, arr]) => s + arr.filter(c => c.role >= 2).length, 0);
      const adminCmds = categories.reduce((s, [, arr]) => s + arr.filter(c => c.role === 1).length, 0);
      const premiumCmds = categories.reduce((s, [, arr]) => s + arr.filter(c => c.isPremium).length, 0);
      const catCount = categories.length;
      const lines = categories.map(([cat, arr]) => {
        const cfg = getDefaultCat(cat);
        return `  ${cfg.icon} ${cfg.label.padEnd(18)} › ${arr.length} cmds`;
      }).join("\n");

      return message.reply(
        `╔══════════════════════╗\n` +
        `║  📊 Bot Command Stats  ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Total Commands › ${totalCmds}\n` +
        `  ✦ Categories    › ${catCount}\n` +
        `  ✦ Owner Only    › 👑 ${ownerCmds}\n` +
        `  ✦ Admin Only    › 🛡️ ${adminCmds}\n` +
        `  ✦ Premium       › 💎 ${premiumCmds}\n` +
        `  ✦ Public        › 👤 ${totalCmds - ownerCmds - adminCmds}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${lines}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    }

    // === SEARCH ===
    if (sub === "search" || sub === "find" || sub === "s") {
      const q = args.slice(1).join(" ").toLowerCase().trim();
      if (!q) return message.reply("❌ Search term দাও!\nExample: .adminhelp search gpt");

      const found = [];
      for (const [cat, arr] of categories) {
        for (const cmd of arr) {
          if (
            cmd.name.toLowerCase().includes(q) ||
            cmd.aliases.some(a => a.toLowerCase().includes(q)) ||
            cmd.desc.toLowerCase().includes(q)
          ) {
            found.push({ ...cmd, category: cat });
          }
        }
      }

      if (!found.length) return message.reply(`❌ "${q}" এর জন্য কোনো command পাওয়া যায়নি।`);

      const lines = found.slice(0, 15).map(cmd => {
        const cfg = getDefaultCat(cmd.category);
        const aliases = cmd.aliases.length ? ` (${cmd.aliases.slice(0, 2).join(", ")})` : "";
        return (
          `  ${roleLabel(cmd.role)} .${cmd.name}${aliases}\n` +
          `     ${cfg.icon} ${cfg.label} › ${cmd.desc.substring(0, 60) || "—"}`
        );
      }).join("\n\n");

      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🔍 Search: "${q}"   ║\n` +
        `╚══════════════════════╝\n\n` +
        `  Found: ${found.length} command(s)\n\n` +
        `${lines}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 Everyone  🛡️ Admin  👑 Owner\n` +
        `— Rakib Islam | Ghost Bot`
      );
    }

    // === SHOW SPECIFIC CATEGORY ===
    const catIndex = parseInt(args[0]);
    if (!isNaN(catIndex) && catIndex >= 1 && catIndex <= categories.length) {
      const [cat, cmds] = categories[catIndex - 1];
      const cfg = getDefaultCat(cat);

      // Split into chunks of 20 commands
      const CHUNK = 20;
      const chunks = [];
      for (let i = 0; i < cmds.length; i += CHUNK) {
        chunks.push(cmds.slice(i, i + CHUNK));
      }

      const totalParts = chunks.length;
      for (let p = 0; p < chunks.length; p++) {
        const chunk = chunks[p];
        const lines = chunk.map(cmd => {
          const r = roleLabel(cmd.role);
          const aliases = cmd.aliases.length ? ` / .${cmd.aliases.slice(0, 1).join(", .")}` : "";
          const prem = cmd.isPremium ? " 💎" : "";
          const cd = cmd.countDown > 0 ? ` ⏱${cmd.countDown}s` : "";
          const desc = cmd.desc ? `\n     └ ${cmd.desc.substring(0, 65)}` : "";
          return `  ${r} .${cmd.name}${aliases}${prem}${cd}${desc}`;
        }).join("\n");

        await message.reply(
          `╔══════════════════════╗\n` +
          `║ ${cfg.icon} ${cfg.label.substring(0, 16).padEnd(16)} ${p > 0 ? `Part ${p + 1}/${totalParts}` : "        "} ║\n` +
          `╚══════════════════════╝\n\n` +
          `${lines}\n\n` +
          `  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
          `  Total: ${cmds.length} commands\n` +
          `  👤 Everyone  🛡️ Admin  👑 Owner\n` +
          (p === chunks.length - 1 ? `  🔙 .adminhelp — Back to menu\n` : "") +
          `  — Rakib Islam | Ghost Bot`
        );

        if (p < chunks.length - 1) await new Promise(r => setTimeout(r, 800));
      }
      return;
    }

    // === MAIN CATEGORY MENU ===
    const totalCmds = categories.reduce((s, [, arr]) => s + arr.length, 0);

    const catLines = categories.map(([cat, arr], i) => {
      const cfg = getDefaultCat(cat);
      const num = String(i + 1).padStart(2, " ");
      const ownerCount = arr.filter(c => c.role >= 2).length;
      const adminCount = arr.filter(c => c.role === 1).length;
      const tag = ownerCount > 0 ? ` 👑${ownerCount}` : adminCount > 0 ? ` 🛡️${adminCount}` : "";
      return `  [${num}] ${cfg.icon} ${cfg.label.padEnd(16)} ${arr.length}${tag}`;
    }).join("\n");

    message.reply(
      `╔══════════════════════════╗\n` +
      `║  👑 GHOST BOT ADMIN HELP  ║\n` +
      `╚══════════════════════════╝\n\n` +
      `  ✦ Total Commands › ${totalCmds}\n` +
      `  ✦ Categories    › ${categories.length}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${catLines}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `  📌 Commands:\n` +
      `  .adminhelp <number>   → Category দেখো\n` +
      `  .adminhelp search <x> → Command খোঁজো\n` +
      `  .adminhelp stats      → Statistics দেখো\n\n` +
      `  👤 Everyone  🛡️ Admin  👑 Owner\n` +
      `  💎 Premium   ⏱ Cooldown\n\n` +
      `  — Rakib Islam | Ghost Bot`
    );
  }
};
