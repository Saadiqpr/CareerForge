import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MarkdownRenderer from "./MarkdownRenderer";

describe("MarkdownRenderer Component", () => {
  it("renders markdown headings, lists, and formatted text properly", () => {
    const markdown = `
# Engineering Strategy
Here is **bold text** and *italic text*.

- Point A
- Point B
`;
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByRole("heading", { level: 1, name: /Engineering Strategy/i })).toBeInTheDocument();
    expect(screen.getByText("Point A")).toBeInTheDocument();
    expect(screen.getByText("Point B")).toBeInTheDocument();
  });

  it("renders inline code snippets cleanly", () => {
    const markdown = "Use `const x = 10;` in your component.";
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText("const x = 10;")).toBeInTheDocument();
  });
});
