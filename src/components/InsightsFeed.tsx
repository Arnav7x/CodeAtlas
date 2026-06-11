'use client';

import React from 'react';
import { EngineeringInsight } from '../lib/mockData';
import { ShieldAlert, AlertTriangle, Lightbulb, Zap, CheckCircle2 } from 'lucide-react';

interface InsightsFeedProps {
  insights: EngineeringInsight[];
}

export default function InsightsFeed({ insights }: InsightsFeedProps) {
  return (
    <div className="insights-card glass-card col-12">
      <div className="card-header-group">
        <Lightbulb size={18} className="icon-cyan animate-pulse-slow" />
        <h3 className="card-title">AI Engineering Insights</h3>
        <span className="header-subtitle-tag">Actionable Recommendations</span>
      </div>

      <div className="insights-feed">
        {insights.map((insight) => {
          let cardBorderClass = 'border-info';
          let icon = <CheckCircle2 size={16} className="icon-cyan" fill="currentColor" />;
          let categoryBg = 'rgba(0, 210, 255, 0.08)';
          let categoryColor = 'var(--accent-cyan)';

          if (insight.type === 'danger') {
            cardBorderClass = 'border-danger';
            icon = <ShieldAlert size={16} className="icon-red animate-pulse" />;
            categoryBg = 'rgba(255, 77, 77, 0.08)';
            categoryColor = 'var(--accent-red)';
          } else if (insight.type === 'warning') {
            cardBorderClass = 'border-warning';
            icon = <AlertTriangle size={16} className="icon-orange" />;
            categoryBg = 'rgba(255, 159, 67, 0.08)';
            categoryColor = 'var(--accent-orange)';
          } else if (insight.type === 'info') {
            cardBorderClass = 'border-info';
            icon = <Zap size={16} className="icon-cyan" />;
          }

          return (
            <div key={insight.id} className={`insight-row glass-card ${cardBorderClass}`}>
              <div className="insight-meta">
                <div className="insight-badge-group">
                  {icon}
                  <span className="insight-category" style={{ backgroundColor: categoryBg, color: categoryColor }}>
                    {insight.category}
                  </span>
                </div>
                {insight.impactMetric && (
                  <span className="impact-metric font-mono">
                    {insight.impactMetric}
                  </span>
                )}
              </div>

              <div className="insight-content">
                <h4 className="insight-title">{insight.title}</h4>
                <p className="insight-desc">{insight.description}</p>
              </div>

              <div className="recommendation-box">
                <strong className="rec-label">Recommended Action:</strong>
                <span className="rec-text">{insight.recommendation}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .insights-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .card-header-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-title {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--fg-primary);
        }
        .header-subtitle-tag {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-cyan);
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
        }
        .insights-feed {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .insights-feed {
            grid-template-columns: 1fr;
          }
        }
        .insight-row {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 3px solid transparent;
        }
        .insight-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.5);
        }
        .border-danger {
          border-left-color: var(--accent-red);
          border-color: rgba(255, 77, 77, 0.12);
        }
        .border-warning {
          border-left-color: var(--accent-orange);
          border-color: rgba(255, 159, 67, 0.12);
        }
        .border-info {
          border-left-color: var(--accent-cyan);
          border-color: rgba(0, 210, 255, 0.12);
        }
        .insight-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .insight-badge-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .insight-category {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .impact-metric {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--fg-secondary);
          background: rgba(255, 255, 255, 0.04);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .insight-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--fg-primary);
        }
        .insight-desc {
          font-size: 0.75rem;
          color: var(--fg-secondary);
          line-height: 1.45;
        }
        .recommendation-box {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          padding: 10px;
          font-size: 0.72rem;
          line-height: 1.4;
        }
        .rec-label {
          color: var(--fg-primary);
          font-weight: 600;
        }
        .rec-text {
          color: var(--fg-secondary);
        }
        .icon-cyan { color: var(--accent-cyan); }
        .icon-purple { color: var(--accent-purple); }
        .icon-orange { color: var(--accent-orange); }
        .icon-red { color: var(--accent-red); }
        .font-mono {
          font-family: var(--font-mono);
        }
        .col-12 {
          grid-column: span 12;
        }
      `}</style>
    </div>
  );
}
