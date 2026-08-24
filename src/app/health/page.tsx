import AppShell from "@/components/AppShell";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type HealthResult = {
  data: Todo | null;
  status: number | null;
  error: string | null;
};

async function getHealthData(): Promise<HealthResult> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        status: response.status,
        error: "The health-check API returned an unsuccessful response.",
      };
    }

    return {
      data: (await response.json()) as Todo,
      status: response.status,
      error: null,
    };
  } catch {
    return {
      data: null,
      status: null,
      error: "The health-check API could not be reached right now.",
    };
  }
}

export default async function HealthPage() {
  const result = await getHealthData();
  const isHealthy = result.error === null;

  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">
            System monitor
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            CareerForge System Health
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black">
            A quick view of the services supporting your CareerForge workspace.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
              API status
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${isHealthy ? "bg-[var(--success)]" : "bg-[var(--error)]"}`}
                aria-hidden="true"
              />
              <p className="font-[var(--font-space-grotesk)] text-2xl font-semibold text-[var(--navy)]">
                {isHealthy ? "Operational" : "Unavailable"}
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-black">
              {isHealthy ? "The public data endpoint responded successfully." : result.error}
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
              HTTP/data response
            </p>
            <p className="mt-4 font-[var(--font-space-grotesk)] text-2xl font-semibold text-[var(--navy)]">
              {result.status ? `${result.status} ${isHealthy ? "OK" : "Error"}` : "No response"}
            </p>
            <p className="mt-3 text-sm leading-6 text-black">
              {isHealthy ? "Todo data was received and parsed." : "No usable data was received."}
            </p>
          </article>
        </div>

        <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black">
                Fetched todo data
              </p>
              <h2 className="mt-2 font-[var(--font-space-grotesk)] text-xl font-semibold text-[var(--navy)]">
                Public API payload
              </h2>
            </div>
            <span className="w-fit rounded-full bg-[var(--background)] px-3 py-1 text-xs font-medium text-black">
              /todos/1
            </span>
          </div>

          {result.data ? (
            <dl className="mt-6 grid gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-black">Title</dt>
                <dd className="mt-2 text-sm leading-6 text-[var(--navy)]">{result.data.title}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-black">Todo ID</dt>
                <dd className="mt-2 text-sm text-[var(--navy)]">{result.data.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-black">Completed</dt>
                <dd className="mt-2 text-sm text-[var(--navy)]">{result.data.completed ? "Yes" : "No"}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--error)]">
              Todo data is temporarily unavailable. Please try the health check again later.
            </p>
          )}
        </article>
      </section>
    </AppShell>
  );
}