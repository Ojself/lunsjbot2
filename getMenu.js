const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getMenu = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://tullin.munu.shop/meny");
  const html = await page.content();
  const $ = cheerio.load(html);

  const menu = [];

  $(".static-container ul").each((index, element) => {
    const items = $(element)
      .find("li")
      .toArray()
      .map((item) => $(item).text().replace(/\n/g, " ").trim());
    menu.push(items);
  });

  await browser.close();
  return menu;
};

module.exports = { getMenu };
