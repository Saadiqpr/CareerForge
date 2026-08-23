import AppShell from "@/components/AppShell";

const skillCards = [
  ["Skill inventory", "Capture the strengths and capabilities you already bring."],
  ["Growth areas", "Spot the skills that could make your next step more achievable."],
  ["Learning focus", "Keep the courses, practice, and projects that build momentum together."],
];

export default function SkillsPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">Skill development</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">Turn strengths into your edge.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Understand what you know, what to learn, and how to show your progress.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCards.map(([title, description]) => (
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