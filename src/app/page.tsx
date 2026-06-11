'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import RepoConnector from '../components/RepoConnector';
import { GitPullRequest, Shield, BarChart3, HelpCircle } from 'lucide-react';

export const metadata = {
  title: "CodeAtlas — GitHub Activity Intelligence Platform",
  description: "Transform raw Git commits, pull requests, and issues into visual engineering impact metrics, knowledge redundancy mapping, and technical debt hotspots.",
};

export default function Home() {
  return (
    <div className="landing-layout">
      <Navbar />

      <main className="landing-main">
        {/* Repo Connector Entrance Card */}
        <div className="connector-section">
          <RepoConnector />
        </div>

        {/* Feature Highlights Grid */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Engineered for Technical Leaders</h2>
            <p className="section-subtitle">CodeAtlas decodes developer activity to help squads manage technical risks, distribute ownership, and optimize deployment velocities.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper cyan-glow">
                <BarChart3 size={20} className="icon-cyan" />
              </div>
              <h3 className="feature-title">Developer Activity Graphs</h3>
              <p className="feature-desc">
                Visualize weekly commit intensity alongside an interactive collaborator co-authorship network map.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper orange-glow">
                <Shield size={20} className="icon-orange" />
              </div>
              <h3 className="feature-title">Knowledge Ownership Mapping</h3>
              <p className="feature-desc">
                Drill down into a heatmap representation of directory hierarchies to detect high-risk knowledge silos.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper purple-glow">
                <GitPullRequest size={20} className="icon-purple" />
              </div>
              <h3 className="feature-title">Hotspots & Churn Visualizer</h3>
              <p className="feature-desc">
                Pinpoint files in the high-churn, high-complexity quadrant to identify priority refactoring candidates.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-grid">
            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={14} className="icon-cyan" />
                <span>How does CodeAtlas fetch repository metrics?</span>
              </h4>
              <p className="faq-answer">
                CodeAtlas integrates directly with the public GitHub API to extract commit metadata, contributor distributions, and code structure. The parsed data is structured using our heuristic pipeline on the fly.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={14} className="icon-cyan" />
                <span>How is the Bus Factor calculated?</span>
              </h4>
              <p className="faq-answer">
                We analyze the percentage contribution of each developer across directories. If a single developer owns more than 60% of modifications in a subtree, the Bus Factor drops to 1, signaling a silo risk.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-copyright">
            © {new Date().getFullYear()} CodeAtlas Platform. All rights reserved.
          </span>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">
              GitHub Docs
            </a>
            <span>•</span>
            <a href="#" className="footer-link">
              API Status
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .landing-main {
          flex: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 64px 24px;
          width: 100%;
        }
        .connector-section {
          padding: 20px 0;
        }
        .features-section {
          padding: 60px 0 40px 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          color: var(--fg-primary);
        }
        .section-subtitle {
          color: var(--fg-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .feature-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cyan-glow {
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.15);
        }
        .orange-glow {
          background: rgba(255, 159, 67, 0.08);
          border: 1px solid rgba(255, 159, 67, 0.15);
        }
        .purple-glow {
          background: rgba(171, 112, 255, 0.08);
          border: 1px solid rgba(171, 112, 255, 0.15);
        }
        .feature-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--fg-primary);
        }
        .feature-desc {
          font-size: 0.82rem;
          color: var(--fg-secondary);
          line-height: 1.45;
        }
        
        .faq-section {
          padding: 40px 0 20px 0;
          border-top: 1px solid var(--border-color);
          margin-top: 40px;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
        .faq-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-question {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--fg-primary);
        }
        .faq-answer {
          font-size: 0.8rem;
          color: var(--fg-secondary);
          line-height: 1.5;
        }
        .icon-cyan { color: var(--accent-cyan); }
        .icon-orange { color: var(--accent-orange); }
        .icon-purple { color: var(--accent-purple); }

        .landing-footer {
          border-top: 1px solid var(--border-color);
          background: rgba(4, 4, 6, 0.8);
          padding: 20px 0;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--fg-tertiary);
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-link {
          color: var(--fg-tertiary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: var(--fg-secondary);
        }
      `}</style>
    </div>
  );
}
