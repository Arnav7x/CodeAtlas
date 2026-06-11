'use client';

import React, { useState } from 'react';
import { FileNode } from '../lib/mockData';
import { Folder, File, Users, ShieldAlert, ShieldCheck, ChevronRight, ChevronDown, Search, X } from 'lucide-react';

interface OwnershipMapProps {
  ownershipData: FileNode;
}

export default function OwnershipMap({ ownershipData }: OwnershipMapProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    [ownershipData.path]: true, // root expanded by default
    [`${ownershipData.path}/packages`]: true // standard subfolder preset expand
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (path: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const matchNode = (node: FileNode, query: string): boolean => {
    if (!query) return true;
    const cleanQuery = query.toLowerCase();
    if (node.name.toLowerCase().includes(cleanQuery) || node.path.toLowerCase().includes(cleanQuery)) {
      return true;
    }
    if (node.type === 'directory' && node.children) {
      return node.children.some(child => matchNode(child, query));
    }
    return false;
  };

  const renderNode = (node: FileNode, depth = 0, parentMatched = false) => {
    const cleanQuery = searchQuery.toLowerCase();
    const selfMatches = searchQuery ? (node.name.toLowerCase().includes(cleanQuery) || node.path.toLowerCase().includes(cleanQuery)) : false;
    const isVisible = !searchQuery || selfMatches || parentMatched || (node.type === 'directory' && node.children && node.children.some(child => matchNode(child, searchQuery)));

    if (!isVisible) return null;

    const isDirectory = node.type === 'directory';
    const hasMatchingChildren = isDirectory && node.children && node.children.some(child => matchNode(child, searchQuery));
    const isExpanded = searchQuery ? (hasMatchingChildren || !!expandedNodes[node.path]) : !!expandedNodes[node.path];
    const hasChildren = isDirectory && node.children && node.children.length > 0;
    const passParentMatched = parentMatched || selfMatches;
    
    // Choose bus factor icons and warnings
    let riskColor = 'text-green';
    let riskBg = 'rgba(0, 245, 160, 0.06)';
    let riskIcon = <ShieldCheck size={14} className="icon-green" />;
    
    if (node.busFactor === 1) {
      riskColor = 'text-red';
      riskBg = 'rgba(255, 77, 77, 0.08)';
      riskIcon = <ShieldAlert size={14} className="icon-red animate-pulse" />;
    } else if (node.busFactor === 2) {
      riskColor = 'text-orange';
      riskBg = 'rgba(255, 159, 67, 0.08)';
      riskIcon = <ShieldAlert size={14} className="icon-orange" />;
    }

    return (
      <div key={node.path} className="tree-node-wrapper">
        <div 
          className={`tree-node glass-card-interactive ${isDirectory ? 'dir-node' : 'file-node'}`}
          style={{ paddingLeft: `${depth * 18 + 12}px` }}
          onClick={() => isDirectory && toggleExpand(node.path)}
        >
          <div className="node-label-group">
            {isDirectory ? (
              <span className="chevron-toggle">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            ) : (
              <span className="chevron-placeholder"></span>
            )}
            
            {isDirectory ? (
              <Folder size={16} className="folder-icon" />
            ) : (
              <File size={16} className="file-icon" />
            )}
            
            <span className="node-name">{node.name}</span>
            {node.size && <span className="node-size font-mono">{node.size} LOC</span>}
          </div>

          <div className="node-metrics">
            {/* Bus Factor Tag */}
            <div className={`bus-factor-badge ${riskColor}`} style={{ backgroundColor: riskBg }}>
              {riskIcon}
              <span>Bus Factor: {node.busFactor}</span>
            </div>

            {/* Contribution Proportions Bar */}
            <div className="owners-bar-wrapper">
              <div className="owners-bar">
                <div 
                  className="owner-seg primary-seg" 
                  style={{ width: `${node.primaryPercentage}%` }}
                  title={`${node.primaryDev}: ${node.primaryPercentage}%`}
                ></div>
                <div 
                  className="owner-seg secondary-seg" 
                  style={{ width: `${node.secondaryPercentage}%` }}
                  title={`${node.secondaryDev}: ${node.secondaryPercentage}%`}
                ></div>
              </div>
              <div className="owners-text">
                <span className="owner-tag font-mono text-cyan" title={node.primaryDev}>
                  {node.primaryDev.slice(0, 10)}{node.primaryDev.length > 10 ? '..' : ''} ({node.primaryPercentage}%)
                </span>
                <span className="owner-divider">/</span>
                <span className="owner-tag font-mono text-purple" title={node.secondaryDev}>
                  {node.secondaryDev.slice(0, 10)}{node.secondaryDev.length > 10 ? '..' : ''} ({node.secondaryPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {isDirectory && isExpanded && hasChildren && (
          <div className="tree-children">
            {node.children!.map(child => renderNode(child, depth + 1, passParentMatched))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ownership-card glass-card col-12">
      <div className="card-header-group">
        <Users size={18} className="icon-cyan" />
        <h3 className="card-title">Code Ownership & Knowledge Distribution</h3>
        <span className="header-subtitle-tag">Interactive File Tree</span>
      </div>

      <p className="card-description">
        Drill down into directories to audit developers' contribution proportions. Higher bus factor indicates healthier knowledge redundancy. A Bus Factor of 1 represents a high-risk single point of dependency.
      </p>

      <div className="search-filter-wrapper">
        <div className="search-input-container">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Filter by file path or name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="tree-container">
        <div className="tree-header">
          <span className="th-label">Component Path</span>
          <span className="th-label text-right" style={{ paddingRight: '80px' }}>Redundancy & Contributors Proportions</span>
        </div>
        
        <div className="tree-root">
          {renderNode(ownershipData)}
        </div>
      </div>

      <style jsx>{`
        .ownership-card {
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
        .card-description {
          font-size: 0.8rem;
          color: var(--fg-secondary);
          line-height: 1.45;
          max-width: 780px;
        }
        .tree-container {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.01);
          overflow: hidden;
        }
        .tree-header {
          display: flex;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .text-right {
          text-align: right;
        }
        .tree-root {
          padding: 8px 0;
          max-height: 400px;
          overflow-y: auto;
        }
        .tree-node-wrapper {
          display: flex;
          flex-direction: column;
        }
        .tree-node {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 0;
          background: transparent;
        }
        .tree-node:hover {
          background: rgba(255, 255, 255, 0.02);
          transform: none;
          box-shadow: none;
        }
        .dir-node {
          cursor: pointer;
        }
        .node-label-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .chevron-toggle {
          width: 14px;
          display: inline-flex;
          align-items: center;
          color: var(--fg-tertiary);
        }
        .chevron-placeholder {
          width: 14px;
        }
        .folder-icon {
          color: var(--accent-cyan);
        }
        .file-icon {
          color: var(--fg-secondary);
        }
        .node-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--fg-primary);
        }
        .dir-node .node-name {
          font-weight: 600;
        }
        .node-size {
          font-size: 0.7rem;
          color: var(--fg-tertiary);
          background: rgba(255, 255, 255, 0.03);
          padding: 1px 4px;
          border-radius: 3px;
        }
        .node-metrics {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .bus-factor-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          width: 120px;
        }
        .text-green { color: var(--accent-green); }
        .icon-green { color: var(--accent-green); }
        .text-orange { color: var(--accent-orange); }
        .icon-orange { color: var(--accent-orange); }
        .text-red { color: var(--accent-red); }
        .icon-red { color: var(--accent-red); }
        
        .owners-bar-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 160px;
        }
        .owners-bar {
          display: flex;
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 99px;
          overflow: hidden;
          width: 100%;
        }
        .owner-seg {
          height: 100%;
        }
        .primary-seg {
          background-color: var(--accent-cyan);
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.2);
        }
        .secondary-seg {
          background-color: var(--accent-purple);
          box-shadow: 0 0 8px rgba(171, 112, 255, 0.2);
        }
        .owners-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: var(--fg-tertiary);
        }
        .owner-tag {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .owner-tag.text-cyan { color: var(--accent-cyan); }
        .owner-tag.text-purple { color: var(--accent-purple); }
        .owner-divider {
          padding: 0 2px;
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        .tree-children {
          border-left: 1px solid rgba(255, 255, 255, 0.04);
          margin-left: 20px;
        }
        .search-filter-wrapper {
          display: flex;
          margin-bottom: 12px;
        }
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 12px;
          transition: all 0.2s ease;
        }
        .search-input-container:focus-within {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }
        .search-icon {
          color: var(--fg-tertiary);
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
        }
        .search-input {
          background: transparent;
          border: none;
          color: var(--fg-primary);
          font-size: 0.8rem;
          width: 100%;
          outline: none;
        }
        .search-input::placeholder {
          color: var(--fg-tertiary);
        }
        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--fg-tertiary);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        .clear-search-btn:hover {
          color: var(--fg-primary);
        }
      `}</style>
    </div>
  );
}
