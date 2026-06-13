import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  Zap,
  Brain,
  Users,
  Rocket,
  MousePointerClick,
  Workflow,
  Chrome,
  Cpu,
  UserCheck,
  User as UserIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillNow — Turn failed AI conversations into expert help" },
      {
        name: "description",
        content:
          "SkillNow eliminates explanation fatigue. Transform troubleshooting history into structured expert-ready tickets and connect with the right human expert in seconds.",
      },
      { property: "og:title", content: "SkillNow — From stuck to solved" },
      {
        property: "og:description",
        content:
          "AI-powered context transfer that connects you with the right human expert — instantly.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Zap, title: "Get Stuck", desc: "Your AI assistant keeps going in circles." },
  {
    icon: MousePointerClick,
    title: "Click SkillNow",
    desc: "One click in your browser extension.",
  },
  {
    icon: Brain,
    title: "AI Understands Context",
    desc: "We extract your full troubleshooting history.",
  },
  {
    icon: UserCheck,
    title: "Connect With Expert",
    desc: "Matched to a human expert who already knows the problem.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Zero Re-Explanation",
    desc: "Stop retyping your problem. We package the whole story for the expert.",
  },
  {
    icon: Brain,
    title: "AI-Powered Context Extraction",
    desc: "Pulls signal from chats, logs, and attempts into a clean ticket.",
  },
  {
    icon: Users,
    title: "Smart Expert Matching",
    desc: "Routed to the human who's solved this exact stack before.",
  },
  {
    icon: Rocket,
    title: "Faster Resolution",
    desc: "Average time-to-fix drops by 4× when context is preserved.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Transfer",
    desc: "From browser to expert with a single click — no copy-paste.",
  },
  {
    icon: Workflow,
    title: "Human + AI Collaboration",
    desc: "AI does triage. Humans do the hard parts. Together, faster.",
  },
];

const flow = [
  { icon: UserIcon, label: "User" },
  { icon: Chrome, label: "Browser Extension" },
  { icon: Cpu, label: "AI Processing Engine" },
  { icon: Users, label: "Expert Matching" },
  { icon: UserCheck, label: "Human Expert" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32 md:pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-float [animation-delay:1.5s]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl animate-fade-up [animation-delay:80ms]">
            Turn Failed AI Conversations
            <br />
            Into <span className="text-gradient-brand">Expert Assistance</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up [animation-delay:160ms]">
            Eliminate explanation fatigue by transforming troubleshooting history into structured,
            expert-ready tickets. Skip the back-and-forth. Skip to the fix.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up [animation-delay:240ms]">
            <Link
              to="/user"
              className="bg-gradient-brand group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Try SkillNow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/expert"
              className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/30"
            >
              Become an Expert
            </Link>
          </div>

          {/* Hero preview card */}
          <div className="relative mx-auto mt-20 max-w-3xl animate-fade-up [animation-delay:320ms]">
            <div className="glass-strong rounded-2xl p-6 text-left shadow-glow">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">SKN-2041 · just now</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Expert Matched
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                Spring Boot container crashes on AWS ECS after deploy
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI summary extracted from 47 messages, 12 attempts, and CloudWatch logs. Routed to
                Aarav M., 8y AWS.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Docker", "Spring Boot", "AWS ECS", "JVM"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">
              From stuck to solved in 4 steps
            </h2>
          </div>

          <div className="relative mt-16 grid gap-6 md:grid-cols-4">
            <div className="absolute inset-x-12 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="glass relative rounded-2xl p-6 text-center">
                  <div className="bg-gradient-brand mx-auto flex h-12 w-12 items-center justify-center rounded-xl shadow-glow">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="mt-3 text-xs font-mono text-muted-foreground">STEP {i + 1}</div>
                  <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Features</p>
            <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">
              Everything you need to skip the explanation
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Architecture
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">How context flows</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Every step preserves the full picture, so the human expert sees what the AI saw.
            </p>
          </div>

          <div className="glass-strong mt-14 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-2">
              {flow.map((node, i) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.label}
                    className="flex flex-col items-center gap-4 md:flex-row md:gap-2"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-brand flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <p className="mt-3 text-sm font-medium">{node.label}</p>
                    </div>
                    {i < flow.length - 1 && (
                      <ArrowRight className="hidden h-5 w-5 text-primary/60 md:block" />
                    )}
                    {i < flow.length - 1 && (
                      <div className="block h-6 w-px bg-primary/40 md:hidden" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center shadow-glow">
            <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
            <h2 className="font-display relative text-3xl font-bold md:text-4xl">
              Stop explaining. Start solving.
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
              Try the demo and see how SkillNow turns a tangled AI thread into a clean expert-ready
              ticket.
            </p>
            <div className="relative mt-8 flex justify-center gap-3">
              <Link
                to="/user"
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Launch Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/expert"
                className="glass inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Expert View
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
