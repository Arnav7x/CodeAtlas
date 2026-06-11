'use client';

import React, { useState } from 'react';
import { HotspotFile } from '../lib/mockData';
import { AlertTriangle, Zap, CheckCircle2, Flame } from 'lucide-react';

interface HotspotsVisualizerProps {
  hotspots: HotspotFile[];
}

export default function HotspotsVisualizer({ hotspots }: HotspotsVisualizerProps) {
  const [hoveredFile, setHoveredFile] = useState<HotspotFile | null>(null);

  // SVG dimensions for scatter plot
  const plotWidth = 320;
  const plotHeight = 220;
  const padding = { top: 15, right: 15, bottom: 25, left: 30 };

  return (
    <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
      
      {/* 2D Quadrant Scatter Plot */}
      <div className="glass-card col-6 plot-card">
        <div className="card-header-group">
          <Flame size={18} className="icon-orange" />
          <h3 className="card-title">Complexity vs. Churn Hotspots</h3>
        </div>

        <p className="plot-desc">
          High-churn, highly complex files locate in the top-right <span className="text-red">Critical Hotspot</span> quadrant.
        </p>

        <div className="plot-container">
          <div className="svg-wrapper">
            <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="plot-svg">
              {/* Quadrant backgrounds */}
              {/* Top-Right: Critical (high churn, high complexity) */}
              <rect 
                x={padding.left + (plotWidth - padding.left - padding.right) / 2} 
                y={padding.top} 
                width={(plotWidth - padding.left - padding.right) / 2} 
                height={(plotHeight - padding.top - padding.bottom) / 2} 
                fill="rgba(255, 77, 77, 0.025)"
              />
              
              {/* Grid Lines splitting quadrants */}
              <line 
                x1={padding.left} 
                y1={padding.top + (plotHeight - padding.top - padding.bottom) / 2} 
                x2={plotWidth - padding.right} 
                y2={padding.top + (plotHeight - padding.top - padding.bottom) / 2} 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeDasharray="3 3"
              />
              <line 
                x1={padding.left + (plotWidth - padding.left - padding.right) / 2} 
                y1={padding.top} 
                x2={padding.left + (plotWidth - padding.left - padding.right) / 2} 
                y2={plotHeight - padding.bottom} 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeDasharray="3 3"
              />

              {/* Axes */}
              <line x1={padding.left} y1={plotHeight - padding.bottom} x2={plotWidth - padding.right} y2={plotHeight - padding.bottom} stroke="var(--border-color)" strokeWidth="1.5" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={plotHeight - padding.bottom} stroke="var(--border-color)" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={plotWidth / 2 + 10} y={plotHeight - 6} fill="var(--fg-tertiary)" fontSize="8.5" textAnchor="middle">
                Churn (Frequency of changes) →
              </text>
              <text x={8} y={plotHeight / 2 - 10} fill="var(--fg-tertiary)" fontSize="8.5" textAnchor="middle" transform={`rotate(-90 8 ${plotHeight / 2 - 10})`}>
                Complexity (LOC/Nesting) →
              </text>

              {/* Draw Files as Scatter dots */}
              {hotspots.map((file, idx) => {
                // Map percentages 0-100 to SVG space
                const x = padding.left + (file.churn / 100) * (plotWidth - padding.left - padding.right);
                // Y axis is inverted in SVG
                const y = padding.top + (1 - file.complexity / 100) * (plotHeight - padding.top - padding.bottom);
                
                let dotColor = '#10b981';
                let glowColor = 'rgba(16, 185, 129, 0.4)';
                if (file.status === 'critical') {
                  dotColor = '#ef4444';
                  glowColor = 'rgba(239, 68, 68, 0.6)';
                } else if (file.status === 'warning') {
                  dotColor = '#f97316';
                  glowColor = 'rgba(249, 115, 22, 0.6)';
                }

                const isHovered = hoveredFile?.path === file.path;

                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredFile(file)}
                    onMouseLeave={() => setHoveredFile(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? 8 : 5} 
                      fill={dotColor} 
                      style={{ 
                        filter: `drop-shadow(0 0 5px ${glowColor})`,
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)' 
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredFile && (
              <div className="plot-tooltip glass-panel animate-fade-in">
                <h5 className="tooltip-title">{hoveredFile.name}</h5>
                <p className="tooltip-path font-mono">{hoveredFile.path}</p>
                <div className="tooltip-grid">
                  <div>
                    <span>Churn:</span>
                    <strong className="font-mono">{hoveredFile.churn}%</strong>
                  </div>
                  <div>
                    <span>Complexity:</span>
                    <strong className="font-mono">{hoveredFile.complexity}/100</strong>
                  </div>
                  <div>
                    <span>Lines:</span>
                    <strong className="font-mono">{hoveredFile.lines}</strong>
                  </div>
                  <div>
                    <span>Bugs Fixed:</span>
                    <strong className="font-mono text-red">{hoveredFile.bugsFixed}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Hotspot Candidates list */}
      <div className="glass-card col-6 candidates-card">
        <div className="card-header-group">
          <Zap size={18} className="icon-cyan" />
          <h3 className="card-title">Refactoring Candidates</h3>
        </div>
        
        <div className="candidates-list">
          {hotspots.map((file, idx) => {
            let statusIcon = <CheckCircle2 size={14} className="icon-green" />;
            let statusClass = 'status-stable';
            let statusText = 'Stable';
            
            if (file.status === 'critical') {
              statusIcon = <AlertTriangle size={14} className="icon-red" />;
              statusClass = 'status-critical';
              statusText = 'Critical';
            } else if (file.status === 'warning') {
              statusIcon = <AlertTriangle size={14} className="icon-orange" />;
              statusClass = 'status-warning';
              statusText = 'Warning';
            }

            return (
              <div key={idx} className="candidate-row">
                <div className="candidate-meta">
                  {statusIcon}
                  <div className="candidate-name-group">
                    <span className="candidate-name" title={file.path}>{file.name}</span>
                    <span className="candidate-path font-mono">{file.path}</span>
                  </div>
                </div>

                <div className="candidate-specs">
                  <div className="spec-item">
                    <span className="spec-label">Churn</span>
                    <span className="spec-val font-mono">{file.churn}%</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Complexity</span>
                    <span className="spec-val font-mono">{file.complexity}</span>
                  </div>
                  <span className={`status-badge ${statusClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .plot-card, .candidates-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
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
        .plot-desc {
          font-size: 0.8rem;
          color: var(--fg-secondary);
          margin-bottom: 8px;
        }
        .text-red {
          color: var(--accent-red);
          font-weight: 600;
        }
        .plot-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .svg-wrapper {
          width: 100%;
          position: relative;
        }
        .plot-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .plot-tooltip {
          position: absolute;
          top: 0;
          right: 0;
          width: 180px;
          padding: 10px;
          border-radius: 6px;
          background: var(--bg-tertiary);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          pointer-events: none;
          z-index: 10;
        }
        .tooltip-title {
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tooltip-path {
          font-size: 0.6rem;
          color: var(--fg-tertiary);
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tooltip-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          font-size: 0.65rem;
        }
        .tooltip-grid div {
          display: flex;
          justify-content: space-between;
          color: var(--fg-secondary);
        }
        .tooltip-grid strong {
          color: var(--fg-primary);
        }
        .tooltip-grid .text-red {
          color: var(--accent-red);
        }
        
        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .candidate-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.01);
          border-radius: 8px;
          gap: 12px;
        }
        .candidate-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }
        .candidate-name-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .candidate-name {
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .candidate-path {
          font-size: 0.65rem;
          color: var(--fg-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .candidate-specs {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .spec-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .spec-label {
          font-size: 0.6rem;
          color: var(--fg-tertiary);
          text-transform: uppercase;
        }
        .spec-val {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-primary);
        }
        .status-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: 65px;
          text-align: center;
        }
        .status-stable {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .status-warning {
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.2);
          color: #f97316;
        }
        .status-critical {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .icon-green { color: #10b981; }
        .icon-orange { color: #f97316; }
        .icon-red { color: #ef4444; }
        .icon-cyan { color: var(--accent-cyan); }
        .font-mono {
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
