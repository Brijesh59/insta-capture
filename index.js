const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

const captureScreenshot = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.instagram.com/${process.env.INSTAGRAM_USERNAME}/`,
    { waitUntil: "networkidle0" }
  );
  const screenshot = await page.screenshot();

  // Uploading the screenshot to the S3 bucket
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: new Date().toDateString() + ".png",
    Body: screenshot,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Screenshot successfully uploaded to ${data.Location}`);
    }
  });

  await browser.close();
};

captureScreenshot();
