const { QdrantClient } = require('@qdrant/qdrant-js');
const Mistral = require('@mistralai/mistralai').default;

class QdrantService {
  constructor() {
    const qdrantConfig = {
      url: process.env.QDRANT_URL || 'http://localhost:6333',
    };
    
    // Add API key if provided
    if (process.env.QDRANT_API_KEY) {
      qdrantConfig.apiKey = process.env.QDRANT_API_KEY;
      console.log('Using Qdrant API key authentication');
    } else {
      console.warn('No QDRANT_API_KEY provided. This might cause authentication issues.');
    }
    
    this.client = new QdrantClient(qdrantConfig);
    this.mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    this.collectionName = 'tech_frameworks';
  }

  async initializeCollection() {
    try {
      console.log('Initializing Qdrant collection...');
      
      // Set a timeout for the connection attempt
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Qdrant connection timeout')), 5000)
      );

      // Try to connect to Qdrant
      const connectPromise = this.client.getCollections();
      
      // Race the connection attempt against the timeout
      const collections = await Promise.race([connectPromise, timeoutPromise]);
      
      const exists = collections.collections.some(
        col => col.name === this.collectionName
      );

      if (!exists) {
        console.log(`Creating collection: ${this.collectionName}`);
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: parseInt(process.env.VECTOR_DIMENSION) || 1536,
            distance: 'Cosine',
          },
        });
        console.log(`Collection ${this.collectionName} created successfully`);
      }
      
      console.log('Qdrant collection initialized successfully');
      return true;
    } catch (error) {
      console.warn('Warning: Could not connect to Qdrant. Running in limited mode.');
      console.warn('Error details:', error.message);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
      }
      return false;
      console.error('Error initializing collection:', error);
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await this.mistral.embeddings({
        model: 'mistral-embed',
        input: [text],
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