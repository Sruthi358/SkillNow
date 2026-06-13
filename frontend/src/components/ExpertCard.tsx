import { Expert } from "@/lib/mock-data";
import { Star } from "lucide-react";

export function ExpertCard({ expert, onRequest }: { expert: Expert; onRequest?: () => void }) {
  return (
    <div className="glass-strong rounded-2xl p-6 animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-brand flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-primary-foreground shadow-glow">
          {expert.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">{expert.name}</h3>
            <span className="inline-flex items-center gap-1 text-sm text-warning">
              <Star className="h-4 w-4 fill-current" /> {expert.rating}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{expert.experience}</p>
          {expert.available && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Available now
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {expert.skills.map((s) => (
          <span
            key={s}
            className="rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary"
          >
            {s}
          </span>
        ))}
      </div>

      {onRequest && (
        <button
          onClick={onRequest}
          className="bg-gradient-brand mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          Request Help
        </button>
      )}
    </div>
  );
}
