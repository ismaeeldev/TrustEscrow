export default function StatusLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-lg space-y-8 animate-pulse">
        
        {/* Brand Header Skeleton */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>

        {/* Card Skeleton */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="bg-[#0F172A] p-8 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-48 bg-slate-700 rounded-lg" />
              <div className="h-6 w-24 bg-slate-800 rounded-full" />
            </div>
            <div className="h-3 w-32 bg-slate-800 rounded" />
          </div>

          <div className="p-8 space-y-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl border-2 border-slate-100" />
                <div className="space-y-3 mt-1">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-2 w-48 bg-slate-100 rounded" />
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="h-16 bg-slate-50 rounded-xl" />
              <div className="h-16 bg-slate-50 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-center gap-6 opacity-20">
          <div className="h-3 w-20 bg-slate-300 rounded" />
          <div className="h-3 w-20 bg-slate-300 rounded" />
        </div>
      </div>
    </div>
  );
}
