import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const ACCENT = "#E11D74";

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-neutral-500">
        {label}
      </span>

      <div className="group flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 transition-colors focus-within:border-(--accent) focus-within:ring-4 focus-within:ring-(--accent-ring)">
        <Icon
          size={17}
          className="shrink-0 text-neutral-400 group-focus-within:text-(--accent)"
        />
        {children}
      </div>
    </label>
  );
}

const inputClass =
  "w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // await authService.login(form);

      await new Promise((res) => setTimeout(res, 1000));

      console.log(form);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        "--accent": ACCENT,
        "--accent-ring": "rgba(225,29,116,0.12)",
      }}
    >
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[520px_1fr]">

        {/* Left */}

        <div className="flex items-center justify-center px-6 py-14 lg:px-16">
          <div className="w-full max-w-md">

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent)">
              Welcome Back
            </p>

            <h1 className="mt-3 text-5xl font-black leading-tight text-neutral-900">
              Sign in
              <br />
              <span
                className="bg-clip-text text-transparent italic"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${ACCENT}, #FF6FA5)`,
                }}
              >
                to CredX.
              </span>
            </h1>

            <p className="mt-4 text-neutral-500">
              Continue building your professional network.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              <Field icon={Mail} label="Email">
                <input
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                />
              </Field>

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
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </Field>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-(--accent)"
                >
                  Forgot Password?
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {loading ? "Signing in..." : "Sign In"}

                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="text-center text-sm text-neutral-500">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-neutral-900 hover:text-(--accent)"
                >
                  Create one
                </a>
              </p>

            </form>
          </div>
        </div>

        {/* Right */}

        <div className="relative hidden overflow-hidden bg-neutral-50 lg:block">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(225,29,116,0.06), transparent 45%), radial-gradient(circle at 75% 75%, rgba(225,29,116,0.05), transparent 40%)",
            }}
          />

          <div className="flex h-full items-center justify-center">

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-xl"
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "rgba(225,29,116,.1)" }}
              >
                <ShieldCheck color={ACCENT} size={28} />
              </div>

              <h2 className="mt-6 text-center text-2xl font-bold">
                Secure Login
              </h2>

              <p className="mt-3 max-w-xs text-center text-neutral-500">
                Access your student profile, applications and campus hiring
                dashboard securely.
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}