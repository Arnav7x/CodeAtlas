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
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">Engineering intelligence</p>
            <h1 className="hero-headline roman-header">
              Map your <span className="gradient-text">codebase</span>.
              <br />
              Understand your <span className="gradient-text">impact</span>.
            </h1>
            <p className="hero-tagline">
              Decode contribution patterns, ownership trees, and complexity hotspots — from any public GitHub repository.
            </p>
          </div>

          <div className="connector-section">
            <RepoConnector />
          </div>

          <div className="glowing-stats-ticker glass-card">
            <div className="ticker-item">
              <Globe size={14} className="icon-cyan" />
              <span>
                Live GitHub API <strong>ready</strong>
              </span>
            </div>
            <div className="ticker-item">
              <Activity size={14} className="icon-green" />
              <span>
                Showcase demos <strong>offline</strong>
              </span>
            </div>
            <div className="ticker-item">
              <Zap size={14} className="icon-purple" />
              <span>
                Tokens stay <strong>local</strong>
              </span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title roman-header">Built for engineering teams</h2>
            <p className="section-subtitle">
              CodeAtlas turns Git history into maps you can act on — ownership risk, collaboration, and refactor priorities.
            </p>
          </div>

          <div className="features-grid">
            <article className="glass-card feature-card">
              <div className="feature-icon-wrapper cyan-glow">
                <BarChart3 size={20} className="icon-cyan" />
              </div>
              <h3 className="feature-title roman-header">Developer activity networks</h3>
              <p className="feature-desc">
                Weekly contribution timelines and collaboration graphs show who works together across modules — not just commit counts.
              </p>
            </article>

            <article className="glass-card feature-card">
              <div className="feature-icon-wrapper orange-glow">
                <Shield size={20} className="icon-orange" />
              </div>
              <h3 className="feature-title roman-header">Knowledge ownership maps</h3>
              <p className="feature-desc">
                Interactive trees surface folders with low bus factor so you can plan pairing and reduce single-person risk.
              </p>
            </article>

            <article className="glass-card feature-card">
              <div className="feature-icon-wrapper purple-glow">
                <GitPullRequest size={20} className="icon-purple" />
              </div>
              <h3 className="feature-title roman-header">Hotspots & churn</h3>
              <p className="feature-desc">
                Complexity vs. change-frequency quadrants highlight files that deserve refactoring before they become liabilities.
              </p>
            </article>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title roman-header">Frequently asked questions</h2>
            <p className="section-subtitle">How metrics work, rate limits, and how your tokens are handled.</p>
          </div>

          <div className="faq-grid">
            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>How does CodeAtlas fetch metrics?</span>
              </h4>
              <p className="faq-answer">
                It queries GitHub for commits, contributors, languages, and the repository tree, then derives ownership shares,
                collaboration links, and hotspot scores. When a developer dominates more than ~60% of recent change, that
                signals elevated knowledge-silo risk.
              </p>
            </article>

            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>What is the bus factor?</span>
              </h4>
              <p className="faq-answer">
                The bus factor estimates how many people would need to leave before critical knowledge is at risk. A bus factor
                of 1 means a single engineer owns the bulk of a module — a high operational risk.
              </p>
            </article>

            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>How are hotspots identified?</span>
              </h4>
              <p className="faq-answer">
                We combine change frequency (churn across recent commits) with an approximate complexity score. Files that are
                both complex and frequently edited rise into the critical quadrant for refactor prioritization.
              </p>
            </article>

            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Does the public API have rate limits?</span>
              </h4>
              <p className="faq-answer">
                Yes — unauthenticated GitHub access is about 60 requests per hour. Use <strong>PAT</strong> in the navbar to
                save a Personal Access Token and raise the limit to 5,000/hour.
              </p>
            </article>

            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Can I analyze private repositories?</span>
              </h4>
              <p className="faq-answer">
                Yes. Save a GitHub PAT with the <code>repo</code> scope. CodeAtlas will use it from your browser to load private
                metadata and build the same dashboards.
              </p>
            </article>

            <article className="glass-card faq-card">
              <h4 className="faq-question">
                <HelpCircle size={15} className="icon-cyan" />
                <span>Are access tokens secure?</span>
              </h4>
              <p className="faq-answer">
                Tokens stay client-side in <code>localStorage</code> and are sent only to GitHub over HTTPS. Nothing is uploaded
                to a CodeAtlas backend.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-copyright">© {new Date().getFullYear()} CodeAtlas. Built for engineering teams.</span>
          <div className="footer-links">
            <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer" className="footer-link">
              GitHub API
            </a>
            <span className="footer-sep">·</span>
            <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="footer-link">
              Create a PAT
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
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px 72px;
          width: 100%;
        }
        .hero-section {
          padding: 48px 0 28px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }
        .hero-content {
          max-width: 720px;
        }
        .hero-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
          margin-bottom: 12px;
        }
        .hero-headline {
          font-size: clamp(2.1rem, 5vw, 3.2rem);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
          color: var(--fg-primary);
        }
        .hero-tagline {
          font-size: 1.05rem;
          color: var(--fg-secondary);
          line-height: 1.6;
          max-width: 540px;
          margin: 0 auto;
        }
        .connector-section {
          width: 100%;
          max-width: 640px;
        }
        .glowing-stats-ticker {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 0.78rem;
          color: var(--fg-secondary);
        }
        @media (max-width: 600px) {
          .glowing-stats-ticker {
            flex-direction: column;
            gap: 10px;
            border-radius: 12px;
            width: 100%;
          }
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ticker-item strong {
          color: var(--fg-primary);
          font-weight: 600;
        }

        .features-section {
          padding: 64px 0 32px;
          border-top: 1px solid var(--border-color);
          margin-top: 36px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .section-title {
          font-size: 1.65rem;
          font-weight: 500;
          letter-spacing: -0.015em;
          margin-bottom: 10px;
        }
        .section-subtitle {
          color: var(--fg-secondary);
          font-size: 0.92rem;
          line-height: 1.55;
          max-width: 540px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 800px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          padding: 26px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .feature-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cyan-glow {
          background: var(--accent-soft);
          border: 1px solid var(--accent-soft-border);
        }
        .orange-glow {
          background: rgba(255, 138, 0, 0.08);
          border: 1px solid rgba(255, 138, 0, 0.16);
        }
        .purple-glow {
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.16);
        }
        .feature-title {
          font-size: 1.05rem;
          font-weight: 500;
        }
        .feature-desc {
          font-size: 0.84rem;
          color: var(--fg-secondary);
          line-height: 1.55;
        }

        .faq-section {
          padding: 48px 0 16px;
          border-top: 1px solid var(--border-color);
          margin-top: 48px;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 800px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
        .faq-card {
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-question {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: var(--font-sans);
          color: var(--fg-primary);
          line-height: 1.35;
        }
        .faq-answer {
          font-size: 0.82rem;
          color: var(--fg-secondary);
          line-height: 1.55;
        }
        .faq-answer code {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          background: var(--bg-muted);
          padding: 1px 5px;
          border-radius: 4px;
          color: var(--fg-primary);
        }
        .faq-answer strong {
          color: var(--fg-primary);
          font-weight: 600;
        }

        .landing-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-muted);
          padding: 20px 0;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--fg-tertiary);
          font-size: 0.75rem;
          font-family: var(--font-mono);
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-sep {
          opacity: 0.5;
        }
        .footer-link {
          color: var(--fg-tertiary);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-link:hover {
          color: var(--fg-secondary);
        }
      `}</style>
    </div>
  );
}
