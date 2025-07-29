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