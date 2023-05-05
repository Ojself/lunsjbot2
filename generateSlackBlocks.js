const foodEmojis = require("./emojis/food_emojis.json");
const categoryEmojis = require("./emojis/category_emojis.json");
const foodEmojiKeys = Object.keys(foodEmojis);

const getRandomElementFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getEmojis = (dish, maxAmountEmojis = 3) => {
  const emojis = new Set();
  const splittedDish = dish.split(" ");

  splittedDish.forEach((word) => {
    const wordLow = word.toLowerCase().replace(/[^a-z|æøå|éèáà|äöë]/g, "");
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
    const category = dish?.category?.name ? dish.category.name : "variousFood";
    emojis.add(getRandomElementFromArray(categoryEmojis[category]));
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
  const menuOverview = menu.map((dish) => {
    const block = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${dish}*\n${getEmojis(dish)}`,
      },
    };
    return block;
  });

  const githubInfo = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Lunsjbot is experimental and <https://github.com/Ojself/lunsjbot|open source>",
    },
  };

  return [generalInfo, divider, ...menuOverview, divider, githubInfo];
};

module.exports = { generateSlackBlocks };
