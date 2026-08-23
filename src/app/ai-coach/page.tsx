import AppShell from "@/components/AppShell";

const coachCards = [
  ["Career conversations", "Prepare thoughtful questions and talking points for important moments."],
  ["Practice sessions", "Work through common interview and networking scenarios."],
  ["Next reflection", "Capture what you learned and choose a useful action to take."],
];

export default function AiCoachPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">AI coach</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">A clearer thought partner for work.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Use guided support to prepare, reflect, and move through career decisions with intention.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coachCards.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="font-[var(--font-space-grotesk)] text-lg font-semibold text-[var(--navy)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}