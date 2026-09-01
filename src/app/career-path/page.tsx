"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";
import { Compass, CheckCircle2, Circle, Plus, Award, Trash2, Zap, Trophy, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CareerPathFallback from "@/components/career-path/CareerPathFallback";

const CareerPathSection = dynamic(
  () => import("@/components/career-path/CareerPathSection"),
  {
    ssr: false,
    loading: () => <CareerPathFallback isFallbackModeNotice={false} />
  }
);

interface Milestone {
  id: string;
  title: string;
  category: "Technical" | "Leadership" | "Portfolio" | "Certification";
  timeline: string;
  completed: boolean;
  notes: string;
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "Master Frontend AI Integration Patterns (AI SDK, Streaming, Structured Output)",
    category: "Technical",
    timeline: "Month 1",
    completed: true,
    notes: "Completed Flyrank FE-07 / FE-09 AI Integration modules with live LLM streaming."
  },
  {
    id: "m2",
    title: "Ship Production-Grade Capstone (CareerForge) with Vitest & WCAG 2.1 AA Compliance",
    category: "Portfolio",
    timeline: "Month 2",
    completed: true,
    notes: "Deploy to Vercel with comprehensive test suite and deployment checklist."
  },
  {
    id: "m3",
    title: "Conduct 10 Mock Technical & Behavioral Interviews (STAR Method)",
    category: "Leadership",
    timeline: "Month 3",
    completed: false,
    notes: "Use CareerForge AI Coach to rehearse system design and conflict resolution questions."
  },
  {
    id: "m4",
    title: "Secure Offer for Senior / Staff Frontend AI Engineer Role",
    category: "Certification",
    timeline: "Month 4",
    completed: false,
    notes: "Target Tier-1 AI Product and SaaS tech companies."
  }
];

export default function CareerPathPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Milestone["category"]>("Technical");
  const [newTimeline, setNewTimeline] = useState("Month 2");

  const toggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      timeline: newTimeline,
      completed: false,
      notes: "Custom career progression milestone added."
    };

    setMilestones([...milestones, newM]);
    setNewTitle("");
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  const getCategoryBadge = (cat: Milestone["category"]) => {
    switch (cat) {
      case "Technical":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "Portfolio":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "Leadership":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "Certification":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <AppShell>
      <section className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
              <Compass className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Career Trajectory & Roadmaps
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Shape your next <span className="gradient-text-vibrant">career milestone</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Chart a structured progression path from your current baseline to target staff engineering and AI product roles.
          </p>
        </div>

        {/* Progress Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-6 shadow-2xl sm:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400" />
                Roadmap Execution Progress
              </span>
              <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                {completedCount} of {milestones.length} Achieved ({progressPercent}%)
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-700 shadow-md shadow-emerald-500/30"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Each completed checkpoint proves a verified capability upgrade, open-source artifact, or interview rehearsal.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 mb-2">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Level
            </span>
            <p className="text-base font-black text-white mt-1">
              Frontend AI Engineer L5
            </p>
          </div>
        </div>

        {/* FE-AA2 3D Career Progression Constellation & Breakdown */}
        <CareerPathSection initialLevelId="l5-senior" />

        {/* Milestones List Card */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="font-[var(--font-space-grotesk)] text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Career Trajectory Checklist</span>
            </h2>
            <span className="text-xs text-slate-400">
              Click circle to mark complete
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`flex items-start justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
                  m.completed
                    ? "border-emerald-500/30 bg-emerald-950/20 text-slate-200"
                    : "border-white/[0.08] bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 shadow-md"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 pr-4">
                  <button
                    type="button"
                    onClick={() => toggleMilestone(m.id)}
                    aria-label={`Toggle milestone: ${m.title}`}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-600 hover:text-cyan-400 transition-colors" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadge(m.category)}`}>
                        {m.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {m.timeline}
                      </span>
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        m.completed ? "line-through text-slate-500" : "text-white"
                      }`}
                    >
                      {m.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {m.notes}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMilestone(m.id)}
                  aria-label={`Delete milestone: ${m.title}`}
                  className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 h-8 px-2.5 rounded-lg shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Milestone Form */}
          <form onSubmit={handleAddMilestone} className="border-t border-white/[0.08] pt-5 mt-5 grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="New milestone goal (e.g. Build end-to-end RAG system)"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Milestone["category"])}
                className="w-full rounded-xl border border-white/[0.1] bg-slate-900/80 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              >
                <option value="Technical" className="bg-slate-900 text-white">Technical</option>
                <option value="Portfolio" className="bg-slate-900 text-white">Portfolio</option>
                <option value="Leadership" className="bg-slate-900 text-white">Leadership</option>
                <option value="Certification" className="bg-slate-900 text-white">Certification</option>
              </select>
            </div>
            <div>
              <Button
                type="submit"
                disabled={!newTitle.trim()}
                className="gradient-btn w-full gap-1.5 rounded-xl text-xs h-10 font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Milestone
              </Button>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  );
}