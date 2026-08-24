import Link from "next/link";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Career Path", href: "/career-path" },
  { label: "Job Tracker", href: "/jobs" },
  { label: "Skills", href: "/skills" },
  { label: "Resume", href: "/resume" },
  { label: "AI Coach", href: "/ai-coach" },
  { label: "System Health", href: "/health" },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/"
            className="font-[var(--font-space-grotesk)] text-xl font-bold tracking-tight text-[var(--navy)]"
          >
            CareerForge
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black transition hover:text-[var(--navy)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--navy-light)]"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-60 border-r border-[var(--border)] bg-[var(--navy)] p-5 md:block">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Workspace
            </p>
            <p className="mt-2 text-sm text-white">
              Build your next career move.
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
  index === 0
    ? "bg-white/10 text-white"
                    : "text-white hover:bg-white/10"
}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>

      <div className="border-t border-[var(--border)] bg-white md:hidden">
        <nav className="mx-auto flex max-w-7xl overflow-x-auto px-4 py-3">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap px-3 py-2 text-sm font-medium text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}