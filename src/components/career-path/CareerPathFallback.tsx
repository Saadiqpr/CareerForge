"use client";

import React from "react";
import { CAREER_LEVELS, CareerLevelData, CareerLevelId } from "./types";
import {
  Compass,
  Sparkles,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CareerPathFallbackProps {
  selectedLevelId?: CareerLevelId;
  onSelectLevel?: (levelId: CareerLevelId) => void;
  isFallbackModeNotice?: boolean;
}

export default function CareerPathFallback({
  selectedLevelId = "l5-senior",
  onSelectLevel,
  isFallbackModeNotice = false
}: CareerPathFallbackProps) {
  const activeLevel =
    CAREER_LEVELS.find((l) => l.id === selectedLevelId) || CAREER_LEVELS[2];

  const handleSelect = (id: CareerLevelId) => {
    if (onSelectLevel) {
      onSelectLevel(id);
    }
  };

  return (
    <div
      className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
      role="region"
      aria-label="Career Trajectory Map (Accessible 2D View)"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: activeLevel.accentHex }}
      />

      {isFallbackModeNotice && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              <strong>Accessible 2D Mode Active:</strong> Optimized for screen readers, reduced motion preferences, or devices without WebGL acceleration.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <Compass className="h-3 w-3" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Engineering Progression Constellation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Frontend AI Career Trajectory
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Selected Tier:</span>
          <span
            className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${activeLevel.badgeColor}`}
          >
            {activeLevel.levelCode} • {activeLevel.category}
          </span>
        </div>
      </div>

      {/* 2D Trajectory Visual Nodes (Accessible interactive map) */}
      <div className="mt-6 mb-8">
        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-cyan-400" />
          <span>Select a level to view competencies, market salary, and roadmap milestones:</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAREER_LEVELS.map((level, idx) => {
            const isSelected = level.id === selectedLevelId;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => handleSelect(level.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(level.id);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Select level ${level.levelCode}: ${level.title}`}
                className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isSelected
                    ? "border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/20 translate-y-[-2px]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]"
                }`}
              >
                {/* Step indicator top */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="h-6 w-6 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{
                      backgroundColor: `${level.accentHex}20`,
                      color: level.accentHex,
                      border: `1px solid ${level.accentHex}40`
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${level.badgeColor}`}
                  >
                    {level.levelCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {level.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {level.tagline}
                </p>

                <div className="mt-auto pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">{level.salaryRange}</span>
                  <span
                    className="font-bold flex items-center gap-1"
                    style={{ color: level.accentHex }}
                  >
                    {isSelected ? "Active" : "Explore"}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Deep Breakdown Panel */}
      <div className="rounded-2xl border border-white/[0.1] bg-slate-950/60 p-5 sm:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full animate-pulse"
                style={{ backgroundColor: activeLevel.accentHex }}
              />
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {activeLevel.title} ({activeLevel.levelCode})
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {activeLevel.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Market Band</p>
              <p className="text-xs font-black text-cyan-300 font-mono">{activeLevel.salaryRange}</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Experience</p>
              <p className="text-xs font-black text-slate-200">{activeLevel.experienceEstimate}</p>
            </div>
          </div>
        </div>

        {/* Competencies & AI Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Engineering Competencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Core Frontend Capabilities</span>
            </h4>
            <div className="space-y-2.5">
              {activeLevel.keyCompetencies.map((comp, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.15] transition"
                >
                  <p className="text-xs font-bold text-white mb-0.5">{comp.name}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI & Innovation Readiness */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>AI Integration & Reasoning Readiness</span>
            </h4>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-2">
              {activeLevel.aiCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>

            {/* Recommended Target Milestones */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 pt-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Priority Milestones for this Tier</span>
            </h4>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2">
              {activeLevel.recommendedMilestones.map((m, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="border-t border-white/[0.08] pt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Use CareerForge tools to level up to <strong>{activeLevel.levelCode}</strong>:
          </span>
          <div className="flex items-center gap-2.5">
            {activeLevel.actionLinks.map((link, i) => (
              <Button
                key={i}
                asChild
                size="sm"
                variant={link.variant === "primary" ? "default" : "outline"}
                className={
                  link.variant === "primary"
                    ? "gradient-btn text-xs font-bold rounded-xl h-9"
                    : "border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold rounded-xl h-9 text-slate-200"
                }
              >
                <Link href={link.href} className="flex items-center gap-1.5">
                  <span>{link.label}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
