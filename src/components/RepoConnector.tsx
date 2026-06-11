'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Search, Play, ArrowRight, Sparkles, Loader2, GitCommit, Users, FileCode } from 'lucide-react';

export default function RepoConnector() {
  const router = useRouter();
  const [repoInput, setRepoInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const loadingSteps = [
    { title: 'Connecting to GitHub API...', icon: <Github size={16} className="icon-cyan" /> },
    { title: 'Parsing git commits & history...', icon: <GitCommit size={16} className="icon-green" /> },
    { title: 'Mapping contributor collaboration network...', icon: <Users size={16} className="icon-purple" /> },
    { title: 'Analyzing directory structures & ownership...', icon: <FileCode size={16} className="icon-orange" /> },
    { title: 'Generating AI engineering insights...', icon: <Sparkles size={16} className="icon-cyan animate-pulse" /> }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(repoInput);
  };

  const handleConnect = (slug: string) => {
    if (!slug) return;
    setError('');
    
    // Parse GitHub URL or slug
    let cleanSlug = slug.trim();
    if (cleanSlug.includes('github.com/')) {
      const parts = cleanSlug.split('github.com/');
      if (parts[1]) {
        cleanSlug = parts[1].replace(/\.git$/, '').split('/').slice(0, 2).join('/');
      }
    }
    
    const parts = cleanSlug.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setError('Please enter a valid slug (owner/repo) or a GitHub repository link.');
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);

    // Simulate analysis delay
    setTimeout(() => {
      router.push(`/dashboard/${parts[0]}/${parts[1]}`);
    }, 6000);
  };

  if (isLoading) {
    return (
      <div className="loader-overlay glass-panel animate-fade-in">
        <div className="loader-content">
          <div className="loader-spinner-wrapper">
            <Loader2 className="spinner" size={48} />
            <div className="pulse-circle"></div>
          </div>
          
          <h2 className="loader-title">Analyzing Codebase</h2>
          <p className="loader-subtitle">Mapping contribution velocity, ownership distributions, and hotspot files.</p>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}></div>
          </div>

          <div className="steps-list">
            {loadingSteps.map((step, idx) => {
              let statusClass = 'step-pending';
              if (idx < loadingStep) statusClass = 'step-completed';
              else if (idx === loadingStep) statusClass = 'step-active';

              return (
                <div key={idx} className={`step-item ${statusClass}`}>
                  <div className="step-icon-container">
                    {idx < loadingStep ? (
                      <span className="step-checkmark">✓</span>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .loader-overlay {
            max-width: 600px;
            margin: 80px auto;
            padding: 40px;
            text-align: center;
          }
          .loader-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .loader-spinner-wrapper {
            position: relative;
            margin-bottom: 24px;
          }
          .spinner {
            animation: spin 1.5s linear infinite;
            color: var(--accent-cyan);
            filter: drop-shadow(0 0 8px var(--accent-cyan));
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .pulse-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 1px solid rgba(0, 210, 255, 0.2);
            animation: pulse-ring 2s infinite ease-in-out;
            pointer-events: none;
            z-index: -1;
          }
          .loader-title {
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
          }
          .loader-subtitle {
            font-size: 0.9rem;
            color: var(--fg-secondary);
            margin-bottom: 32px;
            max-width: 420px;
          }
          .progress-container {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 99px;
            overflow: hidden;
            margin-bottom: 32px;
          }
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-green));
            box-shadow: 0 0 10px var(--accent-green);
            transition: width 0.4s ease-out;
          }
          .steps-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            text-align: left;
          }
          .step-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .step-pending {
            opacity: 0.4;
            background: transparent;
          }
          .step-active {
            opacity: 1;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .step-completed {
            opacity: 0.85;
            color: var(--fg-secondary);
          }
          .step-icon-container {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.04);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }
          .step-completed .step-icon-container {
            background: rgba(0, 245, 160, 0.1);
            border: 1px solid rgba(0, 245, 160, 0.3);
          }
          .step-checkmark {
            color: var(--accent-green);
            font-size: 0.8rem;
          }
          .step-title {
            font-size: 0.85rem;
            font-weight: 500;
          }
          .step-active .step-title {
            color: var(--fg-primary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="connector-card glass-panel animate-fade-in">
      <div className="card-header">
        <div className="brand-pill">
          <Sparkles size={12} className="icon-cyan" />
          <span>GitHub Activity Intelligence</span>
        </div>
        <h1 className="header-title">Codebase Analytics Made Visual</h1>
        <p className="header-desc">
          Connect any public GitHub repository to map code ownership, identify complexity hotspots, and generate AI insights in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="glass-input search-input"
            placeholder="e.g. facebook/react or vercel/next.js"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary search-btn">
            <span>Analyze</span>
            <ArrowRight size={16} />
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="divider">
        <span>or select a preset showcase repo</span>
      </div>

      <div className="presets-grid">
        <div className="preset-card glass-card" onClick={() => handleConnect('facebook/react')}>
          <div className="preset-meta">
            <Github size={20} className="icon-cyan" />
            <div>
              <h4 className="preset-name">React</h4>
              <p className="preset-slug">facebook/react</p>
            </div>
          </div>
          <div className="preset-specs">
            <span>15k+ commits</span>
            <span>•</span>
            <span>184 devs</span>
          </div>
          <div className="preset-action">
            <span>Explore Demo</span>
            <Play size={12} fill="currentColor" />
          </div>
        </div>

        <div className="preset-card glass-card" onClick={() => handleConnect('vercel/next.js')}>
          <div className="preset-meta">
            <Github size={20} className="icon-green" />
            <div>
              <h4 className="preset-name">Next.js</h4>
              <p className="preset-slug">vercel/next.js</p>
            </div>
          </div>
          <div className="preset-specs">
            <span>22k+ commits</span>
            <span>•</span>
            <span>320 devs</span>
          </div>
          <div className="preset-action">
            <span>Explore Demo</span>
            <Play size={12} fill="currentColor" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .connector-card {
          max-width: 680px;
          margin: 60px auto;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .connector-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.03), transparent 50%);
          pointer-events: none;
          z-index: -1;
        }
        .card-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.15);
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .header-title {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--fg-primary) 30%, var(--fg-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-desc {
          color: var(--fg-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          max-width: 520px;
          margin: 0 auto;
        }
        .input-form {
          margin-bottom: 32px;
        }
        .search-input-wrapper {
          display: flex;
          position: relative;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: var(--fg-tertiary);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 14px 14px 14px 48px;
          font-size: 0.95rem;
          border-radius: 10px;
        }
        .search-btn {
          position: absolute;
          right: 6px;
          top: 6px;
          bottom: 6px;
          padding: 0 16px;
          font-size: 0.85rem;
          border-radius: 6px;
        }
        .error-message {
          color: var(--accent-red);
          font-size: 0.8rem;
          margin-top: 8px;
          text-align: left;
          padding-left: 4px;
        }
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: var(--fg-tertiary);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .divider::before {
          margin-right: 12px;
        }
        .divider::after {
          margin-left: 12px;
        }
        .presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .presets-grid {
            grid-template-columns: 1fr;
          }
        }
        .preset-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
        }
        .preset-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .preset-name {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .preset-slug {
          font-size: 0.75rem;
          color: var(--fg-tertiary);
          font-family: var(--font-mono);
        }
        .preset-specs {
          font-size: 0.8rem;
          color: var(--fg-secondary);
          display: flex;
          gap: 6px;
        }
        .preset-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-cyan);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 10px;
          margin-top: auto;
        }
        .preset-card:hover .preset-action {
          color: var(--accent-green);
        }
      `}</style>
    </div>
  );
}
