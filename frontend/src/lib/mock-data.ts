export type Priority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  title: string;
  stack: string[];
  category: string;
  priority: Priority;
  summary: string;
  attempts: string[];
  createdAt: string;
}

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  experience: string;
  rating: number;
  available: boolean;
}

export const currentTicket: Ticket = {
  id: "SKN-2041",
  title: "Spring Boot container crashes on AWS ECS after deploy",
  stack: ["Docker", "Spring Boot", "AWS ECS", "PostgreSQL"],
  category: "Backend / DevOps",
  priority: "high",
  summary:
    "User deployed a Spring Boot 3.2 service to AWS ECS Fargate. The container exits with code 137 within ~40 seconds of startup. Memory limit is 512MB; JVM is using default heap settings. Logs show 'Killed' before the application finishes booting. Health check is failing on /actuator/health. Previous AI sessions suggested raising memory and tuning -Xmx but the user reports the same crash. Likely OOMKilled due to JVM not respecting container memory limits without -XX:+UseContainerSupport tuning, combined with an aggressive ECS health-check grace period.",
  attempts: [
    "Restarted the ECS service multiple times",
    "Checked CloudWatch logs — saw 'Killed' before app boot",
    "Rebuilt the Docker image with multi-stage build",
    "Increased task memory from 512MB to 1GB",
    "Asked ChatGPT — suggested -Xmx tuning, didn't help",
  ],
  createdAt: new Date().toISOString(),
};

export const matchedExpert: Expert = {
  id: "exp_07",
  name: "Aarav Mehta",
  avatar: "AM",
  skills: ["AWS ECS", "Spring Boot", "Docker", "JVM Tuning"],
  experience: "8 years · ex-AWS Solutions Architect",
  rating: 4.9,
  available: true,
};

export const incomingRequests: Ticket[] = [
  currentTicket,
  {
    id: "SKN-2042",
    title: "Next.js 15 app router cache not invalidating after server action",
    stack: ["Next.js", "React", "Vercel"],
    category: "Frontend",
    priority: "medium",
    summary:
      "Server action mutates DB but client UI still shows stale data after revalidatePath. User has tried revalidateTag and router.refresh.",
    attempts: ["Called revalidatePath", "Called router.refresh()", "Checked fetch cache options"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "SKN-2043",
    title: "Postgres query 40x slower after adding GIN index",
    stack: ["PostgreSQL", "Supabase"],
    category: "Database",
    priority: "urgent",
    summary:
      "GIN index on jsonb column made an unrelated query much slower. EXPLAIN ANALYZE shows planner choosing the GIN index over a much better b-tree.",
    attempts: ["Ran VACUUM ANALYZE", "Dropped and recreated the index", "Tried pg_hint_plan"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "SKN-2044",
    title: "Kubernetes pod stuck in CrashLoopBackOff with no logs",
    stack: ["Kubernetes", "Helm", "GKE"],
    category: "DevOps",
    priority: "high",
    summary: "Pod restarts every ~10 seconds. kubectl logs returns empty. Liveness probe configured on /health.",
    attempts: ["Checked describe pod", "Reviewed Helm values", "Lowered liveness initialDelaySeconds"],
    createdAt: new Date().toISOString(),
  },
];

export const stats = {
  active: 7,
  resolved: 142,
  responseTime: "2m 14s",
  successRate: "96%",
};
