// GC Name Changer — Fixed Version — Rakib Islam / Ghost Net Edition
// Usage: .gcname <name>   OR   .gcname --style <style> <name>

const FONTS = {
  bold:       {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'},
  italic:     {a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡'},
  bolditalic: {a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕'},
  script:     {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
  bubble:     {a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ'},
  double:     {a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'},
  gothic:     {a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'},
};

function applyFont(text, fontKey) {
  const map = FONTS[fontKey];
  if (!map) return text;
  return text.split('').map(c => map[c] || c).join('');
}

const STYLE_MAP = {
  bold: t => applyFont(t, 'bold'),
  italic: t => applyFont(t, 'italic'),
  bi: t => applyFont(t, 'bolditalic'),
  bolditalic: t => applyFont(t, 'bolditalic'),
  script: t => applyFont(t, 'script'),
  cursive: t => applyFont(t, 'script'),
  bubble: t => applyFont(t, 'bubble'),
  double: t => applyFont(t, 'double'),
  gothic: t => applyFont(t, 'gothic'),
  aesthetic: t => t.split('').join(' '),
  space: t => t.split('').join(' '),
  stars: t => `★彡 ${t} 彡★`,
  arrows: t => `» ${t} «`,
  wave: t => `〜${t}〜`,
  fire: t => `🔥 ${t} 🔥`,
  crown: t => `👑 ${t} 👑`,
  ghost: t => `👻 ${t} 👻`,
  flower: t => `✿ ${t} ✿`,
  lightning: t => `⚡ ${t} ⚡`,
  diamond: t => `💎 ${t} 💎`,
  heart: t => `❤️ ${t} ❤️`,
  sword: t => `⚔️ ${t} ⚔️`,
  music: t => `🎵 ${t} 🎵`,
  moon: t => `🌙 ${t} 🌙`,
  sakura: t => `🌸 ${t} 🌸`,
  galaxy: t => `🌌 ${t} 🌌`,
  devil: t => `😈 ${t} 😈`,
  dashes: t => `━━━ ${t} ━━━`,
  border: t => `【 ${t} 】`,
  angle: t => `« ${t} »`,
  vibe: t => `〔${t}〕`,
  cyber: t => applyFont(t, 'gothic') + ' ⚡',
};

module.exports = {
  config: {
    name: "gcname",
    aliases: ["setgcname", "changegcname", "groupname", "gcn"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Change GC name — 30+ styles with --style flag" },
    longDescription: { en: "Change group name. Use --style <name> for styling. Plain .gcname sets name as-is." },
    category: "group",
    guide: {
      en: "{p}gcname <name>                      — Normal name\n{p}gcname --style <style> <name>     — Styled name\n{p}gcname styles                       — Show all styles\n\nExamples:\n{p}gcname Ghost Squad         → Ghost Squad\n{p}gcname --style fire Ghost  → 🔥 Ghost 🔥\n{p}gcname --style bold SQUAD  → 𝗦𝗤𝗨𝗔𝗗\n{p}gcname --style crown VIP   → 👑 VIP 👑"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!event.isGroup) return message.reply("❌ এই command শুধু group এ কাজ করে!");

    if (!args.length || args[0] === "styles" || args[0] === "list") {
      const fontStyles = Object.keys(FONTS).map(f => `  • --style ${f}`).join("\n");
      const decoStyles = ["stars","arrows","wave","fire","crown","ghost","flower","lightning","diamond","heart","sword","music","moon","sakura","galaxy","devil","dashes","border","aesthetic","cyber","angle","vibe"]
        .map(s => `  • --style ${s} → ${STYLE_MAP[s]("Test")}`).join("\n");
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║  ✏️ GC Name Styles        ║\n` +
        `╚══════════════════════════╝\n\n` +
        `🔤 Font Styles:\n${fontStyles}\n\n` +
        `✨ Decorator Styles:\n${decoStyles}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 Use: .gcname --style <stylename> <name>\n` +
        `📌 Or:  .gcname <name>  (any name, no style)\n` +
        `Ex: .gcname --style fire Ghost Squad`
      );
    }

    let styleFn = null;
    let nameText = "";

    if (args[0] === "--style" || args[0] === "-s") {
      const styleName = args[1]?.toLowerCase();
      if (!styleName || !STYLE_MAP[styleName]) {
        return message.reply(
          `❌ Style "${args[1] || ""}" পাওয়া যায়নি!\n\n` +
          `Available: ${Object.keys(STYLE_MAP).join(", ")}\n\n` +
          `Ex: .gcname --style fire Ghost Squad\n    .gcname styles — full list`
        );
      }
      styleFn = STYLE_MAP[styleName];
      nameText = args.slice(2).join(" ").trim();
      if (!nameText) return message.reply(`❌ Name দাও!\nEx: .gcname --style ${styleName} <name>`);
    } else {
      nameText = args.join(" ").trim();
    }

    const finalName = styleFn ? styleFn(nameText) : nameText;
    if (finalName.length > 250) return message.reply("❌ Name too long! Maximum 250 characters.");

    api.setMessageReaction("✏️", event.messageID, () => {}, true);

    try {
      await new Promise((res, rej) =>
        api.setTitle(finalName, event.threadID, e => e ? rej(e) : res())
      );
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.reply(
        `╔══════════════════════════╗\n` +
        `║  ✅ GC Name Changed!      ║\n` +
        `╚══════════════════════════╝\n\n` +
        `  ✦ Style › ${styleFn ? args[1] : "normal"}\n` +
        `  ✦ Name  › ${finalName}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot 👻`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(
        `❌ Failed!\n\nError: ${err.message?.substring(0, 120)}\n\n` +
        `💡 Bot কে GC admin করো, তারপর try করো।`
      );
    }
  }
};
