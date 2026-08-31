"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  Target,
  FileText,
  Bot,
  Activity,
  User,
  Sparkles,
  Zap,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null },
  { label: "AI Coach", href: "/ai-coach", icon: Bot, badge: "Live AI" },
  { label: "Resume Studio", href: "/resume", icon: FileText, badge: "ATS" },
  { label: "Skills Matrix", href: "/skills", icon: Target, badge: "Gaps" },
  { label: "Career Path", href: "/career-path", icon: Compass, badge: null },
  { label: "Job Tracker", href: "/jobs", icon: Briefcase, badge: "Board" },
  { label: "System Health", href: "/health", icon: Activity, badge: null },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Accessible Skip to Content Link (FE-10 / WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950 focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090e1a]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 font-[var(--font-space-grotesk)] text-lg sm:text-xl font-bold tracking-tight text-white"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <span className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090e1a] text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  CF
                </span>
              </span>
              <span className="gradient-text font-black tracking-tight">CareerForge</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 shadow-xs">
              <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span>AI Capstone</span>
            </span>
          </div>

          {/* Desktop Top Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navigation.slice(0, 4).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-white/[0.1] text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-cyan-400 rounded-full blur-[1px]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile & Live Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LLM Online</span>
            </div>

            <Link
              href="/profile"
              aria-current={pathname === "/profile" ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                pathname === "/profile"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "border border-white/[0.1] bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] hover:border-cyan-500/40"
              }`}
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r border-white/[0.07] bg-[#090e1a]/60 p-4 md:block shrink-0 backdrop-blur-md">
          <div className="mb-6 px-3 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/80 flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-cyan-400" />
              Workspace Matrix
            </p>
            <p className="mt-1 text-xs text-slate-400 font-normal">
              Production AI Career Suite
            </p>
          </div>

          <nav className="space-y-1.5" aria-label="Sidebar Navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent text-white font-semibold border border-cyan-500/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                          : "bg-white/[0.05] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.1]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-white/[0.05] text-slate-400 border-white/[0.08]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick AI Pro Tip Card at bottom of sidebar */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-3.5 text-xs text-slate-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Career Tip</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the STAR method with quantifiable business metrics for high-impact interview answers.
            </p>
          </div>
        </aside>

        {/* Dynamic Main Page Content */}
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Horizontal Navigation for Mobile Viewports */}
      <div className="sticky bottom-0 z-40 border-t border-white/[0.08] bg-[#090e1a]/95 backdrop-blur-xl md:hidden">
        <nav className="mx-auto flex max-w-7xl overflow-x-auto px-2 py-2" aria-label="Mobile Navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 min-w-[70px] px-2 py-1.5 rounded-xl text-[10px] font-medium transition ${
                  isActive
                    ? "text-cyan-300 font-bold bg-cyan-500/15 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}