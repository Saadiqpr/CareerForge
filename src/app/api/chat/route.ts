import { streamText } from "ai";
import { AI_COACH_CONFIG } from "@/lib/ai/coach-config";
import { getActiveLanguageModel } from "@/lib/ai/provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { model, info } = getActiveLanguageModel();

    // Extract formatted message history
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: typeof m.content === "string" ? m.content : (m.text || ""),
    }));

    if (model) {
      try {
        const result = streamText({
          model,
          system: AI_COACH_CONFIG.systemPrompt,
          messages: formattedMessages,
          temperature: AI_COACH_CONFIG.temperature,
        });

        return result.toTextStreamResponse();
      } catch (streamErr) {
        console.error("Live LLM stream error, falling back to heuristic engine:", streamErr);
      }
    }

    // Fallback stream for offline / demonstration
    const lastMsg = formattedMessages[formattedMessages.length - 1]?.content || "How do I advance my career?";
    const fallbackText = `### Career Coaching Strategy & Recommendations

I analyzed your question: **"${lastMsg.slice(0, 120)}"**

---

#### 🎯 Strategic Engineering Action Plan:
1. **Quantify Your Accomplishments:** On technical resumes, anchor accomplishments with metrics:
   > *"Architected real-time streaming state pipeline reducing TTFB by 42% and client latency by 180ms across 250k MAUs."*
2. **Master the STAR Method for Behavioral Rounds:**
   - **Situation:** Business context and technical constraints.
   - **Task:** Your specific architectural ownership.
   - **Action:** Implementation details, trade-offs, and risk mitigations.
   - **Result:** Business impact and latency improvements.
3. **High-Leverage Competencies:**
   - **AI/LLM Integration:** Streaming patterns, token management, error handling.
   - **Performance:** Sub-100ms INP, Core Web Vitals, dynamic bundling.
   - **Accessibility:** WCAG 2.1 AA keyboard navigation, ARIA live regions.

---
> 💡 **Live LLM Connection:**  
> Add \`GEMINI_API_KEY\` to your \`.env.local\` file or Vercel Environment Variables to unlock unrestricted live real-time conversations!`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i += 3) {
          const chunk = words.slice(i, i + 3).join(" ") + " ";
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("AI Coach Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}