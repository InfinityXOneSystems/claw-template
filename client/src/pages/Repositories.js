import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Repositories.css';

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({});
  const [githubToken, setGithubToken] = useState(localStorage.getItem('github_token') || '');
  const [showTokenInput, setShowTokenInput] = useState(!githubToken);

  const mockRepos = [
    {
      id: 1,
      name: 'claw-template',
      full_name: 'InfinityXOneSystems/claw-template',
      description: 'Enterprise-grade autonomous coding system',
      language: 'JavaScript',
      stars: 42,
      forks: 8,
      updated_at: new Date().toISOString(),
      synced: true
    },
    {
      id: 2,
      name: 'ai-coding-engine',
      full_name: 'InfinityXOneSystems/ai-coding-engine',
      description: 'AI-powered code generation engine',
      language: 'Python',
      stars: 156,
      forks: 23,
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      synced: false
    },
    {
      id: 3,
      name: 'react-components',
      full_name: 'InfinityXOneSystems/react-components',
      description: 'Modern React component library',
      language: 'TypeScript',
      stars: 89,
      forks: 15,
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      synced: true
    }
  ];

  useEffect(() => {
    if (githubToken) {
      loadRepositories();
    } else {
      setRepositories(mockRepos);
    }
  }, [githubToken]);

  const loadRepositories = async () => {
    setLoading(true);
    try {
      // This would use the actual GitHub API
      setRepositories(mockRepos);
      toast.success('Repositories loaded');
    } catch (error) {
      toast.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    if (githubToken.trim()) {
      localStorage.setItem('github_token', githubToken);
      setShowTokenInput(false);
      loadRepositories();
      toast.success('GitHub token saved');
    }
  };

  const handleSync = async (repo) => {
    setSyncStatus({ ...syncStatus, [repo.id]: 'syncing' });
    
    // Simulate sync
    setTimeout(() => {
      setSyncStatus({ ...syncStatus, [repo.id]: 'synced' });
      toast.success(`${repo.name} synced successfully`);
      
      setRepositories(repositories.map(r => 
        r.id === repo.id ? { ...r, synced: true } : r
      ));
    }, 2000);
  };

  const handleClone = async (repo) => {
    toast.success(`Cloning ${repo.name}...`);
    // This would trigger actual cloning logic
  };

  return (
    <div className="repositories-page">
      <Navigation />
      
      <div className="repos-container">
        <div className="repos-header">
          <div>
            <h1>Repositories</h1>
            <p>Manage and sync your GitHub repositories</p>
          </div>
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="btn btn-secondary"
          >
            ⚙️ Settings
          </button>
        </div>

        {showTokenInput && (
          <div className="token-input-section fade-in">
            <h3>GitHub Personal Access Token</h3>
            <p>Enter your GitHub token to access your repositories</p>
            <div className="token-input-group">
              <input
                type="password"
                className="input"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
              <button onClick={handleSaveToken} className="btn btn-primary">
                Save Token
              </button>
            </div>
          </div>
        )}

        <div className="repos-grid">
          {loading ? (
            <div className="loading-message">Loading repositories...</div>
          ) : (
            repositories.map((repo) => (
              <div key={repo.id} className="repo-card fade-in">
                <div className="repo-header-card">
                  <h3>{repo.name}</h3>
                  {repo.synced && (
                    <span className="sync-badge">✓ Synced</span>
                  )}
                </div>
                
                <p className="repo-description">{repo.description}</p>
                
                <div className="repo-meta">
                  <span className="repo-language">
                    <span className={`language-dot ${repo.language.toLowerCase()}`}></span>
                    {repo.language}
                  </span>
                  <span>⭐ {repo.stars}</span>
                  <span>🔱 {repo.forks}</span>
                </div>

                <div className="repo-actions">
                  <button
                    onClick={() => handleSync(repo)}
                    className="btn btn-secondary"
                    disabled={syncStatus[repo.id] === 'syncing'}
                  >
                    {syncStatus[repo.id] === 'syncing' ? '🔄 Syncing...' : '🔄 Sync'}
                  </button>
                  <button
                    onClick={() => handleClone(repo)}
                    className="btn btn-secondary"
                  >
                    📥 Clone
                  </button>
                  <button className="btn btn-primary">
                    🚀 Open
                  </button>
                </div>

                <div className="repo-footer">
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Repositories;
