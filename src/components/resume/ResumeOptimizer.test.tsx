import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResumeOptimizer from "./ResumeOptimizer";

// Mock fetch API globally
global.fetch = vi.fn();

describe("ResumeOptimizer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the optimizer heading and form inputs", () => {
    render(<ResumeOptimizer />);

    expect(screen.getByText(/AI Resume Bullet Optimizer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Current Resume Bullet Point/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Optimize Bullet/i })).toBeInTheDocument();
  });

  it("allows selecting a sample weak bullet", () => {
    render(<ResumeOptimizer />);

    const sampleButton = screen.getByRole("button", { name: /Weak bullet: AI feature/i });
    fireEvent.click(sampleButton);

    const textarea = screen.getByLabelText(/Your Current Resume Bullet Point/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Added an AI chatbot");
  });

  it("submits the optimization request and displays structured results", async () => {
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

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<ResumeOptimizer />);

    const submitButton = screen.getByRole("button", { name: /Optimize Bullet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Optimization Complete/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/94\/100/i)).toBeInTheDocument();
    expect(screen.getByText(/Architected and deployed enterprise AI assistant/i)).toBeInTheDocument();
    expect(screen.getByText("Architected")).toBeInTheDocument();
    expect(screen.getByText(/45% latency reduction/i)).toBeInTheDocument();
  });

  it("handles and displays error state gracefully on network failure", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network connection lost")
    );

    render(<ResumeOptimizer />);

    const submitButton = screen.getByRole("button", { name: /Optimize Bullet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Network connection lost/i);
    });
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

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
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
