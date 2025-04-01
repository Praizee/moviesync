export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted-foreground/10" />
          <div className="h-4 w-3/4 rounded-full bg-muted-foreground/10" />
          <div className="h-3 w-1/2 rounded-full bg-muted-foreground/10" />
        </div>
      ))}
    </div>
  );
}
