# Production Deployment Checklist (FE-11 Standard)
> **Application:** CareerForge  
> **Target Environment:** Production (Vercel Edge Platform)  
> **Release Version:** v1.0.0-capstone  
> **Date:** August 31, 2026  
> **Signed Off By:** Saad (Frontend AI Engineer)

---

## 1. Pre-Deployment Verification

| Item | Requirement | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **Clean Build** | Zero TypeScript compilation or Next.js build errors | ✅ PASSED | `npm run build` completed successfully |
| **Linting & Code Quality** | No ESLint errors or unhandled warnings | ✅ PASSED | `npm run lint` / ESLint 9 configuration |
| **Automated Tests** | All unit and component tests passing ($\ge 50\%$ coverage) | ✅ PASSED | `npm run test` (6/6 test suites passed) |
| **Environment Variables** | `AGENTROUTER_API_KEY`, `AGENTROUTER_MODEL`, `AGENTROUTER_BASE_URL` defined in Vercel | ✅ PASSED | Verified in Vercel project settings |
| **Accessibility (WCAG 2.1 AA)** | Zero critical/serious axe-core violations; keyboard navigable | ✅ PASSED | axe DevTools & manual Tab navigation audit |
| **Performance (Lighthouse)** | Lighthouse Score $\ge 90$ across Performance, A11y, Best Practices, SEO | ✅ PASSED | Lighthouse mobile & desktop audits |
| **Asset Optimization** | Next.js fonts self-hosted; SVG icons tree-shaken | ✅ PASSED | `next/font/google` with preloaded subsets |

---

## 2. Resilience & Safe Failure Modes

| Subsystem | Failure Scenario | Fallback Mechanism | User Experience |
| :--- | :--- | :--- | :--- |
| **AI Career Coach (`/api/chat`)** | Network timeout / API key rate limit | Stream error boundary + retry button | Alert toast with `Retry` action; input preserved |
| **Resume Optimizer (`/api/resume-optimize`)** | LLM schema parse failure / offline | High-fidelity heuristic engine fallback | Outputs structured ATS analysis using deterministic power verbs |
| **Skill Gap Matrix (`/api/skill-gap`)** | LLM latency / quota limit | Matrix heuristic generator | Computes baseline gap and renders 8-week actionable roadmap |
| **Next.js Server / Routing** | Page crash or route failure | Next.js global `error.tsx` boundary | "Something went wrong" recovery UI with reload button |
| **Health API (`/api/health`)** | Upstream provider outage | Real-time diagnostic reporting | Flags `aiProvider: fallback_mode` while Next.js server remains green |

---

## 3. Deployment Steps Executed

1. **Repository Synchronization**:
   ```bash
   git status # verify working tree clean
   git add .
   git commit -m "feat(capstone): finalize production release with full test suite & docs"
   git push origin main
   ```
2. **Vercel Build Execution**:
   - Automated Webhook triggered on push to `main`.
   - Build command: `npm run build`.
   - Output directory: `.next`.
   - Node.js Version: `20.x`.
3. **Smoke Testing on Live Deployment**:
   - [x] Home page loads in $< 1.2\text{s}$ with no visual flash.
   - [x] AI Coach streams response to interview rehearsal prompt.
   - [x] Resume Bullet Optimizer parses and generates ATS power bullet.
   - [x] Skill Gap Analyzer computes match percentage and 8-week timeline.
   - [x] Job Pipeline Board persists state and allows stage progression.
   - [x] `/api/health` returns `HTTP 200 OK` with JSON diagnostics.

---

## 4. Monitoring & Observability Runbook

- **Live Health Endpoint**: `GET https://careerforge.vercel.app/api/health`
- **Telemetry Monitored**:
  - `status`: Overall service health (`healthy` / `degraded`)
  - `latencyMs`: Next.js App Router edge response time ($< 25\text{ms}$)
  - `uptimeSeconds`: Cumulative container uptime
  - `aiProvider`: Configuration status (`configured` / `fallback_mode`)
- **Vercel Analytics & Speed Insights**: Real-time Core Web Vitals (LCP, FID/INP, CLS) tracking.

---

## 5. Rollback Runbook (Safe Recovery)

If a critical regression is detected in production:
1. **Instant Rollback via Vercel Dashboard (RTO < 30 seconds)**:
   - Navigate to `Vercel Dashboard > CareerForge > Deployments`.
   - Locate the previous known-good deployment hash.
   - Click `Instant Rollback` to promote it immediately to production.
2. **Git-Based Revert**:
   ```bash
   git revert HEAD
   git push origin main
   ```
   *Vercel will build and redeploy the previous stable build automatically within 60 seconds.*

---

## 6. Formal Sign-Off

- **Engineer:** Saad
- **Role:** Frontend AI Engineer
- **Sign-Off Date:** August 31, 2026
- **Status:** **APPROVED FOR PRODUCTION SHIPMENT** 🚀
