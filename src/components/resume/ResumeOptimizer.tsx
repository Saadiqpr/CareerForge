"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Copy, RefreshCw, AlertCircle, TrendingUp, Zap, FileText, Code2, PlayCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OptimizedResult {
  optimized: string;
  actionVerb: string;
  metricAdded: string;
  score: number;
  feedback: string;
  alternatives: string[];
  isFallback?: boolean;
}

export type ToolLifecycleState = "idle" | "input-streaming" | "input-available" | "output-available" | "output-error";

export interface ToolArgs {
  bullet: string;
  targetRole?: string;
  industry?: string;
}

const SAMPLE_BULLETS = [
  {
    title: "Frontend dev",
    text: "Worked on frontend features for our website using React and fixed some bugs.",
    role: "Frontend AI Engineer"
  },
  {
    title: "AI Integration",
    text: "Added an AI chatbot to the web app for customer support questions.",
    role: "Fullstack AI Engineer"
  },
  {
    title: "Performance / CWV",
    text: "Made the application load faster and helped improve page speed scores.",
    role: "UI Performance Architect"
  }
];

export default function ResumeOptimizer() {
  const [bullet, setBullet] = useState<string>(SAMPLE_BULLETS[0].text);
  const [targetRole, setTargetRole] = useState<string>("Frontend AI Engineer");
  const [industry, setIndustry] = useState<string>("Tech & AI SaaS");

  // FE-07 Tool Lifecycle State Management
  const [toolState, setToolState] = useState<ToolLifecycleState>("idle");
  const [toolArgs, setToolArgs] = useState<ToolArgs | null>(null);
  const [result, setResult] = useState<OptimizedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const isLoading = toolState === "input-streaming" || toolState === "input-available";

  const handleOptimize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bullet.trim()) return;

    setResult(null);
    setError(null);
    setToolState("input-streaming");
    setToolArgs({ bullet: bullet.trim().slice(0, Math.ceil(bullet.length / 2)), targetRole, industry });

    try {
      const res = await fetch("/api/resume-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: bullet.trim(), targetRole, industry }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Optimization request failed." }));
        throw new Error(data.error || "Failed to optimize bullet.");
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/x-ndjson") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const event = JSON.parse(line);
              if (event.state === "input-streaming") {
                setToolState("input-streaming");
                if (event.args) setToolArgs(event.args);
              } else if (event.state === "input-available") {
                setToolState("input-available");
                if (event.args) setToolArgs(event.args);
              } else if (event.state === "output-available") {
                setToolState("output-available");
                if (event.result) setResult(event.result);
              } else if (event.state === "output-error") {
                setToolState("output-error");
                setError(event.error || "Tool execution failed.");
              }
            } catch (err) {
              console.error("Error parsing NDJSON chunk:", err);
            }
          }
        }
      } else {
        // Direct JSON response handling
        const data: OptimizedResult = await res.json();
        setResult(data);
        setToolState("output-available");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errMsg);
      setToolState("output-error");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Input Card */}
      <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
          <div>
            <h2 className="font-[var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>ATS Resume Bullet Optimizer</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Transform passive statements into high-impact ATS bullets (Action Verb + Technical Context + Quantifiable Metric).
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI SDK Tool: optimizeBullet</span>
          </span>
        </div>

        {/* Preset Sample Prompts */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Try a sample weak bullet:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_BULLETS.map((sample) => (
              <button
                key={sample.title}
                type="button"
                onClick={() => {
                  setBullet(sample.text);
                  setTargetRole(sample.role);
                }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition"
              >
                &ldquo;{sample.title}&rdquo;
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleOptimize} className="space-y-4">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="target-role" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role
              </label>
              <input
                id="target-role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend AI Engineer"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
            <div>
              <label htmlFor="target-industry" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Industry
              </label>
              <input
                id="target-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. AI / Fintech / HealthTech"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="resume-bullet" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Current Resume Bullet Point
            </label>
            <textarea
              id="resume-bullet"
              rows={3}
              value={bullet}
              onChange={(e) => setBullet(e.target.value)}
              placeholder="e.g. Built frontend features using React and improved application speed."
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] p-3.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400">
              Evaluates power verbs, technical depth, and quantifiable business impact metrics via AI SDK tool.
            </p>
            <Button
              type="submit"
              disabled={!bullet.trim() || isLoading}
              className="gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing Tool...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Optimize Bullet</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* FE-07 Tool Lifecycle State Rendering */}
      
      {/* 1. Tool State: input-streaming */}
      {toolState === "input-streaming" && (
        <div
          data-testid="tool-state-input-streaming"
          className="rounded-3xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl p-5 shadow-xl animate-pulse space-y-3"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-bold text-cyan-300">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Tool State: input-streaming</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400/70">tool: optimizeBullet</span>
          </div>
          <p className="text-xs text-slate-300">
            Streaming parameters into server-side AI SDK tool <code className="text-cyan-300 font-mono">optimizeBullet</code>...
          </p>
          {toolArgs && (
            <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-3 font-mono text-xs text-cyan-200 truncate">
              args: &#123; bullet: &quot;{toolArgs.bullet}&quot;... &#125;
            </div>
          )}
        </div>
      )}

      {/* 2. Tool State: input-available */}
      {toolState === "input-available" && (
        <div
          data-testid="tool-state-input-available"
          className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl p-5 shadow-xl space-y-3"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Tool State: input-available</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400/70">execute() in progress</span>
          </div>
          <p className="text-xs text-slate-300">
            Validated arguments passed to <code className="text-emerald-300 font-mono">optimizeBullet.execute()</code>. Generating structured ATS evaluation...
          </p>
          {toolArgs && (
            <div className="grid gap-2 sm:grid-cols-3 font-mono text-[11px]">
              <div className="rounded-xl border border-white/[0.08] bg-slate-950/50 p-2.5">
                <span className="text-[10px] text-slate-400 block uppercase">Role</span>
                <span className="text-emerald-300 font-semibold">{toolArgs.targetRole || "Software Engineer"}</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-slate-950/50 p-2.5">
                <span className="text-[10px] text-slate-400 block uppercase">Industry</span>
                <span className="text-emerald-300 font-semibold">{toolArgs.industry || "Tech"}</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-slate-950/50 p-2.5 sm:col-span-1 truncate">
                <span className="text-[10px] text-slate-400 block uppercase">Bullet</span>
                <span className="text-slate-200 truncate block">{toolArgs.bullet}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Tool State: output-error */}
      {toolState === "output-error" && (
        <div
          data-testid="tool-state-output-error"
          className="rounded-3xl border border-rose-500/40 bg-rose-950/30 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-4"
          role="alert"
        >
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-200">
                Tool Execution Failed (output-error)
              </h3>
            </div>
            <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-mono text-rose-300">
              tool: optimizeBullet
            </span>
          </div>

          <p className="text-xs text-rose-300 leading-relaxed">
            {error || "An error occurred while executing the optimizeBullet AI SDK tool."}
          </p>

          <div className="flex items-center justify-end pt-1">
            <Button
              type="button"
              onClick={() => handleOptimize()}
              className="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 h-9 rounded-xl shadow-lg shadow-rose-500/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Tool Execution</span>
            </Button>
          </div>
        </div>
      )}

      {/* 4. Tool State: output-available (EXISTING Optimization Complete / ATS Impact Score UI) */}
      {toolState === "output-available" && result && (
        <div
          data-testid="tool-state-output-available"
          className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-6 animate-fade-in"
          aria-live="polite"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/30">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-[var(--font-space-grotesk)] text-base sm:text-lg font-bold text-white">
                  Optimization Complete
                </h3>
                <p className="text-xs text-slate-400">
                  ATS Impact Score: <span className="font-bold text-emerald-400 text-sm">{result.score}/100</span>
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(result.optimized)}
              className="gap-1.5 text-xs text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Result</span>
                </>
              )}
            </Button>
          </div>

          {/* Before & After Comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1.5">
                Original Version
              </span>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;{bullet}&rdquo;
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/25 p-4 shadow-lg shadow-emerald-500/5 relative">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Optimized Power Bullet
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {result.optimized}
              </p>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid gap-3 sm:grid-cols-3 pt-1">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Power Action Verb
              </span>
              <p className="mt-1 text-sm font-bold text-cyan-300">
                {result.actionVerb}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quantified Metric Added
              </span>
              <p className="mt-1 text-sm font-bold text-emerald-400">
                {result.metricAdded}
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 text-xs">
            <p className="font-bold text-cyan-300 mb-1">Coach Rationale:</p>
            <p className="text-slate-300 leading-relaxed">{result.feedback}</p>
          </div>

          {/* Alternative Variations */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="border-t border-white/[0.08] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Alternative Angles:
              </h4>
              <div className="space-y-2.5">
                {result.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-xs hover:border-cyan-500/30 hover:bg-white/[0.04] transition"
                  >
                    <p className="text-slate-200 font-normal pr-4">{alt}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(alt)}
                      className="opacity-70 group-hover:opacity-100 h-8 px-2.5 text-xs text-cyan-300 hover:bg-cyan-500/10 rounded-lg shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
