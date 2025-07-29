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