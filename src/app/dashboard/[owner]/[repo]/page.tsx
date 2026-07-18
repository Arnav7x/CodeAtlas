'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import OverviewStats from '../../../../components/OverviewStats';
import ActivityGraph from '../../../../components/ActivityGraph';
import OwnershipMap from '../../../../components/OwnershipMap';
import HotspotsVisualizer from '../../../../components/HotspotsVisualizer';
import InsightsFeed from '../../../../components/InsightsFeed';
import { fetchRepositoryData } from '../../../../lib/github';
import { RepositoryData } from '../../../../lib/mockData';
import { AlertCircle, RefreshCw, ChevronLeft, Database } from 'lucide-react';

const GithubIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();

  const owner = decodeURIComponent((params.owner as string) || '');
  const repo = decodeURIComponent((params.repo as string) || '');

  const [data, setData] = useState<RepositoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const loadData = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      const started = performance.now();

      try {
        const token = localStorage.getItem('github_pat') || undefined;
        const repoData = await fetchRepositoryData(owner, repo, token);
        setData(repoData);
        setLatencyMs(Math.round(performance.now() - started));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to analyze repository metrics.';
        setError(message);
        setData(null);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [owner, repo]
  );

  useEffect(() => {
    if (owner && repo) {
      loadData(false);
    }
  }, [owner, repo, loadData]);

  const handleBack = () => router.push('/');

  if (isLoading && !isRefreshing) {
    return (
      <div className="layout-wrapper">
        <Navbar currentRepo={`${owner}/${repo}`} />
        <main className="main-content">
          <div className="skeleton-header" />
          <div className="skeleton-stats-row">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" style={{ height: '110px' }} />
            ))}
          </div>
          <div className="skeleton-grid">
            <div className="skeleton-card" style={{ height: '320px' }} />
            <div className="skeleton-card" style={{ height: '320px' }} />
          </div>
          <p className="skeleton-hint">
            Loading analysis for <strong>{owner}/{repo}</strong>…
          </p>
        </main>
        <style jsx>{`
          .layout-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .main-content {
            flex: 1;
            max-width: 1280px;
            margin: 0 auto;
            padding: 28px 24px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .skeleton-header {
            height: 56px;
            background: var(--bg-muted);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            animation: pulse 1.4s ease-in-out infinite;
          }
          .skeleton-stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          @media (max-width: 900px) {
            .skeleton-stats-row {
              grid-template-columns: 1fr 1fr;
            }
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          @media (max-width: 900px) {
            .skeleton-grid {
              grid-template-columns: 1fr;
            }
          }
          .skeleton-card {
            background: var(--bg-muted);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            animation: pulse 1.4s ease-in-out infinite;
          }
          .skeleton-hint {
            font-size: 0.8rem;
            color: var(--fg-tertiary);
            text-align: center;
            margin-top: 8px;
          }
          .skeleton-hint strong {
            color: var(--fg-secondary);
            font-family: var(--font-mono);
            font-weight: 500;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout-wrapper">
        <Navbar currentRepo={`${owner}/${repo}`} />
        <main className="error-main">
          <div className="error-card glass-panel animate-fade-in">
            <AlertCircle size={40} className="icon-red" />
            <h2 className="error-title roman-header">Analysis interrupted</h2>
            <p className="error-desc">{error}</p>

            <div className="error-hint">
              <Database size={16} className="icon-cyan" />
              <span>
                Private repos and high traffic need a GitHub PAT. Open <strong>PAT</strong> in the top-right, save a token, then
                retry.
              </span>
            </div>

            <div className="error-actions">
              <button type="button" onClick={handleBack} className="btn btn-secondary">
                <ChevronLeft size={16} />
                <span>Go back</span>
              </button>
              <button type="button" onClick={() => loadData(false)} className="btn btn-primary">
                <RefreshCw size={16} />
                <span>Try again</span>
              </button>
            </div>
          </div>
        </main>
        <style jsx>{`
          .layout-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .error-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .error-card {
            max-width: 480px;
            width: 100%;
            padding: 36px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
          .error-title {
            font-size: 1.35rem;
          }
          .error-desc {
            font-size: 0.88rem;
            color: var(--fg-secondary);
            line-height: 1.55;
          }
          .error-hint {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: var(--accent-soft);
            border: 1px solid var(--accent-soft-border);
            padding: 12px 14px;
            border-radius: 8px;
            text-align: left;
            font-size: 0.78rem;
            color: var(--fg-secondary);
            line-height: 1.45;
          }
          .error-hint strong {
            color: var(--fg-primary);
          }
          .error-actions {
            display: flex;
            gap: 10px;
            margin-top: 6px;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="layout-wrapper">
      <Navbar currentRepo={data ? `${data.owner}/${data.repo}` : `${owner}/${repo}`} />

      {data && (
        <main className="main-content">
          <div className="dashboard-header-bar">
            <button type="button" onClick={handleBack} className="back-btn-sm">
              <ChevronLeft size={14} />
              <span>Home</span>
            </button>

            <div className="dashboard-title-group">
              <div className="repo-avatar-group">
                <GithubIcon size={22} className="icon-cyan" />
              </div>
              <div>
                <h1 className="dashboard-title">
                  {data.owner}/<span className="gradient-text">{data.repo}</span>
                </h1>
                <p className="dashboard-subtitle">
                  Compiled from repository structure and recent commit history
                  {latencyMs != null ? ` · ${latencyMs}ms` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="btn btn-secondary btn-sm refresh-btn"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spinner' : ''} />
              <span>{isRefreshing ? 'Refreshing…' : 'Re-analyze'}</span>
            </button>
          </div>

          {isRefreshing && (
            <div className="refresh-banner" role="status">
              Refreshing metrics…
            </div>
          )}

          <OverviewStats stats={data.stats} />
          <ActivityGraph activity={data.activity} developers={data.developers} connections={data.connections} />
          <HotspotsVisualizer hotspots={data.hotspots} />
          <InsightsFeed insights={data.insights} />
          <OwnershipMap ownershipData={data.ownership} />
        </main>
      )}

      <footer className="dashboard-footer">
        <div className="footer-inner">
          <span>CodeAtlas · engineering intelligence</span>
          <span>
            {data ? `${data.owner}/${data.repo}` : `${owner}/${repo}`}
            {latencyMs != null ? ` · ${latencyMs}ms` : ''}
          </span>
        </div>
      </footer>

      <style jsx>{`
        .layout-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 24px 40px;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .dashboard-header-bar {
            flex-wrap: wrap;
          }
          .refresh-btn {
            margin-left: auto;
          }
        }
        .back-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--fg-tertiary);
          font-size: 0.8rem;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 4px 0;
        }
        .back-btn-sm:hover {
          color: var(--accent-primary);
        }
        .dashboard-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }
        .repo-avatar-group {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-soft);
          border: 1px solid var(--accent-soft-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dashboard-title {
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          font-family: var(--font-sans);
          word-break: break-all;
        }
        .dashboard-subtitle {
          font-size: 0.76rem;
          color: var(--fg-secondary);
          margin-top: 3px;
        }
        .refresh-btn {
          flex-shrink: 0;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .refresh-banner {
          font-size: 0.78rem;
          color: var(--fg-secondary);
          background: var(--accent-soft);
          border: 1px solid var(--accent-soft-border);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          text-align: center;
        }
        .dashboard-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-muted);
          padding: 14px 0;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 0.68rem;
          color: var(--fg-tertiary);
          letter-spacing: 0.02em;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
