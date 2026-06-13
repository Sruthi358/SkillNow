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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register-user")({
  head: () => ({
    meta: [
      { title: "Join SkillNow · User Registration" },
      { name: "description", content: "Create your SkillNow profile and get expert help faster." },
    ],
  }),
  component: UserRegistration,
});

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  profession: string;
  userType: "technical" | "non-technical" | "";
}

function UserRegistration() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    profession: "",
    userType: "technical",
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const requiredOk =
    formData.name.trim().length > 0 &&
    emailValid &&
    formData.phone.trim().length > 0;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!emailValid) newErrors.email = "Enter a valid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      profession: formData.profession,
      userType: formData.userType,
    };

    console.log("[Firebase-ready] User Registration:", payload);
    toast.success("User Registered Successfully");
    setTimeout(() => navigate({ to: "/user" }), 800);
  };

  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />

      <main className="mx-auto max-w-xl px-6 pt-10 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="mt-8">
          <div className="glass-strong rounded-2xl p-8 shadow-glow animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold md:text-3xl">Join SkillNow</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your profile and get expert help faster.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Select
                  value={formData.profession}
                  onValueChange={(value) => setFormData((p) => ({ ...p, profession: value }))}
                >
                  <SelectTrigger id="profession">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="working-professional">Working Professional</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>User Type</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, userType: value as "technical" | "non-technical" }))
                  }
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical" className="cursor-pointer text-sm font-normal">
                      Technical User
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                    <RadioGroupItem value="non-technical" id="non-technical" />
                    <Label htmlFor="non-technical" className="cursor-pointer text-sm font-normal">
                      Non-Technical User
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                disabled={!requiredOk}
                className="bg-gradient-brand w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                Continue
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
