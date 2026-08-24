import AppShell from "@/components/AppShell";

const milestones = [
  ["Current position", "Map your experience and clarify where you are today."],
  ["Next milestone", "Define the role, level, or transition you want to reach."],
  ["Progress plan", "Turn your direction into focused actions and checkpoints."],
];

export default function CareerPathPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">
            Career direction
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            Shape your next career move.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black">
            Build a clear path from your current experience to the work you want next.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="font-[var(--font-space-grotesk)] text-lg font-semibold text-[var(--navy)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-black">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}