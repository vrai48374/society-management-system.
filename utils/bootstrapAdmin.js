import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path if needed

export async function ensureSuperAdmin() {
  try {
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log(" Super Admin already exists:", existing.email);
      return;
    }

    const password = await bcrypt.hash("123456", 10);

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "vrai48374@gmail.com",
      password: password,
      role: "superadmin",
    });

    console.log(" Super Admin created:", superAdmin.email);
  } catch (err) {
    console.error(" Failed to ensure superadmin:", err.message);
  }
}
