export default function AdminOrdersLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-2 w-20 bg-slate-100 rounded" />
                <div className="h-6 w-48 bg-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="h-2 w-72 bg-slate-100 rounded" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-32 bg-slate-200 rounded-xl" />
            <div className="h-12 w-24 bg-slate-100 rounded-xl" />
            <div className="h-12 w-32 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl" />
              <div className="space-y-2">
                <div className="h-2 w-16 bg-slate-100 rounded" />
                <div className="h-5 w-24 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          <div className="h-2 w-32 bg-slate-100 rounded mx-2" />
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-slate-100 rounded" />
                      <div className="h-3 w-32 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-slate-100 rounded-full" />
                  <div className="h-5 w-24 bg-slate-200 rounded" />
                  <div className="h-10 w-24 bg-slate-50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
