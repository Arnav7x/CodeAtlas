'use client';

import React, { useState, useMemo } from 'react';
import { ActivityPoint, DevNode, DevLink } from '../lib/mockData';
import { Calendar, GitCommit, GitMerge, Info, Cpu, Users } from 'lucide-react';

interface ActivityGraphProps {
  activity: ActivityPoint[];
  developers: DevNode[];
  connections: DevLink[];
}

export default function ActivityGraph({ activity, developers, connections }: ActivityGraphProps) {
  const [selectedDev, setSelectedDev] = useState<DevNode | null>(developers[0] || null);
  const [hoveredDev, setHoveredDev] = useState<string | null>(null);

  // Math variables for SVG layout of Collaboration Network
  const width = 450;
  const height = 300;
  const center = { x: width / 2, y: height / 2 };
  const radius = 95; // Radius of node circle

  // Compute developer positions in a circle
  const devPositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    developers.forEach((dev, idx) => {
      const angle = (idx / developers.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      pos[dev.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      };
    });
    return pos;
  }, [developers, center.x, center.y, radius]);

  // Compute connections matching current hover/selected developer
  const activeLinks = useMemo(() => {
    const activeDevId = hoveredDev || selectedDev?.id;
    if (!activeDevId) return [];
    
    return connections.filter(
      link => link.source === activeDevId || link.target === activeDevId
    );
  }, [connections, selectedDev, hoveredDev]);

  // Activity Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 160;
  const chartPadding = { top: 20, right: 20, bottom: 25, left: 35 };

  // Calculate coordinates for Activity Chart
  const chartPoints = useMemo(() => {
    if (activity.length === 0) return [];
    const maxVal = Math.max(...activity.map(a => Math.max(a.commits, a.prs))) || 10;
    
    const xStep = (chartWidth - chartPadding.left - chartPadding.right) / (activity.length - 1);
    
    return activity.map((d, index) => {
      const x = chartPadding.left + index * xStep;
      // Invert Y since (0,0) is top-left in SVG
      const yCommits = chartPadding.top + (1 - d.commits / maxVal) * (chartHeight - chartPadding.top - chartPadding.bottom);
      const yPRs = chartPadding.top + (1 - d.prs / maxVal) * (chartHeight - chartPadding.top - chartPadding.bottom);
      return { x, yCommits, yPRs, raw: d };
    });
  }, [activity, chartWidth, chartHeight]);

  // SVG Path strings for Commits and PRs
  const paths = useMemo(() => {
    if (chartPoints.length === 0) return { commits: '', prs: '', areaCommits: '' };
    
    const commitPoints = chartPoints.map(p => `${p.x},${p.yCommits}`).join(' L ');
    const prPoints = chartPoints.map(p => `${p.x},${p.yPRs}`).join(' L ');
    
    const areaCommits = `${chartPoints[0].x},${chartHeight - chartPadding.bottom} L ${commitPoints} L ${chartPoints[chartPoints.length - 1].x},${chartHeight - chartPadding.bottom} Z`;

    return {
      commits: `M ${commitPoints}`,
      prs: `M ${prPoints}`,
      areaCommits
    };
  }, [chartPoints, chartHeight]);

  const maxValY = Math.max(...activity.map(a => Math.max(a.commits, a.prs))) || 10;

  return (
    <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
      
      {/* Activity Timeline Chart */}
      <div className="glass-card col-6 timeline-card">
        <div className="card-header-group">
          <Calendar size={18} className="icon-cyan" />
          <h3 className="card-title">Weekly Contribution Timeline</h3>
        </div>
        
        <div className="chart-wrapper">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="timeline-svg">
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = chartPadding.top + ratio * (chartHeight - chartPadding.top - chartPadding.bottom);
              const val = Math.round((1 - ratio) * maxValY);
              return (
                <g key={idx}>
                  <line 
                    x1={chartPadding.left} 
                    y1={y} 
                    x2={chartWidth - chartPadding.right} 
                    y2={y} 
                    stroke="var(--border-color)" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={chartPadding.left - 8} 
                    y={y + 3} 
                    fill="var(--fg-tertiary)" 
                    fontSize="9" 
                    textAnchor="end"
                    fontFamily="var(--font-mono)"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {paths.areaCommits && (
              <path d={paths.areaCommits} fill="url(#areaGlow)" />
            )}

            {/* Commit Line */}
            {paths.commits && (
              <path 
                d={paths.commits} 
                fill="none" 
                stroke="var(--accent-cyan)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                filter="drop-shadow(0 0 4px rgba(0, 210, 255, 0.3))"
              />
            )}

            {/* PR Line */}
            {paths.prs && (
              <path 
                d={paths.prs} 
                fill="none" 
                stroke="var(--accent-purple)" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="3 3"
              />
            )}

            {/* Points & Interactive Tooltips */}
            {chartPoints.map((pt, index) => (
              <g key={index} className="chart-group-node">
                <circle 
                  cx={pt.x} 
                  cy={pt.yCommits} 
                  r="4" 
                  fill="var(--bg-primary)" 
                  stroke="var(--accent-cyan)" 
                  strokeWidth="2" 
                />
                <circle 
                  cx={pt.x} 
                  cy={pt.yPRs} 
                  r="3.5" 
                  fill="var(--bg-primary)" 
                  stroke="var(--accent-purple)" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={pt.x} 
                  y={chartHeight - 8} 
                  fill="var(--fg-tertiary)" 
                  fontSize="9.5" 
                  textAnchor="middle"
                >
                  {pt.raw.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-indicator" style={{ backgroundColor: 'var(--accent-cyan)' }}></span>
            <span>Commits Frequency</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator" style={{ backgroundColor: 'var(--accent-purple)', borderStyle: 'dashed', background: 'transparent' }}></span>
            <span>PRs Merged</span>
          </div>
        </div>
      </div>

      {/* Collaboration Network Node Graph */}
      <div className="glass-card col-6 network-card">
        <div className="card-header-group">
          <Users size={18} className="icon-purple" />
          <h3 className="card-title">Developer Collaboration Network</h3>
          <div className="info-tooltip">
            <Info size={14} className="icon-tertiary" />
            <div className="tooltip-content">
              Connecting lines represent developers co-authoring files. Glowing lines show collaborations for selected dev.
            </div>
          </div>
        </div>

        <div className="network-inner">
          <div className="network-svg-container">
            <svg viewBox={`0 0 ${width} ${height}`} className="network-svg">
              {/* Draw Background Connections */}
              {connections.map((link, idx) => {
                const sourcePos = devPositions[link.source];
                const targetPos = devPositions[link.target];
                if (!sourcePos || !targetPos) return null;
                
                // Draw bezier curved paths for premium optics
                const midX = (sourcePos.x + targetPos.x) / 2;
                const midY = (sourcePos.y + targetPos.y) / 2;
                // Offset control point to create curvature
                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const len = Math.sqrt(dx*dx + dy*dy);
                const ox = -dy / len * 15;
                const oy = dx / len * 15;
                const cx = midX + ox;
                const cy = midY + oy;

                return (
                  <path
                    key={idx}
                    d={`M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth={Math.min(3, 1 + link.value / 10)}
                    opacity="0.25"
                  />
                );
              })}

              {/* Draw Active Highlighted Connections */}
              {activeLinks.map((link, idx) => {
                const sourcePos = devPositions[link.source];
                const targetPos = devPositions[link.target];
                if (!sourcePos || !targetPos) return null;

                const midX = (sourcePos.x + targetPos.x) / 2;
                const midY = (sourcePos.y + targetPos.y) / 2;
                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const len = Math.sqrt(dx*dx + dy*dy);
                const ox = -dy / len * 15;
                const oy = dx / len * 15;
                const cx = midX + ox;
                const cy = midY + oy;

                return (
                  <path
                    key={`active-${idx}`}
                    d={`M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`}
                    fill="none"
                    stroke="var(--accent-purple)"
                    strokeWidth={Math.min(4, 2 + link.value / 6)}
                    opacity="0.8"
                    filter="drop-shadow(0 0 4px rgba(171, 112, 255, 0.4))"
                    className="animated-dash-path"
                  />
                );
              })}

              {/* Draw Developer Nodes */}
              {developers.map((dev) => {
                const pos = devPositions[dev.id];
                if (!pos) return null;
                const isSelected = selectedDev?.id === dev.id;
                const isHovered = hoveredDev === dev.id;
                const isRelated = activeLinks.some(l => l.source === dev.id || l.target === dev.id);
                
                let strokeColor = 'rgba(255,255,255,0.15)';
                let glowFilter = '';
                if (isSelected) {
                  strokeColor = 'var(--accent-cyan)';
                  glowFilter = 'drop-shadow(0 0 6px var(--accent-cyan))';
                } else if (isHovered) {
                  strokeColor = 'var(--accent-purple)';
                  glowFilter = 'drop-shadow(0 0 4px var(--accent-purple))';
                } else if (isRelated) {
                  strokeColor = 'var(--accent-purple)';
                }

                return (
                  <g 
                    key={dev.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="node-group"
                    onClick={() => setSelectedDev(dev)}
                    onMouseEnter={() => setHoveredDev(dev.id)}
                    onMouseLeave={() => setHoveredDev(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glowing outer circle */}
                    <circle 
                      r="16" 
                      fill="var(--bg-tertiary)"
                      stroke={strokeColor} 
                      strokeWidth={isSelected ? 2 : 1.5}
                      style={{ filter: glowFilter, transition: 'all 0.2s ease' }}
                    />
                    {/* Avatar Clip Path */}
                    <defs>
                      <clipPath id={`clip-${dev.id}`}>
                        <circle r="13.5" cx="0" cy="0" />
                      </clipPath>
                    </defs>
                    {/* Developer Avatar Image */}
                    <image
                      href={dev.avatar}
                      width="27"
                      height="27"
                      x="-13.5"
                      y="-13.5"
                      clipPath={`url(#clip-${dev.id})`}
                    />
                    {/* Dev handle text */}
                    <text 
                      y="26" 
                      fill={isSelected ? 'var(--fg-primary)' : 'var(--fg-secondary)'} 
                      fontSize="8" 
                      fontWeight={isSelected ? '700' : '500'}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      @{dev.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node details side pane */}
          {selectedDev && (
            <div className="dev-details-pane glass-card animate-fade-in">
              <div className="details-header">
                <img src={selectedDev.avatar} alt={selectedDev.name} className="details-avatar" />
                <div>
                  <h4 className="details-name">{selectedDev.name}</h4>
                  <span className="details-role">{selectedDev.role}</span>
                </div>
              </div>
              
              <div className="details-body">
                <div className="detail-stat">
                  <span className="detail-stat-label">Commits Made</span>
                  <span className="detail-stat-value font-mono">{selectedDev.commits}</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-label">Impact Score</span>
                  <div className="impact-indicator">
                    <Cpu size={12} className="icon-cyan" />
                    <span className="detail-stat-value font-mono text-cyan">{selectedDev.impactScore}%</span>
                  </div>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-label">Volume Changed</span>
                  <span className="detail-stat-value font-mono text-purple">{selectedDev.churnLines.toLocaleString()} lines</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .timeline-card, .network-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card-header-group {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }
        .card-title {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--fg-primary);
        }
        .chart-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .chart-group-node circle {
          transition: r 0.2s ease;
        }
        .chart-group-node:hover circle {
          r: 5.5;
        }
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 4px;
          font-size: 0.75rem;
          color: var(--fg-secondary);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-indicator {
          width: 12px;
          height: 3px;
          border-radius: 2px;
        }
        .network-inner {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        @media (max-width: 600px) {
          .network-inner {
            flex-direction: column;
          }
        }
        .network-svg-container {
          flex: 1.3;
          max-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .network-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .node-group {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .node-group:hover {
          transform: scale(1.1) translate(0px, 0px);
        }
        .animated-dash-path {
          stroke-dasharray: 8 4;
          animation: march 30s linear infinite;
        }
        @keyframes march {
          to { stroke-dashoffset: -100; }
        }
        .info-tooltip {
          position: relative;
          cursor: pointer;
          margin-left: 4px;
          display: inline-flex;
          align-items: center;
        }
        .icon-tertiary {
          color: var(--fg-tertiary);
        }
        .tooltip-content {
          visibility: hidden;
          width: 220px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--fg-secondary);
          text-align: left;
          border-radius: 6px;
          padding: 8px 12px;
          position: absolute;
          z-index: 10;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          line-height: 1.3;
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          pointer-events: none;
        }
        .info-tooltip:hover .tooltip-content {
          visibility: visible;
          opacity: 1;
        }
        .dev-details-pane {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          border-radius: 8px;
        }
        .details-header {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }
        .details-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .details-name {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .details-role {
          font-size: 0.7rem;
          color: var(--accent-cyan);
          font-weight: 500;
        }
        .details-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .detail-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }
        .detail-stat-label {
          color: var(--fg-secondary);
        }
        .detail-stat-value {
          font-weight: 600;
          color: var(--fg-primary);
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        .text-cyan {
          color: var(--accent-cyan);
        }
        .text-purple {
          color: var(--accent-purple);
        }
        .impact-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .icon-cyan {
          color: var(--accent-cyan);
        }
        .icon-purple {
          color: var(--accent-purple);
        }
      `}</style>
    </div>
  );
}
