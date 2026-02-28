const { chromium } = require('playwright');

async function scrapeAndSum(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Wait for tables to load dynamically, then extract all text
  await page.waitForSelector('table', { timeout: 10000 });
  const tableText = await page.$$eval('table', tables => 
    tables.map(table => table.innerText).join(' ')
  );
  
  await browser.close();
  
  // Extract numbers (handles decimals/negatives), sum them
  const numbers = tableText.match(/-?\d*\.?\d+/g).map(Number);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum;
}

async function main() {
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=63',
    'https://sanand0.github.io/tdsdata/js_table/?seed=64',
    'https://sanand0.github.io/tdsdata/js_table/?seed=65',
    'https://sanand0.github.io/tdsdata/js_table/?seed=66',
    'https://sanand0.github.io/tdsdata/js_table/?seed=67',
    'https://sanand0.github.io/tdsdata/js_table/?seed=68',
    'https://sanand0.github.io/tdsdata/js_table/?seed=69',
    'https://sanand0.github.io/tdsdata/js_table/?seed=70',
    'https://sanand0.github.io/tdsdata/js_table/?seed=71',
    'https://sanand0.github.io/tdsdata/js_table/?seed=72'
  ];
  
  let totalSum = 0;
  for (const url of urls) {
    console.log(`Scraping ${url}...`);
    const sum = await scrapeAndSum(url);
    console.log(`Sum for ${url}: ${sum}`);
    totalSum += sum;
  }
  
  console.log(`\n🎉 GRAND TOTAL SUM OF ALL TABLES: ${totalSum}`);
}

main().catch(console.error);
