import StaticPage from "../components/layout/StaticPage";

function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy" subtitle="Last updated June 2026">
      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            1. Information we collect
          </h2>
          <p>
            When you create an account, we collect your email address and a securely hashed
            password. We also store the products you save, the price alerts you set, and the
            target prices you choose.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            2. How we use your information
          </h2>
          <p>
            Your email address is used to verify your account and to send price-drop alert
            notifications you've opted into. We don't sell or share your personal information
            with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            3. Price data from third-party stores
          </h2>
          <p>
            PriceSync retrieves publicly available product and pricing information from
            retailer websites (such as Amazon, Flipkart, Myntra, Ajio, Croma, Reliance Digital,
            and Vijay Sales) to provide comparisons. We are not affiliated with these retailers,
            and prices shown may not always reflect the most current price on their sites.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            4. Cookies & local storage
          </h2>
          <p>
            We use browser local storage to remember things like your saved products and login
            session, so you don't have to sign in repeatedly. We don't use third-party
            advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">5. Data security</h2>
          <p>
            Passwords are stored using one-way hashing and are never saved in plain text.
            Account-related requests are authenticated using signed tokens.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            6. Your choices
          </h2>
          <p>
            You can remove saved products and price alerts at any time from your account. To
            request deletion of your account and associated data, contact us at{" "}
            <a href="mailto:support@pricesync.app" className="text-accent-secondary hover:underline">
              support@pricesync.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-text-primary mb-2">
            7. Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. Continued use of PriceSync after
            changes means you accept the updated policy.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}

export default PrivacyPolicy;
