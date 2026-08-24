import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">
            Career workspace
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            Build a career you can prove.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-black">
            CareerForge brings your goals, skills, applications, resume,
            and career progress into one focused workspace.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Career Progress", "Track where you are and what comes next."],
            ["Skill Development", "Identify gaps and build relevant skills."],
            ["Job Opportunities", "Keep your applications organized."],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
            >
              <h2 className="font-[var(--font-space-grotesk)] text-lg font-semibold text-[var(--navy)]">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-black">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}