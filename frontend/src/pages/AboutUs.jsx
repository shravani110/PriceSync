import { Search, History, BellRing } from "lucide-react";
import StaticPage from "../components/layout/StaticPage";

const STORE_NAMES = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Ajio",
  "Croma",
  "Reliance Digital",
  "Vijay Sales",
];

const STEPS = [
  {
    icon: Search,
    title: "Search once",
    description: "Type a product name and we look it up across every store at the same time.",
  },
  {
    icon: History,
    title: "Compare & track",
    description: "See every store's price side by side, plus how the price has moved over time.",
  },
  {
    icon: BellRing,
    title: "Get notified",
    description: "Set a target price and we'll email you the moment any store drops below it.",
  },
];

function AboutUs() {
  return (
    <StaticPage
      title="About PriceSync"
      subtitle="Precision tracking for smart shoppers."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-10 text-sm text-text-secondary leading-relaxed">
        <section>
          <p>
            PriceSync helps you find the best price for the products you want, without
            opening a dozen tabs. We search across Amazon, Flipkart, Myntra, Ajio, Croma,
            Reliance Digital, and Vijay Sales, and bring every result together in one place
            so you can see exactly where to buy and how much you'll save.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-text-primary mb-4">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-4"
              >
                <Icon className="w-5 h-5 text-accent-secondary mb-3" />
                <h3 className="font-display font-semibold text-text-primary mb-1">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-text-primary mb-3">
            Stores we compare
          </h2>
          <div className="flex flex-wrap gap-2">
            {STORE_NAMES.map((name) => (
              <span
                key={name}
                className="px-3 py-1.5 rounded-full border border-border-subtle bg-bg-surface text-xs text-text-primary"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
            Our mission
          </h2>
          <p>
            Prices change constantly, and the best deal is rarely on the first site you check.
            PriceSync exists so you never have to do that comparison manually — we do the
            scanning, you do the saving.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}

export default AboutUs;
