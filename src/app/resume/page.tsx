import AppShell from "@/components/AppShell";

const resumeCards = [
  ["Resume workspace", "Keep a focused version of your experience ready to refine."],
  ["Impact statements", "Develop concise evidence of the value you have created."],
  ["Tailored versions", "Prepare future variations for the roles you care about most."],
];

export default function ResumePage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">Resume studio</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">Make your experience easy to see.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Build a resume that connects your work, strengths, and next opportunity.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resumeCards.map(([title, description]) => (
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