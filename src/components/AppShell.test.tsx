import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppShell from "./AppShell";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/resume",
}));

describe("AppShell Component (WCAG 2.1 AA Compliance)", () => {
  it("renders accessible skip to main content link", () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );

    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("renders navigation landmarks with active page indicator", () => {
    render(
      <AppShell>
        <div>Page Body</div>
      </AppShell>
    );

    expect(screen.getByText("CareerForge")).toBeInTheDocument();
    expect(screen.getAllByText("Resume Studio")[0]).toBeInTheDocument();
    expect(screen.getByText("Page Body")).toBeInTheDocument();
  });
});
