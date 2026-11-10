import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, KeyRound, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo, YatreoMark } from "../components/layout/Logo";

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!username || username.length < 3) {
          throw new Error("Username must be at least 3 characters.");
        }
        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        await register({ email, username, fullName, password });
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  function fillAdminCredentials() {
    setEmail("admin@yatrio.com");
    setPassword("Admin12345!");
    setIsRegister(false);
    setError("");
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-sand bg-white p-8 shadow-[0_16px_40px_rgba(15,92,94,0.08)]">
        <div className="flex flex-col items-center text-center">
          <Logo size="large" />
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
            {isRegister ? "Create your Yatreo account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {isRegister
              ? "Join us to save favorite destinations and trip itineraries"
              : "Sign in to access your planned holidays and account"}
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    className="w-full rounded-xl border border-sand/80 bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10"
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    required
                    type="text"
                    value={fullName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    className="w-full rounded-xl border border-sand/80 bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="traveler123"
                    required
                    type="text"
                    value={username}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Email address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                className="w-full rounded-xl border border-sand/80 bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                className="w-full rounded-xl border border-sand/80 bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10"
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? "Min. 8 characters" : "••••••••"}
                required
                type="password"
                value={password}
              />
            </div>
          </div>

          <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-semibold uppercase tracking-wider text-cream shadow-sm transition hover:bg-teal-hover disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 border-t border-sand/60 pt-4 text-center">
          <button
            className="text-xs text-teal transition hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            type="button"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </div>

        {/* Quick Demo Helper */}
        <div className="mt-5 rounded-2xl border border-sand/70 bg-[#faf6f0] p-4 text-xs text-muted">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Demo Admin Login</span>
            <button
              className="rounded-full bg-warm/20 px-2.5 py-1 text-[11px] font-semibold text-warm-dark hover:bg-warm/30"
              onClick={fillAdminCredentials}
              type="button"
            >
              Fill Credentials
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed">
            Admin account seeded by backend: <code className="text-teal font-mono">admin@yatrio.com</code> / <code className="text-teal font-mono">Admin12345!</code>
          </p>
        </div>
      </div>
    </div>
  );
}
