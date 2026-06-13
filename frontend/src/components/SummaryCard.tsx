import { Sparkles } from "lucide-react";

export function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-brand shadow-glow">
      <div className="rounded-[calc(theme(borderRadius.2xl)-1px)] bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Generated Summary
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{summary}</p>
      </div>
    </div>
  );
}
