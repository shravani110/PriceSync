const variants = {
  primary:
    "bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-base font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40 hover:scale-[1.02]",
  ghost:
    "bg-bg-surface text-text-primary border border-border-subtle hover:bg-bg-surface-hover",
};

function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
