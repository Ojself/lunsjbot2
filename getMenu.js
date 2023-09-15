const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const { askChatGpt } = require("./chatGpt");

const getMenu = async () => {

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],

  });
  const page = await browser.newPage();
  await page.goto("https://tullin.munu.shop/meny");
  const html = await page.content();
  const $ = cheerio.load(html);

  const result = await askChatGpt($('div.grid-container p span').text().replace(/\n/g, " ").trim())
  return JSON.parse(result.data.choices[0].message.content)
};

module.exports = { getMenu };