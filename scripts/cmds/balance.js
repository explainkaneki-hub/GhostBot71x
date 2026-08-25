const fs = require("fs-extra");
const { balanceCard, fullMoney } = require("../utils/economyCards");

module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.2",
		author: "Rakib Islam",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %100$",
			moneyOf: "%1 đang có %200$"
		},
		en: {
			money: "You have %100$",
			moneyOf: "%1 has %200$"
		}
	},

	onStart: async function ({ message, usersData, event }) {
		const uid = Object.keys(event.mentions || {})[0] || event.messageReply?.senderID || event.senderID;
		const userData = await usersData.get(uid);
		const card = await balanceCard(userData, uid, usersData);
		return message.reply(
			{ body: `💰 ${userData?.name || "User"}\nBalance: ৳${fullMoney(userData?.money)}`, attachment: fs.createReadStream(card) },
			() => fs.remove(card).catch(() => {})
		);
	}
};