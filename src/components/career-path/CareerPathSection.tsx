"use client";

import React, { useState, useEffect } from "react";
import { CAREER_LEVELS, CareerLevelId, CareerLevelData } from "./types";
import CareerPath3DCanvas from "./CareerPath3DCanvas";
import CareerPathFallback from "./CareerPathFallback";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Activity,
  Sliders
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CareerPathSectionProps {
  initialLevelId?: CareerLevelId;
}

export default function CareerPathSection({
  initialLevelId = "l5-senior"
}: CareerPathSectionProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<CareerLevelId>(initialLevelId);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check prefers-reduced-motion and WebGL support on client mount
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsReducedMotion(true);
        setViewMode("2d");
      }

      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setIsReducedMotion(true);
          setViewMode("2d");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const activeLevel =
    CAREER_LEVELS.find((l) => l.id === selectedLevelId) || CAREER_LEVELS[2];

  const handleSelectLevel = (levelId: CareerLevelId) => {
    setSelectedLevelId(levelId);
  };

  return (
    <div className="space-y-6">
      {/* View Mode & Accessibility Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1322]/80 backdrop-blur-xl border border-white/[0.1] p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Interactive Career Constellation
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                FE-AA2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Procedural WebGL 3D Visualization with Full WCAG 2.1 AA 2D Fallback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isReducedMotion && (
            <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Reduced Motion
            </span>
          )}

          {/* Toggle Switch */}
          <div className="flex items-center bg-black/40 border border-white/[0.1] p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              aria-pressed={viewMode === "3d"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "3d"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>3D View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              aria-pressed={viewMode === "2d"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "2d"
                  ? "bg-slate-800 text-cyan-300 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>2D Accessible</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Experience Viewport */}
      {viewMode === "3d" && isMounted ? (
        <div className="space-y-6">
          <CareerPath3DCanvas
            selectedLevelId={selectedLevelId}
            onSelectLevel={handleSelectLevel}
          />

          {/* Active Level Detailed Inspector Card (Synchronized with 3D Selection) */}
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
              style={{ backgroundColor: activeLevel.accentHex }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeLevel.badgeColor}`}
                  >
                    Level {activeLevel.levelCode} • {activeLevel.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Est. Experience: {activeLevel.experienceEstimate}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeLevel.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {activeLevel.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Compensation Band</p>
                  <p className="text-sm font-black text-cyan-300 font-mono">{activeLevel.salaryRange}</p>
                </div>
              </div>
            </div>

            {/* Grid of Capabilities & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Technical Capabilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span>Technical Competencies</span>
                </h4>
                <div className="space-y-2.5">
                  {activeLevel.keyCompetencies.map((comp, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:border-white/[0.15] transition"
                    >
                      <p className="text-xs font-bold text-white mb-0.5">{comp.name}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI & Priority Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-amber-400" />
                  <span>AI Engineering Readiness</span>
                </h4>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                  {activeLevel.aiCapabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 pt-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Priority Career Milestones</span>
                </h4>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                  {activeLevel.recommendedMilestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="border-t border-white/[0.08] pt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Unlock <strong>{activeLevel.levelCode}</strong> qualifications in CareerForge:
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
      ) : (
        <CareerPathFallback
          selectedLevelId={selectedLevelId}
          onSelectLevel={handleSelectLevel}
          isFallbackModeNotice={isReducedMotion}
        />
      )}
    </div>
  );
}
