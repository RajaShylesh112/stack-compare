import { db } from '../database/connection';
import { technologyStacks } from '../database/schema';
import { eq } from 'drizzle-orm';
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const techFilePath = path.join(__dirname, '../../data/technologies.json');

interface TechSeed {
  name: string;
  category: string;
  githubRepo: string;
}

async function getNPMPackageName(githubRepo: string): Promise<string | null> {
  try {
    const [owner, repo] = githubRepo.split('/');
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    });

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const pkg = JSON.parse(content);
      return pkg.name;
    }
    return null;
  } catch (error) {
    // console.error(`Failed to get package.json for ${githubRepo}:`, error);
    return null;
  }
}

async function getDownloads(npmPackage: string): Promise<number | null> {
  if (!npmPackage) return null;
  try {
    const response = await axios.get(
      `https://api.npmjs.org/downloads/point/last-month/${npmPackage}`
    );
    return response.data.downloads;
  } catch (error) {
    // console.error(`Failed to get downloads for ${npmPackage}:`, error);
    return null;
  }
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  const techSeed: TechSeed[] = JSON.parse(fs.readFileSync(techFilePath, 'utf-8'));

  for (const tech of techSeed) {
    try {
      console.log(`Processing ${tech.name}...`);
      const [owner, repo] = tech.githubRepo.split('/');

      const { data: repoData } = await octokit.repos.get({ owner, repo });

      const npmPackageName = await getNPMPackageName(tech.githubRepo);
      const monthlyDownloads = await getDownloads(npmPackageName);

      const existingTech = await db
        .select()
        .from(technologyStacks)
        .where(eq(technologyStacks.name, tech.name));

      const dataToInsert = {
        name: tech.name,
        category: tech.category,
        description: repoData.description,
        githubUrl: repoData.html_url,
        // stars: repoData.stargazers_count,
        // forks: repoData.forks_count,
        // openIssues: repoData.open_issues_count,
        // npmPackage: npmPackageName,
        // monthlyDownloads: monthlyDownloads,
        updatedAt: new Date(),
      };

      if (existingTech.length > 0) {
        console.log(`Updating existing technology: ${tech.name}`);
        await db
          .update(technologyStacks)
          .set(dataToInsert)
          .where(eq(technologyStacks.id, existingTech[0].id));
      } else {
        console.log(`Inserting new technology: ${tech.name}`);
        await db.insert(technologyStacks).values({
          ...dataToInsert,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error(`❌ Failed to process ${tech.name}:`, (error as Error).message);
    }
  }

  console.log('✅ Database seeding completed.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('🔥 Seeding failed:', error);
  process.exit(1);
});
