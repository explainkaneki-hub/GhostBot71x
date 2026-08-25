const axios = require("axios");

const OWNER_ID = "61575436812912";

function isAdmin(senderID) {
  if (String(senderID) === OWNER_ID) return true;
  const admins = (global.GoatBot?.config?.adminBot || []).map(String);
  return admins.includes(String(senderID));
}

const EDIT_SYSTEM = `You are an expert GoatBot V2 JavaScript command editor.
Your job: Receive existing command code + user's instruction, return ONLY the modified code.

RULES:
1. Output ONLY raw JavaScript code — NO markdown, NO backticks, NO explanation
2. Apply ALL requested changes completely
3. Keep all existing logic intact unless instructed otherwise
4. Keep author as "Rakib Islam"
5. Output must be complete and working
6. Do NOT add placeholder comments like "// rest of code here"`;

async function callAI(systemPrompt, userPrompt) {
  const models = [
    { id: "openai-large", label: "GPT-4o" },
    { id: "openai",       label: "GPT-4o Mini" },
    { id: "mistral",      label: "Mistral" },
  ];

  for (const m of models) {
    try {
      const res = await axios.post(
        "https://text.pollinations.ai/",
        {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user",   content: userPrompt }
          ],
          model: m.id, private: true,
          seed: Math.floor(Math.random() * 99999)
        },
        { timeout: 90000, headers: { "Content-Type": "application/json" } }
      );
      const text = typeof res.data === "string" ? res.data
        : res.data?.text || res.data?.choices?.[0]?.message?.content || "";
      if (text && text.length > 100) return { text: text.trim(), model: m.label };
    } catch (e) {}
  }
  throw new Error("সব AI model fail করেছে। একটু পরে আবার try করো।");
}

function cleanCode(raw) {
  return raw.replace(/^```(?:javascript|js)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
}

module.exports = {
  config: {
    name: "editcmd",
    aliases: ["fixcmd", "updatecmd", "improvcmd"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 1,
    shortDescription: { en: "Edit/improve an existing command using AI (admin only)" },
    longDescription: { en: "Reply to a command's code message and describe what to change — AI rewrites it." },
    category: "owner",
    guide: {
      en: "Reply to a code message with:\n{p}editcmd <instruction>\n\nExamples:\n{p}editcmd add error handling\n{p}editcmd add onReply feature\n{p}editcmd translate replies to Bengali\n{p}editcmd add 5 more options"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (!isAdmin(event.senderID)) return message.reply("❌ এই command শুধু admin use করতে পারবে!");

    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  ✏️ AI Command Editor  ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  Code message এ reply করো:\n` +
        `  .editcmd <instruction>\n\n` +
        `📌 উদাহরণ:\n` +
        `  .editcmd add error handling\n` +
        `  .editcmd translate to Bengali\n` +
        `  .editcmd add 10 more jokes\n` +
        `  .editcmd fix the on/off feature\n\n` +
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
        `💡 Edit হলে .makecmd filename দিয়ে install`
      );
    }

    const repliedBody = event.messageReply?.body?.trim();
    if (!repliedBody || !repliedBody.includes("module.exports")) {
      return message.reply("⚠️ কোনো command code এ reply করো!\n\nCode message এ reply করে লেখো:\n   .editcmd <কি change করতে চাও>");
    }

    const instruction = args.join(" ");
    const existingCode = cleanCode(repliedBody);
    const nameMatch = existingCode.match(/name:\s*["']([^"']+)["']/);
    const cmdName = nameMatch ? nameMatch[1] : "command";

    await message.reply(`⏳ AI ".${cmdName}" edit করছে...\n📝 "${instruction}"\n\nএকটু অপেক্ষা করো! ⚡`);

    try {
      const userPrompt =
        `EXISTING CODE:\n${existingCode}\n\n` +
        `INSTRUCTION: ${instruction}\n\n` +
        `Return the complete modified code only.`;

      const { text: raw, model } = await callAI(EDIT_SYSTEM, userPrompt);
      const newCode = cleanCode(raw);

      const newNameMatch = newCode.match(/name:\s*["']([^"']+)["']/);
      const newCmdName = newNameMatch ? newNameMatch[1] : cmdName;
      const lines = newCode.split("\n").length;

      const CHUNK = 19000;
      const header =
        `╔══════════════════════╗\n` +
        `║  ✅ Command Updated!   ║\n` +
        `╚══════════════════════╝\n` +
        `  ✦ Command › .${newCmdName}\n` +
        `  ✦ Lines   › ${lines}\n` +
        `  ✦ AI      › ${model}\n` +
        `  ✦ Change  › ${instruction}\n\n` +
        `💡 এই message এ reply করো:\n` +
        `   .makecmd ${newCmdName}\n\n` +
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;

      const full = header + newCode;
      if (full.length <= CHUNK) return await message.reply(full);

      const totalParts = Math.ceil(newCode.length / CHUNK);
      await message.reply(header + newCode.substring(0, CHUNK) + `\n\n━━━ Part 1/${totalParts} ━━━`);

      let offset = CHUNK, part = 2;
      while (offset < newCode.length) {
        await new Promise(r => setTimeout(r, 1500));
        const chunk = newCode.substring(offset, offset + CHUNK);
        await message.reply(`━━━ Part ${part}/${totalParts} ━━━\n\n` + chunk +
          (offset + CHUNK >= newCode.length ? `\n\n✅ Done — .makecmd ${newCmdName}` : ""));
        offset += CHUNK; part++;
      }
    } catch (err) {
      return message.reply(`❌ AI Error!\n\n${err.message}`);
    }
  }
};
