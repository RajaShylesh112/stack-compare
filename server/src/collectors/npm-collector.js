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