import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/email.js";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email, emailVerified: user.emailVerified };
}

async function issueVerificationEmail(user) {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await user.save();

  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  try {
    await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl });
  } catch (err) {
    console.error("[auth] Failed to send verification email:", err.message);
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });

    await issueVerificationEmail(user);

    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user._id.toString());
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "This verification link is invalid or has expired" });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function resendVerification(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.emailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    await issueVerificationEmail(user);
    res.json({ message: "Verification email sent" });
  } catch (err) {
    next(err);
  }
}
