import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SkillGapAnalyzer from "./SkillGapAnalyzer";

global.fetch = vi.fn();

describe("SkillGapAnalyzer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the default skill badges and target role selector", () => {
    render(<SkillGapAnalyzer />);

    expect(screen.getByText(/AI Skill Gap & Readiness Matrix/i)).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Run Gap Analysis/i })).toBeInTheDocument();
  });

  it("allows adding a new skill and removing an existing skill", () => {
    render(<SkillGapAnalyzer />);

    const input = screen.getByPlaceholderText(/Add skill/i);
    const addButton = screen.getByRole("button", { name: /^Add$/i });

    fireEvent.change(input, { target: { value: "GraphQL" } });
    fireEvent.click(addButton);

    expect(screen.getByText("GraphQL")).toBeInTheDocument();

    const removeReactBtn = screen.getByRole("button", { name: /Remove skill React/i });
    fireEvent.click(removeReactBtn);

    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("submits skill gap analysis and renders match score and 8-week roadmap", async () => {
    const mockResponse = {
      matchPercentage: 78,
      summary: "Strong engineering foundation with opportunities in advanced distributed systems.",
      strengths: ["React", "TypeScript"],
      criticalGaps: [
        {
          skill: "Advanced System Design",
          priority: "High",
          impact: "Decisive for Senior/Staff roles.",
          recommendedAction: "Build real-time caching layer.",
        },
      ],
      learningRoadmap: [
        {
          phase: "Weeks 1-4",
          focus: "System Scalability",
          deliverable: "Deploy distributed micro-frontend service.",
        },
      ],
    };

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<SkillGapAnalyzer />);

    const analyzeBtn = screen.getByRole("button", { name: /Run Gap Analysis/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText(/78%/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Executive Readiness Assessment/i)).toBeInTheDocument();
    expect(screen.getByText("Advanced System Design")).toBeInTheDocument();
    expect(screen.getByText("Weeks 1-4")).toBeInTheDocument();
    expect(screen.getByText("System Scalability")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Service unavailable" }),
    });

    render(<SkillGapAnalyzer />);

    const analyzeBtn = screen.getByRole("button", { name: /Run Gap Analysis/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Service unavailable/i);
    });
  });
});
