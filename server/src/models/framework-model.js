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