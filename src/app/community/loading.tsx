

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-5 lg:col-span-3">
            <div className="h-72 rounded-xl bg-gray-200"></div>
            <div className="h-60 rounded-xl bg-gray-200"></div>
          </aside>

          <section className="space-y-6 lg:col-span-9">
            <div className="h-10 w-64 rounded bg-gray-200"></div>

            <div className="h-14 rounded-full bg-gray-200"></div>

            <div className="flex gap-3">
              <div className="h-10 w-24 rounded-full bg-gray-200"></div>
              <div className="h-10 w-24 rounded-full bg-gray-200"></div>
              <div className="h-10 w-24 rounded-full bg-gray-200"></div>
            </div>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border bg-white p-6"
              >
                <div className="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>

                <div className="mb-2 h-4 rounded bg-gray-200"></div>
                <div className="mb-6 h-4 w-5/6 rounded bg-gray-200"></div>

                <div className="flex gap-2">
                  <div className="h-7 w-16 rounded-full bg-gray-200"></div>
                  <div className="h-7 w-16 rounded-full bg-gray-200"></div>
                  <div className="h-7 w-16 rounded-full bg-gray-200"></div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}