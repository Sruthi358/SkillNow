import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { TicketCard } from "@/components/TicketCard";
import { StatusBadge } from "@/components/StatusBadge";
import { SummaryCard } from "@/components/SummaryCard";
import { incomingRequests, stats, Ticket } from "@/lib/mock-data";
import { Activity, CheckCircle2, Clock, TrendingUp, X, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/expert")({
  head: () => ({
    meta: [
      { title: "Expert Dashboard · SkillNow" },
      { name: "description", content: "View and accept incoming expert requests." },
    ],
  }),
  component: ExpertDashboard,
});

function ExpertDashboard() {
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [available, setAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-hero-glow">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4">
        <Sidebar />

        <div className="min-w-0 flex-1">
          {/* Top Header */}
          <header className="glass mb-6 flex items-center justify-between rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground lg:hidden">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <p className="font-display text-base font-semibold">Aarav Mehta</p>
              </div>
            </div>
            <button
              onClick={() => setAvailable((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                available
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              {available ? "Available" : "Away"}
            </button>
          </header>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Activity} label="Active Requests" value={stats.active.toString()} accent="text-primary" />
            <StatCard icon={CheckCircle2} label="Resolved Issues" value={stats.resolved.toString()} accent="text-success" />
            <StatCard icon={Clock} label="Response Time" value={stats.responseTime} accent="text-warning" />
            <StatCard icon={TrendingUp} label="Success Rate" value={stats.successRate} accent="text-gradient-brand" />
          </div>

          {/* Incoming */}
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Incoming Requests</h2>
                <p className="text-sm text-muted-foreground">Pre-summarized by AI · ready to accept</p>
              </div>
              <span className="text-xs text-muted-foreground">{incomingRequests.length} pending</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {incomingRequests.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  onAccept={() => setSelected(t)}
                  onView={() => setSelected(t)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {selected && <RequestModal ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <p className={`font-display mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function RequestModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="glass-strong relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs font-mono text-muted-foreground">{ticket.id}</p>
        <h3 className="font-display mt-1 text-xl font-bold">{ticket.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.priority} />
          <span className="text-xs text-muted-foreground">{ticket.category}</span>
        </div>

        <div className="mt-6">
          <SummaryCard summary={ticket.summary} />
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Technology Stack</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ticket.stack.map((s) => (
              <span key={s} className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Previous Attempts</p>
          <ul className="mt-3 space-y-2">
            {ticket.attempts.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                  <Check className="h-3 w-3" />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your Suggested Resolution</p>
          <textarea
            placeholder="Walk the user through your fix..."
            className="mt-2 h-32 w-full resize-none rounded-xl border border-border bg-muted/30 p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-muted/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/60"
          >
            Cancel
          </button>
          <button className="bg-gradient-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
}
