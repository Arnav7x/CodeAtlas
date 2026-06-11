'use client';

import React, { useState, useEffect } from 'react';
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

const Github = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  
  const owner = params.owner as string;
  const repo = params.repo as string;
  
  const [data, setData] = useState<RepositoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('github_pat') || undefined;
      const repoData = await fetchRepositoryData(owner, repo, token);
      setData(repoData);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository metrics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (owner && repo) {
      loadData();
    }
  }, [owner, repo]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(true);
  };

  const handleBack = () => {
    router.push('/');
  };

  // Render Loader Skeleton
  if (isLoading && !isRefreshing) {
    return (
      <div className="layout-wrapper">
        <Navbar currentRepo={`${owner}/${repo}`} />
        <main className="main-content">
          <div className="skeleton-header animate-pulse-slow"></div>
          <div className="skeleton-stats-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card animate-pulse-slow" style={{ height: '110px' }}></div>
            ))}
          </div>
          <div className="skeleton-grid">
            <div className="skeleton-card animate-pulse-slow" style={{ height: '340px' }}></div>
            <div className="skeleton-card animate-pulse-slow" style={{ height: '340px' }}></div>
          </div>
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
            padding: 32px 24px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .skeleton-header {
            height: 48px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }
          .skeleton-stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .skeleton-card {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border: 1px solid var(--border-color);
          }
        `}</style>
      </div>
    );
  }

  // Render Error Message
  if (error) {
    return (
      <div className="layout-wrapper">
        <Navbar currentRepo={`${owner}/${repo}`} />
        <main className="error-main">
          <div className="error-card glass-panel animate-fade-in">
            <AlertCircle size={48} className="icon-red animate-pulse" />
            <h2 className="error-title">Analysis Interrupted</h2>
            <p className="error-desc">{error}</p>
            
            <div className="error-hint">
              <Database size={16} className="icon-cyan" />
              <span>Hint: If this is a private repository or you are making too many requests, add a GitHub PAT in the top-right settings.</span>
            </div>

            <div className="error-actions">
              <button onClick={handleBack} className="btn btn-secondary">
                <ChevronLeft size={16} />
                <span>Go Back</span>
              </button>
              <button onClick={() => loadData()} className="btn btn-primary">
                <RefreshCw size={16} />
                <span>Try Again</span>
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
            max-width: 500px;
            width: 100%;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
          .icon-red {
            color: var(--accent-red);
          }
          .error-title {
            font-size: 1.4rem;
            font-weight: 700;
          }
          .error-desc {
            font-size: 0.88rem;
            color: var(--fg-secondary);
            line-height: 1.5;
          }
          .error-hint {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            background: rgba(0, 210, 255, 0.05);
            border: 1px solid rgba(0, 210, 255, 0.15);
            padding: 12px 14px;
            border-radius: 8px;
            text-align: left;
            font-size: 0.78rem;
            color: var(--fg-secondary);
            line-height: 1.4;
          }
          .icon-cyan {
            color: var(--accent-cyan);
          }
          .error-actions {
            display: flex;
            gap: 12px;
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="layout-wrapper">
      <Navbar currentRepo={data ? `${data.owner}/${data.repo}` : `${owner}/${repo}`} />

      {data && (
        <main className="main-content">
          {/* Dashboard Header */}
          <div className="dashboard-header-bar">
            <button onClick={handleBack} className="back-btn-sm font-mono">
              <ChevronLeft size={14} />
              <span>/home</span>
            </button>

            <div className="dashboard-title-group">
              <div className="repo-avatar-group">
                <Github size={24} className="icon-cyan" />
              </div>
              <div>
                <h1 className="dashboard-title">
                  {data.owner}/<span className="gradient-text">{data.repo}</span>
                </h1>
                <p className="dashboard-subtitle">
                  Analysis context compiled from active codebase structures and recent commits.
                </p>
              </div>
            </div>

            <button 
              onClick={handleRefresh} 
              disabled={isRefreshing} 
              className="btn btn-secondary btn-sm refresh-btn"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spinner' : ''} />
              <span>{isRefreshing ? 'Analyzing...' : 'Re-Analyze'}</span>
            </button>
          </div>

          {/* Overview Metrics Cards Row */}
          <OverviewStats stats={data.stats} />

          {/* Charts Section: Timeline and Collaboration Network */}
          <ActivityGraph 
            activity={data.activity} 
            developers={data.developers} 
            connections={data.connections} 
          />

          {/* Hotspots Section: Scatter plot & refactoring candidate details */}
          <HotspotsVisualizer hotspots={data.hotspots} />

          {/* Full Width AI Insights Feed */}
          <InsightsFeed insights={data.insights} />

          {/* Full Width Tree Directory Ownership Map */}
          <OwnershipMap ownershipData={data.ownership} />
        </main>
      )}

      <footer className="dashboard-footer">
        <div className="footer-inner font-mono">
          <span>CODEATLAS CORE ENGINE v1.2 // PERSISTENT CACHE READY</span>
          <span>QUERY COMPLETE // LATENCY 142MS</span>
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
          padding: 32px 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .dashboard-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .refresh-btn {
            align-self: flex-end;
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
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .back-btn-sm:hover {
          color: var(--accent-cyan);
        }
        .dashboard-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }
        .repo-avatar-group {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(0, 210, 255, 0.05);
          border: 1px solid rgba(0, 210, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dashboard-title {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--fg-primary);
        }
        .dashboard-subtitle {
          font-size: 0.78rem;
          color: var(--fg-secondary);
          margin-top: 2px;
        }
        .refresh-btn {
          font-size: 0.8rem;
          padding: 8px 14px;
        }
        .spinner {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dashboard-footer {
          border-top: 1px solid var(--border-color);
          background: rgba(4, 4, 6, 0.8);
          padding: 14px 0;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          color: var(--fg-tertiary);
          letter-spacing: 0.05em;
        }
        .icon-cyan {
          color: var(--accent-cyan);
        }
        .font-mono {
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
