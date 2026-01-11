import { GlassCard } from "@/components/ui";

export default function Loading() {
  return (
    <>
      {/* Header */}
      <GlassCard className="p-3 md:p-4 mb-4 md:mb-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="h-7 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
              <div className="mt-2 h-4 w-52 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
      </GlassCard>

      <main className="flex-1">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
                <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
              </div>
              <div className="mt-5 h-12 w-32 animate-pulse rounded-lg bg-slate-400 dark:bg-slate-500" />
              <div className="mt-3 h-4 w-20 animate-pulse rounded bg-green-200 dark:bg-green-900/40" />
            </GlassCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Consumption Chart */}
          <GlassCard className="col-span-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-600" />
              <div className="h-9 w-32 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-900/30" />
            </div>
            <div className="h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/70" />
          </GlassCard>

          {/* Top Consumers */}
          <GlassCard className="p-6">
            <div className="mb-5 h-7 w-40 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-600" />
            <div className="space-y-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-green-200 dark:bg-green-900/40" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </>
  );
}
