import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Logo from "../components/common/Logo";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignup) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(124,92,252,0.18), transparent 50%), radial-gradient(circle at 70% 60%, rgba(34,211,238,0.14), transparent 50%)",
        }}
      />

      <div className="w-full max-w-sm">
        <button onClick={() => navigate("/")} className="flex justify-center w-full mb-8 cursor-pointer">
          <Logo />
        </button>

        <div className="rounded-2xl bg-bg-surface border border-border-subtle p-6 sm:p-8">
          <h1 className="text-xl font-display font-semibold text-center mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-text-secondary text-sm text-center mb-6">
            {isSignup
              ? "Sign up to save searches and get price drop alerts."
              : "Log in to access your saved products and price alerts."}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <label className="flex items-center gap-2 rounded-xl bg-bg-base border border-border-subtle px-4 h-12 focus-within:border-accent-primary transition-colors">
                <User className="w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-text-secondary text-text-primary text-sm"
                />
              </label>
            )}

            <label className="flex items-center gap-2 rounded-xl bg-bg-base border border-border-subtle px-4 h-12 focus-within:border-accent-primary transition-colors">
              <Mail className="w-4 h-4 text-text-secondary" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder:text-text-secondary text-text-primary text-sm"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl bg-bg-base border border-border-subtle px-4 h-12 focus-within:border-accent-primary transition-colors">
              <Lock className="w-4 h-4 text-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder:text-text-secondary text-text-primary text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </label>

            <Button type="submit" className="w-full mt-2" disabled={submitting}>
              {submitting ? "Please wait..." : isSignup ? "Create account" : "Log In"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
              className="text-accent-secondary hover:text-accent-primary transition-colors cursor-pointer font-medium"
            >
              {isSignup ? "Log In" : "Sign up"}
            </button>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="block w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors mt-6 cursor-pointer"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}

export default Login;
