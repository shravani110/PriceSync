import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Is PriceSync free to use?",
    answer:
      "Yes — PriceSync is completely free, with no subscription or hidden fees. Creating an account is optional — it just unlocks saved products and price drop alerts.",
  },
  {
    question: "How often do prices update?",
    answer:
      "Every search runs a fresh live scan across all supported stores, so prices reflect what's listed right now. Repeat searches within the hour are served from a short cache for speed.",
  },
  {
    question: "Do you track international stores?",
    answer:
      "Right now PriceSync focuses on major Indian retailers — Amazon, Flipkart, Myntra, Croma, Reliance Digital, and Vijay Sales — with more stores being added regularly.",
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-bg-surface border border-border-subtle overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display font-medium text-accent-secondary">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faqs" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-center mb-10">
        Common Questions
      </h2>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq) => (
          <FAQItem key={faq.question} {...faq} />
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
