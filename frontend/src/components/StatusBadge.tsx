import { cn } from "@/lib/utils";

type Status = "open" | "matched" | "in_progress" | "resolved" | "urgent" | "high" | "medium" | "low";

const styles: Record<Status, string> = {
  open: "bg-primary/15 text-primary border-primary/30",
  matched: "bg-success/15 text-success border-success/30",
  in_progress: "bg-warning/15 text-warning border-warning/30",
  resolved: "bg-success/15 text-success border-success/30",
  urgent: "bg-destructive/15 text-destructive border-destructive/40",
  high: "bg-destructive/15 text-destructive border-destructive/40",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-success/15 text-success border-success/30",
};

const labels: Record<Status, string> = {
  open: "Open",
  matched: "Expert Matched",
  in_progress: "In Progress",
  resolved: "Resolved",
  urgent: "Urgent",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
