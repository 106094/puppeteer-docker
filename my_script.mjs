import fs from 'node:fs/promises';
import puppeteer, { executablePath } from 'puppeteer';

const url        = process.env.TARGET_URL        || 'chrome://version';
const outDir     = process.env.OUTPUT_DIR        || '/output';
const shotFile   = process.env.OUTPUT_FILE       || 'screenshot.png';
const textFile   = process.env.OUTPUT_TEXT_FILE  || 'content.txt';
const selector   = process.env.TARGET_SELECTOR   || null;

// IMPORTANT: resolve the browser that’s already in the image
const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || executablePath();
console.log('Using browser at:', execPath);

const browser = await puppeteer.launch({
  executablePath: execPath,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('body', { timeout: 30000 });

  let text;
  if (selector) {
    const exists = await page.$(selector);
    text = exists ? await page.$eval(selector, el => (el.innerText || '').trim()) : '';
  } else {
    text = await page.evaluate(() => (document.body.innerText || '').trim());
  }
  text = text.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  await fs.mkdir(outDir, { recursive: true });
  await page.screenshot({ path: `${outDir}/${shotFile}`, fullPage: true });
  await fs.writeFile(`${outDir}/${textFile}`, text, 'utf8');

  console.log(`Saved screenshot → ${outDir}/${shotFile}`);
  console.log(`Saved text      → ${outDir}/${textFile}`);
} finally {
  await browser.close();
}

