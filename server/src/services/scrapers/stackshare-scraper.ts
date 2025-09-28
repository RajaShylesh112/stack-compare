import puppeteer from 'puppeteer';
import { load } from 'cheerio';

interface ScrapedStackData {
  projectName: string;
  technologies: string[];
}

async function scrapeStackShare(url: string): Promise<ScrapedStackData | null> {
  let browser;
  try {
    console.log(`Launching browser for ${url}...`);
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Page loaded. Parsing content...');
    const content = await page.content();
    const $ = load(content);

    const projectName = $('div.stack-name-container h1').text().trim();
    if (!projectName) {
      console.warn(`Could not find project name for ${url}`);
      return null;
    }

    const technologies: string[] = [];
    $('a[href^="/s/"]').each((_, element) => {
      const techName = $(element).text().trim();
      if (techName) {
        technologies.push(techName);
      }
    });

    if (technologies.length === 0) {
      console.warn(`No technologies found for ${projectName} at ${url}`);
    }

    console.log(`Successfully scraped ${projectName} with ${technologies.length} technologies.`);
    return { projectName, technologies };

  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

export async function scrapeStackShareBatch(urls: string[]): Promise<ScrapedStackData[]> {
  const results: ScrapedStackData[] = [];
  for (const url of urls) {
    const result = await scrapeStackShare(url);
    if (result) {
      results.push(result);
    }
  }
  return results;
}
