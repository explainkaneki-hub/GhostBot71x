const MAX_BALANCE = Number.MAX_SAFE_INTEGER;

function formatMoney(value) {
  return Math.trunc(Number(value) || 0).toLocaleString("en-US");
}

function parseAmount(value) {
  if (!value) return NaN;
  const normalized = String(value).toLowerCase().replace(/[,৳$]/g, "");
  const match = normalized.match(/^([+-]?\d+(?:\.\d+)?)(k|m|b|t)?$/);
  if (!match) return NaN;
  const multipliers = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
  const amount = Number(match[1]) * (multipliers[match[2]] || 1);
  return Number.isSafeInteger(amount) ? Math.trunc(amount) : NaN;
}

function isAdmin(senderID) {
  const config = global.GoatBot?.config || {};
  const admins = (config.adminBot || []).map(String);
  return admins.includes(String(senderID)) || String(config.masterUID || "") === String(senderID);
}

function getTarget(event, args) {
  const mentioned = Object.keys(event.mentions || {});
  if (mentioned[0]) return mentioned[0];
  if (event.messageReply?.senderID) return event.messageReply.senderID;
  return args.find(value => /^\d{8,}$/.test(String(value)));
}

module.exports = {
  config: {
    name: "adminbal",
    aliases: ["balanceadmin", "baladmin"],
    version: "1.0",
    author: "Ghost Bot",
    countDown: 3,
    role: 2,
    category: "admin",
    shortDescription: "Admin balance control",
    longDescription: "Add, set, remove, reset, check, or list persistent economy balances.",
    guide: {
      en:
        "{pn} <@user|reply|UID> add <amount>\n" +
        "{pn} <@user|reply|UID> set <amount>\n" +
        "{pn} <@user|reply|UID> remove <amount>\n" +
        "{pn} <@user|reply|UID> reset\n" +
        "{pn} <@user|reply|UID> check\n" +
        "{pn} list"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    if (!isAdmin(event.senderID)) {
      return message.reply("❌ এই command শুধু admin ব্যবহার করতে পারবে।");
    }

    const actionIndex = args.findIndex(value =>
      ["add", "set", "remove", "deduct", "reset", "check", "list"].includes(String(value).toLowerCase())
    );
    const action = String(args[actionIndex] || "").toLowerCase();

    if (action === "list") {
      const users = await usersData.getAll();
      const top = users
        .filter(user => user && Number.isFinite(Number(user.money)))
        .sort((a, b) => Number(b.money) - Number(a.money))
        .slice(0, 15);
      if (!top.length) return message.reply("📊 এখনো কোনো balance data নেই।");
      return message.reply(
        "💰 Top Economy Balances\n\n" +
        top.map((user, index) => `${index + 1}. ${user.name || user.userID} — ৳${formatMoney(user.money)}`).join("\n")
      );
    }

    const targetID = getTarget(event, args);
    if (!targetID) {
      return message.reply(
        "🛠️ Admin Balance\n" +
        "• add  — balance বাড়াও\n" +
        "• set  — নির্দিষ্ট balance দাও\n" +
        "• remove — balance কমাও\n" +
        "• reset — 0 করে দাও\n" +
        "• check — current balance দেখো\n\n" +
        "Example: .adminbal @user add 10M"
      );
    }

    const user = await usersData.get(targetID);
    const oldBalance = Math.max(0, Number(user?.money) || 0);
    const name = user?.name || targetID;

    if (action === "check") {
      return message.reply(`💰 ${name}\n🆔 ${targetID}\n📊 Balance: ৳${formatMoney(oldBalance)}`);
    }

    if (action === "reset") {
      await usersData.set(targetID, { money: 0 });
      return message.reply(`🔄 Balance reset হয়েছে।\n👤 ${name}\n📊 ৳${formatMoney(oldBalance)} → ৳0`);
    }

    if (!["add", "set", "remove", "deduct"].includes(action)) {
      return message.reply("❌ Action দিন: add, set, remove, reset, check অথবা list");
    }

    const amountToken = args[actionIndex + 1];
    const amount = parseAmount(amountToken);
    if (!Number.isFinite(amount) || amount < 0) {
      return message.reply("❌ সঠিক amount দিন। Example: 5000, 10K, 2.5M, 1B");
    }

    let newBalance;
    if (action === "set") newBalance = amount;
    else if (action === "add") newBalance = oldBalance + amount;
    else newBalance = Math.max(0, oldBalance - amount);

    if (newBalance > MAX_BALANCE) {
      return message.reply("❌ Balance সংখ্যার সীমা ছাড়িয়ে যাচ্ছে।");
    }

    await usersData.set(targetID, { money: Math.trunc(newBalance) });
    const label = action === "set" ? "Set" : action === "add" ? "Added" : "Removed";
    return message.reply(
      `✅ Balance ${label}\n` +
      `👤 ${name}\n` +
      `🆔 ${targetID}\n` +
      `📊 ৳${formatMoney(oldBalance)} → ৳${formatMoney(newBalance)}\n` +
      `💾 SQLite database-এ স্থায়ীভাবে save হয়েছে।`
    );
  }
};