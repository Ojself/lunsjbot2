require("dotenv").config();
const Axios = require("axios");
const nodeCron = require("node-cron");

const { getMenu } = require("./getMenu");
const { generateSlackBlocks } = require("./generateSlackBlocks");

const sendToSlackChannel = async (blocks) => {
  try {
    await Axios.post(process.env.SLACK_WEBHOOK_URL, {
      channel: "lunsj",
      text: "Dagens lunsj - Smaus",
      blocks,
    });
  } catch (err) {
    console.warn(err);
  }
};

const main = async () => {
  let menu;
  try {
    menu = await getMenu();
  } catch (e) {
    console.error("Something went wrong while fetching menu from Smaus: \n", e);
    return;
  }
  // menu looks like this:
  /*

  [
    [
        'Svinekam\nmed potetpure og broccoli.',
        'Vegetar: Potetpure med broccolimedaljong.',
        'Suppe: Maissuppe'
    ]
    [
      ...
    ]
    ...
  ],

  */
  const todaysWeekdayIndex = new Date().getDay() - 1;

  const todaysMenu = menu[todaysWeekdayIndex];
  if (!todaysMenu) {
    console.warn("Something went wrong: missing menu for today");
    return;
  }

  const blocks = generateSlackBlocks(todaysMenu);
  try {
    await sendToSlackChannel(blocks);
  } catch (e) {
    console.error("Something went wrong while sending to slack: \n", e);
  }
};

const job = nodeCron.schedule("0 9 * * 1-5", main);