import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeWorkflows: 5,
    linesGenerated: 45892,
    successRate: 98.5
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const quickActions = [
    {
      title: 'AI Code Generation',
      description: 'Generate code using AI',
      icon: '🤖',
      action: () => navigate('/editor'),
      color: 'blue'
    },
    {
      title: 'Chat with AI',
      description: 'Get coding assistance',
      icon: '💬',
      action: () => navigate('/ai-chat'),
      color: 'purple'
    },
    {
      title: 'Browse Repositories',
      description: 'Manage your repositories',
      icon: '📁',
      action: () => navigate('/repositories'),
      color: 'green'
    },
    {
      title: 'Code Editor',
      description: 'Edit code with AI',
      icon: '⚡',
      action: () => navigate('/editor'),
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard">
      <Navigation setIsAuthenticated={setIsAuthenticated} />
      
      <div className="dashboard-content">
        <div className="dashboard-header fade-in">
          <div>
            <h1>Welcome back, {user?.username || 'Developer'}! 👋</h1>
            <p>Your autonomous coding assistant is ready</p>
          </div>
        </div>

        <div className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚙️</div>
            <div className="stat-content">
              <h3>{stats.activeWorkflows}</h3>
              <p>Active Workflows</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-content">
              <h3>{stats.linesGenerated.toLocaleString()}</h3>
              <p>Lines Generated</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.successRate}%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        <div className="quick-actions fade-in">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`action-card action-${action.color}`}
                onClick={action.action}
              >
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity fade-in">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🎯</div>
              <div className="activity-content">
                <h4>Code generated for React component</h4>
                <p>2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🔄</div>
              <div className="activity-content">
                <h4>Repository synced: claw-template</h4>
                <p>5 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✨</div>
              <div className="activity-content">
                <h4>AI chat session completed</h4>
                <p>1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
