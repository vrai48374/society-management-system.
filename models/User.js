import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // never return password by default
  },
  role: {
    type: String,
    enum: ["resident", "admin", "superadmin"],
    default: "resident",
  },
}, { timestamps: true });

// 🔑 Encrypt password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); // if password unchanged
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
