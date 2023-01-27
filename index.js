const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME;

// AWS S3 configuration
AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

const captureScreenshot = async () => {
  console.log("Opening browser");
  const browser = await puppeteer.launch();

  console.log("Opening a new Page");
  const page = await browser.newPage();

  console.log("Opening instagram");
  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
    waitUntil: "networkidle0",
  });

  console.log("Taking screenshot");
  const screenshot = await page.screenshot();

  // Uploading the screenshot to the S3 bucket
  const params = {
    Bucket: BUCKET_NAME,
    Key: new Date().toDateString() + ".png",
    Body: screenshot,
  };

  console.log("Uploading to S3");
  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error while uploading to S3", err);
    } else {
      console.log(`Screenshot successfully uploaded to ${data.Location}`);
    }
  });

  console.log("Closing browser");
  await browser.close();
};

// https://crontab.guru/every-day11am
cron.schedule("0 11 * * *", () => {
  console.log("Initiate screenshot catpure at " + new Date().toLocaleString());
  captureScreenshot();
});
