import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignatureHero from "./SignatureHero";

// Mock the 3D WebGL Shader Canvas for JSDOM
vi.mock("./SignatureShaderCanvas", () => ({
  default: () => (
    <div data-testid="mock-shader-canvas">
      <span>WebGL GLSL Shader Canvas</span>
    </div>
  ),
}));

describe("SignatureHero Component (FE-AA3 Fullscreen Shader Standards)", () => {
  it("renders headline, description, and primary CTA buttons", () => {
    render(<SignatureHero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Build a career you can prove/i);
    expect(screen.getByText(/Autonomous AI career acceleration suite/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Launch AI Coach/i })).toHaveAttribute("href", "/ai-coach");
    expect(screen.getByRole("link", { name: /ATS Resume Studio/i })).toHaveAttribute("href", "/resume");
    expect(screen.getByRole("link", { name: /3D Constellation/i })).toHaveAttribute("href", "/career-path");
  });

  it("renders shader badge and view mode controls", () => {
    render(<SignatureHero />);

    expect(screen.getByText("FE-AA3 Signature Shader")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enable procedural GLSL shader/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enable static accessible 2D fallback/i })).toBeInTheDocument();
  });

  it("toggles between Shader mode and 2D Static fallback mode", () => {
    render(<SignatureHero />);

    const staticBtn = screen.getByRole("button", { name: /Enable static accessible 2D fallback/i });
    fireEvent.click(staticBtn);

    // Verify 2D button is active
    expect(staticBtn).toHaveAttribute("aria-pressed", "true");

    const shaderBtn = screen.getByRole("button", { name: /Enable procedural GLSL shader/i });
    fireEvent.click(shaderBtn);
    expect(shaderBtn).toHaveAttribute("aria-pressed", "true");
  });
});
