import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  if (window.HTMLElement) {
    window.HTMLElement.prototype.scrollTo = vi.fn();
  }
}

if (typeof navigator !== "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    writable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
}
