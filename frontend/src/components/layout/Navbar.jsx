import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Logo from "../common/Logo";
import SearchBar from "../search/SearchBar";
import Button from "../common/Button";
import UserMenu from "./UserMenu";
import VerifyBanner from "./VerifyBanner";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "FAQs", href: "#faqs" },
];

function Navbar({ showSearch = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 relative">
        <button onClick={() => navigate("/")} className="cursor-pointer">
          <Logo />
        </button>

        {showSearch ? (
          <>
            <div className="flex-1 max-w-xl mx-auto">
              <SearchBar compact onSearch={handleSearch} />
            </div>
            <button
              onClick={() => navigate("/saved")}
              aria-label="Saved items"
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
            </button>
            {user ? (
              <UserMenu />
            ) : (
              <Button className="px-5 py-2 text-sm flex-shrink-0" onClick={() => navigate("/login")}>
                Get Started
              </Button>
            )}
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-8 text-sm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={() => navigate("/saved")}
                aria-label="Saved items"
                className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
              >
                <Heart className="w-5 h-5" />
              </button>
              {user ? (
                <UserMenu />
              ) : (
                <Button className="px-5 py-2 text-sm" onClick={() => navigate("/login")}>
                  Get Started
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      <VerifyBanner />
    </header>
  );
}

export default Navbar;
