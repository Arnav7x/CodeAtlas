'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GitBranch, Settings, Key, Check, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  currentRepo?: string;
}

const TOKEN_PATTERN = /^(ghp_[A-Za-z0-9]{10,}|github_pat_[A-Za-z0-9_]{10,}|gho_[A-Za-z0-9]{10,}|Bearer\s+.+)$/;

export default function Navbar({ currentRepo }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { isDark: isDarkTheme, mounted, toggle: toggleTheme } = useTheme();
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setToken(localStorage.getItem('github_pat') || '');
    } catch {}
  }, []);

  // Close settings when clicking outside
  useEffect(() => {
    if (!showSettings) return;
    const onPointer = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSettings(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [showSettings]);

  const handleSaveToken = () => {
    const trimmed = token.trim();
    if (trimmed && !TOKEN_PATTERN.test(trimmed)) {
      setTokenError('That does not look like a GitHub token (expected ghp_… or github_pat_…).');
      return;
    }
    setTokenError('');
    try {
      if (trimmed) localStorage.setItem('github_pat', trimmed);
      else localStorage.removeItem('github_pat');
    } catch {}
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleClearToken = () => {
    try {
      localStorage.removeItem('github_pat');
    } catch {}
    setToken('');
    setTokenError('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowSettings(false);
    }, 1200);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link href="/" className="logo-group" aria-label="CodeAtlas home">
          <div className="logo-icon">
            <GitBranch className="icon-glow" size={18} />
          </div>
          <span className="logo-text">
            Code<span className="gradient-text">Atlas</span>
          </span>
        </Link>

        {currentRepo && (
          <div className="current-repo-badge" title={currentRepo}>
            <div className="status-indicator" />
            <span className="current-repo-text">{currentRepo}</span>
          </div>
        )}

        <div className="navbar-actions" ref={settingsRef}>
          <Link href="/" className="btn btn-secondary btn-sm nav-btn">
            <Home size={14} />
            <span className="btn-label">Home</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm nav-btn icon-only"
            title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {mounted && isDarkTheme ? (
              <Sun size={14} className="icon-orange" />
            ) : (
              <Moon size={14} className="icon-purple" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className={`btn btn-secondary btn-sm nav-btn ${showSettings ? 'active' : ''}`}
            aria-expanded={showSettings}
            aria-haspopup="dialog"
          >
            <Settings size={14} />
            <span className="btn-label">PAT</span>
            {token ? <span className="token-dot" title="Token saved" /> : null}
          </button>

          {showSettings && (
            <div className="settings-dropdown glass-panel animate-fade-in" role="dialog" aria-label="GitHub PAT settings">
              <h4 className="settings-title">
                <Key size={14} className="icon-cyan" />
                <span>GitHub Access Token</span>
              </h4>
              <p className="settings-description">
                Unauthenticated requests are limited to 60/hour. A PAT raises this to 5,000/hour and enables private repos.
                Stored only in your browser&apos;s localStorage.
              </p>
              <input
                type="password"
                placeholder="ghp_… or github_pat_…"
                className="glass-input settings-input"
                value={token}
                onChange={(e) => { setToken(e.target.value); setTokenError(''); }}
                autoComplete="off"
                spellCheck={false}
              />
              {tokenError && (
                <p className="token-error" role="alert">
                  {tokenError}
                </p>
              )}
              <div className="settings-actions">
                {token ? (
                  <button type="button" onClick={handleClearToken} className="btn btn-danger btn-sm">
                    Clear
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" onClick={handleSaveToken} className="btn btn-primary btn-sm">
                  {isSaved ? <Check size={12} /> : 'Save'}
                </button>
              </div>
              {isSaved && (
                <div className="saved-toast">
                  <Check size={12} className="icon-green" />
                  <span>Saved locally</span>
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
          background: var(--glass-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-color);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          gap: 16px;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--fg-primary);
          flex-shrink: 0;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--accent-soft);
          border: 1px solid var(--accent-soft-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-glow {
          color: var(--accent-cyan);
        }
        .logo-text {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .current-repo-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-muted);
          border: 1px solid var(--border-color);
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.8rem;
          max-width: 280px;
          min-width: 0;
        }
        @media (max-width: 640px) {
          .current-repo-badge {
            display: none;
          }
          .btn-label {
            display: none;
          }
        }
        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-green);
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
          flex-shrink: 0;
        }
        .current-repo-text {
          font-family: var(--font-mono);
          color: var(--fg-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          flex-shrink: 0;
        }
        .nav-btn.active {
          border-color: var(--border-focus);
          background: var(--accent-soft);
        }
        .icon-only {
          padding: 6px 10px;
        }
        .token-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          margin-left: 2px;
        }
        .settings-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: min(320px, calc(100vw - 32px));
          padding: 16px;
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 50;
        }
        .settings-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: var(--font-sans);
        }
        .settings-description {
          font-size: 0.75rem;
          color: var(--fg-tertiary);
          line-height: 1.45;
        }
        .settings-input {
          font-size: 0.8rem;
          padding: 9px 12px;
          font-family: var(--font-mono);
        }
        .token-error {
          font-size: 0.72rem;
          color: var(--accent-red);
          line-height: 1.4;
        }
        .settings-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .saved-toast {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.22);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--accent-green);
          justify-content: center;
        }
      `}</style>
    </header>
  );
}
