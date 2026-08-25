// GoatBot V2 Command Generator — Replit AI Edition
// Usage: .cmdgen [command description] | [alias1, alias2, alias3]
// Example: .cmdgen make a command that tells random jokes | joke, jokes, funnyjoke
// Author: Ghost Net

const axios = require("axios");

// ── Replit AI Config ──
// এই env variables আপনার Replit project-এ set করুন:
// AI_INTEGRATIONS_OPENAI_BASE_URL
// AI_INTEGRATIONS_OPENAI_API_KEY
const AI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";
const AI_API_KEY  = process.env.AI_INTEGRATIONS_OPENAI_API_KEY  || "";

const SYSTEM_PROMPT = `You are an expert GoatBot V2 command developer. 
When given a description, generate a complete, working GoatBot V2 command file.

STRICT RULES:
1. Always follow EXACTLY this GoatBot V2 structure
2. Use proper error handling with try/catch
3. Write clean, working Node.js code
4. Add helpful comments
5. Use axios for HTTP requests if needed
6. Return ONLY the raw JavaScript code — no explanation, no markdown, no backticks

GOATBOT V2 COMMAND STRUCTURE:
module.exports = {
  config: {
    name: "commandname",
    aliases: ["alias1", "alias2"],
    version: "1.0",
    author: "Ghost Net",
    countDown: 5,
    role: 0,
    shortDescription: { en: "short description" },
    longDescription: { en: "long description" },
    category: "utility",
    guide: { en: ".commandname [args]" }
  },
  onStart: async function ({ api, event, args, message, usersData, threadsData, getLang }) {
    try {
      // command logic here
    } catch (err) {
      return message.reply("❌ সমস্যা হয়েছে: " + err.message);
    }
  }
};`;

async function generateCommand(description, aliases) {
  const aliasArray = aliases
    .split(",")
    .map(a => a.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  const commandName = aliasArray[0] || "mycommand";

  const userPrompt = `Create a complete GoatBot V2 command with these details:

Command name: ${commandName}
Aliases: ${JSON.stringify(aliasArray)}
Description: ${description}

Generate the full working command code following the exact GoatBot V2 structure.
Only return raw JavaScript code, nothing else.`;

  // ── Replit AI (OpenAI compatible) ──
  const response = await axios.post(
    `${AI_BASE_URL}/chat/completions`,
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.3
    },
    {
      timeout: 40000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      }
    }
  );

  let code = response.data?.choices?.[0]?.message?.content || "";

  // Clean up markdown code blocks if AI adds them
  code = code
    .replace(/```javascript\n?/gi, "")
    .replace(/```js\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();

  return { code, commandName };
}

module.exports = {
  config: {
    name: "cmdgen",
    aliases: ["commandgen", "gencommand", "makecmd", "createcmd"],
    version: "2.0",
    author: "Ghost Net",
    countDown: 30,
    role: 2,
    shortDescription: { en: "🤖 AI দিয়ে GoatBot command তৈরি করুন" },
    longDescription: {
      en: "Description আর aliases দিলে সম্পূর্ণ GoatBot V2 command code বানিয়ে দেবে AI।"
    },
    category: "owner",
    guide: {
      en: ".cmdgen [description] | [alias1, alias2]\n\nExample:\n.cmdgen make a command that tells random jokes | joke, jokes, funnyjoke"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const input = args.join(" ").trim();

    if (!input) {
      return message.reply(
        "❌ সঠিকভাবে লিখুন:\n\n" +
        ".cmdgen [description] | [aliases]\n\n" +
        "📌 Example:\n" +
        ".cmdgen make a jokes command | joke, jokes, funnyjoke"
      );
    }

    const parts = input.split("|");
    if (parts.length < 2) {
      return message.reply(
        "❌ Aliases দিতে ভুলে গেছেন!\n\n" +
        "Format: .cmdgen [description] | [alias1, alias2]\n\n" +
        "Example:\n.cmdgen jokes command | joke, jokes"
      );
    }

    const description = parts[0].trim();
    const aliases     = parts.slice(1).join("|").trim();

    if (!description || !aliases) {
      return message.reply("❌ Description এবং Aliases দুটোই দিন।");
    }

    await message.reaction("⏳", event.messageID);
    await message.reply("🤖 Replit AI দিয়ে command তৈরি হচ্ছে...\nএকটু অপেক্ষা করুন (১৫–৩০ সেকেন্ড)");

    try {
      const { code, commandName } = await generateCommand(description, aliases);

      const header =
        `✅ Command তৈরি হয়েছে!\n` +
        `📁 ফাইলের নাম: ${commandName}.js\n` +
        `📂 রাখুন: modules/commands/${commandName}.js\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n`;

      const MAX_LEN = 19000;
      const full = header + code;

      if (full.length <= MAX_LEN) {
        await message.reply(full);
      } else {
        await message.reply(header + code.slice(0, MAX_LEN - header.length));
        await new Promise(r => setTimeout(r, 2000));
        await message.reply("📄 Part 2/2:\n\n" + code.slice(MAX_LEN - header.length));
      }

      await message.reaction("✅", event.messageID);
    } catch (err) {
      await message.reaction("❌", event.messageID);
      await message.reply(
        "❌ সমস্যা হয়েছে: " + err.message +
        "\n\nআবার চেষ্টা করুন।"
      );
    }
  }
};