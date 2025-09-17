// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["superadmin", "admin", "resident"], default: "resident" },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat" }, // link user → flat
  assignedSociety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    default: null,
  },

  // New fields
  currentBalance: { type: Number, default: 0 },  // Admin sets balance
  dueDate: { type: Date }                        // Admin sets due date
});

// Encrypt password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
