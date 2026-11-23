import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/layout/Logo";

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  function validateRegistration() {
    const errors = {};
    const normalizedEmail = email.trim();
    const normalizedUsername = username.trim();
    const normalizedName = fullName.trim();
    const passwordLength = Array.from(password).length;
    const passwordBytes = new TextEncoder().encode(password).length;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = "Enter a valid email address.";
    }
    if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
      errors.username = "Username must be between 3 and 50 characters.";
    } else if (!/^[A-Za-z0-9_.-]+$/.test(normalizedUsername)) {
      errors.username = "Use only letters, numbers, periods, underscores, and hyphens.";
    }
    if (!normalizedName) {
      errors.full_name = "Enter your full name.";
    } else if (normalizedName.length > 120) {
      errors.full_name = "Full name must be 120 characters or fewer.";
    }
    if (passwordLength < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (passwordBytes > 72) {
      errors.password = "Password must be at most 72 UTF-8 bytes.";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Password must contain at least one letter and one number.";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (isRegister) {
      const validationErrors = validateRegistration();
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setError("Please correct the highlighted fields.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          username: username.trim(),
          fullName: fullName.trim(),
          password,
        });
      } else {
        await login(email.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const details = err.data?.detail;
      if (isRegister && Array.isArray(details)) {
        const validationErrors = {};
        for (const detail of details) {
          const field = Array.isArray(detail.loc) ? detail.loc[detail.loc.length - 1] : null;
          if (["email", "username", "full_name", "password"].includes(field)) {
            validationErrors[field] = (detail.msg || "Invalid value").replace(/^Value error,\s*/, "");
          }
        }
        setFieldErrors(validationErrors);
        setError(
          Object.keys(validationErrors).length > 0
            ? "Please correct the highlighted fields."
            : err.message || "Authentication failed. Please check your details."
        );
      } else {
        setError(err.message || "Authentication failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
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
                    aria-invalid={Boolean(fieldErrors.full_name)}
                    className={`w-full rounded-xl border ${fieldErrors.full_name ? "border-red-400" : "border-sand/80"} bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10`}
                    maxLength={120}
                    name="full_name"
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError("");
                      setFieldErrors((current) => ({ ...current, full_name: "" }));
                    }}
                    placeholder="e.g. Ananya Sharma"
                    required
                    type="text"
                    value={fullName}
                  />
                </div>
                {fieldErrors.full_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    aria-invalid={Boolean(fieldErrors.username)}
                    className={`w-full rounded-xl border ${fieldErrors.username ? "border-red-400" : "border-sand/80"} bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10`}
                    maxLength={50}
                    name="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                      setFieldErrors((current) => ({ ...current, username: "" }));
                    }}
                    placeholder="traveler123"
                    required
                    type="text"
                    value={username}
                  />
                </div>
                {fieldErrors.username && <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Email address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                aria-invalid={Boolean(fieldErrors.email)}
                className={`w-full rounded-xl border ${fieldErrors.email ? "border-red-400" : "border-sand/80"} bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10`}
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setFieldErrors((current) => ({ ...current, email: "" }));
                }}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                aria-invalid={Boolean(fieldErrors.password)}
                className={`w-full rounded-xl border ${fieldErrors.password ? "border-red-400" : "border-sand/80"} bg-cream/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/10`}
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setFieldErrors((current) => ({ ...current, password: "" }));
                }}
                placeholder={isRegister ? "8+ chars, letters and numbers" : "••••••••"}
                required
                type="password"
                value={password}
              />
            </div>
            {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            {isRegister && !fieldErrors.password && (
              <p className="mt-1 text-[11px] text-muted">
                Use at least 8 characters with a letter and a number (maximum 72 UTF-8 bytes).
              </p>
            )}
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
              setFieldErrors({});
            }}
            type="button"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
}
