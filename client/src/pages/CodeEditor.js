import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CodeEditor.css';

function CodeEditor() {
  const [code, setCode] = useState('// Start coding here...\n\n');
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate',
        { prompt, context: { language } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCode(response.data.data.code);
        toast.success('Code generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { code, analysisType: 'general' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAnalysis(response.data.data.analysis);
        toast.success('Analysis complete!');
      }
    } catch (error) {
      toast.error('Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/fix',
        { code, error: 'General improvement' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCode(response.data.data.fixedCode);
        toast.success('Code fixed!');
      }
    } catch (error) {
      toast.error('Failed to fix code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-editor-page">
      <Navigation />
      
      <div className="editor-container">
        <div className="editor-header">
          <h1>AI Code Editor</h1>
          <div className="editor-controls">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
        </div>

        <div className="editor-layout">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Code</h3>
              <div className="panel-actions">
                <button onClick={handleAnalyze} className="btn btn-secondary" disabled={loading}>
                  🔍 Analyze
                </button>
                <button onClick={handleFix} className="btn btn-secondary" disabled={loading}>
                  🔧 Fix
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-textarea"
              spellCheck="false"
            />
          </div>

          <div className="editor-sidebar">
            <div className="panel-header">
              <h3>AI Assistant</h3>
            </div>
            
            <div className="ai-prompt-section">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what code you want to generate..."
                className="prompt-textarea"
                rows="4"
              />
              <button
                onClick={handleGenerate}
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Generating...' : '✨ Generate Code'}
              </button>
            </div>

            {analysis && (
              <div className="analysis-section">
                <h4>Code Analysis</h4>
                <div className="analysis-content">
                  {analysis}
                </div>
              </div>
            )}

            <div className="quick-actions-section">
              <h4>Quick Actions</h4>
              <div className="quick-action-buttons">
                <button className="btn btn-secondary" onClick={() => setCode('')}>
                  🗑️ Clear
                </button>
                <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(code)}>
                  📋 Copy
                </button>
                <button className="btn btn-secondary">
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
