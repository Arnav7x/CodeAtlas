'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Play, ArrowRight, Sparkles, Loader2, GitCommit, Users, FileCode } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { parseRepoSlug } from '../lib/repoSlug';

const PRESET_SLUGS = new Set(['facebook/react', 'vercel/next.js']);

export default function RepoConnector() {
  const router = useRouter();
  const [repoInput, setRepoInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const loadingSteps = [
    { title: 'Connecting to GitHub…', icon: <GithubIcon size={16} className="icon-cyan" /> },
    { title: 'Parsing commits & history…', icon: <GitCommit size={16} className="icon-green" /> },
    { title: 'Mapping collaboration network…', icon: <Users size={16} className="icon-purple" /> },
    { title: 'Analyzing ownership structure…', icon: <FileCode size={16} className="icon-orange" /> },
    { title: 'Generating engineering insights…', icon: <Sparkles size={16} className="icon-cyan" /> },
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev >= loadingSteps.length - 1 ? prev : prev + 1));
    }, 550);
    return () => clearInterval(interval);
  }, [isLoading, loadingSteps.length]);

  const handleConnect = useCallback(
    (slug: string) => {
      setError('');
      const parsed = parseRepoSlug(slug);
      if (!parsed) {
        setError('Enter a valid owner/repo slug or GitHub URL (e.g. facebook/react).');
        return;
      }

      const full = `${parsed.owner}/${parsed.repo}`;
      const isPreset = PRESET_SLUGS.has(full.toLowerCase());

      setIsLoading(true);
      setLoadingStep(0);

      // Presets are local mock data — shorter wait. Live API needs a beat for perceived progress.
      const delay = isPreset ? 1400 : 2800;
      window.setTimeout(() => {
        router.push(`/dashboard/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`);
      }, delay);
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(repoInput);
  };

  if (isLoading) {
    return (
      <div className="loader-overlay glass-panel animate-fade-in">
        <div className="loader-content">
          <div className="loader-spinner-wrapper">
            <Loader2 className="spinner" size={40} />
          </div>

          <h2 className="loader-title roman-header">Analyzing codebase</h2>
          <p className="loader-subtitle">
            Mapping contribution velocity, ownership, and hotspot files.
          </p>

          <div className="progress-container" role="progressbar" aria-valuenow={loadingStep + 1} aria-valuemin={1} aria-valuemax={loadingSteps.length}>
            <div
              className="progress-bar"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>

          <div className="steps-list">
            {loadingSteps.map((step, idx) => {
              let statusClass = 'step-pending';
              if (idx < loadingStep) statusClass = 'step-completed';
              else if (idx === loadingStep) statusClass = 'step-active';

              return (
                <div key={idx} className={`step-item ${statusClass}`}>
                  <div className="step-icon-container">
                    {idx < loadingStep ? <span className="step-checkmark">✓</span> : step.icon}
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .loader-overlay {
            max-width: 520px;
            margin: 0 auto;
            padding: 36px 32px;
            text-align: center;
          }
          .loader-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .loader-spinner-wrapper {
            margin-bottom: 20px;
          }
          .spinner {
            animation: spin 1.2s linear infinite;
            color: var(--accent-cyan);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .loader-title {
            font-size: 1.45rem;
            margin-bottom: 6px;
          }
          .loader-subtitle {
            font-size: 0.88rem;
            color: var(--fg-secondary);
            margin-bottom: 28px;
            max-width: 380px;
          }
          .progress-container {
            width: 100%;
            height: 3px;
            background: var(--bg-muted);
            border-radius: 99px;
            overflow: hidden;
            margin-bottom: 24px;
          }
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            transition: width 0.35s ease-out;
          }
          .steps-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            text-align: left;
          }
          .step-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 9px 12px;
            border-radius: 8px;
            transition: all 0.25s ease;
          }
          .step-pending {
            opacity: 0.4;
          }
          .step-active {
            opacity: 1;
            background: var(--bg-muted);
            border: 1px solid var(--border-subtle);
          }
          .step-completed {
            opacity: 0.8;
            color: var(--fg-secondary);
          }
          .step-icon-container {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--bg-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .step-completed .step-icon-container {
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.28);
          }
          .step-checkmark {
            color: var(--accent-green);
            font-size: 0.75rem;
            font-weight: 700;
          }
          .step-title {
            font-size: 0.84rem;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="connector-card glass-panel animate-fade-in">
      <div className="card-header">
        <div className="brand-pill">
          <Sparkles size={12} />
          <span>GitHub activity intelligence</span>
        </div>
        <h2 className="header-title roman-header">Analyze any repository</h2>
        <p className="header-desc">
          Map ownership, collaboration, and complexity hotspots from public Git history — or use a showcase demo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="glass-input search-input"
            placeholder="owner/repo or github.com/owner/repo"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            aria-label="Repository slug or URL"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="btn btn-primary search-btn" disabled={!repoInput.trim()}>
            <span>Analyze</span>
            <ArrowRight size={15} />
          </button>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </form>

      <div className="divider">
        <span>or try a showcase</span>
      </div>

      <div className="presets-grid">
        <button type="button" className="preset-card glass-card glass-card-interactive" onClick={() => handleConnect('facebook/react')}>
          <div className="preset-meta">
            <GithubIcon size={20} className="icon-cyan" />
            <div>
              <h4 className="preset-name">React</h4>
              <p className="preset-slug">facebook/react</p>
            </div>
          </div>
          <div className="preset-specs">
            <span>15k+ commits</span>
            <span aria-hidden>•</span>
            <span>184 devs</span>
          </div>
          <div className="preset-action">
            <span>Explore demo</span>
            <Play size={12} fill="currentColor" />
          </div>
        </button>

        <button type="button" className="preset-card glass-card glass-card-interactive" onClick={() => handleConnect('vercel/next.js')}>
          <div className="preset-meta">
            <GithubIcon size={20} className="icon-orange" />
            <div>
              <h4 className="preset-name">Next.js</h4>
              <p className="preset-slug">vercel/next.js</p>
            </div>
          </div>
          <div className="preset-specs">
            <span>22k+ commits</span>
            <span aria-hidden>•</span>
            <span>320 devs</span>
          </div>
          <div className="preset-action">
            <span>Explore demo</span>
            <Play size={12} fill="currentColor" />
          </div>
        </button>
      </div>

      <style jsx>{`
        .connector-card {
          max-width: 640px;
          margin: 0 auto;
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
        }
        .card-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-soft);
          border: 1px solid var(--accent-soft-border);
          padding: 4px 11px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }
        .header-title {
          font-size: 1.65rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          color: var(--fg-primary);
        }
        .header-desc {
          color: var(--fg-secondary);
          font-size: 0.92rem;
          line-height: 1.55;
          max-width: 460px;
          margin: 0 auto;
        }
        .input-form {
          margin-bottom: 24px;
        }
        .search-input-wrapper {
          display: flex;
          position: relative;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--fg-tertiary);
          pointer-events: none;
          z-index: 1;
        }
        .search-input {
          width: 100%;
          padding: 13px 118px 13px 44px;
          font-size: 0.92rem;
          border-radius: 10px;
          font-family: var(--font-mono);
        }
        .search-btn {
          position: absolute;
          right: 5px;
          top: 5px;
          bottom: 5px;
          padding: 0 14px;
          font-size: 0.82rem;
          border-radius: 7px;
        }
        .error-message {
          color: var(--accent-red);
          font-size: 0.78rem;
          margin-top: 8px;
          text-align: left;
          padding-left: 4px;
        }
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--fg-tertiary);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .divider::before { margin-right: 12px; }
        .divider::after { margin-left: 12px; }
        .presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 560px) {
          .presets-grid { grid-template-columns: 1fr; }
          .connector-card { padding: 28px 20px; }
          .search-input { padding-right: 100px; }
        }
        .preset-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          font: inherit;
          color: inherit;
          width: 100%;
        }
        .preset-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .preset-name {
          font-size: 0.92rem;
          font-weight: 600;
          font-family: var(--font-sans);
        }
        .preset-slug {
          font-size: 0.72rem;
          color: var(--fg-tertiary);
          font-family: var(--font-mono);
        }
        .preset-specs {
          font-size: 0.78rem;
          color: var(--fg-secondary);
          display: flex;
          gap: 6px;
        }
        .preset-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-primary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 10px;
          margin-top: auto;
        }
        .preset-card:hover .preset-action {
          color: var(--accent-secondary);
        }
      `}</style>
    </div>
  );
}
