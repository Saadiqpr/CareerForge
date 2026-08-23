import AppShell from "@/components/AppShell";

const jobCards = [
  ["Saved opportunities", "Collect roles that match your direction in one place."],
  ["Application pipeline", "See which applications need attention and what comes next."],
  ["Search criteria", "Keep your preferred roles, locations, and work styles close at hand."],
];

export default function JobsPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">Job tracker</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">Keep every opportunity moving.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Organize your search and stay ready for the right next conversation.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobCards.map(([title, description]) => (
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