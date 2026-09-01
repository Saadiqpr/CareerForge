export type CareerLevelId = "l3-associate" | "l4-mid" | "l5-senior" | "l6-architect";

export interface CompetencyDetail {
  name: string;
  description: string;
}

export interface CareerLevelData {
  id: CareerLevelId;
  levelNumber: number;
  levelCode: string;
  title: string;
  tagline: string;
  category: "Foundation" | "Core Engineering" | "AI Specialist" | "Strategic Architecture";
  salaryRange: string;
  experienceEstimate: string;
  badgeColor: string;
  accentHex: string;
  glowHex: string;
  position3D: [number, number, number];
  rotationSpeed: number;
  geometryType: "octahedron" | "icosahedron" | "beacon" | "hypercube";
  description: string;
  keyCompetencies: CompetencyDetail[];
  aiCapabilities: string[];
  recommendedMilestones: string[];
  actionLinks: {
    label: string;
    href: string;
    variant: "primary" | "secondary";
  }[];
}

export const CAREER_LEVELS: CareerLevelData[] = [
  {
    id: "l3-associate",
    levelNumber: 1,
    levelCode: "L3",
    title: "Associate Frontend Engineer",
    tagline: "Foundational UI Semantics, Modern React & Responsive Layouts",
    category: "Foundation",
    salaryRange: "$85,000 – $115,000",
    experienceEstimate: "0 – 2 Years",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    accentHex: "#06b6d4",
    glowHex: "#38bdf8",
    position3D: [-3.8, -0.8, 0],
    rotationSpeed: 0.008,
    geometryType: "octahedron",
    description: "Mastery of modern JavaScript/TypeScript, React 19 component lifecycles, CSS layouts, and basic accessibility standards.",
    keyCompetencies: [
      {
        name: "Modern React & TypeScript",
        description: "Strict typing, functional components, hooks lifecycle, and component isolation."
      },
      {
        name: "Semantic HTML & CSS Layouts",
        description: "Accessible DOM landmarks, flexbox/grid architectures, and Tailwind utility systems."
      },
      {
        name: "Version Control & Static Analysis",
        description: "Git branching workflows, ESLint clean passes, and structured PR reviews."
      }
    ],
    aiCapabilities: [
      "AI Pair Programming (Copilot / Gemini)",
      "Prompt Engineering for Code Generation",
      "AI-assisted Unit Test Writing"
    ],
    recommendedMilestones: [
      "Master React 19 & TypeScript typing patterns",
      "Ship 3+ responsive accessible UI modules with 0 WCAG errors",
      "Pass automated linting and clean code audits"
    ],
    actionLinks: [
      { label: "Analyze Skill Gaps", href: "/skills", variant: "primary" },
      { label: "Optimize ATS Resume", href: "/resume", variant: "secondary" }
    ]
  },
  {
    id: "l4-mid",
    levelNumber: 2,
    levelCode: "L4",
    title: "Mid-Level Frontend Engineer",
    tagline: "State Orchestration, Web Vitals Performance & Automated Testing",
    category: "Core Engineering",
    salaryRange: "$120,000 – $155,000",
    experienceEstimate: "2 – 4 Years",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    accentHex: "#8b5cf6",
    glowHex: "#a855f7",
    position3D: [-1.2, 0.4, 0.6],
    rotationSpeed: 0.012,
    geometryType: "icosahedron",
    description: "Architecting resilient client state, Next.js App Router performance, comprehensive Vitest / Playwright test suites, and WCAG 2.1 AA compliance.",
    keyCompetencies: [
      {
        name: "Next.js App Router & Performance",
        description: "Server/Client boundaries, streaming SSR, bundle splitting, and Web Vitals (LCP/INP/CLS)."
      },
      {
        name: "State Machines & Resilient UI",
        description: "Error boundary hierarchies, optimistic mutations, and offline-ready local storage."
      },
      {
        name: "Testing & Accessibility (WCAG 2.1 AA)",
        description: "Vitest unit coverage (>85%), Playwright E2E flows, and screen-reader keyboard traps."
      }
    ],
    aiCapabilities: [
      "Vercel AI SDK Integration (useChat, useCompletion)",
      "Structured Output Parsing with Zod Schemas",
      "Real-time token streaming & markdown rendering"
    ],
    recommendedMilestones: [
      "Achieve >85% unit test coverage on core interactive flows",
      "Implement structured AI tool invocation with client confirmation",
      "Eliminate layout shifts and optimize INP to under 150ms"
    ],
    actionLinks: [
      { label: "Rehearse AI Coach", href: "/ai-coach", variant: "primary" },
      { label: "Review Resume Bullets", href: "/resume", variant: "secondary" }
    ]
  },
  {
    id: "l5-senior",
    levelNumber: 3,
    levelCode: "L5",
    title: "Senior Frontend AI Engineer",
    tagline: "Agentic Workflows, 3D WebGL Experiences & Production Resilience",
    category: "AI Specialist",
    salaryRange: "$165,000 – $215,000",
    experienceEstimate: "4 – 7 Years",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    accentHex: "#f59e0b",
    glowHex: "#fbbf24",
    position3D: [1.4, 0.9, -0.4],
    rotationSpeed: 0.015,
    geometryType: "beacon",
    description: "Production standard for CareerForge: Multi-provider LLM failover, choreographed micro-interactions (FE-AA1), real-time reasoning loops, WebGL interactive 3D (FE-AA2), and edge observability (FE-11).",
    keyCompetencies: [
      {
        name: "Multi-Provider LLM Resilience",
        description: "Anthropic, OpenAI, and compatible endpoint failover with latency telemetry and fallback."
      },
      {
        name: "Agentic Tool Loops & Artifacts",
        description: "Client-side tool confirmation, streaming reasoning traces, and rich interactive artifacts."
      },
      {
        name: "WebGL 3D & Choreographed Motion",
        description: "Procedural Three.js visualizations, frameloop efficiency, and accessible motion fallbacks."
      }
    ],
    aiCapabilities: [
      "Multi-turn Agent Tool Execution with client confirmation",
      "Real-time thinking trace parsing & live preview rendering",
      "Custom WebGL / Canvas AI data representations"
    ],
    recommendedMilestones: [
      "Master Frontend AI Integration Patterns (AI SDK, Streaming, Structured Output)",
      "Ship Production-Grade Capstone (CareerForge) with Vitest & WCAG 2.1 AA Compliance",
      "Conduct 10 Mock Technical & Behavioral Interviews (STAR Method)"
    ],
    actionLinks: [
      { label: "Launch Mock Interview", href: "/ai-coach", variant: "primary" },
      { label: "Check System Health", href: "/health", variant: "secondary" }
    ]
  },
  {
    id: "l6-architect",
    levelNumber: 4,
    levelCode: "Staff+",
    title: "Staff AI Solutions Architect",
    tagline: "Enterprise AI Infrastructure, Multi-Agent Swarms & Eval Frameworks",
    category: "Strategic Architecture",
    salaryRange: "$225,000 – $320,000+",
    experienceEstimate: "7+ Years",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    accentHex: "#10b981",
    glowHex: "#34d399",
    position3D: [3.8, 1.8, 0.5],
    rotationSpeed: 0.01,
    geometryType: "hypercube",
    description: "Guiding cross-functional engineering teams, architecting distributed multi-agent systems, establishing LLM evaluation & security benchmarks, and setting frontend standards.",
    keyCompetencies: [
      {
        name: "Multi-Agent Swarm Orchestration",
        description: "Asynchronous coordination of specialized agents with shared memory and tool sandboxing."
      },
      {
        name: "AI Safety, Guardrails & Evals",
        description: "Automated benchmark evaluation pipelines, hallucination mitigation, and cost governance."
      },
      {
        name: "Org Technical Strategy & Standards",
        description: "Cross-team architectural RFCs, performance budgets, and high-impact engineering leadership."
      }
    ],
    aiCapabilities: [
      "Enterprise RAG with hybrid vector + sparse search",
      "Automated model evaluation & prompt optimization harnesses",
      "Edge model deployment & offline inference orchestration"
    ],
    recommendedMilestones: [
      "Author RFC on Organization-Wide AI Agent Architecture",
      "Establish automated LLM evaluation pipeline in CI/CD",
      "Lead system design interviews & mentor 4+ senior engineers"
    ],
    actionLinks: [
      { label: "Target L6+ Milestones", href: "/career-path", variant: "primary" },
      { label: "Explore All Skills", href: "/skills", variant: "secondary" }
    ]
  }
];
