import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  User,
  KeyRound,
  Globe,
  MapPin,
  BookOpen,
  CalendarDays,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROLES = [
  {
    id: "STUDENT",
    label: "Student",
    icon: GraduationCap,
    blurb: "Join your branch & batch",
  },
  {
    id: "COMPANY_MANAGER",
    label: "Company Manager",
    icon: Building2,
    blurb: "Hire from campus talent",
  },
  {
    id: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    blurb: "Manage the platform",
  },
];

const ACCENT = "#E11D74"; // signature pink

const initialForm = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  role: "STUDENT",
  branch: "",
  batchYear: "",
  invitationKey: "",
  companyName: "",
  website: "",
  location: "",
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-neutral-500">
        {label}
      </span>
      <div className="group flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 transition-colors focus-within:border-(--accent) focus-within:ring-4 focus-within:ring-(--accent-ring)">
        <Icon size={17} strokeWidth={2} className="shrink-0 text-neutral-400 group-focus-within:text-(--accent)" />
        {children}
      </div>
    </label>
  );
}

const inputClass =
  "w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none";

function TextInput({ icon, label, ...props }) {
  return (
    <Field icon={icon} label={label}>
      <input className={inputClass} {...props} />
    </Field>
  );
}

const fieldMotion = {
  initial: { opacity: 0, height: 0, marginTop: 0 },
  animate: { opacity: 1, height: "auto", marginTop: 18 },
  exit: { opacity: 0, height: 0, marginTop: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isStudent = form.role === "STUDENT";
  const isCompany = form.role === "COMPANY_MANAGER";
  const isAdmin = form.role === "ADMIN";
  const needsInvitationKey = isCompany || isAdmin;

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectRole = (roleId) => {
    // Reset role-specific fields whenever the role changes so stale data
    // from a previous role selection never gets submitted.
    setForm((f) => ({
      ...initialForm,
      username: f.username,
      password: f.password,
      fullName: f.fullName,
      email: f.email,
      role: roleId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password || !form.fullName || !form.email) {
      setError("Please fill in all the required fields.");
      return;
    }
    if (isStudent && (!form.branch || !form.batchYear)) {
      setError("Branch and batch year are required for students.");
      return;
    }
    if (needsInvitationKey && !form.invitationKey) {
      setError("An invitation key is required for this role.");
      return;
    }
    if (isCompany && (!form.companyName || !form.website)) {
      setError("Company name and website are required.");
      return;
    }

    setSubmitting(true);
    try {
      // Build the payload your service layer expects. Only the fields
      // relevant to the selected role are included.
      const payload = {
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        ...(isStudent && { branch: form.branch, batchYear: Number(form.batchYear) }),
        ...(needsInvitationKey && { invitationKey: form.invitationKey }),
        ...(isCompany && {
          companyName: form.companyName,
          website: form.website,
          location: form.location,
        }),
      };

      // Replace with your actual auth service call, e.g.
      // await authService.signup(payload);
      await new Promise((res) => setTimeout(res, 900));
      console.log("Signup payload:", payload);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-white"
      style={{ "--accent": ACCENT, "--accent-ring": "rgba(225,29,116,0.12)" }}
    >
      <div className="mx-auto grid min-h-screen w-full max-w-350 grid-cols-1 lg:grid-cols-[minmax(0,560px)_1fr]">
        {/* ------------------------------------------------------------- */}
        {/* Left: form                                                    */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-16">
          <div className="w-full max-w-105">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-(--accent)">
              Create account
            </p>
            <h1 className="mt-3 text-[40px] font-black leading-[1.05] tracking-tight text-neutral-900">
              Get started
              <br />
              <span
                className="italic text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${ACCENT}, #FF6FA5)`,
                }}
              >
                in a minute.
              </span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
              Tell us who you are and we'll set the right access for you.
            </p>

            {/* Role selector */}
            <div className="mt-8 grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => {
                const active = form.role === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectRole(id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 text-center transition-all ${
                      active
                        ? "border-transparent text-white shadow-[0_8px_20px_-8px_rgba(225,29,116,0.55)]"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                    }`}
                    style={active ? { backgroundColor: ACCENT } : undefined}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                    <span className="text-[12px] font-semibold leading-tight">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="space-y-4">
                <TextInput
                  icon={User}
                  label="Full name"
                  type="text"
                  placeholder="Anumanya Jaiswal"
                  value={form.fullName}
                  onChange={update("fullName")}
                />
                <TextInput
                  icon={User}
                  label="Username"
                  type="text"
                  placeholder="anumanya"
                  value={form.username}
                  onChange={update("username")}
                />
                <TextInput
                  icon={Mail}
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                />

                <Field icon={Lock} label="Password">
                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-neutral-400 hover:text-neutral-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </Field>
              </div>

              {/* Role-specific fields */}
              <AnimatePresence mode="popLayout" initial={false}>
                {isStudent && (
                  <motion.div key="student-fields" {...fieldMotion} className="space-y-4 overflow-hidden">
                    <TextInput
                      icon={BookOpen}
                      label="Branch"
                      type="text"
                      placeholder="Computer Science"
                      value={form.branch}
                      onChange={update("branch")}
                    />
                    <TextInput
                      icon={CalendarDays}
                      label="Batch year"
                      type="number"
                      placeholder="2026"
                      value={form.batchYear}
                      onChange={update("batchYear")}
                    />
                  </motion.div>
                )}

                {needsInvitationKey && (
                  <motion.div key="invitation-field" {...fieldMotion} className="overflow-hidden">
                    <TextInput
                      icon={KeyRound}
                      label="Invitation key"
                      type="text"
                      placeholder="Provided by your organization"
                      value={form.invitationKey}
                      onChange={update("invitationKey")}
                    />
                  </motion.div>
                )}

                {isCompany && (
                  <motion.div key="company-fields" {...fieldMotion} className="space-y-4 overflow-hidden">
                    <TextInput
                      icon={Building2}
                      label="Company name"
                      type="text"
                      placeholder="Chime"
                      value={form.companyName}
                      onChange={update("companyName")}
                    />
                    <TextInput
                      icon={Globe}
                      label="Website"
                      type="text"
                      placeholder="https://company.com"
                      value={form.website}
                      onChange={update("website")}
                    />
                    <TextInput
                      icon={MapPin}
                      label="Location"
                      type="text"
                      placeholder="New York, NY"
                      value={form.location}
                      onChange={update("location")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {submitting ? "Creating account…" : "Create account"}
                {!submitting && <ArrowRight size={17} />}
              </button>

              <p className="mt-5 text-center text-[13px] text-neutral-500">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-neutral-900 hover:text-(--accent)">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Right: visual panel                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="relative hidden overflow-hidden bg-neutral-50 lg:block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(225,29,116,0.06), transparent 45%), radial-gradient(circle at 75% 75%, rgba(225,29,116,0.05), transparent 40%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-110 w-110">
              <div className="absolute inset-0 rounded-full border border-dashed border-neutral-200" />
              <div className="absolute inset-16 rounded-full border border-neutral-200" />

              {/* Center card reflects the selected role */}
              <RoleCard role={form.role} />

              <FloatingCard
                className="left-10 top-8"
                icon={<GraduationCap size={16} className="text-(--accent)" />}
                title="Students"
                subtitle="1,247 verified"
              />
              <FloatingCard
                className="right-7.5 top-24"
                icon={<Mail size={16} className="text-blue-500" />}
                title="Invites sent"
                subtitle="2,400 today"
              />
              <FloatingCard
                className="left-2.5 bottom-6"
                icon={<Building2 size={16} className="text-emerald-500" />}
                title="Companies"
                subtitle="+47 this week"
              />
              <FloatingCard
                className="right-5 bottom-28"
                icon={<ShieldCheck size={16} className="text-amber-500" />}
                title="Admin access"
                subtitle="Key protected"
              />
            </div>
          </div>

          <div className="absolute bottom-14 left-1/2 w-95 -translate-x-1/2 text-center">
            <p className="text-[15px] font-medium text-neutral-600">
              {ROLES.find((r) => r.id === form.role)?.blurb}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role }) {
  const meta = ROLES.find((r) => r.id === role) ?? ROLES[0];
  const Icon = meta.icon;
  return (
    <motion.div
      key={role}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2 flex w-55 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-white px-6 py-7 text-center shadow-[0_20px_45px_-15px_rgba(0,0,0,0.12)]"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(225,29,116,0.1)" }}
      >
        <Icon size={20} style={{ color: ACCENT }} strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-bold text-neutral-900">{meta.label}</p>
      <p className="text-[12px] text-neutral-400">Signing up now</p>
    </motion.div>
  );
}

function FloatingCard({ className, icon, title, subtitle }) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-semibold text-neutral-800">{title}</p>
        <p className="text-[11px] text-neutral-400">{subtitle}</p>
      </div>
    </div>
  );
}