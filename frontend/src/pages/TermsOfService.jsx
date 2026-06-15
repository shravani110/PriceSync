import StaticPage from "../components/layout/StaticPage";

function TermsOfService() {
  return (
    <StaticPage title="Terms of Service" subtitle="Last updated June 2026">
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            1. Acceptance of terms
          </h2>
          <p>
            By creating an account or using PriceSync, you agree to these terms. If you don't
            agree, please don't use the service.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            2. Description of service
          </h2>
          <p>
            PriceSync searches multiple retailer websites and displays product prices,
            availability, and price history in one place, and can notify you by email when a
            product's price drops to a target you set.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            3. Pricing information disclaimer
          </h2>
          <p>
            Prices, discounts, and availability are pulled from third-party retailer websites
            and can change at any time without notice. PriceSync makes no guarantee of
            accuracy. Always confirm the final price and availability on the retailer's site
            before completing a purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            4. Price alerts
          </h2>
          <p>
            Price alerts are checked periodically and sent on a best-effort basis. We don't
            guarantee that an alert email will be delivered immediately, or at all, and
            PriceSync isn't responsible for missed deals due to delayed or undelivered alerts.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            5. Accounts
          </h2>
          <p>
            You're responsible for keeping your account credentials secure and for any
            activity that happens under your account.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            6. Acceptable use
          </h2>
          <p>
            You agree not to misuse PriceSync, including attempting to disrupt the service,
            scrape or resell our data at scale, or use it for any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            7. Limitation of liability
          </h2>
          <p>
            PriceSync is provided "as is" without warranties of any kind. We aren't liable for
            any losses arising from price inaccuracies, missed alerts, or service
            interruptions.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            8. Changes to these terms
          </h2>
          <p>
            We may update these terms occasionally. Continued use of PriceSync after a change
            means you accept the updated terms. Questions can be sent to{" "}
            <a href="mailto:support@pricesync.app" className="text-accent-secondary hover:underline">
              support@pricesync.app
            </a>
            .
          </p>
        </section>
      </div>
    </StaticPage>
  );
}

export default TermsOfService;
