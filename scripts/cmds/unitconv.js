module.exports.config = {
  name: "unitconv",
  aliases: ["unit2", "convert2", "রূপান্তর"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Unit converter (km, kg, temp) 📏" },
  longDescription: { en: "Convert between common units easily!" },
  category: "utility-bd",
  guide: { en: "{pn} [value] [from] [to] — e.g: .unitconv 5 km mi" }
};

const conversions = {
  // Length
  "km_mi": v => v * 0.621371, "mi_km": v => v * 1.60934,
  "m_ft": v => v * 3.28084, "ft_m": v => v / 3.28084,
  "cm_inch": v => v * 0.393701, "inch_cm": v => v * 2.54,
  // Weight
  "kg_lb": v => v * 2.20462, "lb_kg": v => v / 2.20462,
  "g_oz": v => v * 0.035274, "oz_g": v => v / 0.035274,
  // Temperature
  "c_f": v => v * 9/5 + 32, "f_c": v => (v - 32) * 5/9,
  "c_k": v => v + 273.15, "k_c": v => v - 273.15,
  // Area
  "sqm_sqft": v => v * 10.7639, "sqft_sqm": v => v / 10.7639,
  "acre_sqm": v => v * 4046.86, "sqm_acre": v => v / 4046.86,
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0] || !args[1] || !args[2]) {
    return message.reply(`📏 𝗨𝗻𝗶𝘁 𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗿\n━━━━━━━━━━━━\n📌 উদাহরণ:\n.unitconv 5 km mi\n.unitconv 70 kg lb\n.unitconv 37 c f\n\n📋 Supported:\nkm↔mi, m↔ft, cm↔inch\nkg↔lb, g↔oz\nc↔f, c↔k\nsqm↔sqft, acre↔sqm`);
  }

  const value = parseFloat(args[0]);
  const from = args[1].toLowerCase();
  const to = args[2].toLowerCase();
  const key = `${from}_${to}`;

  if (isNaN(value)) return message.reply("❌ সঠিক সংখ্যা দাও।");
  if (!conversions[key]) return message.reply(`❌ '${from}' থেকে '${to}' রূপান্তর সমর্থিত নয়।\n💡 .unitconv দিয়ে supported list দেখো।`);

  const result = conversions[key](value);
  return message.reply(`📏 𝗨𝗻𝗶𝘁 𝗖𝗼𝗻𝘃𝗲𝗿𝘀𝗶𝗼𝗻\n━━━━━━━━━━━━\n🔢 ${value} ${from.toUpperCase()} = ${result.toFixed(4)} ${to.toUpperCase()}\n━━━━━━━━━━━━\n✅ Ghost Net Edition`);
};
