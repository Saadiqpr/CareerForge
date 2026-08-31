export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const rawKey = process.env.AGENTROUTER_API_KEY;
  const hasApiKey = Boolean(rawKey && rawKey.trim().length > 0);
  const modelName = process.env.AGENTROUTER_MODEL || "claude-3-5-sonnet-20241022";
  const baseUrl = process.env.AGENTROUTER_BASE_URL || "https://co.agentrouter.org/v1";

  const latencyMs = Date.now() - startTime;

  const healthData = {
    status: "healthy",
    uptimeSeconds: Math.floor(typeof process !== "undefined" && typeof process.uptime === "function" ? process.uptime() : 120),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    services: {
      nextServer: {
        status: "operational",
        latencyMs,
      },
      aiProvider: {
        status: hasApiKey ? "configured" : "fallback_mode",
        provider: "AgentRouter (OpenAI-Compatible)",
        model: modelName,
        baseUrl,
        hasKey: hasApiKey,
      },
      clientFeatures: {
        aiCoach: "operational",
        resumeOptimizer: "operational",
        skillGapAnalyzer: "operational",
        jobPipeline: "operational",
      }
    }
  };

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    }
  });
}
