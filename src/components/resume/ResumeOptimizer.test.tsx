import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResumeOptimizer from "./ResumeOptimizer";

describe("ResumeOptimizer Component (FE-07 AI SDK Tool Flow)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders the optimizer heading and form inputs", () => {
    render(<ResumeOptimizer />);

    expect(screen.getByText(/ATS Resume Bullet Optimizer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Current Resume Bullet Point/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Optimize Bullet/i })).toBeInTheDocument();
  });

  it("allows selecting a sample weak bullet", () => {
    render(<ResumeOptimizer />);

    const sampleButton = screen.getByRole("button", { name: /AI Integration/i });
    fireEvent.click(sampleButton);

    const textarea = screen.getByLabelText(/Your Current Resume Bullet Point/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Added an AI chatbot");
  });

  it("submits request and renders output-available state with structured result", async () => {
    const mockResponse = {
      optimized: "Architected and deployed enterprise AI assistant, reducing customer response latency by 45%.",
      actionVerb: "Architected",
      metricAdded: "45% latency reduction",
      score: 94,
      feedback: "Replaced vague phrasing with high-impact power verb and quantified speed metric.",
      alternatives: [
        "Engineered scalable LLM agent handling 10k daily queries.",
      ],
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (headerName: string) => (headerName.toLowerCase() === "content-type" ? "application/json" : null),
      },
      json: async () => mockResponse,
    });

    render(<ResumeOptimizer />);

    const submitButton = screen.getByRole("button", { name: /Optimize Bullet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("tool-state-output-available")).toBeInTheDocument();
    });

    expect(screen.getByText(/Optimization Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/94\/100/i)).toBeInTheDocument();
    expect(screen.getByText(/Architected and deployed enterprise AI assistant/i)).toBeInTheDocument();
    expect(screen.getByText("Architected")).toBeInTheDocument();
    expect(screen.getByText(/45% latency reduction/i)).toBeInTheDocument();
  });

  it("processes NDJSON stream and renders input-streaming, input-available, and output-available states", async () => {
    const chunks = [
      JSON.stringify({
        state: "input-streaming",
        toolName: "optimizeBullet",
        args: { bullet: "Worked on frontend" }
      }) + "\n",
      JSON.stringify({
        state: "input-available",
        toolName: "optimizeBullet",
        args: { bullet: "Worked on frontend", targetRole: "Frontend AI Engineer", industry: "Tech" }
      }) + "\n",
      JSON.stringify({
        state: "output-available",
        toolName: "optimizeBullet",
        result: {
          optimized: "Spearheaded frontend performance optimizations.",
          actionVerb: "Spearheaded",
          metricAdded: "Core Web Vitals to 98",
          score: 96,
          feedback: "Strong technical impact.",
          alternatives: [],
        }
      }) + "\n"
    ];

    let chunkIdx = 0;
    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        if (chunkIdx < chunks.length) {
          const encoder = new TextEncoder();
          const value = encoder.encode(chunks[chunkIdx++]);
          return Promise.resolve({ done: false, value });
        }
        return Promise.resolve({ done: true, value: undefined });
      }),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (headerName: string) => (headerName.toLowerCase() === "content-type" ? "application/x-ndjson" : null),
      },
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ResumeOptimizer />);
    fireEvent.click(screen.getByRole("button", { name: /Optimize Bullet/i }));

    await waitFor(() => {
      expect(screen.getByTestId("tool-state-output-available")).toBeInTheDocument();
    });

    expect(screen.getByText(/Spearheaded frontend performance optimizations/i)).toBeInTheDocument();
  });

  it("handles and displays output-error tool state gracefully with retry button", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Simulated tool execution failure for optimizeBullet.")
    );

    render(<ResumeOptimizer />);

    const submitButton = screen.getByRole("button", { name: /Optimize Bullet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("tool-state-output-error")).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/Simulated tool execution failure for optimizeBullet/i);
    expect(screen.getByRole("button", { name: /Retry Tool Execution/i })).toBeInTheDocument();
  });

  it("allows copying the optimized bullet to clipboard", async () => {
    const mockResponse = {
      optimized: "Spearheaded frontend performance optimizations, boosting Core Web Vitals to 98.",
      actionVerb: "Spearheaded",
      metricAdded: "Lighthouse 98 score",
      score: 92,
      feedback: "Strong technical anchoring.",
      alternatives: [],
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (headerName: string) => (headerName.toLowerCase() === "content-type" ? "application/json" : null),
      },
      json: async () => mockResponse,
    });

    render(<ResumeOptimizer />);

    fireEvent.click(screen.getByRole("button", { name: /Optimize Bullet/i }));

    await waitFor(() => {
      expect(screen.getByText(/Copy Result/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Copy Result/i));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockResponse.optimized);
    await waitFor(() => {
      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });
});
