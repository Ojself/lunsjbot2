const foodEmojis = require("./emojis/food_emojis.json");
const variousFoodEmojis = require("./emojis/variousFoodEmojis.json");
const foodEmojiKeys = Object.keys(foodEmojis);

const getRandomElementFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getEmojis = (dish, maxAmountEmojis = 3) => {
  const emojis = new Set();
  const splittedDish = dish.split(" ");

  splittedDish.forEach((word) => {
    const wordLow = word
      .toLowerCase()
      .replace(/[^a-z|æøå|éèáà|äöë]/g, ""); /* TODO, this might be wrong */
    if (foodEmojiKeys.includes(wordLow) && emojis.size < maxAmountEmojis) {
      emojis.add(
        Array.isArray(foodEmojis[wordLow])
          ? getRandomElementFromArray(foodEmojis[wordLow])
          : foodEmojis[wordLow]
      );
    }
  });

  // Adds general emojis if specific ones are not found
  while (emojis.size < maxAmountEmojis) {
    emojis.add(getRandomElementFromArray(variousFoodEmojis));
  }
  return Array.from(emojis).join(" ");
};

const generateSlackBlocks = (menu) => {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const today = dd + "/" + mm;
  // (23/09)

  const generalInfo = {
    type: "header",
    text: {
      type: "plain_text",
      text: `(${today}) Dagens meny - Smaus `,
      emoji: false,
    },
  };

  const divider = { type: "divider" };

  const menuOverview = menu.map((dish, i) => {
    /* const accessory = {
      type: "image",
      image_url: urls[i],
      alt_text: dish,
    }; */
    const block = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${dish}*\n${getEmojis(dish)} `,
      },
      /* accessory, */
    };
    return block;
  });

  const githubInfo = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Lunsjbot2.0 is experimental and <https://github.com/Ojself/lunsjbot2|open source> \n AI generated images coming soon to a slack channel near you!",
    },
  };

  return [generalInfo, divider, ...menuOverview, divider, githubInfo];
};

module.exports = { generateSlackBlocks };
