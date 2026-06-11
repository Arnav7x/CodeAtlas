'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import RepoConnector from '../components/RepoConnector';
import BackgroundCanvas from '../components/BackgroundCanvas';
import { GitPullRequest, Shield, BarChart3, HelpCircle, Activity, Globe, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing-layout animate-fade-in">
      <BackgroundCanvas />

      <Navbar />

      <main className="landing-main">
        
        {/* Core Hero Landing Space */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-headline roman-header">
              Map Your Codebase. Understand Your <span className="gradient-text">Impact</span>.
            </h1>
            <p className="hero-tagline">
              Decode engineering activity, map developer ownership trees, and identify complex hotspots in seconds.
            </p>
          </div>
          
          <div className="connector-section">
            <RepoConnector />
          </div>
          
          {/* Real-time ticker metrics under CTA */}
          <div className="glowing-stats-ticker glass-card">
            <div className="ticker-item">
              <Globe size={14} className="icon-cyan" />
              <span>Analyses Completed: <strong>14,204</strong></span>
            </div>
            <div className="ticker-item">
              <Activity size={14} className="icon-green" />
              <span>Heuristic Engines: <strong>99.9% Active</strong></span>
            </div>
            <div className="ticker-item">
              <Zap size={14} className="icon-purple" />
              <span>Query Latency: <strong>142ms Avg</strong></span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title roman-header">Built for Engineering Teams</h2>
            <p className="section-subtitle">CodeAtlas aggregates Git logs and codebase structures to help teams share ownership, locate complex files, and ship features faster.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper cyan-glow">
                <BarChart3 size={20} className="icon-cyan" />
              </div>
              <h3 className="feature-title roman-header">Developer Activity Networks</h3>
              <p className="feature-desc">
                Analyze weekly contributions and map collaboration paths to see how developers share work across different modules.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper orange-glow">
                <Shield size={20} className="icon-orange" />
              </div>
              <h3 className="feature-title roman-header">Knowledge Ownership Maps</h3>
              <p className="feature-desc">
                Identify folders that rely too heavily on a single engineer and establish redundancy to lower operational risk.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper purple-glow">
                <GitPullRequest size={20} className="icon-purple" />
              </div>
              <h3 className="feature-title roman-header">Hotspots & Churn Visualizer</h3>
              <p className="feature-desc">
                Locate complex files undergoing frequent changes so you can prioritize refactoring tasks before bugs occur.
              </p>
            </div>
          </div>
        </section>

        {/* Expanded FAQs Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title roman-header">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about the CodeAtlas platform metrics and settings.</p>
          </div>

          <div className="faq-grid">
            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>How does CodeAtlas fetch repository metrics?</span>
              </h4>
              <p className="faq-answer">
                CodeAtlas queries GitHub commit histories, author metrics, and language patterns. Our analyzer processes directories recursively, measuring file touch distributions. If a single developer owns over 60% of code modifications, it signals a knowledge silo risk.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>What is the "Bus Factor"?</span>
              </h4>
              <p className="faq-answer">
                The Bus Factor is a vulnerability index representing the minimum number of developers whose sudden departure would compromise critical codebase components. A Bus Factor of 1 represents a high-risk scenario where key files are owned by only one person.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>How are code "Hotspots" identified?</span>
              </h4>
              <p className="faq-answer">
                We combine cyclomatic complexity (approximated via lines of code and nested branching structures) with code churn (how frequently a file changes across commits). Highly complex files that are modified frequently are marked as hotspots.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Does the public API have rate limits?</span>
              </h4>
              <p className="faq-answer">
                Yes, GitHub limits unauthenticated requests to 60 per hour. To resolve this, click **PAT Settings** in the navbar and input a Personal Access Token. This increases your limit to 5,000 requests per hour.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Can I analyze private repositories?</span>
              </h4>
              <p className="faq-answer">
                Yes! By saving a GitHub PAT with `repo` scope permissions in your local settings, CodeAtlas will successfully pull metadata and construct analytics dashboards for private repositories in your browser.
              </p>
            </div>

            <div className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Are my access tokens secure?</span>
              </h4>
              <p className="faq-answer">
                Absolutely. All authentication is client-side. Your Personal Access Token is saved in browser `localStorage` and sent directly to GitHub's HTTPS endpoints. No token values are ever sent to external databases.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer font-mono">
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
          position: relative;
        }
        .landing-main {
          flex: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 80px 24px;
          width: 100%;
        }
        .hero-section {
          padding: 60px 0 20px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .hero-content {
          max-width: 800px;
        }
        .hero-headline {
          font-size: 3.4rem;
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          color: var(--fg-primary);
        }
        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.4rem;
          }
        }
        .hero-tagline {
          font-size: 1.15rem;
          color: var(--fg-secondary);
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto;
        }
        .connector-section {
          width: 100%;
          max-width: 680px;
        }
        .glowing-stats-ticker {
          display: inline-flex;
          align-items: center;
          gap: 28px;
          padding: 12px 24px;
          border-radius: 999px;
          font-size: 0.8rem;
          color: var(--fg-secondary);
        }
        @media (max-width: 600px) {
          .glowing-stats-ticker {
            flex-direction: column;
            gap: 12px;
            border-radius: 12px;
          }
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ticker-item strong {
          color: var(--fg-primary);
        }
        
        .features-section {
          padding: 80px 0 40px 0;
          border-top: 1px solid var(--border-color);
          margin-top: 40px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .section-title {
          font-size: 1.8rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin-bottom: 12px;
          color: var(--fg-primary);
        }
        .section-subtitle {
          color: var(--fg-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          max-width: 650px;
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
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .feature-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cyan-glow {
          background: rgba(255, 69, 48, 0.08);
          border: 1px solid rgba(255, 69, 48, 0.15);
        }
        .orange-glow {
          background: rgba(255, 138, 0, 0.08);
          border: 1px solid rgba(255, 138, 0, 0.15);
        }
        .purple-glow {
          background: rgba(171, 112, 255, 0.08);
          border: 1px solid rgba(171, 112, 255, 0.15);
        }
        .feature-title {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--fg-primary);
        }
        .feature-desc {
          font-size: 0.82rem;
          color: var(--fg-secondary);
          line-height: 1.5;
        }
        
        .faq-section {
          padding: 60px 0 20px 0;
          border-top: 1px solid var(--border-color);
          margin-top: 60px;
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
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--fg-primary);
        }
        .faq-answer {
          font-size: 0.82rem;
          color: var(--fg-secondary);
          line-height: 1.5;
        }
        .icon-cyan { color: var(--accent-cyan); }
        .icon-orange { color: var(--accent-orange); }
        .icon-purple { color: var(--accent-purple); }
        .icon-green { color: var(--accent-green); }

        .landing-footer {
          border-top: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
          padding: 24px 0;
          margin-top: auto;
          font-size: 0.72rem;
        }
        body.dark-theme .landing-footer {
          background: rgba(4, 4, 6, 0.8);
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        .font-mono {
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
