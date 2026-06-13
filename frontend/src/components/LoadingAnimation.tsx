export function LoadingAnimation({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring [animation-delay:600ms]" />
        <span className="absolute inset-2 rounded-full bg-gradient-brand shadow-glow" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
