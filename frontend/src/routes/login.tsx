import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  findUserByEmail,
  findExpertByEmail
} from "@/lib/firestore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · SkillNow" },
      { name: "description", content: "Continue to your SkillNow dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"user" | "expert" | "">("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ role?: string; email?: string }>({});

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = role !== "" && emailValid;

  // const handleSubmit = (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { role?: string; email?: string } = {};
    if (!role) newErrors.role = "Select a role";
    if (!email.trim()) newErrors.email = "Email address is required";
    else if (!emailValid) newErrors.email = "Enter a valid email address";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // toast.success("Welcome Back");
    // setTimeout(() => navigate({ to: role === "user" ? "/user" : "/expert" }), 600);
    try {
      if (role === "user") {
    
        // const user = await findUserByEmail(email.trim());
    
        // if (user.length > 0) {
    
        //   localStorage.setItem(
        //     "skillnowUser",
        //     JSON.stringify(user[0])
        //   );
    
        //   toast.success("Welcome Back");
    
        //   setTimeout(() => {
        //     navigate({ to: "/user" });
        //   }, 800);
    
        // } else {
    
        //   toast.error("User not found");
    
        // }

        const user = await findUserByEmail(email.trim());

console.log("USER:", user);

if (user) {

  localStorage.setItem(
    "skillnowUser",
    JSON.stringify(user)
  );

  toast.success("Welcome Back");

  setTimeout(() => {
    navigate({ to: "/user" });
  }, 800);

} else {

  toast.error("User not found");

}
    
      } else {
    
        const expert = await findExpertByEmail(
          email.trim()
        );
    
        if (expert) {
    
          localStorage.setItem(
            "skillnowExpert",
            JSON.stringify(expert)
          );
    
          toast.success("Welcome Back");
    
          setTimeout(() => {
            navigate({ to: "/expert" });
          }, 800);
    
        } else {
    
          toast.error("Expert not found");
    
        }
      }
    
    } catch (error) {
    
      console.error(error);
    
      toast.error(
        "Something went wrong"
      );
    
    }
  };

  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />

      <main className="mx-auto max-w-md px-6 pt-10 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="mt-8">
          <div className="glass-strong rounded-2xl p-8 shadow-glow animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold md:text-3xl">Welcome Back</h1>
              <p className="mt-2 text-sm text-muted-foreground">Continue to SkillNow</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as "user" | "expert")}>
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-destructive focus-visible:ring-destructive" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="bg-gradient-brand w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                Continue
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register-user" className="text-foreground underline-offset-2 hover:underline">
                  Register as User
                </Link>{" "}
                or{" "}
                <Link to="/register-expert" className="text-foreground underline-offset-2 hover:underline">
                  Become an Expert
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
