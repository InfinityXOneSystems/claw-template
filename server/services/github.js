const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Claw-Autonomous-System'
    };
  }

  async getUserInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  async listRepositories(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
        headers: this.getHeaders(),
        params: { per_page: 100, sort: 'updated' }
      });
      return response.data;
    } catch (error) {
      console.error('Error listing repositories:', error);
      throw error;
    }
  }

  async getRepository(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }
  }

  async getFileContent(owner, repo, path, ref = 'main') {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: this.getHeaders(),
          params: { ref }
        }
      );
      
      if (response.data.content) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return { ...response.data, decodedContent: content };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }

  async createOrUpdateFile(owner, repo, path, content, message, sha = null) {
    try {
      const data = {
        message,
        content: Buffer.from(content).toString('base64'),
        ...(sha && { sha })
      };

      const response = await axios.put(
        `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
        data,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating/updating file:', error);
      throw error;
    }
  }

  async listBranches(owner, repo) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/branches`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error listing branches:', error);
      throw error;
    }
  }

  async createPullRequest(owner, repo, title, head, base, body) {
    try {
      const response = await axios.post(
        `${this.baseURL}/repos/${owner}/${repo}/pulls`,
        { title, head, base, body },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating pull request:', error);
      throw error;
    }
  }
}

module.exports = GitHubService;
