// GC Nick Manager — Fixed v2 — Rakib Islam / Ghost Net Edition
// Usage: .gcnick @user <nick>   OR   .gcnick @user --style <style> <nick>

const FONT_MAPS = {
  bold:   {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'},
  script: {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
};

function applyFont(text, key) {
  const map = FONT_MAPS[key];
  return text.split('').map(c => map?.[c] || c).join('');
}

const NICK_STYLES = {
  bold: t => applyFont(t, 'bold'),
  script: t => applyFont(t, 'script'),
  cursive: t => applyFont(t, 'script'),
  fire: t => `🔥 ${t} 🔥`,
  crown: t => `👑 ${t}`,
  ghost: t => `👻 ${t}`,
  heart: t => `❤️ ${t} ❤️`,
  star: t => `⭐ ${t}`,
  devil: t => `😈 ${t}`,
  angel: t => `😇 ${t}`,
  boss: t => `💼 ${t}`,
  king: t => `🤴 ${t}`,
  queen: t => `👸 ${t}`,
  admin: t => `🛡️ ${t}`,
  vip: t => `💎 ${t}`,
  toxic: t => `☢️ ${t}`,
  panda: t => `🐼 ${t}`,
  wolf: t => `🐺 ${t}`,
  dragon: t => `🐉 ${t}`,
  ninja: t => `🥷 ${t}`,
  hacker: t => `💻 ${t}`,
  spy: t => `🕵️ ${t}`,
  joker: t => `🃏 ${t}`,
  flower: t => `🌸 ${t} 🌸`,
  moon: t => `🌙 ${t}`,
  galaxy: t => `🌌 ${t}`,
  diamond: t => `💎 ${t}`,
  lightning: t => `⚡ ${t}`,
  music: t => `🎵 ${t}`,
  sword: t => `⚔️ ${t}`,
  rocket: t => `🚀 ${t}`,
  cop: t => `👮 ${t}`,
  shield: t => `🛡️ ${t}`,
  robot: t => `🤖 ${t}`,
};

module.exports = {
  config: {
    name: "gcnick",
    aliases: ["setnick", "nickname", "nick", "changenick"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Set GC nicknames — 35+ styles with --style flag" },
    category: "group",
    guide: {
      en: "{p}gcnick @user <nick>                → Set nickname\n{p}gcnick @user --style <s> <nick>  → Styled nick\n{p}gcnick me <nick>                   → Own nick\n{p}gcnick me --style crown Boss      → Styled own nick\n{p}gcnick reset @user                 → Reset nick\n{p}gcnick reset all                   → Reset everyone\n{p}gcnick all --style <s>             → Style all members\n{p}gcnick styles                      → List styles\n\nEx: .gcnick @user Ghost King\n    .gcnick @user --style fire Admin"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    if (!event.isGroup) return message.reply("❌ এই command শুধু group এ কাজ করে!");

    const mentioned = Object.keys(event.mentions || {});
    const sub = args[0]?.toLowerCase();

    // ─── STYLES LIST ───
    if (sub === "styles" || sub === "list") {
      const s = Object.keys(NICK_STYLES).map(k => `  • --style ${k} → ${NICK_STYLES[k]("Test")}`).join("\n");
      return message.reply(`✨ Nick Styles:\n\n${s}\n\n📌 Use: .gcnick @user --style <stylename> <nick>`);
    }

    // ─── RESET ALL ───
    if (sub === "reset" && args[1]?.toLowerCase() === "all") {
      api.setMessageReaction("🔄", event.messageID, () => {}, true);
      let threadInfo;
      try { threadInfo = await new Promise((r,j) => api.getThreadInfo(event.threadID, (e,d) => e ? j(e) : r(d))); }
      catch (e) { return message.reply("❌ Group info আনা যায়নি।"); }
      const members = threadInfo.participantIDs || [];
      let ok = 0, fail = 0;
      for (const uid of members) {
        try { await new Promise((r,j) => api.changeNickname("", event.threadID, uid, e => e ? j(e) : r())); ok++; }
        catch { fail++; }
        await new Promise(r => setTimeout(r, 300));
      }
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      return message.reply(`✅ Reset Done!\n  ✦ Success › ${ok}\n  ✦ Failed  › ${fail}`);
    }

    // ─── RESET SINGLE ───
    if (sub === "reset") {
      const uid = String(mentioned[0] || "");
      if (!uid) return message.reply("❌ @mention করো অথবা 'reset all' দাও।");
      try {
        await new Promise((r,j) => api.changeNickname("", event.threadID, uid, e => e ? j(e) : r()));
        let name = uid;
        try { const u = await usersData.get(uid); name = u?.name || uid; } catch {}
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        return message.reply(`✅ Nick reset: ${name}`);
      } catch (e) { return message.reply(`❌ Failed: ${e.message?.substring(0, 80)}`); }
    }

    // Helper: parse --style flag from remaining args
    function parseStyleAndNick(argArr) {
      const styleIdx = argArr.indexOf("--style");
      if (styleIdx === -1) {
        return { styleFn: null, styleName: "normal", nick: argArr.join(" ").trim() };
      }
      const styleName = argArr[styleIdx + 1]?.toLowerCase();
      const styleFn = NICK_STYLES[styleName];
      const nickParts = argArr.filter((_, i) => i !== styleIdx && i !== styleIdx + 1);
      return { styleFn: styleFn || null, styleName, nick: nickParts.join(" ").trim() };
    }

    // ─── SET ALL MEMBERS ───
    if (sub === "all") {
      const restArgs = args.slice(1);
      const { styleFn, styleName, nick: baseNick } = parseStyleAndNick(restArgs);
      if (!styleFn && !baseNick) {
        return message.reply(
          `❌ Style অথবা nick দাও!\n\n` +
          `.gcnick all --style <style>     — সবার নামে style লাগাও\n` +
          `.gcnick all <nick>              — সবাইকে একই nick দাও\n\n` +
          `Styles: ${Object.keys(NICK_STYLES).slice(0,10).join(", ")}...\n.gcnick styles — full list`
        );
      }
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      let threadInfo;
      try { threadInfo = await new Promise((r,j) => api.getThreadInfo(event.threadID, (e,d) => e ? j(e) : r(d))); }
      catch { return message.reply("❌ Group info আনা যায়নি।"); }
      const members = threadInfo.participantIDs || [];
      const wait = await message.reply(`⏳ ${members.length} জনের nick set হচ্ছে...`);
      let ok = 0, fail = 0;
      for (const uid of members) {
        try {
          let nick;
          if (styleFn && !baseNick) {
            const u = await usersData.get(uid);
            nick = styleFn(u?.name?.split(" ")[0] || "Member");
          } else if (styleFn) {
            nick = styleFn(baseNick);
          } else {
            nick = baseNick;
          }
          await new Promise((r,j) => api.changeNickname(nick, event.threadID, uid, e => e ? j(e) : r()));
          ok++;
        } catch { fail++; }
        await new Promise(r => setTimeout(r, 400));
      }
      try { api.unsendMessage(wait.messageID); } catch {}
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      return message.reply(`✅ All Nicknames Set!\n  ✦ Style   › ${styleName}\n  ✦ Success › ${ok}\n  ✦ Failed  › ${fail}`);
    }

    // ─── SET OWN NICK (me) ───
    if (sub === "me") {
      const restArgs = args.slice(1);
      const { styleFn, nick } = parseStyleAndNick(restArgs);
      if (!nick && !styleFn) return message.reply("❌ Nick দাও!\nEx: .gcnick me Rakib Boss\n    .gcnick me --style crown Admin");
      let finalNick;
      if (styleFn && !nick) {
        const u = await usersData.get(event.senderID);
        finalNick = styleFn(u?.name?.split(" ")[0] || "Me");
      } else if (styleFn) {
        finalNick = styleFn(nick);
      } else {
        finalNick = nick;
      }
      try {
        await new Promise((r,j) => api.changeNickname(finalNick, event.threadID, event.senderID, e => e ? j(e) : r()));
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        return message.reply(`✅ তোমার nick: ${finalNick}`);
      } catch (e) { return message.reply(`❌ Failed: ${e.message?.substring(0,80)}\n💡 Bot কে group admin করো!`); }
    }

    // ─── SET MENTION NICK ───
    if (mentioned.length === 0) {
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║  ✨ GC Nick Manager v2    ║\n` +
        `╚══════════════════════════╝\n\n` +
        `📌 Commands:\n` +
        `  .gcnick @user <nick>              — Set nick\n` +
        `  .gcnick @user --style <s> <nick>  — Styled nick\n` +
        `  .gcnick me <nick>                 — Own nick\n` +
        `  .gcnick reset @user               — Reset\n` +
        `  .gcnick reset all                 — Reset all\n` +
        `  .gcnick all --style <s>           — Style all\n` +
        `  .gcnick styles                    — All styles\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Ex: .gcnick @user Ghost King\n` +
        `    .gcnick @user --style crown Boss`
      );
    }

    const uid = String(mentioned[0]);
    // Remove mention token from args, keep the rest
    const restArgs = args.filter(a => !Object.values(event.mentions).some(n => a.includes(n.replace("@","").split(" ")[0])) && a !== "@" + uid);
    const { styleFn, styleName, nick } = parseStyleAndNick(restArgs);

    let finalNick;
    if (!nick && !styleFn) {
      // Just mention, no nick provided — show that user's current name
      let name;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch { name = uid; }
      return message.reply(`❌ Nick দাও!\nEx: .gcnick @user <nick>\n    .gcnick @user --style crown ${name}`);
    } else if (styleFn && !nick) {
      let name;
      try { const u = await usersData.get(uid); name = u?.name?.split(" ")[0] || uid; } catch { name = uid; }
      finalNick = styleFn(name);
    } else if (styleFn) {
      finalNick = styleFn(nick);
    } else {
      finalNick = nick;
    }

    try {
      await new Promise((r,j) => api.changeNickname(finalNick, event.threadID, uid, e => e ? j(e) : r()));
      let name;
      try { const u = await usersData.get(uid); name = u?.name || uid; } catch { name = uid; }
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.reply(
        `╔══════════════════════════╗\n` +
        `║  ✅ Nickname Set!         ║\n` +
        `╚══════════════════════════╝\n\n` +
        `  ✦ User  › ${name}\n` +
        `  ✦ Style › ${styleName}\n` +
        `  ✦ Nick  › ${finalNick}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot 👻`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`❌ Failed!\n\n${err.message?.substring(0,100)}\n\n💡 Bot কে GC admin করো!`);
    }
  }
};
