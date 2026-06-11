'use client';

import React from 'react';
import { RepoStats } from '../lib/mockData';
import { ShieldAlert, Activity, Heart, Users, Code } from 'lucide-react';

interface OverviewStatsProps {
  stats: RepoStats;
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
  // Determine health level
  let healthLevel = 'Excellent';
  let healthColorClass = 'text-green';
  let healthBorderClass = 'border-green';
  if (stats.codeHealth < 75) {
    healthLevel = 'Critical';
    healthColorClass = 'text-red';
    healthBorderClass = 'border-red';
  } else if (stats.codeHealth < 90) {
    healthLevel = 'Warning';
    healthColorClass = 'text-orange';
    healthBorderClass = 'border-orange';
  }

  return (
    <div className="stats-row">
      {/* Code Health */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper circle-green">
          <Heart size={20} className="icon-green animate-pulse-slow" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Code Health Index</span>
          <div className="health-display">
            <h2 className="stat-value">{stats.codeHealth}%</h2>
            <span className={`health-badge ${healthBorderClass} ${healthColorClass}`}>
              {healthLevel}
            </span>
          </div>
          <p className="stat-desc">Complexity and churn ratios</p>
        </div>
      </div>

      {/* Bus Factor */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper circle-orange">
          <ShieldAlert size={20} className="icon-orange" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Bus Factor Risk</span>
          <h2 className="stat-value">{stats.busFactor}</h2>
          <p className="stat-desc">
            Siloed in: <span className="font-mono text-white">{stats.busFactorDevs.join(', ')}</span>
          </p>
        </div>
      </div>

      {/* Activity Velocity */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper circle-cyan">
          <Activity size={20} className="icon-cyan" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Weekly Velocity</span>
          <h2 className="stat-value">{stats.velocity} <span className="value-suffix">commits/wk</span></h2>
          <p className="stat-desc">Avg frequency in last 6 weeks</p>
        </div>
      </div>

      {/* Contributors */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper circle-purple">
          <Users size={20} className="icon-purple" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Contributors</span>
          <h2 className="stat-value">{stats.contributors}</h2>
          <p className="stat-desc">Active developers analyzed</p>
        </div>
      </div>

      {/* Languages Segmented Bar */}
      <div className="glass-card col-12 lang-card">
        <div className="lang-header">
          <div className="lang-title-group">
            <Code size={16} className="icon-cyan" />
            <h4 className="lang-title">Codebase Composition</h4>
          </div>
          <div className="lang-breakdown">
            {stats.languages.map((lang, idx) => (
              <div key={idx} className="lang-indicator">
                <span className="lang-color-dot" style={{ backgroundColor: lang.color }}></span>
                <span className="lang-indicator-name">{lang.name}</span>
                <span className="lang-indicator-percent">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lang-bar">
          {stats.languages.map((lang, idx) => (
            <div 
              key={idx} 
              className="lang-segment" 
              style={{ 
                width: `${lang.percentage}%`, 
                backgroundColor: lang.color,
                boxShadow: `0 0 10px ${lang.color}33`
              }}
              title={`${lang.name}: ${lang.percentage}%`}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
        .stat-card {
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .stat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .circle-green {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .circle-orange {
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.15);
        }
        .circle-cyan {
          background: rgba(255, 69, 48, 0.08);
          border: 1px solid rgba(255, 69, 48, 0.15);
        }
        .circle-purple {
          background: rgba(171, 112, 255, 0.08);
          border: 1px solid rgba(171, 112, 255, 0.15);
        }
        .stat-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--fg-primary);
        }
        .value-suffix {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--fg-secondary);
        }
        .health-display {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .health-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid currentColor;
        }
         .text-green { color: #10b981; }
        .border-green { border-color: rgba(16, 185, 129, 0.3); }
        .text-orange { color: #f97316; }
        .border-orange { border-color: rgba(249, 115, 22, 0.3); }
        .text-red { color: #ef4444; }
        .border-red { border-color: rgba(239, 68, 68, 0.3); }
        .icon-green { color: #10b981; }
        .icon-orange { color: #f97316; }
        .icon-cyan { color: var(--accent-cyan); }
        .icon-purple { color: var(--accent-purple); }
        
        .stat-desc {
          font-size: 0.75rem;
          color: var(--fg-secondary);
          margin-top: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        .text-white {
          color: var(--fg-primary);
        }
        .col-12 {
          grid-column: span 4;
        }
        @media (max-width: 1024px) {
          .col-12 {
            grid-column: span 2;
          }
        }
        @media (max-width: 600px) {
          .col-12 {
            grid-column: span 1;
          }
        }
        .lang-card {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .lang-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .lang-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lang-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--fg-primary);
        }
        .lang-breakdown {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .lang-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
        }
        .lang-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .lang-indicator-name {
          color: var(--fg-secondary);
          font-weight: 500;
        }
        .lang-indicator-percent {
          color: var(--fg-primary);
          font-weight: 600;
        }
        .lang-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 99px;
          overflow: hidden;
          display: flex;
        }
        .lang-segment {
          height: 100%;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
