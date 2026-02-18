import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CodeEditor from './pages/CodeEditor';
import Repositories from './pages/Repositories';
import AIChat from './pages/AIChat';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    () => !!localStorage.getItem('token')
  );

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #3a3a3a',
            },
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/editor"
            element={
              isAuthenticated ? (
                <CodeEditor />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/repositories"
            element={
              isAuthenticated ? (
                <Repositories />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/ai-chat"
            element={
              isAuthenticated ? (
                <AIChat />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
