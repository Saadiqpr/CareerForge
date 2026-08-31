import AppShell from "@/components/AppShell";
import ResumeOptimizer from "@/components/resume/ResumeOptimizer";
import { FileText } from "lucide-react";

export default function ResumePage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <FileText className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              ATS Resume Studio
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Make your engineering impact <span className="gradient-text-vibrant">impossible to ignore</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Elevate bullet points into high-impact, ATS-optimized statements that demonstrate clear technical depth and quantifiable metrics.
          </p>
        </div>

        <ResumeOptimizer />
      </section>
    </AppShell>
  );
}