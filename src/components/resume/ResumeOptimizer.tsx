"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Copy, RefreshCw, AlertCircle, TrendingUp, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptimizedResult {
  optimized: string;
  actionVerb: string;
  metricAdded: string;
  score: number;
  feedback: string;
  alternatives: string[];
  isFallback?: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<OptimizedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleOptimize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bullet.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

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

      const data: OptimizedResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
            <span>ATS Impact Engine</span>
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
              Evaluates power verbs, technical depth, and quantifiable business impact metrics.
            </p>
            <Button
              type="submit"
              disabled={!bullet.trim() || isLoading}
              className="gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Optimizing...</span>
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

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-6 animate-fade-in" aria-live="polite">
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
