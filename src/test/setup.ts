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

  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.ResizeObserver = window.ResizeObserver || (MockResizeObserver as unknown as typeof ResizeObserver);

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.IntersectionObserver = window.IntersectionObserver || (MockIntersectionObserver as unknown as typeof IntersectionObserver);
}

if (typeof navigator !== "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    writable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
}
