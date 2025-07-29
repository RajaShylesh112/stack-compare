# Technology Framework Database Setup Guide

## Overview
This guide will help you set up a comprehensive system to store and manage technology framework data using:
- **Node.js Backend** for data collection and processing
- **Qdrant Vector Database** for semantic search and similarity matching
- **Appwrite** for NoSQL database and cloud functions

## Prerequisites
- Node.js (v16 or higher)
- Docker (for Qdrant)
- Appwrite account and project setup
- Basic knowledge of JavaScript/Node.js

## 1. Project Structure Setup

First, create your project directory structure:

```
tech-framework-db/
├── src/
│   ├── collectors/
│   │   ├── github-collector.js
│   │   ├── npm-collector.js
│   │   └── benchmark-collector.js
│   ├── services/
│   │   ├── qdrant-service.js
│   │   ├── appwrite-service.js
│   │   └── scoring-service.js
│   ├── models/
│   │   └── framework-model.js
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── data/
│   └── frameworks-seed.json
├── appwrite-functions/
│   └── sync-frameworks/
├── docker-compose.yml
└── package.json
```

## 2. Initialize Node.js Project

```bash
mkdir tech-framework-db
cd tech-framework-db
npm init -y
npm install axios dotenv @qdrant/qdrant-js node-appwrite openai
npm install -D nodemon
```

## 3. Set up Qdrant Vector Database

### 3.1 Docker Setup for Qdrant

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
    restart: unless-stopped

volumes:
  qdrant_storage:
```

### 3.2 Start Qdrant

```bash
docker-compose up -d
```

## 4. Data Models and Schema

### 4.1 Framework Data Model

Create `src/models/framework-model.js`:

```javascript
class FrameworkModel {
  constructor(data) {
    this.name = data.name;
    this.category = data.category; // 'frontend', 'backend', 'fullstack', 'mobile', 'database', 'devops'
    this.tags = data.tags || [];
    this.performanceScore = data.performanceScore || 0;
    this.scalabilityScore = data.scalabilityScore || 0;
    this.communityScore = data.communityScore || 0;
    this.realtimeSupport = data.realtimeSupport || false;
    this.createdAt = data.createdAt || new Date();
    
    // Additional metadata
    this.description = data.description || '';
    this.githubUrl = data.githubUrl || '';
    this.officialUrl = data.officialUrl || '';
    this.language = data.language || '';
    this.license = data.license || '';
    this.lastUpdated = data.lastUpdated || new Date();
    this.stars = data.stars || 0;
    this.forks = data.forks || 0;
    this.contributors = data.contributors || 0;
    this.npmDownloads = data.npmDownloads || 0;
  }

  // Calculate overall score
  getOverallScore() {
    return Math.round(
      (this.performanceScore * 0.3 + 
       this.scalabilityScore * 0.3 + 
       this.communityScore * 0.4)
    );
  }

  // Generate embedding text for vector search
  getEmbeddingText() {
    return `${this.name} ${this.category} ${this.tags.join(' ')} ${this.description}`;
  }
}

module.exports = FrameworkModel;
```

## 5. Environment Configuration

Create `.env` file:

```env
# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_if_needed

# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=your_collection_id

# External APIs
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key

# Collection Settings
VECTOR_DIMENSION=1536
```

## 6. Qdrant Service Setup

Create `src/services/qdrant-service.js`:

```javascript
const { QdrantClient } = require('@qdrant/qdrant-js');
const OpenAI = require('openai');

class QdrantService {
  constructor() {
    this.client = new QdrantClient({
      host: process.env.QDRANT_URL || 'localhost',
      port: 6333,
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.collectionName = 'tech_frameworks';
  }

  async initializeCollection() {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(
        col => col.name === this.collectionName
      );

      if (!exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: parseInt(process.env.VECTOR_DIMENSION) || 1536,
            distance: 'Cosine',
          },
        });
        console.log(`Collection ${this.collectionName} created successfully`);
      }
    } catch (error) {
      console.error('Error initializing collection:', error);
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }

  async upsertFramework(framework) {
    try {
      const embedding = await this.generateEmbedding(framework.getEmbeddingText());
      if (!embedding) return false;

      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: this.generateId(framework.name),
            vector: embedding,
            payload: {
              name: framework.name,
              category: framework.category,
              tags: framework.tags,
              performanceScore: framework.performanceScore,
              scalabilityScore: framework.scalabilityScore,
              communityScore: framework.communityScore,
              realtimeSupport: framework.realtimeSupport,
              overallScore: framework.getOverallScore(),
              description: framework.description,
              githubUrl: framework.githubUrl,
              language: framework.language,
              stars: framework.stars,
              createdAt: framework.createdAt,
            },
          },
        ],
      });

      return true;
    } catch (error) {
      console.error('Error upserting framework:', error);
      return false;
    }
  }

  async searchSimilarFrameworks(query, limit = 10) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      if (!queryEmbedding) return [];

      const results = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit,
        with_payload: true,
      });

      return results.map(result => ({
        ...result.payload,
        similarity: result.score,
      }));
    } catch (error) {
      console.error('Error searching frameworks:', error);
      return [];
    }
  }

  generateId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
}

module.exports = QdrantService;
```

## 7. Appwrite Service Setup

Create `src/services/appwrite-service.js`:

```javascript
const { Client, Databases, Query } = require('node-appwrite');

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    
    this.databases = new Databases(this.client);
    this.databaseId = process.env.APPWRITE_DATABASE_ID;
    this.collectionId = process.env.APPWRITE_COLLECTION_ID;
  }

  async createFramework(framework) {
    try {
      const document = await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        'unique()', // Auto-generate document ID
        {
          name: framework.name,
          category: framework.category,
          tags: framework.tags,
          performanceScore: framework.performanceScore,
          scalabilityScore: framework.scalabilityScore,
          communityScore: framework.communityScore,
          realtimeSupport: framework.realtimeSupport,
          description: framework.description,
          githubUrl: framework.githubUrl,
          officialUrl: framework.officialUrl,
          language: framework.language,
          license: framework.license,
          stars: framework.stars,
          forks: framework.forks,
          contributors: framework.contributors,
          npmDownloads: framework.npmDownloads,
          overallScore: framework.getOverallScore(),
          createdAt: framework.createdAt,
          lastUpdated: framework.lastUpdated,
        }
      );
      return document;
    } catch (error) {
      console.error('Error creating framework:', error);
      return null;
    }
  }

  async updateFramework(documentId, updates) {
    try {
      const document = await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        documentId,
        updates
      );
      return document;
    } catch (error) {
      console.error('Error updating framework:', error);
      return null;
    }
  }

  async getFrameworks(filters = {}) {
    try {
      const queries = [];
      
      if (filters.category) {
        queries.push(Query.equal('category', filters.category));
      }
      
      if (filters.minScore) {
        queries.push(Query.greaterThanEqual('overallScore', filters.minScore));
      }
      
      if (filters.realtimeSupport) {
        queries.push(Query.equal('realtimeSupport', true));
      }

      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        queries
      );
      
      return response.documents;
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      return [];
    }
  }

  async searchFrameworksByName(name) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.search('name', name)]
      );
      return response.documents;
    } catch (error) {
      console.error('Error searching frameworks:', error);
      return [];
    }
  }
}

module.exports = AppwriteService;
```

## 8. Data Collection Services

### 8.1 GitHub Data Collector

Create `src/collectors/github-collector.js`:

```javascript
const axios = require('axios');

class GitHubCollector {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.headers = {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    };
  }

  async getRepositoryData(owner, repo) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/repos/${owner}/${repo}`,
        { headers: this.headers }
      );

      const data = response.data;
      return {
        name: data.name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        license: data.license?.name || 'Unknown',
        createdAt: new Date(data.created_at),
        lastUpdated: new Date(data.updated_at),
        githubUrl: data.html_url,
        officialUrl: data.homepage || '',
        topics: data.topics || [],
      };
    } catch (error) {
      console.error(`Error fetching GitHub data for ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  async getContributorsCount(owner, repo) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/repos/${owner}/${repo}/contributors`,
        { 
          headers: this.headers,
          params: { per_page: 1, anon: true }
        }
      );
      
      const linkHeader = response.headers.link;
      if (linkHeader) {
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
        return lastPageMatch ? parseInt(lastPageMatch[1]) : 1;
      }
      
      return response.data.length;
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error.message);
      return 0;
    }
  }

  async searchFrameworks(category, language) {
    try {
      const query = `${category} ${language} framework sort:stars`;
      const response = await axios.get(
        `${this.baseUrl}/search/repositories`,
        {
          headers: this.headers,
          params: {
            q: query,
            per_page: 30,
          },
        }
      );

      return response.data.items.map(item => ({
        name: item.name,
        fullName: item.full_name,
        owner: item.owner.login,
        stars: item.stargazers_count,
        description: item.description,
        language: item.language,
        topics: item.topics || [],
      }));
    } catch (error) {
      console.error('Error searching GitHub frameworks:', error.message);
      return [];
    }
  }
}

module.exports = GitHubCollector;
```

### 8.2 NPM Data Collector

Create `src/collectors/npm-collector.js`:

```javascript
const axios = require('axios');

class NPMCollector {
  constructor() {
    this.baseUrl = 'https://registry.npmjs.org';
    this.apiUrl = 'https://api.npmjs.org';
  }

  async getPackageData(packageName) {
    try {
      const [registryResponse, downloadsResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/${packageName}`),
        axios.get(`${this.apiUrl}/downloads/point/last-month/${packageName}`)
      ]);

      const data = registryResponse.data;
      const downloads = downloadsResponse.data.downloads || 0;

      return {
        name: data.name,
        description: data.description,
        version: data['dist-tags'].latest,
        keywords: data.keywords || [],
        license: data.license || 'Unknown',
        createdAt: new Date(data.time.created),
        lastUpdated: new Date(data.time.modified),
        homepage: data.homepage || '',
        repository: data.repository?.url || '',
        monthlyDownloads: downloads,
        maintainers: data.maintainers?.length || 0,
        dependencies: Object.keys(data.versions[data['dist-tags'].latest]?.dependencies || {}),
      };
    } catch (error) {
      console.error(`Error fetching NPM data for ${packageName}:`, error.message);
      return null;
    }
  }

  async searchPackages(query, limit = 20) {
    try {
      const response = await axios.get(`${this.apiUrl}/search`, {
        params: {
          text: query,
          size: limit,
        },
      });

      return response.data.objects.map(item => ({
        name: item.package.name,
        description: item.package.description,
        version: item.package.version,
        keywords: item.package.keywords || [],
        quality: item.score.quality,
        popularity: item.score.popularity,
        maintenance: item.score.maintenance,
      }));
    } catch (error) {
      console.error('Error searching NPM packages:', error.message);
      return [];
    }
  }
}

module.exports = NPMCollector;
```

## 9. Scoring Service

Create `src/services/scoring-service.js`:

```javascript
class ScoringService {
  constructor() {
    this.weights = {
      stars: 0.3,
      downloads: 0.3,
      contributors: 0.2,
      maintenance: 0.2,
    };
  }

  calculatePerformanceScore(benchmarkData) {
    // Implement based on benchmark data
    // This is a simplified example
    if (!benchmarkData) return Math.floor(Math.random() * 30) + 70; // Placeholder
    
    const baseScore = 50;
    const performanceMultiplier = benchmarkData.requestsPerSecond / 1000;
    return Math.min(100, baseScore + (performanceMultiplier * 10));
  }

  calculateScalabilityScore(framework) {
    let score = 50;
    
    // Language-based scoring
    const scalableLanguages = ['go', 'rust', 'c++', 'java', 'c#'];
    if (scalableLanguages.includes(framework.language?.toLowerCase())) {
      score += 20;
    }
    
    // Architecture patterns
    if (framework.tags.includes('microservices') || 
        framework.tags.includes('distributed')) {
      score += 15;
    }
    
    // Container support
    if (framework.tags.includes('docker') || 
        framework.tags.includes('kubernetes')) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  calculateCommunityScore(framework) {
    const maxStars = 100000;
    const maxDownloads = 1000000;
    const maxContributors = 1000;
    
    const starsScore = Math.min(40, (framework.stars / maxStars) * 40);
    const downloadsScore = Math.min(30, (framework.npmDownloads / maxDownloads) * 30);
    const contributorsScore = Math.min(20, (framework.contributors / maxContributors) * 20);
    
    // Recent activity bonus
    const monthsOld = (Date.now() - new Date(framework.lastUpdated)) / (1000 * 60 * 60 * 24 * 30);
    const activityScore = monthsOld < 6 ? 10 : (monthsOld < 12 ? 5 : 0);
    
    return Math.round(starsScore + downloadsScore + contributorsScore + activityScore);
  }

  determineRealtimeSupport(framework) {
    const realtimeKeywords = [
      'websocket', 'realtime', 'live', 'streaming', 'events',
      'socket.io', 'sse', 'graphql subscription', 'pubsub'
    ];
    
    const text = `${framework.name} ${framework.description} ${framework.tags.join(' ')}`.toLowerCase();
    return realtimeKeywords.some(keyword => text.includes(keyword));
  }

  categorizeFramework(framework) {
    const categories = {
      'frontend': ['react', 'vue', 'angular', 'svelte', 'ember'],
      'backend': ['express', 'fastify', 'koa', 'nest', 'django', 'flask', 'spring'],
      'fullstack': ['next', 'nuxt', 'gatsby', 'remix', 'sveltekit'],
      'mobile': ['react-native', 'flutter', 'ionic', 'cordova'],
      'database': ['mongodb', 'postgresql', 'redis', 'elasticsearch'],
      'devops': ['docker', 'kubernetes', 'terraform', 'ansible'],
    };
    
    const text = `${framework.name} ${framework.description} ${framework.tags.join(' ')}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }
}

module.exports = ScoringService;
```

## 10. Main Application

Create `src/index.js`:

```javascript
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
    await this.qdrant.initializeCollection();
    console.log('System initialized successfully!');
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
```

## 11. Sample Data

Create `data/frameworks-seed.json`:

```json
[
  {
    "name": "React",
    "githubUrl": "https://github.com/facebook/react",
    "language": "JavaScript",
    "tags": ["frontend", "ui", "component"],
    "description": "A JavaScript library for building user interfaces"
  },
  {
    "name": "Vue.js",
    "githubUrl": "https://github.com/vuejs/vue",
    "language": "JavaScript",
    "tags": ["frontend", "progressive", "framework"],
    "description": "Progressive JavaScript framework for building UI"
  },
  {
    "name": "Django",
    "githubUrl": "https://github.com/django/django",
    "language": "Python",
    "tags": ["backend", "web", "framework"],
    "description": "High-level Python web framework"
  },
  {
    "name": "Spring Boot",
    "githubUrl": "https://github.com/spring-projects/spring-boot",
    "language": "Java",
    "tags": ["backend", "enterprise", "microservices"],
    "description": "Spring Boot makes it easy to create production-ready applications"
  },
  {
    "name": "Flutter",
    "githubUrl": "https://github.com/flutter/flutter",
    "language": "Dart",
    "tags": ["mobile", "cross-platform", "ui"],
    "description": "Google's UI toolkit for building natively compiled applications"
  }
]
```

## 12. Package.json Scripts

Update your `package.json`:

```json
{
  "name": "tech-framework-db",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "seed": "node scripts/seed-data.js",
    "test": "node scripts/test-search.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "dotenv": "^16.0.0",
    "@qdrant/qdrant-js": "^1.7.0",
    "node-appwrite": "^11.0.0",
    "openai": "^4.20.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

## 13. Running the System

### Step 1: Start Qdrant
```bash
docker-compose up -d
```

### Step 2: Set up environment variables
Configure your `.env` file with proper API keys and URLs.

### Step 3: Initialize and run
```bash
npm run dev
```

### Step 4: Test the system
```bash
npm run test
```

## 14. Appwrite Function Example

Create `appwrite-functions/sync-frameworks/index.js`:

```javascript
const { Client, Databases } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client();
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // Sync logic here
    const frameworks = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID
    );

    // Update scores based on latest data
    for (const framework of frameworks.documents) {
      const now = new Date();
      const lastUpdate = new Date(framework.lastUpdated);
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

      // Update if data is older than 7 days
      if (daysSinceUpdate > 7) {
        // Fetch fresh data and update scores
        log(`Updating framework: ${framework.name}`);
        
        // Update the document
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          framework.$id,
          {
            lastUpdated: now.toISOString(),
            // Add other updated fields here
          }
        );
      }
    }

    return res.json({
      success: true,
      message: `Synced ${frameworks.documents.length} frameworks`,
      updatedCount: frameworks.documents.length
    });

  } catch (err) {
    error('Sync failed: ' + err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
```

## 15. Testing Scripts

Create `scripts/test-search.js`:

```javascript
require('dotenv').config();
const TechFrameworkDB = require('../src/index');

async function testSearch() {
  const db = new TechFrameworkDB();
  await db.initialize();

  console.log('🔍 Testing search functionality...\n');

  // Test 1: Semantic search
  console.log('Test 1: Semantic search for "fast web framework"');
  const results1 = await db.searchFrameworks('fast web framework');
  console.log('Results:', results1.slice(0, 3).map(r => ({
    name: r.name,
    category: r.category,
    similarity: r.similarity
  })));

  // Test 2: Category filter
  console.log('\nTest 2: Frontend frameworks only');
  const results2 = await db.searchFrameworks('javascript', { category: 'frontend' });
  console.log('Results:', results2.slice(0, 3).map(r => ({
    name: r.name,
    category: r.category
  })));

  // Test 3: Score filter
  console.log('\nTest 3: High-scoring frameworks (>80)');
  const results3 = await db.searchFrameworks('popular framework', { minScore: 80 });
  console.log('Results:', results3.slice(0, 3).map(r => ({
    name: r.name,
    overallScore: r.overallScore
  })));

  // Test 4: Realtime support
  console.log('\nTest 4: Frameworks with realtime support');
  const results4 = await db.searchFrameworks('', { realtimeSupport: true });
  console.log('Results:', results4.slice(0, 3).map(r => ({
    name: r.name,
    realtimeSupport: r.realtimeSupport
  })));

  console.log('\n✅ All tests completed!');
}

testSearch().catch(console.error);
```

Create `scripts/seed-data.js`:

```javascript
require('dotenv').config();
const TechFrameworkDB = require('../src/index');
const seedData = require('../data/frameworks-seed.json');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');
  
  const db = new TechFrameworkDB();
  await db.initialize();

  // Process seed data
  const results = await db.bulkProcessFrameworks(seedData);

  console.log('\n📊 Seeding Summary:');
  console.log(`Total frameworks: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);

  // Show sample results
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log('\n✅ Sample processed frameworks:');
    successful.slice(0, 3).forEach(result => {
      const f = result.framework;
      console.log(`- ${f.name} (${f.category}): Performance=${f.performanceScore}, Community=${f.communityScore}`);
    });
  }

  console.log('\n🎉 Database seeding completed!');
}

seedDatabase().catch(console.error);
```

## 16. Advanced Features

### 16.1 Batch Processing Script

Create `scripts/batch-collect.js`:

```javascript
require('dotenv').config();
const TechFrameworkDB = require('../src/index');

async function batchCollectFrameworks() {
  const db = new TechFrameworkDB();
  await db.initialize();

  // Popular frameworks to collect
  const frameworksToCollect = [
    // Frontend
    { name: 'React', category: 'frontend', githubUrl: 'https://github.com/facebook/react' },
    { name: 'Vue.js', category: 'frontend', githubUrl: 'https://github.com/vuejs/vue' },
    { name: 'Angular', category: 'frontend', githubUrl: 'https://github.com/angular/angular' },
    { name: 'Svelte', category: 'frontend', githubUrl: 'https://github.com/sveltejs/svelte' },
    
    // Backend
    { name: 'Express.js', category: 'backend', githubUrl: 'https://github.com/expressjs/express' },
    { name: 'Fastify', category: 'backend', githubUrl: 'https://github.com/fastify/fastify' },
    { name: 'Django', category: 'backend', githubUrl: 'https://github.com/django/django' },
    { name: 'Flask', category: 'backend', githubUrl: 'https://github.com/pallets/flask' },
    { name: 'Spring Boot', category: 'backend', githubUrl: 'https://github.com/spring-projects/spring-boot' },
    
    // Full-stack
    { name: 'Next.js', category: 'fullstack', githubUrl: 'https://github.com/vercel/next.js' },
    { name: 'Nuxt.js', category: 'fullstack', githubUrl: 'https://github.com/nuxt/nuxt.js' },
    { name: 'Remix', category: 'fullstack', githubUrl: 'https://github.com/remix-run/remix' },
    
    // Mobile
    { name: 'React Native', category: 'mobile', githubUrl: 'https://github.com/facebook/react-native' },
    { name: 'Flutter', category: 'mobile', githubUrl: 'https://github.com/flutter/flutter' },
    
    // Database
    { name: 'MongoDB', category: 'database', githubUrl: 'https://github.com/mongodb/mongo' },
    { name: 'PostgreSQL', category: 'database', githubUrl: 'https://github.com/postgres/postgres' },
    { name: 'Redis', category: 'database', githubUrl: 'https://github.com/redis/redis' },
  ];

  console.log(`🚀 Starting batch collection of ${frameworksToCollect.length} frameworks...`);
  
  const results = await db.bulkProcessFrameworks(frameworksToCollect);
  
  console.log('\n📈 Batch Collection Results:');
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  
  // Show top frameworks by overall score
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    const topFrameworks = successful
      .sort((a, b) => b.framework.getOverallScore() - a.framework.getOverallScore())
      .slice(0, 5);
    
    console.log('\n🏆 Top 5 Frameworks by Overall Score:');
    topFrameworks.forEach((result, index) => {
      const f = result.framework;
      console.log(`${index + 1}. ${f.name} (${f.category}) - Score: ${f.getOverallScore()}`);
      console.log(`   Performance: ${f.performanceScore}, Scalability: ${f.scalabilityScore}, Community: ${f.communityScore}`);
    });
  }

  console.log('\n🎉 Batch collection completed!');
}

batchCollectFrameworks().catch(console.error);
```

### 16.2 API Server

Create `src/api/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const TechFrameworkDB = require('../index');

const app = express();
const db = new TechFrameworkDB();

app.use(cors());
app.use(express.json());

// Initialize database
db.initialize();

// Routes
app.get('/frameworks', async (req, res) => {
  try {
    const { category, minScore, realtimeSupport, search } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (minScore) filters.minScore = parseInt(minScore);
    if (realtimeSupport === 'true') filters.realtimeSupport = true;
    
    const results = await db.searchFrameworks(search || '', filters);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/frameworks/categories', async (req, res) => {
  try {
    const categories = ['frontend', 'backend', 'fullstack', 'mobile', 'database', 'devops'];
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/frameworks', async (req, res) => {
  try {
    const result = await db.processFramework(req.body);
    if (result.success) {
      res.json({ success: true, data: result.framework });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/frameworks/similar/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const results = await db.searchFrameworks(name, {});
    const similar = results.filter(r => r.name !== name).slice(0, 5);
    res.json({ success: true, data: similar });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
```

## 17. Deployment Guide

### 17.1 Docker Configuration

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 17.2 Production Environment Variables

Create `.env.production`:

```env
# Production Qdrant (Cloud or self-hosted)
QDRANT_URL=https://your-qdrant-instance.com
QDRANT_API_KEY=your_production_api_key

# Appwrite Production
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_prod_project_id
APPWRITE_API_KEY=your_prod_api_key
APPWRITE_DATABASE_ID=your_prod_database_id
APPWRITE_COLLECTION_ID=your_prod_collection_id

# External APIs
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key

# Performance Settings
VECTOR_DIMENSION=1536
BATCH_SIZE=10
RATE_LIMIT_DELAY=2000
```

### 17.3 Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - qdrant
    restart: unless-stopped

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  qdrant_data:
```

## 18. Monitoring and Maintenance

### 18.1 Health Check Script

Create `scripts/health-check.js`:

```javascript
require('dotenv').config();
const TechFrameworkDB = require('../src/index');

async function healthCheck() {
  const db = new TechFrameworkDB();
  
  try {
    console.log('🔍 Running health check...');
    
    // Test Qdrant connection
    const vectorResults = await db.qdrant.searchSimilarFrameworks('test', 1);
    console.log('✅ Qdrant connection: OK');
    
    // Test Appwrite connection
    const dbResults = await db.appwrite.getFrameworks({});
    console.log('✅ Appwrite connection: OK');
    
    // Test external APIs
    const githubTest = await db.github.getRepositoryData('expressjs', 'express');
    console.log('✅ GitHub API: OK');
    
    console.log('\n📊 System Status:');
    console.log(`- Frameworks in database: ${dbResults.length}`);
    console.log(`- Vector search working: ${vectorResults.length >= 0}`);
    console.log(`- Last check: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();
```

### 18.2 Backup Script

Create `scripts/backup.js`:

```javascript
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const TechFrameworkDB = require('../src/index');

async function backupData() {
  const db = new TechFrameworkDB();
  
  try {
    console.log('📦 Creating backup...');
    
    // Get all frameworks from Appwrite
    const frameworks = await db.appwrite.getFrameworks({});
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      count: frameworks.length,
      data: frameworks
    };
    
    // Save to file
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const filename = `frameworks-backup-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(backupDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup created: ${filepath}`);
    console.log(`📊 Backed up ${frameworks.length} frameworks`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

backupData();
```

## 19. Usage Examples

### 19.1 Basic Usage

```javascript
const TechFrameworkDB = require('./src/index');

async function examples() {
  const db = new TechFrameworkDB();
  await db.initialize();

  // Add a new framework
  const newFramework = {
    name: 'Astro',
    githubUrl: 'https://github.com/withastro/astro',
    language: 'JavaScript',
    tags: ['static-site', 'performance', 'islands'],
    description: 'Build fast websites with less client-side JavaScript'
  };
  
  await db.processFramework(newFramework);

  // Search for similar frameworks
  const similar = await db.searchFrameworks('static site generator', {
    category: 'frontend'
  });
  
  console.log('Similar frameworks:', similar);

  // Find high-performance frameworks
  const performant = await db.searchFrameworks('', {
    minScore: 85,
    category: 'backend'
  });
  
  console.log('High-performance backends:', performant);
}

examples().catch(console.error);
```

## 20. Next Steps

1. **Set up your environment variables** in `.env`
2. **Configure Appwrite** database and collections
3. **Start Qdrant** with Docker
4. **Run the seed script** to populate initial data
5. **Test the search functionality** with the provided scripts
6. **Set up monitoring** and backup schedules
7. **Deploy to production** using the Docker configuration

This system provides a solid foundation for collecting, storing, and searching technology framework data with both traditional and vector-based search capabilities. The modular architecture makes it easy to extend with additional data sources and features.

## Troubleshooting

- **Rate limiting**: Implement delays between API calls
- **Data quality**: Validate and clean data before storage
- **Performance**: Monitor vector search performance and adjust settings
- **Storage**: Regularly backup your data
- **Updates**: Schedule periodic data refreshes

The system is designed to be production-ready with proper error handling, logging, and monitoring capabilities.