'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitBranch, Settings, Key, Check, AlertCircle, Home } from 'lucide-react';

interface NavbarProps {
  currentRepo?: string;
}

export default function Navbar({ currentRepo }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [token, setToken] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_pat') || '';
    setToken(savedToken);
  }, []);

  const handleSaveToken = () => {
    localStorage.setItem('github_pat', token);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowSettings(false);
    }, 1500);
  };

  const handleClearToken = () => {
    localStorage.removeItem('github_pat');
    setToken('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowSettings(false);
    }, 1500);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link href="/" className="logo-group">
          <div className="logo-icon">
            <GitBranch className="icon-glow" size={20} />
          </div>
          <span className="logo-text">
            Code<span className="gradient-text">Atlas</span>
          </span>
        </Link>

        {currentRepo && (
          <div className="current-repo-badge">
            <div className="status-indicator animate-pulse-slow"></div>
            <span className="current-repo-text">{currentRepo}</span>
          </div>
        )}

        <div className="navbar-actions">
          <Link href="/" className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <Home size={14} />
            <span>Overview</span>
          </Link>
          
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`btn btn-secondary btn-sm ${showSettings ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.85rem', position: 'relative' }}
          >
            <Settings size={14} />
            <span>PAT Settings</span>
          </button>

          {showSettings && (
            <div className="settings-dropdown glass-panel animate-fade-in">
              <h4 className="settings-title">
                <Key size={14} className="icon-cyan" />
                <span>GitHub Access Token</span>
              </h4>
              <p className="settings-description">
                Provide a Personal Access Token (PAT) to avoid public API rate limits (60 requests/hr). Tokens are saved locally in your browser.
              </p>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="glass-input settings-input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <div className="settings-actions">
                {token && (
                  <button onClick={handleClearToken} className="btn btn-danger btn-sm" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
                    Clear
                  </button>
                )}
                <button onClick={handleSaveToken} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '6px 12px', marginLeft: 'auto' }}>
                  {isSaved ? <Check size={12} /> : 'Save Token'}
                </button>
              </div>
              {isSaved && (
                <div className="saved-toast">
                  <Check size={12} className="icon-green" />
                  <span>Preferences saved!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: rgba(4, 4, 6, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--fg-primary);
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.1), rgba(0, 245, 160, 0.1));
          border: 1px solid var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0, 245, 160, 0.15);
        }
        .icon-glow {
          color: var(--accent-green);
          filter: drop-shadow(0 0 4px var(--accent-green));
        }
        .logo-text {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .current-repo-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.85rem;
        }
        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-green);
          box-shadow: 0 0 8px var(--accent-green);
        }
        .current-repo-text {
          font-family: var(--font-mono);
          color: var(--fg-secondary);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .settings-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 300px;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .settings-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .icon-cyan {
          color: var(--accent-cyan);
        }
        .settings-description {
          font-size: 0.75rem;
          color: var(--fg-tertiary);
          line-height: 1.4;
        }
        .settings-input {
          font-size: 0.8rem;
          padding: 8px 10px;
        }
        .settings-actions {
          display: flex;
          align-items: center;
        }
        .saved-toast {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 245, 160, 0.08);
          border: 1px solid rgba(0, 245, 160, 0.2);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--accent-green);
          justify-content: center;
        }
        .icon-green {
          color: var(--accent-green);
        }
      `}</style>
    </header>
  );
}
