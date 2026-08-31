import AppShell from "@/components/AppShell";
import ChatContainer from "@/components/ai-coach/ChatContainer";
import { Bot } from "lucide-react";

export default function AiCoachPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <Bot className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
              Live AI Mentorship & Strategy
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A strategic thought partner for your <span className="gradient-text-vibrant">engineering career</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Rehearse technical and behavioral interviews, optimize resumes, and resolve challenging career decisions in real time with Claude.
          </p>
        </div>

        <ChatContainer />
      </section>
    </AppShell>
  );
}