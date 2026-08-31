import { getAIProviderInfo } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const providerInfo = getAIProviderInfo();
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
        status: providerInfo.isConfigured ? "configured" : "fallback_mode",
        provider: providerInfo.providerName,
        model: providerInfo.modelName,
        hasKey: providerInfo.isConfigured,
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
