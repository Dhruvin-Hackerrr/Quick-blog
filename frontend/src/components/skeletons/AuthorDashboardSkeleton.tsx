import Skeleton from "../../ui/Skeleton";

export default function AuthorDashboardSkeleton() {
  return (
    <div className="h-screen bg-(--bg) flex p-10 text-(--text) overflow-hidden">
      <div className="flex-1 p-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#111827] via-[#0f172a] to-[#1e293b] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-4 w-120" />
            </div>

            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-(--bg) border border-(--border) rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-8 w-14" />
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-(--surface) border border-(--border) rounded-(--radius) overflow-hidden">
          {/* TABLE HEADER */}
          <div className="p-4 flex justify-between items-center border-b border-(--border)">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* TABLE HEAD */}
          <div className="grid grid-cols-7 gap-4 px-4 py-5 border-b border-(--border)">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>

          {/* TABLE BODY */}
          <div className="divide-y divide-(--border)">
            {Array.from({ length: 6 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-7 gap-4 px-4 py-5 items-center"
              >
                <Skeleton className="h-4 w-6" />

                <Skeleton className="h-4 w-52" />

                <Skeleton className="h-7 w-28 rounded-full" />

                <Skeleton className="h-4 w-24" />

                <Skeleton className="h-4 w-24" />

                <Skeleton className="h-7 w-24 rounded-full" />

                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}