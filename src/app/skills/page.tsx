import AppShell from "@/components/AppShell";
import SkillGapAnalyzer from "@/components/skills/SkillGapAnalyzer";
import { Target } from "lucide-react";

export default function SkillsPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <Target className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              AI Skill Matrix & Gap Analysis
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Turn technical strengths into your <span className="gradient-text-vibrant">competitive edge</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Audit your skills against target job roles, pinpoint critical engineering gaps, and build a focused 8-week mastery roadmap.
          </p>
        </div>

        <SkillGapAnalyzer />
      </section>
    </AppShell>
  );
}