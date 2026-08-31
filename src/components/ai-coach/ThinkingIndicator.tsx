"use client";

import React from "react";
import { Bot, Sparkles } from "lucide-react";

export default function ThinkingIndicator() {
  return (
    <div
      className="flex gap-3 max-w-3xl mr-auto transition-opacity duration-200"
      role="status"
      aria-label="AI Coach is thinking"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)] text-white text-xs font-semibold shadow-xs"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-gray-50/90 px-4 py-3 text-sm text-black/70 shadow-xs">
        <Sparkles className="h-4 w-4 text-[var(--blue)] animate-pulse motion-reduce:animate-none" />
        <span className="text-xs font-medium text-[var(--navy)]">Thinking</span>
        <div className="flex items-center gap-1 pl-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)] animate-bounce [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)] animate-bounce [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)] animate-bounce motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
