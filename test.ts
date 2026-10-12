import puppeteer, { Page, Puppeteer, Browser, executablePath } from "puppeteer";




const browser = await puppeteer.launch({
  executablePath: "D:/deno-puppeteer/chrome-win64/chrome.exe",
  headless: "new",
  args: [
    "--no-sandbox",
    // "--disable-dev-shm-usage", // /dev/shmの使用を無効化
    // "--no-zygote", // Zygoteプロセスを無効化
    // "--single-process", // 単一プロセスで実行
    // "--disable-software-rasterizer", // ソフトウェアラスタライザーを無効化
  ],
});


const page = await browser.newPage();
await page.goto("https://jp.mercari.com/search?category_id=1328", {
  waitUntil: "domcontentloaded",
  timeout: 20000,
});
// await page.waitForNavigation({ timeout: 20000 });
await page.setViewport({ width: 1080, height: 5500 });

await page.waitForSelector(
  'div[data-testid="search-item-grid"] > ul > li[data-testid="item-cell"]',
  20000
);

const parentElements = await page.$$(
  'div[data-testid="search-item-grid"] > ul > li[data-testid="item-cell"]'
);
if (parentElements.length == 0) {
  throw new Error("Cannot get itemUrlList");
}
console.log(parentElements)

const itemUrlList = await Promise.all(
  parentElements.map(async (el) => {
    try {
      const urlElement = await el.$("div > a");
      // const productNameElement = await el.$(
      //   "span[data-testid='thumbnail-item-name']"
      // );
      // if (!urlElement || !productNameElement) {
      //   return;
      // }
      const url = await urlElement.evaluate((el) => el.href);
      // const productName = await page.evaluate(
      //   (el) => el.textContent,
      //   productNameElement
      // );
      // if (!url || !productName) {
      //   return;
      // }
      // for (const forbiddenString of filter) {
      //   if (productName.includes(forbiddenString)) {
      //     return;
      //   }
      // }
      return url;
    } catch (error) {
      return;
    }
  })
);

console.log(itemUrlList)


await browser.close();
