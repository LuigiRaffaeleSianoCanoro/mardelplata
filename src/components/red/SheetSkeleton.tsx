// Skeleton primitives for the bottom sheets — matches the rhythm of
// ProjectSheet/IdeaSheet so the swap from skeleton to real content doesn't
// reflow noticeably.

const Bar = ({ w, h = 14 }: { w: string; h?: number }) => (
  <div
    className="rounded-md bg-white/[0.06] animate-pulse"
    style={{ width: w, height: h }}
  />
);

export function SheetHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Bar w="60px" h={10} />
        <span className="text-white/15">·</span>
        <Bar w="100px" h={10} />
      </div>
      <Bar w="60%" h={32} />
      <div className="flex items-center gap-5">
        <Bar w="80px" h={12} />
        <Bar w="80px" h={12} />
        <Bar w="60px" h={12} />
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <Bar w="72px" h={28} />
          <Bar w="84px" h={28} />
        </div>
      </div>
    </div>
  );
}

export function SheetToolbarSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded-md bg-white/[0.04] animate-pulse"
          style={{ width: 96 + (i % 2) * 16, height: 22 }}
        />
      ))}
    </div>
  );
}

export function SheetBodySkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <Bar w="40%" h={10} />
          <Bar w="100%" />
          <Bar w="92%" />
          <Bar w="80%" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Bar w="50%" h={10} />
              <Bar w="80%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
