import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
