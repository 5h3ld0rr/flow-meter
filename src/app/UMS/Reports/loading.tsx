import { GlassCard } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <main className="flex-1">
        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-600" />
              <div className="h-9 w-32 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-900/30" />
            </div>
            <div className="h-60 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/70" />
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-600" />
              <div className="h-9 w-32 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-900/30" />
            </div>
            <div className="h-60 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/70" />
          </GlassCard>

          {/* Top Consumers */}
          <GlassCard className="col-span-2 p-6">
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
