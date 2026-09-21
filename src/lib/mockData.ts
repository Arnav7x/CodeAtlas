export interface RepoStats {
  commits: number;
  prs: number;
  issues: number;
  contributors: number;
  busFactor: number;
  busFactorDevs: string[];
  codeHealth: number;
  velocity: number; // commits per week avg
  languages: { name: string; percentage: number; color: string }[];
}

export interface ActivityPoint {
  date: string;
  commits: number;
  prs: number;
}

export interface DevNode {
  id: string;
  name: string;
  avatar: string;
  role: string;
  commits: number;
  impactScore: number; // 0-100 based on complexity of code edited
  churnLines: number;
  x?: number; // visual coordinates
  y?: number;
}

export interface DevLink {
  source: string;
  target: string;
  value: number; // strength of collaboration (co-authored files)
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number; // LOC
  busFactor: number;
  primaryDev: string;
  primaryPercentage: number;
  secondaryDev: string;
  secondaryPercentage: number;
  children?: FileNode[];
}

export interface HotspotFile {
  name: string;
  path: string;
  churn: number; // number of modifications in last 100 commits
  complexity: number; // cyclomatic complexity or cognitive score (0-100)
  lines: number;
  bugsFixed: number;
  status: 'stable' | 'warning' | 'critical';
}

export interface EngineeringInsight {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impactMetric?: string;
  recommendation: string;
  category: 'Silo' | 'Hotspot' | 'Bottleneck' | 'Velocity';
}

export interface RepositoryData {
  owner: string;
  repo: string;
  stats: RepoStats;
  activity: ActivityPoint[];
  developers: DevNode[];
  connections: DevLink[];
  ownership: FileNode;
  hotspots: HotspotFile[];
  insights: EngineeringInsight[];
  meta?: {
    source: 'live' | 'demo';
    fetchedAt: string;
    warnings: string[];
  };
}

export const MOCK_REPOSITORIES: Record<string, RepositoryData> = {
  "facebook/react": {
    owner: "facebook",
    repo: "react",
    stats: {
      commits: 15432,
      prs: 4321,
      issues: 894,
      contributors: 184,
      busFactor: 2,
      busFactorDevs: ["@acdlite", "@gaearon"],
      codeHealth: 88,
      velocity: 38,
      languages: [
        { name: "JavaScript", percentage: 54.2, color: "#f1e05a" },
        { name: "TypeScript", percentage: 42.8, color: "#3178c6" },
        { name: "HTML/CSS", percentage: 3.0, color: "#e34c26" }
      ]
    },
    activity: [
      { date: "May 04", commits: 25, prs: 12 },
      { date: "May 11", commits: 42, prs: 18 },
      { date: "May 18", commits: 35, prs: 15 },
      { date: "May 25", commits: 55, prs: 24 },
      { date: "Jun 01", commits: 38, prs: 16 },
      { date: "Jun 08", commits: 48, prs: 22 }
    ],
    developers: [
      { id: "gaearon", name: "Dan Abramov", role: "Core Maintainer", commits: 412, impactScore: 95, churnLines: 45200, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "acdlite", name: "Andrew Clark", role: "Core Architect", commits: 380, impactScore: 98, churnLines: 52000, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "sebmarkbage", name: "Sebastian Markbåge", role: "Tech Lead", commits: 245, impactScore: 97, churnLines: 28400, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "sophiebits", name: "Sophie Alpert", role: "Maintainer", commits: 189, impactScore: 82, churnLines: 15400, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "bvaughn", name: "Brian Vaughn", role: "DevTools Lead", commits: 310, impactScore: 89, churnLines: 32800, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "lisa_m", name: "Lisa Miller", role: "Contributor", commits: 45, impactScore: 64, churnLines: 4100, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "alex_dev", name: "Alex Chen", role: "Contributor", commits: 32, impactScore: 58, churnLines: 2800, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" }
    ],
    connections: [
      { source: "gaearon", target: "acdlite", value: 24 },
      { source: "acdlite", target: "sebmarkbage", value: 32 },
      { source: "gaearon", target: "sebmarkbage", value: 18 },
      { source: "bvaughn", target: "gaearon", value: 15 },
      { source: "bvaughn", target: "acdlite", value: 11 },
      { source: "sophiebits", target: "gaearon", value: 14 },
      { source: "sophiebits", target: "sebmarkbage", value: 9 },
      { source: "lisa_m", target: "bvaughn", value: 6 },
      { source: "alex_dev", target: "acdlite", value: 4 }
    ],
    ownership: {
      name: "react",
      path: "react",
      type: "directory",
      busFactor: 2,
      primaryDev: "@acdlite",
      primaryPercentage: 42,
      secondaryDev: "@gaearon",
      secondaryPercentage: 28,
      children: [
        {
          name: "packages",
          path: "react/packages",
          type: "directory",
          busFactor: 2,
          primaryDev: "@acdlite",
          primaryPercentage: 45,
          secondaryDev: "@gaearon",
          secondaryPercentage: 31,
          children: [
            {
              name: "react-reconciler",
              path: "react/packages/react-reconciler",
              type: "directory",
              busFactor: 1,
              primaryDev: "@acdlite",
              primaryPercentage: 74,
              secondaryDev: "@sebmarkbage",
              secondaryPercentage: 14,
              children: [
                { name: "ReactFiberWorkLoop.new.js", path: "react/packages/react-reconciler/ReactFiberWorkLoop.new.js", type: "file", size: 3820, busFactor: 1, primaryDev: "@acdlite", primaryPercentage: 86, secondaryDev: "@sebmarkbage", secondaryPercentage: 8 },
                { name: "ReactFiberCommitWork.new.js", path: "react/packages/react-reconciler/ReactFiberCommitWork.new.js", type: "file", size: 2450, busFactor: 2, primaryDev: "@acdlite", primaryPercentage: 58, secondaryDev: "@gaearon", secondaryPercentage: 32 },
                { name: "ReactFiberBeginWork.new.js", path: "react/packages/react-reconciler/ReactFiberBeginWork.new.js", type: "file", size: 4100, busFactor: 1, primaryDev: "@acdlite", primaryPercentage: 81, secondaryDev: "@sebmarkbage", secondaryPercentage: 11 }
              ]
            },
            {
              name: "react-dom",
              path: "react/packages/react-dom",
              type: "directory",
              busFactor: 2,
              primaryDev: "@gaearon",
              primaryPercentage: 52,
              secondaryDev: "@bvaughn",
              secondaryPercentage: 24,
              children: [
                { name: "ReactDOMHostConfig.js", path: "react/packages/react-dom/ReactDOMHostConfig.js", type: "file", size: 680, busFactor: 2, primaryDev: "@gaearon", primaryPercentage: 48, secondaryDev: "@bvaughn", secondaryPercentage: 35 },
                { name: "ReactDOMLegacy.js", path: "react/packages/react-dom/ReactDOMLegacy.js", type: "file", size: 1450, busFactor: 1, primaryDev: "@gaearon", primaryPercentage: 91, secondaryDev: "@sophiebits", secondaryPercentage: 5 }
              ]
            },
            {
              name: "react",
              path: "react/packages/react",
              type: "directory",
              busFactor: 3,
              primaryDev: "@gaearon",
              primaryPercentage: 35,
              secondaryDev: "@sophiebits",
              secondaryPercentage: 25,
              children: [
                { name: "ReactHooks.js", path: "react/packages/react/ReactHooks.js", type: "file", size: 1200, busFactor: 2, primaryDev: "@gaearon", primaryPercentage: 62, secondaryDev: "@acdlite", secondaryPercentage: 28 },
                { name: "ReactElement.js", path: "react/packages/react/ReactElement.js", type: "file", size: 850, busFactor: 3, primaryDev: "@sebmarkbage", primaryPercentage: 40, secondaryDev: "@gaearon", secondaryPercentage: 30 }
              ]
            }
          ]
        }
      ]
    },
    hotspots: [
      { name: "ReactFiberWorkLoop.new.js", path: "packages/react-reconciler/src/ReactFiberWorkLoop.new.js", churn: 87, complexity: 96, lines: 3820, bugsFixed: 22, status: "critical" },
      { name: "ReactFiberBeginWork.new.js", path: "packages/react-reconciler/src/ReactFiberBeginWork.new.js", churn: 72, complexity: 92, lines: 4100, bugsFixed: 18, status: "critical" },
      { name: "ReactFiberCommitWork.new.js", path: "packages/react-reconciler/src/ReactFiberCommitWork.new.js", churn: 54, complexity: 85, lines: 2450, bugsFixed: 14, status: "warning" },
      { name: "ReactDOMHostConfig.js", path: "packages/react-dom/src/client/ReactDOMHostConfig.js", churn: 18, complexity: 78, lines: 680, bugsFixed: 3, status: "stable" },
      { name: "ReactHooks.js", path: "packages/react/src/ReactHooks.js", churn: 45, complexity: 65, lines: 1200, bugsFixed: 8, status: "warning" },
      { name: "ReactElement.js", path: "packages/react/src/ReactElement.js", churn: 12, complexity: 55, lines: 850, bugsFixed: 1, status: "stable" }
    ],
    insights: [
      {
        id: "react-silo-1",
        type: "danger",
        category: "Silo",
        title: "Single-Developer Knowledge Silo in Fiber Work Loop",
        description: "Only Andrew Clark (@acdlite) has modified ReactFiberWorkLoop.new.js in the last 4 months, representing 86% of the total churn.",
        impactMetric: "86% Churn Ownership",
        recommendation: "Conduct a pair-programming review or knowledge sharing session with Dan Abramov (@gaearon) to distribute ownership.",
      },
      {
        id: "react-hotspot-1",
        type: "warning",
        category: "Hotspot",
        title: "High Churn & High Complexity in BeginWork",
        description: "ReactFiberBeginWork.new.js has had 72 revisions in the last 100 commits and scores 92 on the complexity scale. Very prone to regression bugs.",
        impactMetric: "92 Complexity / 72 Churns",
        recommendation: "Prioritize refactoring ReactFiberBeginWork.new.js into smaller compiler or helper functions during the next sprint cycle.",
      },
      {
        id: "react-bottleneck-1",
        type: "info",
        category: "Bottleneck",
        title: "PR Approval Latency in Reconciliation Module",
        description: "PRs modifying react-reconciler package take an average of 5.8 days to merge, compared to 1.4 days for react-dom.",
        impactMetric: "5.8 Days PR Queue Time",
        recommendation: "Introduce automated tests specifically profiling Fiber execution to bypass manual regression testing latency.",
      }
    ]
  },
  "vercel/next.js": {
    owner: "vercel",
    repo: "next.js",
    stats: {
      commits: 22104,
      prs: 6245,
      issues: 1240,
      contributors: 320,
      busFactor: 3,
      busFactorDevs: ["@huozhi", "@timneutkens", "@ijykeng"],
      codeHealth: 82,
      velocity: 64,
      languages: [
        { name: "TypeScript", percentage: 84.5, color: "#3178c6" },
        { name: "Rust", percentage: 11.2, color: "#dee5e7" },
        { name: "JavaScript", percentage: 4.3, color: "#f1e05a" }
      ]
    },
    activity: [
      { date: "May 04", commits: 48, prs: 21 },
      { date: "May 11", commits: 62, prs: 34 },
      { date: "May 18", commits: 55, prs: 28 },
      { date: "May 25", commits: 80, prs: 45 },
      { date: "Jun 01", commits: 71, prs: 39 },
      { date: "Jun 08", commits: 89, prs: 52 }
    ],
    developers: [
      { id: "huozhi", name: "Jiachi Liu", role: "Bundler Engineer", commits: 384, impactScore: 92, churnLines: 41200, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "timneutkens", name: "Tim Neutkens", role: "Next.js Architect", commits: 210, impactScore: 96, churnLines: 35000, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "ijykeng", name: "Jiyoon Kang", role: "Core Engineer", commits: 295, impactScore: 88, churnLines: 29400, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "shuding", name: "Shu Ding", role: "Design Engineer", commits: 154, impactScore: 78, churnLines: 12300, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "kdy1", name: "Donny", role: "Rust/SWC Specialist", commits: 189, impactScore: 95, churnLines: 49000, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" }
    ],
    connections: [
      { source: "huozhi", target: "timneutkens", value: 20 },
      { source: "huozhi", target: "ijykeng", value: 28 },
      { source: "timneutkens", target: "ijykeng", value: 16 },
      { source: "huozhi", target: "kdy1", value: 34 },
      { source: "shuding", target: "timneutkens", value: 8 }
    ],
    ownership: {
      name: "next.js",
      path: "next.js",
      type: "directory",
      busFactor: 3,
      primaryDev: "@huozhi",
      primaryPercentage: 35,
      secondaryDev: "@ijykeng",
      secondaryPercentage: 26,
      children: [
        {
          name: "packages",
          path: "next.js/packages",
          type: "directory",
          busFactor: 3,
          primaryDev: "@huozhi",
          primaryPercentage: 38,
          secondaryDev: "@ijykeng",
          secondaryPercentage: 29,
          children: [
            {
              name: "next",
              path: "next.js/packages/next",
              type: "directory",
              busFactor: 2,
              primaryDev: "@huozhi",
              primaryPercentage: 54,
              secondaryDev: "@timneutkens",
              secondaryPercentage: 22,
              children: [
                { name: "next-dev.ts", path: "next.js/packages/next/client/next-dev.ts", type: "file", size: 850, busFactor: 2, primaryDev: "@huozhi", primaryPercentage: 58, secondaryDev: "@timneutkens", secondaryPercentage: 32 },
                { name: "app-router.tsx", path: "next.js/packages/next/server/app-router.tsx", type: "file", size: 4200, busFactor: 1, primaryDev: "@timneutkens", primaryPercentage: 84, secondaryDev: "@huozhi", secondaryPercentage: 8 }
              ]
            },
            {
              name: "next-swc",
              path: "next.js/packages/next-swc",
              type: "directory",
              busFactor: 1,
              primaryDev: "@kdy1",
              primaryPercentage: 89,
              secondaryDev: "@huozhi",
              secondaryPercentage: 6,
              children: [
                { name: "lib.rs", path: "next.js/packages/next-swc/src/lib.rs", type: "file", size: 1950, busFactor: 1, primaryDev: "@kdy1", primaryPercentage: 92, secondaryDev: "@huozhi", secondaryPercentage: 4 }
              ]
            }
          ]
        }
      ]
    },
    hotspots: [
      { name: "app-router.tsx", path: "packages/next/server/app-router.tsx", churn: 94, complexity: 95, lines: 4200, bugsFixed: 31, status: "critical" },
      { name: "lib.rs", path: "packages/next-swc/src/lib.rs", churn: 61, complexity: 88, lines: 1950, bugsFixed: 12, status: "warning" },
      { name: "next-dev.ts", path: "packages/next/client/next-dev.ts", churn: 32, complexity: 62, lines: 850, bugsFixed: 4, status: "stable" }
    ],
    insights: [
      {
        id: "next-silo-1",
        type: "danger",
        category: "Silo",
        title: "Extreme Knowledge Silo in SWC Compiler Bridge",
        description: "Donny (@kdy1) holds 92% ownership of next-swc codebase. No other active engineer has updated SWC rust bindings in 6 months.",
        impactMetric: "92% Rust Code Ownership",
        recommendation: "Identify a secondary engineer with Rust background to co-own next-swc bindings and documentation.",
      },
      {
        id: "next-hotspot-1",
        type: "danger",
        category: "Hotspot",
        title: "App Router Server Controller is Unstable",
        description: "app-router.tsx is experiencing extreme churn (94 modifications) and correlates with 45% of recent Next Server bug fixes.",
        impactMetric: "94 Churns / 31 Bugs Fixed",
        recommendation: "Split app-router.tsx into sub-controllers (e.g. FlightResponseHandler, RenderPipeline) to reduce cognitive overload.",
      }
    ]
  }
};
