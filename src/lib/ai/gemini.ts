/**
 * Native Google Gemini API Streaming & Generation Client
 * Works directly with Google AI Studio & Gemini Pro Plan API Keys.
 */

export interface GeminiMessage {
  role: "user" | "assistant" | "system" | "model";
  content: string;
}

export async function streamGeminiChat({
  apiKey,
  model = "gemini-1.5-flash",
  systemPrompt,
  messages,
  temperature = 0.7,
}: {
  apiKey: string;
  model?: string;
  systemPrompt?: string;
  messages: GeminiMessage[];
  temperature?: number;
}): Promise<ReadableStream<Uint8Array>> {
  // Normalize model name (e.g. "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro")
  const cleanModel = model.replace(/^models\//, "");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:streamGenerateContent?alt=sse&key=${apiKey}`;

  // Format contents for Gemini REST API
  const contents = messages
    .filter((m) => m.content && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const payload: any = {
    contents,
    generationConfig: {
      temperature,
    },
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Google Gemini API error (${response.status})`;
    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("No response body received from Google Gemini.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const jsonStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                const textChunk =
                  parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (textChunk) {
                  controller.enqueue(encoder.encode(textChunk));
                }
              } catch {
                // Ignore parse errors on keepalive comments
              }
            }
          }
        }

        if (buffer.trim().startsWith("data: ")) {
          const jsonStr = buffer.trim().slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk =
              parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (textChunk) {
              controller.enqueue(encoder.encode(textChunk));
            }
          } catch {
            // ignore
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function generateGeminiJson({
  apiKey,
  model = "gemini-1.5-flash",
  prompt,
  temperature = 0.3,
}: {
  apiKey: string;
  model?: string;
  prompt: string;
  temperature?: number;
}): Promise<string> {
  const cleanModel = model.replace(/^models\//, "");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error (${response.status})`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}
