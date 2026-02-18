const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GitHubService = require('../services/github');

// List user repositories
router.get('/list', auth, async (req, res) => {
  try {
    const { username, token } = req.query;

    if (!username || !token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Username and token are required', status: 400 }
      });
    }

    const githubService = new GitHubService();
    githubService.setToken(token);

    const repos = await githubService.listRepositories(username);

    res.json({
      success: true,
      data: repos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Get repository details
router.get('/:owner/:repo', auth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token is required', status: 400 }
      });
    }

    const githubService = new GitHubService();
    githubService.setToken(token);

    const repository = await githubService.getRepository(owner, repo);

    res.json({
      success: true,
      data: repository
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Get file content
router.get('/:owner/:repo/file', auth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path, token, ref } = req.query;

    if (!token || !path) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token and path are required', status: 400 }
      });
    }

    const githubService = new GitHubService();
    githubService.setToken(token);

    const file = await githubService.getFileContent(owner, repo, path, ref);

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// Update file
router.put('/:owner/:repo/file', auth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path, content, message, sha, token } = req.body;

    if (!token || !path || !content || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token, path, content, and message are required', status: 400 }
      });
    }

    const githubService = new GitHubService();
    githubService.setToken(token);

    const result = await githubService.createOrUpdateFile(owner, repo, path, content, message, sha);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

// List branches
router.get('/:owner/:repo/branches', auth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token is required', status: 400 }
      });
    }

    const githubService = new GitHubService();
    githubService.setToken(token);

    const branches = await githubService.listBranches(owner, repo);

    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, status: 500 }
    });
  }
});

module.exports = router;
