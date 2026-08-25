const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "welcome",
    version: "4.0.0",
    author: "Rakib Islam",
    description: "Anime welcome card with automatic profile picture",
    category: "events",
    eventType: ["log:subscribe"]
  },

  onStart: async function ({ api, event }) {
    if (!event) return;

    if (event.logMessageType !== "log:subscribe") {
      return;
    }

    const data = event.logMessageData || {};

    const participants =
      Array.isArray(data.addedParticipants)
        ? data.addedParticipants
        : [];

    if (!participants.length) {
      return;
    }

    const botID = String(api.getCurrentUserID());

    // Do not send welcome when the bot itself joins
    if (
      participants.some(
        user =>
          String(user.userFbId) === botID
      )
    ) {
      return;
    }

    const cacheDir = path.join(
      __dirname,
      "..",
      "cache"
    );

    await fs.ensureDir(cacheDir);

    /*
     * =====================================================
     * 7 ANIME BACKGROUNDS
     * =====================================================
     */

    const backgrounds = [
      "https://i.ibb.co.com/rRj1nh6S/img1.png",
      "https://i.ibb.co.com/HDdvRVrG/img2.png",
      "https://i.ibb.co.com/GQP8HygW/img3.png",
      "https://i.ibb.co.com/KcKvM8dG/img4.png",
      "https://i.ibb.co.com/T91PPLc/img5.png",
      "https://i.ibb.co.com/Qvn5T8X5/img6.png",
      "https://i.ibb.co.com/3VHPWQN/img7.png"
    ];

    /*
     * =====================================================
     * SAVE WHICH IMAGE WAS USED LAST
     * =====================================================
     */

    const indexFile = path.join(
      cacheDir,
      "welcome-image-index.json"
    );

    let imageIndex = 0;

    try {
      if (await fs.pathExists(indexFile)) {
        const saved = await fs.readJson(indexFile);

        if (
          saved &&
          typeof saved.index === "number"
        ) {
          imageIndex = saved.index;
        }
      }
    } catch (error) {
      imageIndex = 0;
    }

    imageIndex =
      imageIndex % backgrounds.length;

    const backgroundURL =
      backgrounds[imageIndex];

    await fs.writeJson(
      indexFile,
      {
        index:
          (imageIndex + 1) %
          backgrounds.length
      },
      {
        spaces: 2
      }
    );

    /*
     * =====================================================
     * PROCESS EVERY NEW MEMBER
     * =====================================================
     */

    for (const participant of participants) {
      const userID =
        participant.userFbId;

      const userName =
        participant.fullName ||
        "New Member";

      let outputPath = null;

      try {
        /*
         * =================================================
         * DOWNLOAD BACKGROUND
         * =================================================
         */

        const bgResponse =
          await axios.get(
            backgroundURL,
            {
              responseType: "arraybuffer",
              timeout: 30000,
              headers: {
                "User-Agent":
                  "Mozilla/5.0"
              }
            }
          );

        const background =
          await loadImage(
            Buffer.from(
              bgResponse.data
            )
          );

        /*
         * =================================================
         * GET USER PROFILE PICTURE
         * =================================================
         */

        let profileImage = null;

        try {
          const userInfo =
            await new Promise(
              (resolve, reject) => {
                api.getUserInfo(
                  userID,
                  (err, result) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    resolve(
                      result &&
                      result[userID]
                    );
                  }
                );
              }
            );

          if (
            userInfo &&
            userInfo.thumbSrc
          ) {
            const pfpResponse =
              await axios.get(
                userInfo.thumbSrc,
                {
                  responseType:
                    "arraybuffer",
                  timeout: 20000,
                  headers: {
                    "User-Agent":
                      "Mozilla/5.0"
                  }
                }
              );

            profileImage =
              await loadImage(
                Buffer.from(
                  pfpResponse.data
                )
              );
          }
        } catch (error) {
          console.log(
            "WELCOME: Could not fetch PFP:",
            error.message
          );
        }

        /*
         * =================================================
         * CARD SIZE
         *
         * 16:9 / YouTube landscape ratio
         * =================================================
         */

        const WIDTH = 1280;
        const HEIGHT = 720;

        const canvas =
          createCanvas(
            WIDTH,
            HEIGHT
          );

        const ctx =
          canvas.getContext("2d");

        /*
         * =================================================
         * DRAW BACKGROUND
         * =================================================
         */

        drawCover(
          ctx,
          background,
          WIDTH,
          HEIGHT
        );

        /*
         * Very soft dark overlay.
         * Keeps the anime background visible.
         */

        const overlay =
          ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
          );

        overlay.addColorStop(
          0,
          "rgba(0,0,0,0.05)"
        );

        overlay.addColorStop(
          0.55,
          "rgba(0,0,0,0.04)"
        );

        overlay.addColorStop(
          1,
          "rgba(0,0,0,0.18)"
        );

        ctx.fillStyle = overlay;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          HEIGHT
        );

        /*
         * =================================================
         * PROFILE PICTURE
         *
         * Centered horizontally
         * Slightly above center
         * =================================================
         */

        const centerX =
          WIDTH / 2;

        const profileY = 245;

        const radius = 118;

        if (profileImage) {
          drawProfile(
            ctx,
            profileImage,
            centerX,
            profileY,
            radius
          );
        } else {
          drawEmptyProfile(
            ctx,
            centerX,
            profileY,
            radius
          );
        }

        /*
         * =================================================
         * USER NAME
         * =================================================
         */

        let name =
          String(userName);

        if (name.length > 26) {
          name =
            name.substring(
              0,
              23
            ) + "...";
        }

        drawOutlinedText(
          ctx,
          name,
          centerX,
          430,
          46,
          "bold",
          "#ffffff",
          "#000000",
          7
        );

        /*
         * =================================================
         * WELCOME
         * =================================================
         */

        drawOutlinedText(
          ctx,
          "WELCOME",
          centerX,
          500,
          68,
          "bold",
          "#ffffff",
          "#000000",
          9
        );

        /*
         * =================================================
         * SAVE CARD
         * =================================================
         */

        outputPath =
          path.join(
            cacheDir,
            `welcome_${userID}_${Date.now()}.png`
          );

        await fs.writeFile(
          outputPath,
          canvas.toBuffer("image/png")
        );

        /*
         * =================================================
         * WELCOME MESSAGE
         * =================================================
         */

        const welcomeMessage =
`‎𝐇𝐞𝐥𝐥𝐨 ${userName}
𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩 🎉
𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐬𝐭𝐚𝐲 𝐡𝐞𝐫𝐞 ❤️`;

        /*
         * =================================================
         * SEND CARD + MESSAGE
         * =================================================
         */

        await api.sendMessage(
          {
            body: welcomeMessage,

            attachment:
              fs.createReadStream(
                outputPath
              ),

            mentions: [
              {
                tag: userName,
                id: userID
              }
            ]
          },
          event.threadID
        );

        /*
         * =================================================
         * REMOVE TEMP FILE
         * =================================================
         */

        await fs.remove(
          outputPath
        );

        outputPath = null;

      } catch (error) {
        console.error(
          "WELCOME CARD ERROR:",
          error
        );

        if (outputPath) {
          await fs.remove(
            outputPath
          ).catch(() => {});
        }
      }
    }
  }
};


/*
 * =========================================================
 * DRAW BACKGROUND AS COVER
 * =========================================================
 */

function drawCover(
  ctx,
  image,
  width,
  height
) {
  const imageRatio =
    image.width /
    image.height;

  const canvasRatio =
    width /
    height;

  let drawWidth;
  let drawHeight;
  let x;
  let y;

  if (
    imageRatio >
    canvasRatio
  ) {
    drawHeight = height;

    drawWidth =
      height *
      imageRatio;

    x =
      (width -
        drawWidth) /
      2;

    y = 0;
  } else {
    drawWidth = width;

    drawHeight =
      width /
      imageRatio;

    x = 0;

    y =
      (height -
        drawHeight) /
      2;
  }

  ctx.drawImage(
    image,
    x,
    y,
    drawWidth,
    drawHeight
  );
}


/*
 * =========================================================
 * DRAW PROFILE PICTURE
 *
 * Thick black outline
 * White inner border
 * =========================================================
 */

function drawProfile(
  ctx,
  image,
  x,
  y,
  radius
) {
  ctx.save();

  /*
   * Black outer stroke
   */

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius + 12,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(0,0,0,0.75)";

  ctx.shadowColor =
    "rgba(0,0,0,0.75)";

  ctx.shadowBlur = 25;

  ctx.fill();

  /*
   * White thin inner border
   */

  ctx.shadowBlur = 0;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius + 5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#ffffff";

  ctx.fill();

  /*
   * Clip profile image
   */

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.clip();

  const scale =
    Math.max(
      (radius * 2) /
        image.width,

      (radius * 2) /
        image.height
    );

  const width =
    image.width *
    scale;

  const height =
    image.height *
    scale;

  ctx.drawImage(
    image,
    x -
      width / 2,
    y -
      height / 2,
    width,
    height
  );

  ctx.restore();
}


/*
 * =========================================================
 * FALLBACK IF PFP CANNOT BE FETCHED
 * =========================================================
 */

function drawEmptyProfile(
  ctx,
  x,
  y,
  radius
) {
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius + 12,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#000000";

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius + 5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#ffffff";

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#222222";

  ctx.fill();

  ctx.restore();
}


/*
 * =========================================================
 * OUTLINED TEXT
 *
 * White text
 * Black thick stroke
 * Shadow
 * =========================================================
 */

function drawOutlinedText(
  ctx,
  text,
  x,
  y,
  size,
  weight,
  fill,
  stroke,
  lineWidth
) {
  ctx.save();

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.font =
    `${weight} ${size}px Sans`;

  /*
   * Shadow
   */

  ctx.shadowColor =
    "rgba(0,0,0,0.90)";

  ctx.shadowBlur = 14;

  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  /*
   * Stroke
   */

  ctx.lineJoin =
    "round";

  ctx.lineWidth =
    lineWidth;

  ctx.strokeStyle =
    stroke;

  ctx.strokeText(
    text,
    x,
    y
  );

  /*
   * Main text
   */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    fill;

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.restore();
}