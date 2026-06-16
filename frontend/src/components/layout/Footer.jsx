import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/coming-soon" },
      { label: "Careers", to: "/coming-soon" },
      { label: "Contact Support", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/coming-soon" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Documentation", to: "/coming-soon" },
      { label: "System Status", to: "/coming-soon" },
      { label: "Open Source", to: "/coming-soon" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Logo />
          <p className="mt-3 text-sm text-text-secondary max-w-xs">
            Precision tracking for smart shoppers. Never pay full price
            again.
          </p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-10">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-display font-semibold text-sm mb-3">{column.title}</h3>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      state={link.to === "/coming-soon" ? { title: link.label } : undefined}
                      className="hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-secondary">
          <p>© 2026 PriceSync. Precision tracking for smart shoppers.</p>
          <div className="flex items-center gap-4">
            <span>v2.4.0-stable</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
