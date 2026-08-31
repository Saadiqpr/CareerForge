"use client";

import React, { useState } from "react";
import { Sparkles, Target, CheckCircle2, AlertTriangle, BookOpen, Plus, X, RefreshCw, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CriticalGap {
  skill: string;
  priority: "High" | "Medium";
  impact: string;
  recommendedAction: string;
}

interface LearningMilestone {
  phase: string;
  focus: string;
  deliverable: string;
}

interface SkillGapResult {
  matchPercentage: number;
  summary: string;
  strengths: string[];
  criticalGaps: CriticalGap[];
  learningRoadmap: LearningMilestone[];
  isFallback?: boolean;
}

const DEFAULT_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "REST APIs",
  "Git & GitHub",
];

const PRESET_ROLES = [
  "Frontend AI Engineer",
  "Senior Fullstack Developer",
  "Staff UI Architect",
  "AI Product Engineer",
];

export default function SkillGapAnalyzer() {
  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [newSkillInput, setNewSkillInput] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>(PRESET_ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState<string>("Mid-to-Senior");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAnalyze = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: skills,
          targetRole,
          experienceLevel,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Skill gap analysis failed." }));
        throw new Error(data.error || "Analysis failed.");
      }

      const data: SkillGapResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Input & Target Configuration */}
      <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
          <div>
            <h2 className="font-[var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>AI Skill Gap & Readiness Matrix</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Benchmark your current skillset against industry standards and generate a customized technical roadmap.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Competency Architect</span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label htmlFor="target-role-select" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Target Engineering Role
            </label>
            <select
              id="target-role-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              {PRESET_ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-white">
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="level-select" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Target Seniority Level
            </label>
            <select
              id="level-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              <option value="Entry-to-Mid" className="bg-slate-900 text-white">Entry to Mid-Level (0-2 YOE)</option>
              <option value="Mid-to-Senior" className="bg-slate-900 text-white">Mid to Senior (3-5 YOE)</option>
              <option value="Staff/Lead" className="bg-slate-900 text-white">Staff / Principal / Tech Lead (6+ YOE)</option>
            </select>
          </div>
        </div>

        {/* Current Skills List */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Your Verified Skills ({skills.length}):
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 shadow-sm transition hover:bg-cyan-500/20"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  aria-label={`Remove skill ${skill}`}
                  className="text-cyan-400/60 hover:text-rose-400 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
            <input
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. GraphQL, Docker, WCAG)"
              className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={!newSkillInput.trim()}
              className="gap-1 text-xs border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl px-3.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.08] pt-5 mt-6">
          <p className="text-xs text-slate-400">
            Compares your stack against market expectations for {targetRole}.
          </p>
          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || skills.length === 0}
            className="gradient-btn gap-2 rounded-xl px-6 h-11 shadow-lg shadow-indigo-500/25 font-bold"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Evaluating Gaps...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Gap Analysis</span>
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fade-in" aria-live="polite">
          {/* Executive Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-6 shadow-2xl text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Role Match
              </span>
              <p className="mt-2 text-5xl font-black gradient-text-vibrant">
                {result.matchPercentage}%
              </p>
              <div className="w-full bg-white/[0.08] h-2.5 rounded-full mt-4 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-md shadow-cyan-500/50"
                  style={{ width: `${result.matchPercentage}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-6 shadow-2xl sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Executive Readiness Assessment
              </span>
              <p className="text-sm leading-relaxed text-slate-200 font-normal">
                {result.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  ✓ Core Strengths: {result.strengths.slice(0, 3).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Critical Skill Gaps */}
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="font-[var(--font-space-grotesk)] text-base sm:text-lg font-bold text-white">
                High-Priority Capability Gaps
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {result.criticalGaps.map((gap, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4 space-y-3 hover:border-cyan-500/40 hover:bg-slate-900/90 transition shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {gap.skill}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        gap.priority === "High"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {gap.impact}
                  </p>
                  <div className="border-t border-white/[0.06] pt-2.5 text-xs text-cyan-300">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Recommended Action:</span>
                    {gap.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Learning Roadmap */}
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <h3 className="font-[var(--font-space-grotesk)] text-base sm:text-lg font-bold text-white">
                Tailored 8-Week Execution Roadmap
              </h3>
            </div>

            <div className="space-y-3.5">
              {result.learningRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/50 p-4 gap-3.5 hover:border-cyan-500/30 transition shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/20 shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                        {item.phase}
                      </span>
                      <p className="text-sm font-bold text-white">
                        {item.focus}
                      </p>
                    </div>
                  </div>
                  <div className="sm:max-w-md text-xs text-slate-300 bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                    <span className="font-bold text-cyan-300">Milestone Deliverable: </span>
                    {item.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
