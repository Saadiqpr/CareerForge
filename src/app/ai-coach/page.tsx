import AppShell from "@/components/AppShell";
import ChatContainer from "@/components/ai-coach/ChatContainer";

export default function AiCoachPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">
            AI coach
          </p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">
            A clearer thought partner for work.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/80">
            Use real-time interactive coaching to prepare for interviews, optimize your resume, and navigate strategic career decisions with confidence.
          </p>
        </div>

        <ChatContainer />
      </section>
    </AppShell>
  );
}