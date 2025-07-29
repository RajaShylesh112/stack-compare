require('dotenv').config();
const FrameworkModel = require('./models/framework-model');
const QdrantService = require('./services/qdrant-service');
const AppwriteService = require('./services/appwrite-service');
const ScoringService = require('./services/scoring-service');
const GitHubCollector = require('./collectors/github-collector');
const NPMCollector = require('./collectors/npm-collector');

class TechFrameworkDB {
  constructor() {
    this.qdrant = new QdrantService();
    this.appwrite = new AppwriteService();
    this.scoring = new ScoringService();
    this.github = new GitHubCollector();
    this.npm = new NPMCollector();
  }

  async initialize() {
    console.log('Initializing TechFrameworkDB...');
    try {
      const qdrantInitialized = await this.qdrant.initializeCollection();
      if (!qdrantInitialized) {
        console.warn('Qdrant initialization failed. Some features may be limited.');
      }
      console.log('System initialized successfully!');
      return true;
    } catch (error) {
      console.error('Error during initialization:', error.message);
      console.warn('System initialized with limited functionality.');
      return false;
    }
  }

  async processFramework(frameworkData) {
    try {
      // Enhance with external data
      let enhancedData = { ...frameworkData };
      
      // Get GitHub data if repository URL is provided
      if (frameworkData.githubUrl) {
        const [owner, repo] = frameworkData.githubUrl.split('/').slice(-2);
        const githubData = await this.github.getRepositoryData(owner, repo);
        if (githubData) {
          enhancedData = { ...enhancedData, ...githubData };
          enhancedData.contributors = await this.github.getContributorsCount(owner, repo);
        }
      }
      
      // Get NPM data if it's a Node.js package
      if (frameworkData.language === 'JavaScript' && frameworkData.name) {
        const npmData = await this.npm.getPackageData(frameworkData.name);
        if (npmData) {
          enhancedData.npmDownloads = npmData.monthlyDownloads;
          enhancedData.tags = [...(enhancedData.tags || []), ...npmData.keywords];
        }
      }
      
      // Calculate scores
      enhancedData.category = this.scoring.categorizeFramework(enhancedData);
      enhancedData.performanceScore = this.scoring.calculatePerformanceScore();
      enhancedData.scalabilityScore = this.scoring.calculateScalabilityScore(enhancedData);
      enhancedData.communityScore = this.scoring.calculateCommunityScore(enhancedData);
      enhancedData.realtimeSupport = this.scoring.determineRealtimeSupport(enhancedData);
      
      // Create framework model
      const framework = new FrameworkModel(enhancedData);
      
      // Store in both databases
      const [appwriteResult, qdrantResult] = await Promise.all([
        this.appwrite.createFramework(framework),
        this.qdrant.upsertFramework(framework)
      ]);
      
      if (appwriteResult && qdrantResult) {
        console.log(`✅ Successfully processed: ${framework.name}`);
        return { success: true, framework };
      } else {
        console.log(`❌ Failed to process: ${framework.name}`);
        return { success: false, error: 'Storage failed' };
      }
    } catch (error) {
      console.error('Error processing framework:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkProcessFrameworks(frameworksData) {
    console.log(`Processing ${frameworksData.length} frameworks...`);
    const results = [];
    
    for (const frameworkData of frameworksData) {
      const result = await this.processFramework(frameworkData);
      results.push(result);
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Processed ${successful}/${frameworksData.length} frameworks successfully`);
    
    return results;
  }

  async searchFrameworks(query, filters = {}) {
    // Combine vector search with traditional filtering
    const [vectorResults, traditionalResults] = await Promise.all([
      this.qdrant.searchSimilarFrameworks(query, 20),
      this.appwrite.getFrameworks(filters)
    ]);
    
    // Merge and deduplicate results
    const combined = [...vectorResults];
    traditionalResults.forEach(traditional => {
      if (!combined.find(v => v.name === traditional.name)) {
        combined.push({ ...traditional, similarity: 0 });
      }
    });
    
    return combined.sort((a, b) => b.similarity - a.similarity);
  }
}

// Example usage
async function main() {
  const db = new TechFrameworkDB();
  await db.initialize();
  
  // Example: Process a single framework
  const exampleFramework = {
    name: 'Express.js',
    githubUrl: 'https://github.com/expressjs/express',
    language: 'JavaScript',
    tags: ['web', 'framework', 'nodejs'],
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
  };
  
  await db.processFramework(exampleFramework);
  
  // Example: Search frameworks
  const results = await db.searchFrameworks('fast web framework', {
    category: 'backend',
    minScore: 70
  });
  
  console.log('Search results:', results);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TechFrameworkDB;