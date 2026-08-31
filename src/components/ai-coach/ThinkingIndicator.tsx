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
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-white/[0.1] text-cyan-400 text-xs font-semibold shadow-md"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4 text-cyan-400" />
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-md px-4 py-3 text-sm text-slate-200 shadow-lg shadow-cyan-500/5">
        <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        <span className="text-xs font-bold text-cyan-300">Formulating coaching strategy</span>
        <div className="flex items-center gap-1.5 pl-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
