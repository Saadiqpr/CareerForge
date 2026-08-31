import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export interface AIProviderInfo {
  providerName: string;
  modelName: string;
  isConfigured: boolean;
  type: "gemini" | "agentrouter" | "anthropic" | "fallback";
}

/**
 * Detects and returns information about the active AI provider configured in the environment.
 */
export function getAIProviderInfo(): AIProviderInfo {
  // 1. Google Gemini (User's Gemini Pro Plan / Google AI Studio Key)
  const geminiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  )?.trim();

  if (geminiKey) {
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    return {
      providerName: "Google Gemini",
      modelName: model,
      isConfigured: true,
      type: "gemini",
    };
  }

  // 2. AgentRouter (Claude / OpenAI Compatible)
  const agentRouterKey = process.env.AGENTROUTER_API_KEY?.trim();
  if (agentRouterKey) {
    const model = process.env.AGENTROUTER_MODEL || "claude-3-5-sonnet-20241022";
    return {
      providerName: "AgentRouter (Claude 3.5)",
      modelName: model,
      isConfigured: true,
      type: "agentrouter",
    };
  }

  // 3. Direct Anthropic API Key
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (anthropicKey) {
    return {
      providerName: "Anthropic Direct",
      modelName: "claude-3-5-sonnet-20241022",
      isConfigured: true,
      type: "anthropic",
    };
  }

  // 4. Fallback Mode
  return {
    providerName: "CareerForge Resilient Engine",
    modelName: "deterministic-heuristic-fallback",
    isConfigured: false,
    type: "fallback",
  };
}

/**
 * Returns an initialized AI SDK model instance based on active environment variables.
 * Prioritizes Google Gemini when GEMINI_API_KEY is present, then AgentRouter / Anthropic.
 */
export function getActiveLanguageModel() {
  const info = getAIProviderInfo();

  if (info.type === "gemini") {
    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
    )?.trim()!;

    const gemini = createOpenAICompatible({
      name: "google-gemini",
      apiKey: apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    return {
      model: gemini(info.modelName),
      info,
    };
  }

  if (info.type === "agentrouter") {
    const apiKey = process.env.AGENTROUTER_API_KEY?.trim()!;
    const baseURL = process.env.AGENTROUTER_BASE_URL || "https://co.agentrouter.org/v1";

    const agentrouter = createOpenAICompatible({
      name: "agentrouter",
      apiKey: apiKey,
      baseURL: baseURL,
    });

    return {
      model: agentrouter(info.modelName),
      info,
    };
  }

  return {
    model: null,
    info,
  };
}
