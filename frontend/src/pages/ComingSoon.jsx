import { useLocation, Link } from "react-router-dom";
import { Construction } from "lucide-react";
import StaticPage from "../components/layout/StaticPage";
import Button from "../components/common/Button";

function ComingSoon() {
  const { state } = useLocation();
  const title = state?.title || "This page";

  return (
    <StaticPage title={title}>
      <div className="flex flex-col items-center text-center py-12 text-text-secondary">
        <Construction className="w-10 h-10 mb-3 text-accent-secondary" />
        <p className="font-medium text-text-primary mb-1">Coming soon</p>
        <p className="text-sm mb-6">We're still working on this page. Check back later.</p>
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </StaticPage>
  );
}

export default ComingSoon;
