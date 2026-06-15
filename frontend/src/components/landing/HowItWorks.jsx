import { Search, Scale, PiggyBank } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    iconBg: "bg-accent-secondary/15 text-accent-secondary",
    title: "1. Search",
    description:
      "Type in any product name or paste a URL. Our engine crawls thousands of retailers in real-time.",
  },
  {
    icon: Scale,
    iconBg: "bg-accent-primary/15 text-accent-primary",
    title: "2. Compare",
    description:
      "View a side-by-side comparison of prices, shipping costs, and seller ratings all in one clean view.",
  },
  {
    icon: PiggyBank,
    iconBg: "bg-success/15 text-success",
    title: "3. Save",
    description:
      "Get the lowest price and set alerts to get notified when the cost drops even further.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-center mb-10">
        Compare in Seconds, Save for a Lifetime
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map(({ icon: Icon, iconBg, title, description }) => (
          <div
            key={title}
            className="rounded-2xl bg-bg-surface border border-border-subtle p-6"
          >
            <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full mb-4 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
