import { Ticket } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";
import { ArrowRight, Eye } from "lucide-react";

export function TicketCard({
  ticket,
  onAccept,
  onView,
}: {
  ticket: Ticket;
  onAccept?: () => void;
  onView?: () => void;
}) {
  return (
    <div className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{ticket.id}</span>
            <span>·</span>
            <span>{ticket.category}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-snug">{ticket.title}</h3>
        </div>
        <StatusBadge status={ticket.priority} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{ticket.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {ticket.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-border/80 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={onAccept}
          className="bg-gradient-brand inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Accept <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/70"
        >
          <Eye className="h-3.5 w-3.5" /> Details
        </button>
      </div>
    </div>
  );
}
