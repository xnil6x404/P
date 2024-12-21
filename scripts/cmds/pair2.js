const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pair2",
    author: "Rulex-al LOUFI",
    version: "1.0",
    role: 0,
    shortDescription: "Pair with random people 😗",
    category: "fun",
    guide: "{prefix}pair"
  },

  onStart: async function({ event, threadsData, message, usersData }) {
    const pathImg = __dirname + "/cache/background.png";

    // Get sender info
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadData = await threadsData.get(event.threadID);

    // Filter eligible members
    const members = threadData.members.filter(member => member.inGroup);
    if (members.length === 0)
      return message.reply("There are no members in the group ☹️💕😢");

    const senderGender = threadData.members.find(member => member.userID === senderID)?.gender;
    const eligibleMembers = members.filter(
      member => member.gender !== senderGender && member.userID !== senderID
    );

    if (eligibleMembers.length === 0)
      return message.reply("There are no suitable members for pairing ☹️💕😢");

    // Select a random partner
    const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
    const partner = eligibleMembers[randomIndex];
    const partnerID = partner.userID;
    const partnerName = await usersData.getName(partnerID);

    // Fetch avatars with error handling
    try {
      const senderAvatarUrl = await usersData.getAvatarUrl(senderID);
      const partnerAvatarUrl = await usersData.getAvatarUrl(partnerID);

      if (!senderAvatarUrl || !partnerAvatarUrl) {
        return message.reply("Could not fetch avatars for pairing.");
      }

      const senderAvatar = await loadImage(senderAvatarUrl);
      const partnerAvatar = await loadImage(partnerAvatarUrl);

      // Load random background with error handling
      const backgrounds = [
        "https://i.postimg.cc/wjJ29HRB/background1.png",
        "https://i.postimg.cc/zf4Pnshv/background2.png",
        "https://i.postimg.cc/5tXRQ46D/background3.png"
      ];
      const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const response = await axios.get(randomBackground, { responseType: "arraybuffer" });
      const background = await loadImage(Buffer.from(response.data, "binary"));

      // Generate canvas
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(senderAvatar, 100, 150, 300, 300);
      ctx.drawImage(partnerAvatar, 900, 150, 300, 300);

      // Draw text
      const lovePercentage = Math.floor(Math.random() * 36) + 65;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px Arial";
      ctx.fillText(`❤️ ${senderName} 💕 ${partnerName} ❤️`, 150, 500);
      ctx.fillText(`Love percentage: ${lovePercentage}% 💕`, 150, 580);

      // Save and send the image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      return message.reply({
        body: `🥰 Successful pairing! ❤️\nLove percentage: ${lovePercentage}% 💕`,
        attachment: fs.createReadStream(pathImg)
      }, () => fs.unlinkSync(pathImg));

    } catch (error) {
      console.error("Error during pairing:", error);
      return message.reply("An error occurred while pairing. Please try again.");
    }
  }
};