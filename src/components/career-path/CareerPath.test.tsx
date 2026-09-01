import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CareerPathFallback from "./CareerPathFallback";
import CareerPathSection from "./CareerPathSection";
import { CAREER_LEVELS } from "./types";

// Mock 3D WebGL Canvas in JSDOM unit test environment
vi.mock("./CareerPath3DCanvas", () => ({
  default: ({ selectedLevelId, onSelectLevel }: { selectedLevelId: string; onSelectLevel: (id: string) => void }) => (
    <div data-testid="mock-3d-canvas">
      <span>3D Canvas Mock ({selectedLevelId})</span>
      <button onClick={() => onSelectLevel("l4-mid")}>Select L4 in 3D</button>
    </div>
  ),
}));

describe("CareerPath Components (FE-AA2 3D / 2D Accessibility Standards)", () => {
  it("renders all 4 career tiers in 2D accessible fallback view", () => {
    render(<CareerPathFallback selectedLevelId="l5-senior" />);

    expect(screen.getByText("Frontend AI Career Trajectory")).toBeInTheDocument();
    expect(screen.getByText("Associate Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Mid-Level Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Senior Frontend AI Engineer")).toBeInTheDocument();
    expect(screen.getByText("Staff AI Solutions Architect")).toBeInTheDocument();
  });

  it("allows selecting a level and displays corresponding compensation and competencies", () => {
    const handleSelect = vi.fn();
    render(
      <CareerPathFallback
        selectedLevelId="l4-mid"
        onSelectLevel={handleSelect}
      />
    );

    // Verify L4 data is displayed in inspector
    expect(screen.getByText("Mid-Level Frontend Engineer (L4)")).toBeInTheDocument();
    expect(screen.getByText("$120,000 – $155,000")).toBeInTheDocument();

    // Click on L6 tier button
    const l6Btn = screen.getByRole("button", {
      name: /Select level Staff\+: Staff AI Solutions Architect/i
    });
    fireEvent.click(l6Btn);
    expect(handleSelect).toHaveBeenCalledWith("l6-architect");
  });

  it("supports keyboard navigation with Enter key on level cards", () => {
    const handleSelect = vi.fn();
    render(
      <CareerPathFallback
        selectedLevelId="l3-associate"
        onSelectLevel={handleSelect}
      />
    );

    const l5Btn = screen.getByRole("button", {
      name: /Select level L5: Senior Frontend AI Engineer/i
    });
    fireEvent.keyDown(l5Btn, { key: "Enter", code: "Enter" });
    expect(handleSelect).toHaveBeenCalledWith("l5-senior");
  });

  it("renders CareerPathSection with view mode toggles and accessibility landmarks", () => {
    render(<CareerPathSection initialLevelId="l5-senior" />);

    expect(
      screen.getByText("Interactive Career Constellation")
    ).toBeInTheDocument();
    expect(screen.getByText("FE-AA2")).toBeInTheDocument();
    expect(screen.getByText("3D View")).toBeInTheDocument();
    expect(screen.getByText("2D Accessible")).toBeInTheDocument();
  });

  it("switches to 2D view when 2D Accessible button is clicked", () => {
    render(<CareerPathSection initialLevelId="l5-senior" />);

    const accessibleBtn = screen.getByRole("button", {
      name: /2D Accessible/i
    });
    fireEvent.click(accessibleBtn);

    expect(screen.getByText("Engineering Progression Constellation")).toBeInTheDocument();
  });
});
