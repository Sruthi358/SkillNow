import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { SummaryCard } from "@/components/SummaryCard";
import { ExpertCard } from "@/components/ExpertCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { currentTicket, matchedExpert } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { Check, RefreshCw, Send, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/user")({
  head: () => ({
    meta: [
      { title: "User Portal · SkillNow" },
      { name: "description", content: "Your AI-generated ticket and matched expert." },
    ],
  }),
  component: UserPortal,
});

function UserPortal() {
  const [matched, setMatched] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMatched(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1500);
  };

  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-10 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground">{currentTicket.id}</p>
            <h1 className="font-display text-2xl font-bold md:text-3xl">{currentTicket.title}</h1>
          </div>
          <StatusBadge status={matched ? "matched" : "open"} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* MAIN */}
          <div className="space-y-6 lg:col-span-2">
            {/* Summary card meta */}
            <div className="glass rounded-2xl p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Issue Title" value={currentTicket.title} />
                <Field label="Expert Category" value={currentTicket.category} />
                <Field label="Priority Level" value={<StatusBadge status={currentTicket.priority} />} />
                <Field label="Created" value="Just now" />
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Technology Stack</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentTicket.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI summary */}
            <div className="relative">
              {regenerating ? (
                <div className="glass flex items-center justify-center rounded-2xl py-12">
                  <LoadingAnimation label="Regenerating summary with latest context..." />
                </div>
              ) : (
                <SummaryCard summary={currentTicket.summary} />
              )}
            </div>

            {/* Previous attempts */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Previous Attempts
              </div>
              <ul className="mt-4 space-y-2.5">
                {currentTicket.attempts.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-foreground/90">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                disabled={!matched}
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Request Help
              </button>
              <button
                onClick={handleRegenerate}
                className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted/30"
              >
                <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                Regenerate Summary
              </button>
            </div>
          </div>

          {/* SIDE */}
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Expert Search</p>
              {!matched ? (
                <div className="mt-4">
                  <LoadingAnimation label="Searching for matching experts..." />
                  <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                    <SearchLine label="Parsing AI conversation" done />
                    <SearchLine label="Extracting stack & context" done />
                    <SearchLine label="Scoring 1,243 experts" />
                  </div>
                </div>
              ) : (
                <div className="mt-2 animate-fade-up">
                  <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> Expert Found
                  </div>
                  <ExpertCard expert={matchedExpert} onRequest={() => undefined} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function SearchLine({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${done ? "bg-success" : "animate-pulse bg-primary"}`}
      />
      <span className={done ? "text-foreground/80 line-through decoration-success/50" : ""}>{label}</span>
    </div>
  );
}
