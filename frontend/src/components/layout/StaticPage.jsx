import Navbar from "./Navbar";
import Footer from "./Footer";

function StaticPage({ title, subtitle, maxWidth = "max-w-3xl", children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 ${maxWidth}`}>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold mb-2">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mb-8">{subtitle}</p>}
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default StaticPage;
