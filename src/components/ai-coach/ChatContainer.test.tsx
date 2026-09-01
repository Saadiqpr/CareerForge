import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatContainer from "./ChatContainer";

describe("ChatContainer Component (AI Coach Chat)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders header, starter prompt cards, and accessible message input", () => {
    render(<ChatContainer />);

    expect(screen.getByRole("heading", { name: /CareerForge AI Coach/i })).toBeInTheDocument();
    expect(screen.getByText(/How can I elevate your career today\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STAR Behavioral Interview/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask your career coach anything/i)).toBeInTheDocument();
  });

  it("populates input when a starter prompt card is clicked", () => {
    render(<ChatContainer />);

    const starterBtn = screen.getByRole("button", { name: /STAR Behavioral Interview/i });
    fireEvent.click(starterBtn);

    const input = screen.getByPlaceholderText(/Ask your career coach anything/i) as HTMLInputElement;
    expect(input.value).toContain("mock behavioral interview");
  });

  it("renders user message and pending thinking indicator when submitting a prompt", async () => {
    // Return a delayed pending stream
    const mockStream = new ReadableStream({
      async start() {
        // keep open to simulate pending/thinking state
      },
    });

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      body: mockStream,
    });

    render(<ChatContainer />);

    const input = screen.getByPlaceholderText(/Ask your career coach anything/i);
    fireEvent.change(input, { target: { value: "How do I prepare for a Staff Engineer review?" } });

    const sendBtn = screen.getByTitle(/Send message/i);
    fireEvent.click(sendBtn);

    // User message should appear immediately
    expect(screen.getByText("How do I prepare for a Staff Engineer review?")).toBeInTheDocument();

    // Pending / thinking indicator should render
    await waitFor(() => {
      expect(screen.getByText(/Formulating coaching strategy/i)).toBeInTheDocument();
    });
  });

  it("streams AI response chunks and updates assistant message", async () => {
    const responseChunks = [
      "### Career Strategy Recommendations\n\n",
      "1. Focus on **quantifiable impact**.\n",
      "2. Lead cross-team architecture discussions.",
    ];

    let chunkIdx = 0;
    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        if (chunkIdx < responseChunks.length) {
          const encoder = new TextEncoder();
          const value = encoder.encode(responseChunks[chunkIdx++]);
          return Promise.resolve({ done: false, value });
        }
        return Promise.resolve({ done: true, value: undefined });
      }),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ChatContainer />);

    const input = screen.getByPlaceholderText(/Ask your career coach anything/i);
    fireEvent.change(input, { target: { value: "Give me promotion advice." } });

    const sendBtn = screen.getByTitle(/Send message/i);
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Career Strategy Recommendations/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Focus on/i)).toBeInTheDocument();
    expect(screen.getByText(/Lead cross-team architecture discussions/i)).toBeInTheDocument();
  });

  it("handles stream errors gracefully and provides a retry button", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "AI service connection lost." }),
    });

    render(<ChatContainer />);

    const input = screen.getByPlaceholderText(/Ask your career coach anything/i);
    fireEvent.change(input, { target: { value: "Fail test prompt" } });

    const sendBtn = screen.getByTitle(/Send message/i);
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/AI service connection lost/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("allows clearing conversation and resetting session", async () => {
    const mockResponseChunk = "Here is some coaching advice.";
    let chunkIdx = 0;

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: () => {
            if (chunkIdx++ === 0) {
              return Promise.resolve({ done: false, value: new TextEncoder().encode(mockResponseChunk) });
            }
            return Promise.resolve({ done: true, value: undefined });
          },
        }),
      },
    });

    render(<ChatContainer />);

    const input = screen.getByPlaceholderText(/Ask your career coach anything/i);
    fireEvent.change(input, { target: { value: "Clear conversation test" } });
    fireEvent.click(screen.getByTitle(/Send message/i));

    await waitFor(() => {
      expect(screen.getByText("Clear conversation test")).toBeInTheDocument();
    });

    const newSessionBtn = screen.getByRole("button", { name: /New Session/i });
    fireEvent.click(newSessionBtn);

    expect(screen.queryByText("Clear conversation test")).not.toBeInTheDocument();
    expect(screen.getByText(/How can I elevate your career today\?/i)).toBeInTheDocument();
  });
});
