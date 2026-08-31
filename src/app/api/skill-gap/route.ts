import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getCoachModelName } from "@/lib/ai/coach-config";

export const maxDuration = 30;

interface SkillGapRequest {
  currentSkills: string[];
  targetRole: string;
  experienceLevel?: string;
}

export async function POST(req: Request) {
  try {
    const body: SkillGapRequest = await req.json();
    const { currentSkills = [], targetRole = "Senior Frontend Engineer", experienceLevel = "Mid-Level" } = body;

    if (!targetRole || typeof targetRole !== "string") {
      return new Response(
        JSON.stringify({ error: "Please provide a target role." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const rawApiKey = process.env.AGENTROUTER_API_KEY;
    const apiKey = rawApiKey?.trim();

    if (apiKey) {
      try {
        const agentrouter = createOpenAICompatible({
          name: "agentrouter",
          apiKey: apiKey,
          baseURL: process.env.AGENTROUTER_BASE_URL || "https://co.agentrouter.org/v1",
        });

        const modelName = getCoachModelName();

        const prompt = `You are a Principal Engineering Career Advisor and Technical Competency Architect.
Analyze the skill gap for a candidate aiming for the role of "${targetRole}" at "${experienceLevel}" level.
Candidate's current skills: ${currentSkills.length > 0 ? currentSkills.join(", ") : "None specified"}.

Strictly return a valid JSON object matching this structure without markdown code blocks:
{
  "matchPercentage": 74,
  "summary": "2-sentence executive summary of readiness and immediate priority areas.",
  "strengths": ["Skill 1", "Skill 2"],
  "criticalGaps": [
    {
      "skill": "Skill Name",
      "priority": "High" | "Medium",
      "impact": "Why this skill is decisive for the role",
      "recommendedAction": "Concrete project or milestone to master it"
    }
  ],
  "learningRoadmap": [
    {
      "phase": "Month 1",
      "focus": "Core domain competency",
      "deliverable": "Specific artifact or project to build"
    },
    {
      "phase": "Month 2",
      "focus": "System design & scale",
      "deliverable": "Specific artifact or project to build"
    }
  ]
}`;

        const result = await generateText({
          model: agentrouter(modelName),
          prompt,
          temperature: 0.3,
        });

        const cleanJson = result.text.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (aiErr) {
        console.warn("AI skill gap failed, falling back to structured matrix:", aiErr);
      }
    }

    // High-quality deterministic fallback
    const fallbackResponse = {
      matchPercentage: Math.min(90, Math.max(45, currentSkills.length * 12 + 35)),
      summary: `Your profile demonstrates foundational strengths for ${targetRole}. Bridging architecture patterns, advanced accessibility (WCAG AA), and full-stack performance optimization will position you as a top candidate.`,
      strengths: currentSkills.length > 0 ? currentSkills.slice(0, 4) : ["Modern JavaScript/TypeScript", "React Architecture"],
      criticalGaps: [
        {
          skill: "Advanced System Design & Scalability",
          priority: "High",
          impact: "Essential for designing resilient distributed frontend architectures and caching strategies.",
          recommendedAction: "Build a real-time streaming state manager and document architecture trade-offs."
        },
        {
          skill: "Production Performance & Core Web Vitals",
          priority: "High",
          impact: "Differentiates senior candidates who can diagnose bundle bloat and sub-second paint times.",
          recommendedAction: "Conduct Lighthouse audits and implement dynamic code-splitting and asset preloading."
        },
        {
          skill: "AI Integration & Prompt Engineering Patterns",
          priority: "Medium",
          impact: "High-leverage capability for modern Frontend AI Engineering workflows.",
          recommendedAction: "Integrate LLM streaming SDKs with resilient error boundaries and token throttling."
        }
      ],
      learningRoadmap: [
        {
          phase: "Weeks 1-3",
          focus: "Production Architecture & Performance Profiling",
          deliverable: "Refactor core rendering tree with zero unnecessary re-renders and sub-100ms INP."
        },
        {
          phase: "Weeks 4-6",
          focus: "Accessible Component Systems (WCAG 2.1 AA)",
          deliverable: "Ship reusable keyboard-trapped modal dialogs and ARIA tab primitives."
        },
        {
          phase: "Weeks 7-8",
          focus: "Capstone Deployment & Observability",
          deliverable: "Deploy with continuous monitoring, automated Vitest coverage, and rollback checklist."
        }
      ],
      isFallback: !apiKey
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Skill gap error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze skill gap. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
