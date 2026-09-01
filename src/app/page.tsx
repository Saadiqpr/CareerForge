import AppShell from "@/components/AppShell";
import Link from "next/link";
import SignatureHero from "@/components/hero/SignatureHero";
import {
  Sparkles,
  Target,
  Compass,
  Briefcase,
  FileText,
  Bot,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "AI Career Coach",
      description: "Interactive real-time interview rehearsals, STAR method evaluation, and technical mentorship.",
      href: "/ai-coach",
      icon: Bot,
      tag: "Streaming LLM",
      glowColor: "from-purple-500/20 to-indigo-500/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
    {
      title: "ATS Resume Studio",
      description: "Transform passive bullet points into high-impact ATS power statements with quantifiable metrics.",
      href: "/resume",
      icon: FileText,
      tag: "Structured JSON",
      glowColor: "from-emerald-500/20 to-teal-500/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    },
    {
      title: "AI Skill Gap Matrix",
      description: "Audit current engineering capabilities against market roles and generate a tailored 8-week roadmap.",
      href: "/skills",
      icon: Target,
      tag: "Competency Architect",
      glowColor: "from-cyan-500/20 to-blue-500/20",
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    },
    {
      title: "Career Path Roadmap",
      description: "Chart promotion milestones, system design goals, and interview progression checkpoints.",
      href: "/career-path",
      icon: Compass,
      tag: "Milestone Tracker",
      glowColor: "from-amber-500/20 to-orange-500/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    {
      title: "Job Pipeline Board",
      description: "Manage target high-leverage roles, interview stages, and compensation packages in one place.",
      href: "/jobs",
      icon: Briefcase,
      tag: "Pipeline Kanban",
      glowColor: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    },
    {
      title: "System Observability",
      description: "Production runtime health checks, model status, and resilience diagnostics (FE-11).",
      href: "/health",
      icon: Activity,
      tag: "Observability",
      glowColor: "from-rose-500/20 to-pink-500/20",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    },
  ];

  return (
    <AppShell>
      <section className="space-y-8 animate-fade-in">
        {/* FE-AA3: Signature Fullscreen GLSL Shader Hero */}
        <SignatureHero />

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-white/[0.08] bg-[#0c1322]/80 backdrop-blur-md p-5 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">98.4% ATS</p>
              <p className="text-[10px] text-slate-400">Score Impact Rate</p>
            </div>
          </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">WCAG 2.1 AA</p>
                  <p className="text-[10px] text-slate-400">100% Accessible</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Claude 3.5</p>
                  <p className="text-[10px] text-slate-400">Sonnet / Opus</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">L5 / Staff</p>
                  <p className="text-[10px] text-slate-400">Career Targets</p>
                </div>
              </div>
        </div>

        {/* Feature Tools Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-[var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-white">
                Integrated Career Engineering Tools
              </h2>
              <p className="text-xs text-slate-400">
                Precision AI modules for every stage of your career roadmap
              </p>
            </div>
            <span className="text-xs text-cyan-400 hidden sm:flex items-center gap-1 font-medium">
              <Zap className="h-3.5 w-3.5" />
              Production Ready
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0f172a]/70 p-5 sm:p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#162238]/80 hover:shadow-[0_10px_30px_-10px_rgba(56,189,248,0.2)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle hover gradient shine */}
                  <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${tool.glowColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tool.iconBg} text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                        {tool.tag}
                      </span>
                    </div>

                    <h3 className="font-[var(--font-space-grotesk)] text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                      {tool.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5 flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                    <span>Open workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform text-cyan-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}