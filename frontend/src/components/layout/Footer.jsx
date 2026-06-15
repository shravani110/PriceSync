import Logo from "../common/Logo";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: ["About Us", "Blog", "Careers", "Contact Support"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
  {
    title: "Developers",
    links: ["API Documentation", "System Status", "Open Source"],
  },
];

function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-text-secondary max-w-xs">
              Precision tracking for smart shoppers. Never pay full price
              again.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-display font-semibold text-sm mb-3">{column.title}</h3>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-text-primary transition-colors">
                      {link}
                    </a>
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
