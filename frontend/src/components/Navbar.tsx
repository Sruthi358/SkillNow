import { Link } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-brand flex h-8 w-8 items-center justify-center rounded-lg shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Skill<span className="text-gradient-brand">Now</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="/#how" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="/#architecture" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Architecture</a>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/register-user"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Register as User
            </Link>
            <Link
              to="/register-expert"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Become an Expert
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Login
            </Link>
            <Link
              to="/user"
              className="bg-gradient-brand inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Try SkillNow
            </Link>
          </div>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground sm:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="glass mt-2 rounded-2xl p-4 sm:hidden animate-fade-up">
            <div className="flex flex-col gap-2">
              <a href="/#how" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">How it works</a>
              <a href="/#features" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">Features</a>
              <a href="/#architecture" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">Architecture</a>
              <div className="my-1 h-px bg-border/60" />
              <Link to="/register-user" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">Register as User</Link>
              <Link to="/register-expert" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">Become an Expert</Link>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">Login</Link>
              <Link
                to="/user"
                className="bg-gradient-brand mt-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"
              >
                Try SkillNow
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
