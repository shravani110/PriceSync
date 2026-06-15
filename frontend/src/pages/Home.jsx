import { useNavigate } from "react-router-dom";
import { ShoppingCart, ShoppingBag, Shirt, Tv, Zap, Store } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/search/SearchBar";
import TrendingChips from "../components/search/TrendingChips";
import HowItWorks from "../components/landing/HowItWorks";
import PowerTools from "../components/landing/PowerTools";
import FAQSection from "../components/landing/FAQSection";

const PLATFORMS = [
  { name: "Amazon", icon: ShoppingCart },
  { name: "Flipkart", icon: ShoppingBag },
  { name: "Myntra", icon: Shirt },
  { name: "Croma", icon: Tv },
  { name: "Reliance Digital", icon: Zap },
  { name: "Vijay Sales", icon: Store },
];

function Home() {
  const navigate = useNavigate();

  const goToResults = (query) => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 relative overflow-hidden">
        {/* Ambient gradient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(124,92,252,0.18), transparent 50%), radial-gradient(circle at 70% 60%, rgba(34,211,238,0.14), transparent 50%)",
          }}
        />

        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold tracking-tight leading-tight">
            Start{" "}
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Syncing.
            </span>
          </h1>
          <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            One search. Every store. We find the best price across Amazon,
            Flipkart, Myntra and more — instantly. 100% free for everyone.
          </p>

          <div className="mt-8">
            <SearchBar id="hero-search-input" onSearch={goToResults} />
          </div>

          <TrendingChips onSelect={goToResults} />
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-text-secondary mb-4">
            We sync prices across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PLATFORMS.map(({ name, icon: Icon }) => (
              <span
                key={name}
                className="flex items-center gap-2 text-text-secondary/60 font-display font-medium text-lg hover:text-text-primary transition-colors cursor-default"
              >
                <Icon className="w-5 h-5" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </main>

      <HowItWorks />
      <PowerTools />
      <FAQSection />

      <Footer />
    </div>
  );
}

export default Home;
