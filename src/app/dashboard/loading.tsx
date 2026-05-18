function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="mb-5 h-11 w-11 animate-pulse rounded-xl bg-[#F8FAFC]" />
      <div className="h-4 w-24 animate-pulse rounded-full bg-[#F8FAFC]" />
      <div className="mt-3 h-8 w-20 animate-pulse rounded-full bg-[#F8FAFC]" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="app-container grid gap-7 py-8 sm:py-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:block">
        <div className="h-10 w-36 animate-pulse rounded-full bg-[#F8FAFC]" />
        <div className="mt-8 space-y-3">
          <div className="h-10 animate-pulse rounded-xl bg-[#F8FAFC]" />
          <div className="h-10 animate-pulse rounded-xl bg-[#F8FAFC]" />
          <div className="h-10 animate-pulse rounded-xl bg-[#F8FAFC]" />
          <div className="h-10 animate-pulse rounded-xl bg-[#F8FAFC]" />
        </div>
      </aside>
      <section className="space-y-6">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="h-5 w-28 animate-pulse rounded-full bg-[#F8FAFC]" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-[#F8FAFC]" />
          <div className="mt-4 h-4 max-w-xl animate-pulse rounded-full bg-[#F8FAFC]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-80 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="h-full animate-pulse rounded-2xl bg-[#F8FAFC]" />
          </div>
          <div className="h-80 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="h-full animate-pulse rounded-2xl bg-[#F8FAFC]" />
          </div>
        </div>
      </section>
    </main>
  );
}
