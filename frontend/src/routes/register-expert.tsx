import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, X, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { registerExpert } from "@/lib/firestore";

export const Route = createFileRoute("/register-expert")({
  head: () => ({
    meta: [
      { title: "Become an Expert · SkillNow" },
      { name: "description", content: "Join SkillNow as an expert and help others solve problems." },
    ],
  }),
  component: ExpertRegistration,
});

const technicalSkills = [
  "React", "Java", "Spring Boot", "Node.js", "Python", "Docker", "Kubernetes",
  "AWS", "Firebase", "MongoDB", "PostgreSQL", "MySQL", "Machine Learning",
  "Artificial Intelligence", "Git & GitHub", "Android Development", "Web Development",
];

const nonTechnicalExpertise = [
  "Resume Review", "Interview Preparation", "Career Guidance", "Communication Skills",
  "Public Speaking", "Startup Mentoring", "Business Planning", "Presentation Design",
  "Documentation Support", "Project Guidance",
];

const availabilityOptions = ["Available Now", "Evening Only", "Weekends", "Part Time"];
const experienceOptions = ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"];

interface SkillEntry {
  name: string;
  experience: string;
}

interface ExpertFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  expertType: "technical" | "non-technical";
  skills: SkillEntry[];
  customSkills: SkillEntry[];
  expertise: SkillEntry[];
  availability: string[];
}

function ExperienceSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {experienceOptions.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all " +
              (active
                ? "bg-gradient-brand border-transparent text-primary-foreground shadow-glow"
                : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground")
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ExpertRegistration() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const [formData, setFormData] = useState<ExpertFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    expertType: "technical",
    skills: [],
    customSkills: [],
    expertise: [],
    availability: [],
  });

  const isTech = formData.expertType === "technical";

  const requiredOk = useMemo(() => {
    const baseOk =
      formData.name.trim() &&
      formData.phone.trim() &&
      formData.city.trim() &&
      formData.availability.length > 0;
    if (!baseOk) return false;
    if (isTech) {
      const total = formData.skills.length + formData.customSkills.length;
      if (total === 0) return false;
      const allRated = [...formData.skills, ...formData.customSkills].every((s) => s.experience);
      return allRated;
    }
    if (formData.expertise.length === 0) return false;
    return formData.expertise.every((s) => s.experience);
  }, [formData, isTech]);

  const toggleSkill = (name: string) => {
    setFormData((p) => {
      const exists = p.skills.find((s) => s.name === name);
      const skills = exists ? p.skills.filter((s) => s.name !== name) : [...p.skills, { name, experience: "" }];
      return { ...p, skills };
    });
  };

  const toggleExpertise = (name: string) => {
    setFormData((p) => {
      const exists = p.expertise.find((s) => s.name === name);
      const expertise = exists ? p.expertise.filter((s) => s.name !== name) : [...p.expertise, { name, experience: "" }];
      return { ...p, expertise };
    });
  };

  const updateSkillExp = (name: string, exp: string) => {
    setFormData((p) => ({
      ...p,
      skills: p.skills.map((s) => (s.name === name ? { ...s, experience: exp } : s)),
    }));
  };

  const updateCustomExp = (name: string, exp: string) => {
    setFormData((p) => ({
      ...p,
      customSkills: p.customSkills.map((s) => (s.name === name ? { ...s, experience: exp } : s)),
    }));
  };

  const updateExpertiseExp = (name: string, exp: string) => {
    setFormData((p) => ({
      ...p,
      expertise: p.expertise.map((s) => (s.name === name ? { ...s, experience: exp } : s)),
    }));
  };

  const addCustomSkill = () => {
    const name = customInput.trim();
    if (!name) return;
    const dup = [...formData.skills, ...formData.customSkills].some(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    if (dup) {
      toast.error("Skill already added");
      return;
    }
    setFormData((p) => ({ ...p, customSkills: [...p.customSkills, { name, experience: "" }] }));
    setCustomInput("");
  };

  const removeCustomSkill = (name: string) => {
    setFormData((p) => ({ ...p, customSkills: p.customSkills.filter((s) => s.name !== name) }));
  };

  const saveEditCustom = (idx: number) => {
    const newName = editingValue.trim();
    if (!newName) return;
    setFormData((p) => ({
      ...p,
      customSkills: p.customSkills.map((s, i) => (i === idx ? { ...s, name: newName } : s)),
    }));
    setEditingIdx(null);
    setEditingValue("");
  };

  const toggleAvailability = (option: string) => {
    setFormData((p) => {
      const exists = p.availability.includes(option);
      const availability = exists ? p.availability.filter((a) => a !== option) : [...p.availability, option];
      return { ...p, availability };
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (formData.availability.length === 0) e.availability = "Select at least one availability option";
    if (isTech) {
      if (formData.skills.length + formData.customSkills.length === 0)
        e.skills = "Select or add at least one skill";
    } else if (formData.expertise.length === 0) {
      e.expertise = "Select at least one expertise";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // const handleSubmit = (event: React.FormEvent) => {
    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    // const payload = {
    //   name: formData.name.trim(),
    //   email: formData.email.trim(),
    //   phone: formData.phone.trim(),
    //   city: formData.city.trim(),
    //   expertType: formData.expertType,
    //   skills: isTech ? formData.skills : [],
    //   customSkills: isTech ? formData.customSkills : [],
    //   expertise: isTech ? [] : formData.expertise,
    //   availability: formData.availability,
    // };

    // console.log("[Firebase-ready] Expert Registration:", payload);
    // toast.success("Expert Registered Successfully");
    // setTimeout(() => navigate({ to: "/expert" }), 800);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
    
      expertType: formData.expertType,
    
      skills: isTech ? formData.skills : [],
    
      customSkills: isTech
        ? formData.customSkills
        : [],
    
      expertise: isTech
        ? []
        : formData.expertise,
    
      availability: formData.availability,
    };
    
    try {
      await registerExpert(payload);
    
      toast.success(
        "Expert Registered Successfully"
      );
    
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1000);
    
    } catch (error) {
      console.error(error);
    
      toast.error(
        "Failed to Register Expert"
      );
    }
  };

  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pt-10 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="mt-8">
          <div className="glass-strong rounded-2xl p-8 shadow-glow animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold md:text-3xl">Become a SkillNow Expert</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Help others solve problems using your expertise.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ex-name">Full Name</Label>
                <Input
                  id="ex-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ex-phone">Phone Number</Label>
                  <Input
                    id="ex-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ex-email">
                    Email Address <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="ex-email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ex-city">City</Label>
                <Input
                  id="ex-city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-3">
                <Label>Expert Category</Label>
                <RadioGroup
                  value={formData.expertType}
                  onValueChange={(value) =>
                    setFormData((p) => ({
                      ...p,
                      expertType: value as "technical" | "non-technical",
                      skills: [],
                      customSkills: [],
                      expertise: [],
                    }))
                  }
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                    <RadioGroupItem value="technical" id="ex-technical" />
                    <Label htmlFor="ex-technical" className="cursor-pointer text-sm font-normal">
                      Technical Expert
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                    <RadioGroupItem value="non-technical" id="ex-non-technical" />
                    <Label htmlFor="ex-non-technical" className="cursor-pointer text-sm font-normal">
                      Non-Technical Expert
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {isTech ? (
                <>
                  <div className="space-y-3">
                    <Label>Skills</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {technicalSkills.map((skill) => {
                        const checked = !!formData.skills.find((s) => s.name === skill);
                        return (
                          <div
                            key={skill}
                            className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 transition-colors hover:bg-muted/30"
                          >
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={checked}
                              onCheckedChange={() => toggleSkill(skill)}
                            />
                            <Label htmlFor={`skill-${skill}`} className="cursor-pointer text-xs font-normal">
                              {skill}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {errors.skills && <p className="text-xs text-destructive">{errors.skills}</p>}
                  </div>

                  {(formData.skills.length > 0 || formData.customSkills.length > 0) && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Selected</Label>
                      <div className="flex flex-wrap gap-2">
                        {[...formData.skills, ...formData.customSkills].map((s) => (
                          <span
                            key={s.name}
                            className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                          >
                            {s.name}
                            <button
                              type="button"
                              onClick={() =>
                                formData.skills.find((x) => x.name === s.name)
                                  ? toggleSkill(s.name)
                                  : removeCustomSkill(s.name)
                              }
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${s.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.skills.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-border/40 bg-muted/10 p-4">
                      <Label className="text-sm">Skill Experience</Label>
                      <div className="space-y-3">
                        {formData.skills.map((s) => (
                          <div key={s.name} className="space-y-1.5">
                            <p className="text-xs font-medium text-foreground">{s.name} Experience</p>
                            <ExperienceSelector
                              value={s.experience}
                              onChange={(v) => updateSkillExp(s.name, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Other Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Skill"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSkill();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addCustomSkill}
                        className="bg-gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-primary-foreground shadow-glow"
                      >
                        <Plus className="h-4 w-4" /> Add Skill
                      </Button>
                    </div>

                    {formData.customSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.customSkills.map((s, idx) => (
                          <span
                            key={`${s.name}-${idx}`}
                            className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                          >
                            {editingIdx === idx ? (
                              <>
                                <input
                                  autoFocus
                                  className="w-24 bg-transparent text-xs outline-none"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      saveEditCustom(idx);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => saveEditCustom(idx)}
                                  className="text-success"
                                  aria-label="Save"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              </>
                            ) : (
                              <>
                                {s.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingIdx(idx);
                                    setEditingValue(s.name);
                                  }}
                                  className="text-muted-foreground transition-colors hover:text-foreground"
                                  aria-label="Edit"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeCustomSkill(s.name)}
                                  className="text-muted-foreground transition-colors hover:text-destructive"
                                  aria-label="Remove"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {formData.customSkills.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-border/40 bg-muted/10 p-4">
                      <Label className="text-sm">Custom Skill Experience</Label>
                      <div className="space-y-3">
                        {formData.customSkills.map((s) => (
                          <div key={s.name} className="space-y-1.5">
                            <p className="text-xs font-medium text-foreground">{s.name} Experience</p>
                            <ExperienceSelector
                              value={s.experience}
                              onChange={(v) => updateCustomExp(s.name, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label>Expertise</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {nonTechnicalExpertise.map((item) => {
                        const checked = !!formData.expertise.find((s) => s.name === item);
                        return (
                          <div
                            key={item}
                            className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 transition-colors hover:bg-muted/30"
                          >
                            <Checkbox
                              id={`exp-${item}`}
                              checked={checked}
                              onCheckedChange={() => toggleExpertise(item)}
                            />
                            <Label htmlFor={`exp-${item}`} className="cursor-pointer text-xs font-normal">
                              {item}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {errors.expertise && <p className="text-xs text-destructive">{errors.expertise}</p>}
                  </div>

                  {formData.expertise.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Selected</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.expertise.map((s) => (
                          <span
                            key={s.name}
                            className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                          >
                            {s.name}
                            <button
                              type="button"
                              onClick={() => toggleExpertise(s.name)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${s.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.expertise.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-border/40 bg-muted/10 p-4">
                      <Label className="text-sm">Expertise Experience</Label>
                      <div className="space-y-3">
                        {formData.expertise.map((s) => (
                          <div key={s.name} className="space-y-1.5">
                            <p className="text-xs font-medium text-foreground">{s.name} Experience</p>
                            <ExperienceSelector
                              value={s.experience}
                              onChange={(v) => updateExpertiseExp(s.name, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-3">
                <Label>Availability</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {availabilityOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 transition-colors hover:bg-muted/30"
                    >
                      <Checkbox
                        id={`avail-${option}`}
                        checked={formData.availability.includes(option)}
                        onCheckedChange={() => toggleAvailability(option)}
                      />
                      <Label htmlFor={`avail-${option}`} className="cursor-pointer text-xs font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.availability && <p className="text-xs text-destructive">{errors.availability}</p>}
              </div>

              <Button
                type="submit"
                disabled={!requiredOk}
                className="bg-gradient-brand w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                Become an Expert
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
