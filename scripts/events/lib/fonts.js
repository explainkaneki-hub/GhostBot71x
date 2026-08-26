const BOLD_UPPER = 0x1d400 - 65;
const BOLD_LOWER = 0x1d41a - 97;
const MONO_UPPER = 0x1d670 - 65;
const MONO_LOWER = 0x1d68a - 97;
const MONO_DIGIT = 0x1d7f6 - 48;

const SMALL_CAPS = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
  h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
  o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ",
  v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

function transformText(input, style = "default") {
  const value = String(input);
  if (style === "bold") {
    return value.replace(/[A-Za-z]/g, char =>
      String.fromCodePoint(char <= "Z" ? char.charCodeAt(0) + BOLD_UPPER : char.charCodeAt(0) + BOLD_LOWER));
  }
  if (style === "mono") {
    return value.replace(/[A-Za-z0-9]/g, char => {
      const code = char.charCodeAt(0);
      if (/[0-9]/.test(char)) return String.fromCodePoint(code + MONO_DIGIT);
      return String.fromCodePoint(code + (char <= "Z" ? MONO_UPPER : MONO_LOWER));
    });
  }
  if (style === "smallcaps") {
    return value.replace(/[A-Za-z]/g, char => SMALL_CAPS[char.toLowerCase()] || char);
  }
  return value;
}

function stylePayload(payload, style) {
  if (typeof payload === "string") return transformText(payload, style);
  if (payload && typeof payload === "object" && typeof payload.body === "string") {
    return { ...payload, body: transformText(payload.body, style) };
  }
  return payload;
}

module.exports = { transformText, stylePayload };