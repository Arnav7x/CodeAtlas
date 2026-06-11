# CodeAtlas: GitHub Activity Intelligence Platform

CodeAtlas transforms raw Git history (commits, pull requests, issues) into actionable visual engineering metrics. It maps developer collaboration networks, measures recursive code ownership to highlight knowledge silos, and maps complexity-vs-churn hotspots to optimize refactoring cycles.

---

## Key Features

*   **Developer Activity Networks**: Custom SVG graphs plotting weekly contribution timelines and developer connection maps based on co-authored files. Includes detailed metrics drawers for contributors.
*   **Knowledge Ownership Maps**: An interactive folder tree displaying primary vs. secondary contributor shares to identify single-developer dependencies and check the "Bus Factor".
*   **Refactoring Hotspots**: A 2D scatter quadrant mapping file churn (frequency of changes) against cyclomatic complexity. Files in the top-right quadrant are highlighted as critical refactoring targets.
*   **AI Engineering Insights**: An automated advisory feed generating actionable warnings regarding process bottlenecks, knowledge silos, and refactoring priorities.
*   **Flexible Themes**: Dynamic Light Mode (default) and Dark Mode styles with smooth transition effects and coordinate constellation animations.

---

## Tech Stack

*   **Frontend**: Next.js App Router (React, TypeScript)
*   **Styling**: Pure Vanilla CSS and CSS Modules (Tailwind-free for maximum flexibility and clean selectors)
*   **Icons**: Lucide React
*   **Data Integration**: Public GitHub API with fallback mock datasets (React, Next.js) for instant showcase demos.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `3001` if port `3000` is active) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## GitHub Rate Limits & Authentication (Optional)

By default, GitHub restricts unauthenticated requests to **60 requests per hour**. When analyzing custom repositories, you may hit this rate limit. 

To increase your limit to **5,000 requests per hour**:
1. Generate a Personal Access Token (PAT) on GitHub.
2. In the CodeAtlas web interface, click **PAT Settings** in the top-right navigation bar.
3. Paste your token and click **Save**. The token is saved locally in your browser's `localStorage` and sent directly to GitHub APIs.
