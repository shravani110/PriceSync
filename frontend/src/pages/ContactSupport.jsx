import { Mail, Clock, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StaticPage from "../components/layout/StaticPage";

function ContactSupport() {
  return (
    <StaticPage title="Contact Support" subtitle="We're happy to help.">
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 flex items-start gap-4">
          <Mail className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display font-semibold text-text-primary mb-1">Email us</h2>
            <p>
              For account issues, bugs, or general questions, write to{" "}
              <a
                href="mailto:support@pricesync.app"
                className="text-accent-secondary hover:underline"
              >
                support@pricesync.app
              </a>
              .
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 flex items-start gap-4">
          <Clock className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display font-semibold text-text-primary mb-1">Response time</h2>
            <p>We aim to reply to all support emails within 1-2 business days.</p>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 flex items-start gap-4">
          <HelpCircle className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display font-semibold text-text-primary mb-1">
              Common questions
            </h2>
            <p>
              Before reaching out, check our{" "}
              <Link to="/#faqs" className="text-accent-secondary hover:underline">
                FAQs
              </Link>{" "}
              — many questions about price alerts, accuracy, and accounts are answered there.
            </p>
          </div>
        </div>
      </div>
    </StaticPage>
  );
}

export default ContactSupport;
