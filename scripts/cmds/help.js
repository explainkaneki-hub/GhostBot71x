const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;

const ICONS = {
  info: "💡", fun: "🎪", game: "🎮", system: "⚙️", prank: "🃏",
  image: "🖼️", anime: "🌸", media: "🎬", admin: "👑", "box chat": "💬",
  owner: "🎀", music: "🎵", "free fire": "🔫", utility: "🛠️",
  ai: "🤖", love: "💕", custom: "💎", "ghost net": "👻",
  "18+": "🔞", rank: "🏆", information: "📋", economy: "💰",
  convert: "🔄", tools: "🔧", chat: "💬", group: "👥",
  বাংলা: "🇧🇩", "utility-bd": "🔧", "game-bd": "🕹️",
  social: "🤝", "info-bd": "📚", "text-tools": "✍️",
  config: "⚡", uncategorized: "📦"
};

const PAGE_PREFERENCES = [
  ["info", "system", "config", "admin", "owner", "group", "information", "box chat"],
  ["fun", "game", "anime", "love", "music", "media", "image", "prank", "free fire", "18+"],
  ["utility", "tools", "economy", "ai", "convert", "বাংলা", "utility-bd", "game-bd", "social", "info-bd", "text-tools"]
];

function distributeCategories(categories) {
  const pages = [[], [], []];
  const assigned = new Set();
  const totals = [0, 0, 0];

  PAGE_PREFERENCES.forEach((preferred, pageIndex) => {
    for (const category of preferred) {
      if (!categories[category] || assigned.has(category)) continue;
      pages[pageIndex].push(category);
      assigned.add(category);
      totals[pageIndex] += categories[category].length;
    }
  });

  Object.keys(categories)
    .filter(category => !assigned.has(category))
    .sort((a, b) => categories[b].length - categories[a].length)
    .forEach(category => {
      const pageIndex = totals.indexOf(Math.min(...totals));
      pages[pageIndex].push(category);
      totals[pageIndex] += categories[category].length;
    });

  return pages;
}

function getCommandCategories(role) {
  const categories = {};
  for (const [name, command] of commands) {
    if ((command.config.role || 0) > 1 && role < command.config.role) continue;
    const category = String(command.config.category || "uncategorized").toLowerCase();
    (categories[category] ||= []).push(name);
  }
  return categories;
}

function pageNumber(args) {
  const raw = String(args[0] || "1").toLowerCase();
  const match = raw.match(/[123]/);
  return match ? Number(match[0]) : 1;
}

function pageHeader(prefix, page, categories, visibleCount) {
  const titles = [
    "CORE SYSTEM // COMMANDS",
    "ENTERTAINMENT // MEDIA",
    "TOOLS // ECONOMY // BANGLA"
  ];
  const accents = ["⚡", "🎬", "💎"];
  return [
    "╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮",
    `│  👻 GHOST BOT  •  ${accents[page - 1]} ${titles[page - 1].padEnd(21)}│`,
    "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯",
    `  ◈ PAGE ${page}/3   ◈ ${visibleCount} COMMANDS   ◈ PREFIX ${prefix} / .`,
    `  ◈ CATEGORIES ${categories.length}   ◈ STATUS ONLINE`,
    ""
  ].join("\n");
}

function renderCategory(category, names) {
  const icon = ICONS[category] || "🌟";
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  const lines = [`\n${icon} ${category.toUpperCase()}  [${sorted.length}]`, "  ─────────────────────────"];
  for (let index = 0; index < sorted.length; index += 3) {
    lines.push(`  ${sorted.slice(index, index + 3).map(name => `› ${name}`).join("   ")}`);
  }
  return lines.join("\n");
}

module.exports = {
  config: {
    name: "help",
    version: "5.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Three-page Ghost Bot command index" },
    longDescription: { en: "Browse every available command across three redesigned help pages." },
    category: "info",
    guide: { en: "{p}help [1 | 2 | 3 | command]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);
    const query = String(args[0] || "").toLowerCase();

    if (query && !["1", "2", "3", "all", "list", "cat"].includes(query) && !/^[123]\/3$/.test(query)) {
      const command = commands.get(query) || aliases.get(query) && commands.get(aliases.get(query));
      if (command) return showCmd(message, command, prefix);
      return message.reply(`❌ Command "${args[0]}" not found.\n💡 Use ${prefix}help to browse all commands.`);
    }

    const categories = getCommandCategories(role);
    const pages = distributeCategories(categories);
    const page = pageNumber(args);
    const selectedCategories = pages[page - 1];
    const visibleCount = selectedCategories.reduce((total, category) => total + categories[category].length, 0);

    let body = pageHeader(prefix, page, selectedCategories, visibleCount);
    body += selectedCategories
      .sort((a, b) => a.localeCompare(b))
      .map(category => renderCategory(category, categories[category]))
      .join("\n");
    body += [
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `  ◀ ${prefix}help ${page === 1 ? 3 : page - 1}   •   ${prefix}help ${page === 3 ? 1 : page + 1} ▶`,
      `  ✦ ${prefix}help <command>  ›  command details`,
      "  ✦ .spy  ›  profile intel     .pp  ›  view PFP",
      "  ✦ Ghost Bot • Mono Neon Interface"
    ].join("\n");

    return message.reply(body);
  }
};

function showCmd(message, command, prefix) {
  const config = command.config;
  const guide = typeof config.guide === "string" ? config.guide : (config.guide?.en || "—");
  const description = typeof config.shortDescription === "string"
    ? config.shortDescription
    : (config.shortDescription?.en || "—");
  const aliasesText = (config.aliases || []).join(", ") || "—";
  const roles = ["USER", "MODERATOR", "ADMIN", "OWNER"];

  const body = [
    "╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮",
    `│  👻 COMMAND INTEL  //  ${String(config.name).toUpperCase().padEnd(12)}│`,
    "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯",
    "",
    `  ◈ CATEGORY  › ${config.category || "—"}`,
    `  ◈ ALIASES   › ${aliasesText}`,
    `  ◈ ROLE      › ${roles[config.role || 0] || "USER"}`,
    `  ◈ COOLDOWN  › ${config.countDown || 0}s`,
    "",
    "  ──────────────────────────────",
    `  ◈ ${description}`,
    "",
    "  USAGE",
    `  ${guide.replace(/\{p\}|\{pn\}/g, `${prefix}${config.name} `)}`,
    "",
    `  ◀ Browse: ${prefix}help 1  •  2  •  3`,
    "  👻 GHOST BOT // MONO NEON INTERFACE"
  ].join("\n");

  return message.reply(body);
}