"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileText,
  Compass,
  Sliders,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

// Dynamic import for client-only WebGL shader canvas
const SignatureShaderCanvas = dynamic(
  () => import("./SignatureShaderCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0c1322] via-[#090e1f] to-[#120f26]"
        aria-hidden="true"
      />
    )
  }
);

interface SignatureHeroProps {
  className?: string;
}

export default function SignatureHero({ className = "" }: SignatureHeroProps) {
  const [shaderEnabled, setShaderEnabled] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsReducedMotion(true);
        setShaderEnabled(false);
      }

      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setIsReducedMotion(true);
          setShaderEnabled(false);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/[0.12] bg-[#070d1a] shadow-2xl transition-all duration-500 ${className}`}
      role="region"
      aria-label="CareerForge Signature Hero Banner"
    >
      {/* 1. Fullscreen Procedural GLSL Fragment Shader Background */}
      {shaderEnabled && isMounted ? (
        <SignatureShaderCanvas className="opacity-90" />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0a1226] via-[#070d1c] to-[#120f2a]"
          aria-hidden="true"
        />
      )}

      {/* 2. Soft Ambient Radial Vignette for High Text Contrast (WCAG 2.1 AA) */}
      <div
        className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(6, 12, 24, 0.4) 0%, rgba(5, 10, 20, 0.85) 75%, rgba(4, 8, 16, 0.95) 100%)"
        }}
        aria-hidden="true"
      />

      {/* Top Edge Shader Telemetry HUD */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 pb-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">FE-AA3 Signature Shader</span>
          <span className="hidden sm:inline text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
            GLSL FBM
          </span>
        </div>

        {/* Shader Toggle Control for Accessibility & Reviewers */}
        <div className="flex items-center gap-2">
          {isReducedMotion && (
            <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reduced Motion Active</span>
            </span>
          )}

          <div className="flex items-center bg-black/50 backdrop-blur-md border border-white/[0.15] p-1 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setShaderEnabled(true)}
              aria-pressed={shaderEnabled}
              aria-label="Enable procedural GLSL shader"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                shaderEnabled
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Shader</span>
            </button>
            <button
              type="button"
              onClick={() => setShaderEnabled(false)}
              aria-pressed={!shaderEnabled}
              aria-label="Enable static accessible 2D fallback"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !shaderEnabled
                  ? "bg-slate-800 text-cyan-300 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-3 w-3" />
              <span className="hidden sm:inline">2D Static</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Hero Content Overlay */}
      <div className="relative z-10 p-6 sm:p-10 pt-4 sm:pt-6">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] drop-shadow-md">
            Build a career you can{" "}
            <span className="gradient-text-vibrant font-black">prove</span>.
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-200 max-w-2xl drop-shadow">
            Autonomous AI career acceleration suite for high-leverage frontend AI engineers.
            Practice with real-time streaming AI coaches, optimize ATS resume metrics, and navigate procedural 3D career constellations.
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/ai-coach"
              className="gradient-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Bot className="h-4 w-4" />
              <span>Launch AI Coach</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.15] bg-[#0c1322]/80 backdrop-blur-md px-5 py-3 text-xs sm:text-sm font-bold text-slate-200 hover:border-emerald-400/50 hover:bg-slate-900/90 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>ATS Resume Studio</span>
            </Link>

            <Link
              href="/career-path"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.15] bg-[#0c1322]/80 backdrop-blur-md px-5 py-3 text-xs sm:text-sm font-bold text-slate-200 hover:border-amber-400/50 hover:bg-slate-900/90 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>3D Constellation</span>
            </Link>
          </div>

          {/* Interactive Flow Hint Indicator */}
          {shaderEnabled && (
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Interactive flow field responds smoothly to cursor gravity & touch drag</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
