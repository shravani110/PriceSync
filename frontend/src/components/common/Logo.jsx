import { Zap } from "lucide-react";

function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-lg shadow-accent-primary/30">
        <Zap className="w-5 h-5 text-bg-base" strokeWidth={2.5} fill="currentColor" />
      </span>
      <span className="text-xl font-display font-semibold tracking-tight bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
        PriceSync
      </span>
    </div>
  );
}

export default Logo;
