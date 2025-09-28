import { ScraperService } from '../services/scraper-service';

// A list of StackShare URLs to scrape.
// This should be expanded with more URLs for a full run.
const targetUrls = [
  'https://stackshare.io/uber/uber',
  'https://stackshare.io/airbnb/airbnb',
  'https://stackshare.io/netflix/netflix',
  // Add more URLs here
];

async function main() {
  console.log('Initializing Scraper Service...');
  const scraperService = new ScraperService();

  try {
    await scraperService.processStackShareUrls(targetUrls);
    console.log('Scraping script finished successfully.');
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
    process.exit(1);
  }
}

main();
