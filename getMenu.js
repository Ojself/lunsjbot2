const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getMenu = async () => {

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],

  });
  const page = await browser.newPage();
  await page.goto("https://tullin.munu.shop/meny");
  const html = await page.content();
  const $ = cheerio.load(html);


const daysOfWeek = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
const textContent = [];

$('div.grid-container p span').each((index, element) => {
  const spanTexts = $(element).find('span').map((spanIndex, spanElement) => {
    return $(spanElement).text().replace(/\n/g, " ").replace(new RegExp(daysOfWeek.join('|'), 'g'), '').trim();
  }).get().filter((word) => word.length > 0);

  if (spanTexts.length > 0 && spanTexts.some(str => str.includes("Vegetar"))) {
    if (spanTexts.length == 1) {
      textContent.push(spanTexts[0].split(/(?=Vegetar:|Suppe:)/).map(str => str.trim()))
    } else {
      textContent.push(spanTexts);
    }
  }
});

return textContent;

};

module.exports = { getMenu };