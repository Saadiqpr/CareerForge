import AppShell from "@/components/AppShell";

const profileCards = [
  ["Career snapshot", "Keep your goals, interests, and experience current."],
  ["Preferences", "Set the work environments and opportunities that fit you best."],
  ["Personal story", "Shape the short introduction you want to bring to every conversation."],
];

export default function ProfilePage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">Your profile</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">Keep your career story ready.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Bring your goals and experience together so every part of CareerForge stays relevant to you.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profileCards.map(([title, description]) => (
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