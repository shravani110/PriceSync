import axios from "axios";

// Brevo (formerly Sendinblue) HTTPS API — Railway blocks outbound SMTP
// connections (ports 465/587), so nodemailer/Gmail SMTP always times out.
// Brevo's REST API goes over port 443 which Railway allows.
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.SMTP_FROM_EMAIL || "shravanidasari110@gmail.com";
const SENDER_NAME = "PriceSync";

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[email] BREVO_API_KEY not set — skipping email send");
    return;
  }

  await axios.post(
    BREVO_API_URL,
    {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    }
  );
}

export async function sendVerificationEmail({ to, name, verifyUrl }) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color: #7c5cfc;">Verify your email</h2>
      <p>Hi ${name},</p>
      <p>Thanks for signing up for PriceSync. Please confirm this is your email address so we can send you price-drop alerts.</p>
      <p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; border-radius: 999px; background: linear-gradient(90deg, #7c5cfc, #22d3ee); color: #0a0a0f; font-weight: 600; text-decoration: none;">
          Verify email
        </a>
      </p>
      <p style="color: #888; font-size: 0.85em;">This link expires in 24 hours. If you didn't create a PriceSync account, you can ignore this email.</p>
      <p style="color: #888; font-size: 0.85em;">— PriceSync</p>
    </div>
  `;

  await sendEmail({ to, subject: "Verify your PriceSync email", html });
}

export async function sendPriceDropEmail({ to, title, targetPrice, currentPrice, url, image }) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color: #7c5cfc;">Good news! A price dropped</h2>
      ${image ? `<img src="${image}" alt="${title}" style="max-width: 200px; border-radius: 8px;" />` : ""}
      <h3>${title}</h3>
      <p>You asked to be notified when the price dropped to <strong>&#8377;${targetPrice}</strong> or below.</p>
      <p>It's now available for <strong style="color: #22d3ee; font-size: 1.2em;">&#8377;${currentPrice}</strong>.</p>
      ${url ? `<p><a href="${url}" style="color: #7c5cfc;">View product &rarr;</a></p>` : ""}
      <p style="color: #888; font-size: 0.85em;">— PriceSync</p>
    </div>
  `;

  await sendEmail({ to, subject: `Price drop alert: ${title}`, html });
}
