const { Client, Databases, Query } = require('node-appwrite');

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY);
    
    this.databases = new Databases(this.client);
    this.databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    this.collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;
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
        queries.length > 0 ? queries : undefined
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