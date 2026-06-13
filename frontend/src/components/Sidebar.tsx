import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Inbox, History, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "active", label: "Active Requests", icon: Inbox },
  { id: "history", label: "History", icon: History },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const [active, setActive] = useState("dashboard");
  return (
    <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-2xl p-4 lg:flex">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2">
        <div className="bg-gradient-brand flex h-8 w-8 items-center justify-center rounded-lg shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-semibold">
          Skill<span className="text-gradient-brand">Now</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      <div className="glass-strong rounded-xl p-3 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Expert Mode</p>
        <p className="mt-1">You're online and matchable.</p>
      </div>
    </aside>
  );
}
