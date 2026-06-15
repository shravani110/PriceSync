import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Logo from "../components/common/Logo";
import Button from "../components/common/Button";
import { verifyEmail } from "../services/api";
import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user, setUser } = useAuth();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }
    if (requestedRef.current) return;
    requestedRef.current = true;

    verifyEmail(token)
      .then((verifiedUser) => {
        setStatus("success");
        if (user) {
          setUser((prev) => (prev ? { ...prev, emailVerified: true } : verifiedUser));
        }
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
  }, [token]);

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

      <div className="w-full max-w-sm text-center">
        <button onClick={() => navigate("/")} className="flex justify-center w-full mb-8 cursor-pointer">
          <Logo />
        </button>

        <div className="rounded-2xl bg-bg-surface border border-border-subtle p-6 sm:p-8">
          {status === "loading" && (
            <>
              <Loader2 className="w-10 h-10 mx-auto mb-3 text-accent-secondary animate-spin" />
              <h1 className="text-lg font-display font-semibold mb-1">Verifying your email...</h1>
              <p className="text-text-secondary text-sm">Hang on a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-success" />
              <h1 className="text-lg font-display font-semibold mb-1">Email verified</h1>
              <p className="text-text-secondary text-sm mb-6">
                Your email is confirmed. You'll now receive price-drop alerts.
              </p>
              <Button className="w-full" onClick={() => navigate("/")}>
                Continue
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />
              <h1 className="text-lg font-display font-semibold mb-1">Verification failed</h1>
              <p className="text-text-secondary text-sm mb-6">{error}</p>
              <Button className="w-full" onClick={() => navigate("/")}>
                Back to home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
