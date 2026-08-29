# ST Bot E2EE ব্যবহার — বাংলা গাইড

এই project-এ E2EE (End-to-End Encryption) চালু থাকলে Messenger-এর encrypted inbox/group থেকেও bot command ব্যবহার করা যায়। E2EE thread ID সাধারণত `@` চিহ্নসহ আসে।

## ১. Runtime প্রস্তুত করুন

- Node.js `22.19.0` বা তার নতুন version ব্যবহার করুন।
- Project root-এ `npm install` শেষ না হওয়া পর্যন্ত bot চালাবেন না।
- Start command:

```bash
npm start
```

Railway/Render-এ `package.json`-এর `start` script ব্যবহার করুন। Platform-এর দেওয়া `PORT` bot নিজে ব্যবহার করবে।

## ২. account.txt নিরাপদে প্রস্তুত করুন

1. নিজের trusted source থেকে valid Facebook fbstats/cookie array নিন।
2. Project root-এর `account.txt`-এ paste করুন।
3. JSON/array format ভেঙে যায়নি নিশ্চিত করুন।
4. এই file কখনো chat, screenshot, public GitHub বা log-এ paste করবেন না।

Bot startup-এ `Login with cookie array` এবং `Successful login` দেখা গেলে cookie load হয়েছে।

## ৩. E2EE config

`config.json`-এ এই settings রাখুন:

```json
{
  "e2ee": {
    "enable": true,
    "saveType": "path",
    "devicePath": "database/e2ee-device.json"
  }
}
```

`saveType: "path"` ব্যবহার করলে restart-এর পর E2EE device identity/key আবার তৈরি করতে হয় না। `database/e2ee-device.json` private রাখুন এবং public repository-তে commit করবেন না।

## ৪. Bot command কীভাবে ব্যবহার করবেন

- Normal Messenger group-এর মতোই configured prefix ব্যবহার করুন: `!help`
- E2EE thread-এও একই prefix ব্যবহার করুন: `!help`
- Admin UID: `61592104482524`
- E2EE ready হওয়ার আগে command পাঠালে bot response দেরি করতে পারে। Startup log-এ নিচের line আসা পর্যন্ত অপেক্ষা করুন:

```text
E2EE fully ready — encrypted messaging active
```

## ৫. Welcome/leave HUD

Welcome/leave event Canvas image attachment হিসেবে যায়। কোনো group-এ বন্ধ করতে admin লিখুন:

```text
!hudwelcome off
```

আবার চালু করতে:

```text
!hudwelcome on
```

Manual preview:

```text
!welcomecard
!leavecard
```

`!leavecard` কাউকে group থেকে remove করে না; এটি শুধু departure card preview তৈরি করে।

## ৬. Reply font পরিবর্তন

প্রথমে available style দেখুন:

```text
!font list
```

তারপর group-level style সেট করুন:

```text
!font bold
!font mono
!font smallcaps
!font default
```

উদাহরণ:

- `bold` → `𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡`
- `mono` → `𝚁𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑`
- `smallcaps` → `ʀᴇᴘʟʏ ᴡɪᴛʜ`

Font Unicode character-এর উপর নির্ভর করে। Facebook client কোনো অক্ষর না দেখালে `default` ব্যবহার করুন। Font preference group-এর thread data-তে save হয়, তাই restart-এর পরও থাকে।

## ৭. Startup check

সফল startup-এর minimum checklist:

- `Successful login`
- `E2EE fully ready`
- `Successfully connected SQLITE`
- `LOADED` commands
- `MQTT Connected`
- `Server listening on 0.0.0.0:<PORT>`

## ৮. Troubleshooting

### E2EE bridge error

প্রথমে Node version দেখুন:

```bash
node -v
```

Node `22.19+` না হলে runtime update করুন। `database/e2ee-device.json` delete করবেন না—এতে device identity হারাতে পারে।

### Command loaded, কিন্তু response নেই

1. Bot startup-এর পরে command list-এ command আছে কি না দেখুন।
2. সঠিক prefix ব্যবহার করুন।
3. `!font default` দিয়ে Unicode issue বাদ দিন।
4. একই command-এর cooldown শেষ হয়েছে কি না দেখুন।
5. Console log-এ `CALL COMMAND` বা `errorOccurred` আছে কি না দেখুন।

### Welcome card-এ PFP না আসা

Facebook profile privacy/API restriction থাকলে fallback avatar দেখাবে। Bot profile data fetch করতে না পারলে event বন্ধ হবে না; text fallback পাঠাবে।

## নিরাপত্তা নোট

fbstats, cookie, session, device key বা password কাউকে পাঠাবেন না। এগুলো leaked হলে Facebook account এবং bot session ঝুঁকিতে পড়তে পারে।