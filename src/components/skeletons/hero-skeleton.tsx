export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-muted animate-pulse">
      <div className="aspect-[21/9] md:aspect-[3/1]">
        <div className="absolute inset-0 bg-gradient-to-r from-muted-foreground/10 via-muted-foreground/5 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-xl space-y-4">
            <div className="h-8 md:h-10 bg-muted-foreground/20 rounded-lg w-3/4" />
            <div className="flex flex-wrap gap-4">
              <div className="h-4 bg-muted-foreground/20 rounded-full w-16" />
              <div className="h-4 bg-muted-foreground/20 rounded-full w-20" />
              <div className="h-4 bg-muted-foreground/20 rounded-full w-24" />
            </div>
            <div className="h-4 bg-muted-foreground/20 rounded-full w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded-full w-full" />
              <div className="h-4 bg-muted-foreground/20 rounded-full w-5/6" />
              <div className="h-4 bg-muted-foreground/20 rounded-full w-4/6" />
            </div>
            <div className="h-10 bg-muted-foreground/20 rounded-lg w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
