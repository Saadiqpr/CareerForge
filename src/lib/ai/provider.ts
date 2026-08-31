import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export interface AIProviderInfo {
  providerName: string;
  modelName: string;
  isConfigured: boolean;
  type: "gemini" | "agentrouter" | "anthropic" | "fallback";
  apiKey?: string;
}

/**
 * Sanitizes model names to prevent 404/400 errors from provider proxies.
 */
function sanitizeModelName(provider: string, rawModel?: string): string {
  if (!rawModel || rawModel.trim().length === 0) {
    return provider === "gemini" ? "gemini-1.5-flash" : "claude-3-5-sonnet-20241022";
  }

  const clean = rawModel.trim();
  if (provider === "agentrouter" || provider === "anthropic") {
    // If an invalid model like "claude-opus-4-8" was set, default to standard sonnet
    if (clean === "claude-opus-4-8" || !clean.startsWith("claude-")) {
      return "claude-3-5-sonnet-20241022";
    }
  }

  return clean;
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
    const model = sanitizeModelName("gemini", process.env.GEMINI_MODEL || "gemini-1.5-flash");
    return {
      providerName: "Google Gemini",
      modelName: model,
      isConfigured: true,
      type: "gemini",
      apiKey: geminiKey,
    };
  }

  // 2. AgentRouter (Claude / OpenAI Compatible)
  const agentRouterKey = process.env.AGENTROUTER_API_KEY?.trim();
  if (agentRouterKey) {
    const model = sanitizeModelName("agentrouter", process.env.AGENTROUTER_MODEL || "claude-3-5-sonnet-20241022");
    return {
      providerName: "AgentRouter (Claude 3.5)",
      modelName: model,
      isConfigured: true,
      type: "agentrouter",
      apiKey: agentRouterKey,
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
      apiKey: anthropicKey,
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
 */
export function getActiveLanguageModel() {
  const info = getAIProviderInfo();

  if (info.type === "gemini" && info.apiKey) {
    const gemini = createOpenAICompatible({
      name: "google-gemini",
      apiKey: info.apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    return {
      model: gemini(info.modelName),
      info,
    };
  }

  if (info.type === "agentrouter" && info.apiKey) {
    const baseURL = process.env.AGENTROUTER_BASE_URL || "https://co.agentrouter.org/v1";

    const agentrouter = createOpenAICompatible({
      name: "agentrouter",
      apiKey: info.apiKey,
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
