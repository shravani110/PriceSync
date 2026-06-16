import { useState } from "react";
import { MailWarning, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { resendVerification } from "../../services/api";

function VerifyBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState("idle");
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setStatus("sending");
    try {
      await resendVerification();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative border-b border-accent-primary/20 bg-accent-primary/10 px-4 py-2 text-center text-sm text-text-secondary">
      <MailWarning className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-accent-secondary" />
      Please verify your email ({user.email}) to enable price-drop alerts.{" "}
      {status === "sent" ? (
        <span className="text-success font-medium">Verification email sent — check your inbox.</span>
      ) : status === "error" ? (
        <span className="text-red-400 font-medium">Couldn't send email. Try again later.</span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={status === "sending"}
          className="text-accent-secondary hover:text-accent-primary font-medium underline cursor-pointer disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Resend email"}
        </button>
      )}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default VerifyBanner;
