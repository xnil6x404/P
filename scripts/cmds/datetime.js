const NepaliDate = require('nepali-date');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "datetime",
    aliases: ["dt"],
    version: "1.3",
    author: "xnil",
    countDown: 1,
    role: 0,
    shortDescription: "Displays the current date and time in BANGLADESH.",
    longDescription: "",
    category: "Date-Time",
    envConfig: {}
  },
  onStart: async function({ message, args }) {
    const nepalTime = moment.tz("Asia/Dhaka").format("h:mm:ss A");
    const nepaliDate = new NepaliDate(new Date());
    const bsDateStr = nepaliDate.format("dddd, DD MMMM YYYY");

    const reply = `Today Date & Time in BANGLADESH:\n` +
                  `☛Date: ${moment.tz("Asia/Dhaka").format("dddd, DD MMMM YYYY")}\n` +
                  `☛Time: ${nepalTime}\n`

    message.reply(reply);
  },
  onEvent: async function() {}
};
