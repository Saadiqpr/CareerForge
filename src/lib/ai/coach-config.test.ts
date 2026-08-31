import { describe, it, expect } from "vitest";
import { AI_COACH_CONFIG, getCoachModelName } from "./coach-config";

describe("AI Coach Configuration & Model Settings", () => {
  it("exports valid coach configuration parameters", () => {
    expect(AI_COACH_CONFIG.defaultModel).toBe("claude-3-5-sonnet-20241022");
    expect(AI_COACH_CONFIG.temperature).toBe(0.7);
    expect(AI_COACH_CONFIG.maxTokens).toBe(2500);
    expect(AI_COACH_CONFIG.systemPrompt).toContain("CareerForge AI Coach");
    expect(AI_COACH_CONFIG.systemPrompt).toContain("STAR framework");
  });

  it("resolves default model or environment variable correctly", () => {
    const originalEnv = process.env.AGENTROUTER_MODEL;
    delete process.env.AGENTROUTER_MODEL;

    expect(getCoachModelName()).toBe("claude-3-5-sonnet-20241022");

    process.env.AGENTROUTER_MODEL = "claude-3-7-sonnet";
    expect(getCoachModelName()).toBe("claude-3-7-sonnet");

    process.env.AGENTROUTER_MODEL = originalEnv;
  });
});
