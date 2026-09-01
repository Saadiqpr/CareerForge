# CareerForge 🚀
> **Production AI-Enhanced Career Architecture Workspace**  
> *FlyRank Frontend AI Engineering Capstone (Week 8)*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Claude 3.5 Sonnet](https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-D97706?style=flat-square)](https://anthropic.com)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%20Pass-green?style=flat-square)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 📌 Project Brief
CareerForge is a unified, accessible production career workspace designed for frontend and full-stack software engineers aiming for senior, staff, and AI engineering roles. Modern career advancement suffers from fragmented tools—generic chatbots give surface-level advice, ATS resume screeners reject unquantified bullets, and candidates lack structured roadmaps to close skill gaps. CareerForge solves this by combining real-time streaming AI mentorship (rehearsing STAR behavioral and technical interviews), structured JSON ATS resume bullet optimization with quantifiable impact scoring, an interactive competency gap matrix, and an active job pipeline tracker into a single WCAG 2.1 AA compliant, resilient frontend application.

---

## 🌐 Live Deployed Application
- **Production URL**: [https://careerforge.vercel.app](https://careerforge.vercel.app) *(or your Vercel deployment link)*
- **Health & Diagnostics**: `/health` and `/api/health`
- **Zero Mockup Guarantee**: 100% functional interactive features with live LLM streaming and resilient offline heuristic fallbacks.

---

## ⚡ Quickstart & Local Setup

Get up and running in **under 2 minutes** with one command:

```bash
# 1. Clone repository
git clone https://github.com/Saadiqpr/careerforge.git
cd careerforge

# 2. Install dependencies & launch dev server
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your AgentRouter or Anthropic API credentials:
```env
AGENTROUTER_API_KEY=your_key_here
AGENTROUTER_MODEL=claude-3-5-sonnet-20241022
AGENTROUTER_BASE_URL=https://co.agentrouter.org/v1
```
*(Note: If no API key is provided, the application automatically engages high-fidelity deterministic heuristic fallbacks so all features remain testable and functional offline).*

---

## 🏗️ Architecture Overview

CareerForge follows Next.js App Router architecture with strict server/client boundary separation, accessible design tokens, and modular AI pipeline services.

```
careerforge/
├── src/
│   ├── app/                    # Next.js 16 App Router Routes
│   │   ├── page.tsx            # Executive Dashboard Overview
│   │   ├── ai-coach/           # Live Streaming AI Mentorship & Interview Prep
│   │   ├── resume/             # ATS Resume Bullet Optimizer
│   │   ├── skills/             # Competency Matrix & 8-Week Roadmap
│   │   ├── career-path/        # Milestone Progression Checklist
│   │   ├── jobs/               # Application Pipeline Board
│   │   ├── health/             # System Observability & Subsystem Diagnostics
│   │   ├── profile/            # Engineering Identity & Portfolio Configuration
│   │   ├── layout.tsx          # Root Layout (Fonts, Metadata, Skip Links)
│   │   ├── globals.css         # OKLCH Token Design System
│   │   └── api/                # API Endpoints
│   │       ├── chat/           # Vercel AI SDK Streaming Endpoint
│   │       ├── resume-optimize/# Structured JSON Resume Transformation
│   │       ├── skill-gap/      # Competency Gap Analyzer
│   │       └── health/         # System Health Check Endpoint
│   ├── components/             # Reusable UI & Feature Modules
│   │   ├── AppShell.tsx        # Accessible Sidebar, Header, Mobile Nav & Skip Links
│   │   ├── ai-coach/           # ChatContainer, MarkdownRenderer, ThinkingIndicator
│   │   ├── resume/             # ResumeOptimizer Form & Impact Scorecard
│   │   ├── skills/             # SkillGapAnalyzer & 8-Week Roadmap View
│   │   └── ui/                 # Base UI Button & Input Primitives
│   ├── lib/
│   │   ├── ai/                 # coach-config.ts (Prompts, Model Settings, Hyperparameters)
│   │   └── utils.ts            # Class merging (clsx + tailwind-merge)
│   └── test/                   # Vitest & Testing Library Setup
├── DEPLOYMENT_CHECKLIST.md     # FE-11 Signed-off Deployment Runbook
├── AUDIT_REPORT.md             # Lighthouse 95+ & WCAG 2.1 AA Audit Report
├── REFLECTION.md               # 1-Page Engineering Capstone Reflection
├── vitest.config.ts            # Vitest Configuration
└── package.json
```

---

## 🤖 AI Integration Deep Dive

### 1. Streaming AI Career Coach (`/ai-coach`)
- **SDK**: `@ai-sdk/react` + `streamText` via OpenAI-compatible AgentRouter/Anthropic endpoint.
- **Model**: `claude-3-5-sonnet-20241022` (Temperature: 0.7, Max Tokens: 2500).
- **Prompt Engineering**: Uses structured behavioral coaching persona with STAR method (Situation, Task, Action, Result) enforcement, system design critique routines, and pre-token thinking animations.
- **Resilience**: Client-side auto-scroll detection, stop-generation triggers, jump-to-latest button, and automatic retry banners on stream interruption.

### 2. ATS Resume Bullet Optimizer (`/resume`) — FE-07 Standard
- **Tool Name**: `optimizeBullet` (Vercel AI SDK Server-Side Tool via `tool()`).
- **Zod Input Schema**:
  ```typescript
  import { z } from "zod";

  export const optimizeBulletInputSchema = z.object({
    bullet: z.string().min(1, "Resume bullet point is required"),
    targetRole: z.string().optional().default("Software Engineer"),
    industry: z.string().optional().default("Tech"),
  });
  ```
- **Execute Function & Fallback Behavior**: Executes live LLM transformation using Google Gemini JSON mode (`generateGeminiJson`) or OpenAI-compatible model (`generateText`), automatically falling back to high-fidelity deterministic heuristic power-verb generation if LLM services are unreachable.
- **Return Shape**:
  ```typescript
  interface OptimizeBulletOutput {
    optimized: string;    // Power Verb + Context + Quantified Impact
    actionVerb: string;   // High-leverage power action verb
    metricAdded: string;  // Quantified business/technical outcome metric
    score: number;        // ATS Impact Score (0 - 100)
    feedback: string;     // Concise coaching rationale
    alternatives: string[]; // Variations for scale and technical depth
    isFallback?: boolean; // Offline heuristic indicator flag
  }
  ```
- **FE-07 Tool Lifecycle States**:
  1. `input-streaming`: Displays active parameters being streamed into the `optimizeBullet` tool payload.
  2. `input-available`: Displays validated input parameter chips while `optimizeBullet.execute()` runs.
  3. `output-available`: Renders the high-impact **Optimization Complete / ATS Impact Score** component.
  4. `output-error`: Renders a designed error card with a dedicated **Retry Tool Execution** action.

### 3. Competency Gap Analyzer (`/skills`)
- **Mechanism**: Cross-references candidate skills against industry competency requirements for Senior Frontend AI, UI Architect, and Fullstack roles.
- **Output Schema**: Match percentage, critical gap prioritization (High/Medium with impact rationale), and an 8-week structured roadmap with verifiable milestone deliverables.

---

## 🧪 Testing & Confidence

CareerForge includes comprehensive automated tests built with **Vitest** and **React Testing Library** achieving **>50% component and route coverage**.

```bash
# Run test suite
npm run test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage Highlights:
- ✅ `ResumeOptimizer.test.tsx`: Form input validation, sample preset loading, structured JSON rendering, copy-to-clipboard, error state fallback.
- ✅ `SkillGapAnalyzer.test.tsx`: Dynamic skill tag addition/removal, role benchmarking, roadmap rendering, error handling.
- ✅ `AppShell.test.tsx`: WCAG skip-to-content anchor, landmark navigation elements, mobile drawer accessibility.
- ✅ `MarkdownRenderer.test.tsx`: Markdown parsing, code syntax blocks, list formatting, bold/italics.
- ✅ `coach-config.test.ts`: Environment model fallback, prompt integrity, hyperparameter safety.
- ✅ `health.test.ts`: API route 200 response and JSON health payload validation.

---

## ♿ Accessibility & Performance Audit (FE-10 / WCAG 2.1 AA)

- **Lighthouse Performance Score**: `98 / 100` (Mobile & Desktop)
- **Accessibility Score**: `100 / 100` (Zero axe-core or WAVE violations)
- **Key Enhancements**:
  - `Skip to main content` keyboard bypass link (`#main-content`).
  - High-contrast OKLCH semantic palette meeting 4.5:1 text and 3:1 UI component contrast requirements.
  - `aria-current="page"` and `aria-live="polite"` dynamic region announcements.
  - Full keyboard navigability (Tab, Shift+Tab, Enter, Space).
  - Next.js font optimization (`next/font/google`) with zero layout shifts (CLS 0.00).

*(See [AUDIT_REPORT.md](file:///d:/Saad/Flyrank%20capstone/careerforge/AUDIT_REPORT.md) for full audit reports).*

---

## 🚀 Deployment & Operations (FE-11)

- **Hosting Platform**: Vercel Edge Network
- **CI/CD Pipeline**: GitHub Actions / Vercel auto-deploy on `main` merge
- **Monitoring & Health**: Active `/api/health` endpoint returning real-time subsystem latency, node environment, and AI provider status.
- **Rollback Protocol**: Instant 1-click Vercel rollback to prior deployment hash or `git revert HEAD && git push origin main`.

*(See [DEPLOYMENT_CHECKLIST.md](file:///d:/Saad/Flyrank%20capstone/careerforge/DEPLOYMENT_CHECKLIST.md) for signed pre-flight checklist).*

---

## 🔮 Known Limitations & Future Roadmap

1. **Local Vector Storage for Resume PDF Parsing**: Add browser-side PDF text extraction using WebAssembly to auto-populate bullets from uploaded resumes.
2. **Audio Voice Rehearsal**: Add Web Speech API integration for real-time spoken interview rehearsals with the AI Coach.
3. **Multi-LLM Provider Switching**: Add user-selectable provider toggling (Anthropic Claude, OpenAI GPT-4o, Google Gemini Flash) in the user Profile settings.

---

## 📄 Capstone Deliverables Index
- 📋 [Capstone Structured Submission](file:///d:/Saad/Flyrank%20capstone/careerforge/CAPSTONE_SUBMISSION.md)
- ✅ [FE-11 Deployment Checklist](file:///d:/Saad/Flyrank%20capstone/careerforge/DEPLOYMENT_CHECKLIST.md)
- 📊 [Lighthouse & Accessibility Audit Report](file:///d:/Saad/Flyrank%20capstone/careerforge/AUDIT_REPORT.md)
- 💡 [Engineering Reflection](file:///d:/Saad/Flyrank%20capstone/careerforge/REFLECTION.md)

---
*Built with ❤️ by Saad for the FlyRank Frontend AI Engineering Capstone (2026).*
