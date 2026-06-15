import nodemailer from "nodemailer";

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  if (process.env.SMTP_HOST) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      })
    );
  } else {
    transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
      console.log("[email] No SMTP configured — using Ethereal test inbox");
      console.log(`[email] Ethereal login: ${testAccount.user} / ${testAccount.pass}`);
      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    });
  }

  return transporterPromise;
}

const FROM_ADDRESS = process.env.SMTP_FROM || "PriceSync <alerts@pricesync.app>";

export async function sendPriceDropEmail({ to, title, targetPrice, currentPrice, url, image }) {
  const transporter = await getTransporter();

  const subject = `Price drop alert: ${title}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color: #7c5cfc;">Good news! A price dropped 🎉</h2>
      ${image ? `<img src="${image}" alt="${title}" style="max-width: 200px; border-radius: 8px;" />` : ""}
      <h3>${title}</h3>
      <p>You asked to be notified when the price dropped to <strong>₹${targetPrice}</strong> or below.</p>
      <p>It's now available for <strong style="color: #22d3ee; font-size: 1.2em;">₹${currentPrice}</strong>.</p>
      ${url ? `<p><a href="${url}" style="color: #7c5cfc;">View product →</a></p>` : ""}
      <p style="color: #888; font-size: 0.85em;">— PriceSync</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[email] Preview URL: ${previewUrl}`);
  }

  return info;
}

export async function sendVerificationEmail({ to, name, verifyUrl }) {
  const transporter = await getTransporter();

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

  const info = await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your PriceSync email",
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[email] Preview URL: ${previewUrl}`);
  }

  return info;
}
