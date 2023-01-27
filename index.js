const puppeteer = require("puppeteer");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME;

const captureScreenshot = async () => {
  console.log("Opening browser");
  const browser = await puppeteer.launch();

  console.log("Opening a new Page");
  const page = await browser.newPage();

  console.log("Opening instagram");
  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
    waitUntil: "networkidle0",
  });

  console.log("Taking screenshot and saving locally");
  await page.screenshot({
    path: `/Users/infinity/Pictures/screenshots/insta-capture/${new Date().toDateString()}.png`,
    fullPage: true,
  });

  console.log("Closing browser");
  await browser.close();
};

// https://crontab.guru/every-day11am
cron.schedule("0 11 * * *", () => {
  console.log("Initiate screenshot catpure at " + new Date().toLocaleString());
  captureScreenshot();
});
