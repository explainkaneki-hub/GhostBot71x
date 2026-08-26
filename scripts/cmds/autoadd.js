module.exports = {
  config: {
    name: "autoadd",
    version: "1.0.0",
    author: "Developer",
    countDown: 5,
    role: 0,
    description: "Bot run hole automatic all group e add korbe",
    category: "system"
  },

  onLoad: async function ({ api }) {
    // আপনার প্রোফাইলের ইউজারনাম
    const targetUsername = "md.majadul.islam.228344";

    console.log("[AUTO-ADD] ইউজার আইডি খোঁজা হচ্ছে...");

    try {
      // ইউজারনাম থেকে UID বের করার চেষ্টা
      const userInfo = await api.getUserInfo(targetUsername);
      let targetID = Object.keys(userInfo)[0];

      // যদি ইউজারনাম থেকে না পাওয়া যায়, তবে সার্চ দিয়ে UID বের করবে
      if (!targetID) {
        const searchResult = await api.searchForUser(targetUsername);

        if (searchResult && searchResult.length > 0) {
          targetID = searchResult[0].userID;
        }
      }

      if (!targetID) {
        console.log(
          "[AUTO-ADD] ত্রুটি: প্রোফাইল থেকে UID খুঁজে পাওয়া যায়নি!"
        );
        return;
      }

      console.log(`[AUTO-ADD] আপনার UID পাওয়া গেছে: ${targetID}`);
      console.log("[AUTO-ADD] সব গ্রুপে যুক্ত করার কাজ শুরু হচ্ছে...");

      // বটের ইনবক্সে থাকা মেসেজ/গ্রুপের তালিকা
      const threadList = await api.getThreadList(100, null, ["INBOX"]);

      let successCount = 0;

      for (const thread of threadList) {
        // কেবল গ্রুপ চ্যাট হলে অ্যাড করবে
        if (thread.isGroup) {
          try {
            await api.addUserToGroup(targetID, thread.threadID);

            successCount++;

            console.log(
              `[AUTO-ADD] গ্রুপে যুক্ত করা হয়েছে: ${
                thread.name || thread.threadID
              }`
            );
          } catch (err) {
            console.log(
              `[AUTO-ADD] গ্রুপে অ্যাড করতে ব্যর্থ: ${thread.threadID}`
            );
          }
        }
      }

      console.log(
        `[AUTO-ADD] কাজ শেষ! মোট ${successCount} টি গ্রুপে আপনাকে অ্যাড করা হয়েছে।`
      );
    } catch (error) {
      console.log("[AUTO-ADD] এরর ঘটেছে: " + error.message);
    }
  }
};