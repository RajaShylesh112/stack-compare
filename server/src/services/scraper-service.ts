import { db } from '../database/connection';
import { projects, technologyStacks, projectStacks } from '../database/schema';
import { scrapeStackShareBatch } from './scrapers/stackshare-scraper';
import { inArray } from 'drizzle-orm';

export class ScraperService {
  public async processStackShareUrls(urls: string[]) {
    console.log('Starting to scrape URLs...');
    const scrapedData = await scrapeStackShareBatch(urls);

    if (scrapedData.length === 0) {
      console.log('No data was scraped. Exiting service.');
      return;
    }

    console.log(`Scraped ${scrapedData.length} projects. Processing and saving to database...`);

    for (const data of scrapedData) {
      try {
        // Step 1: Upsert the project
        const insertedProject = await db
          .insert(projects)
          .values({ name: data.projectName })
          .onConflictDoUpdate({
            target: projects.name,
            set: { updatedAt: new Date() },
          })
          .returning({ id: projects.id });

        const projectId = insertedProject[0].id;
        if (!projectId) {
          console.warn(`Failed to insert or find project: ${data.projectName}`);
          continue;
        }

        // Step 2: Find the IDs of the scraped technologies
        const techNames = data.technologies;
        if (techNames.length === 0) {
            console.log(`No technologies to process for ${data.projectName}.`);
            continue;
        }

        const existingTechs = await db
          .select({
            id: technologyStacks.id,
            name: technologyStacks.name,
          })
          .from(technologyStacks)
          .where(inArray(technologyStacks.name, techNames));

        const existingTechIds = existingTechs.map((t: { id: string; name: string }) => t.id);
        const foundTechNames = existingTechs.map((t: { id: string; name: string }) => t.name);
        
        // Log technologies that were not found in our DB
        const notFoundTechs = techNames.filter(t => !foundTechNames.includes(t));
        if (notFoundTechs.length > 0) {
            console.warn(`Could not find the following technologies for ${data.projectName}: ${notFoundTechs.join(', ')}. They will be skipped.`);
        }

        if (existingTechIds.length === 0) {
            console.log(`No matching technologies in the database for ${data.projectName}.`);
            continue;
        }

        // Step 3: Create the relationships in the project_stacks table
        const stackRelations = existingTechIds.map((techId: string) => ({
          projectId: projectId,
          technologyId: techId,
        }));

        // Using onConflictDoNothing to avoid errors if a relationship already exists.
        await db
            .insert(projectStacks)
            .values(stackRelations)
            .onConflictDoNothing();

        console.log(`Successfully processed and saved stack for ${data.projectName}.`);

      } catch (error) {
        console.error(`Error processing project ${data.projectName}:`, error);
      }
    }
    console.log('Finished processing all scraped data.');
  }
}
