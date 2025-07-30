import User from "../models/User.js";

// Sync Clerk user to MongoDB (called on first login + profile setup)
import User from "../models/User.js";

export const syncClerkUser = async (req, res) => {
  try {
    const { clerkId, name, email, phone } = req.body;

    let user = await User.findOne({ clerkId });

    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    user = await User.create({
      clerkId,
      name,
      email,
      phone,
      role: "customer",
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to sync user", details: err.message });
  }
};

// Get current user profile using clerkId from JWT
export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch profile", details: err.message });
  }
};

// Admin-only: Set role of any user
export const setRole = async (req, res) => {
  const { clerkId, role } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admin can set roles" });
  }

  const allowedRoles = ["customer", "shopOwner", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const user = await User.findOneAndUpdate(
    { clerkId },
    { role },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ message: "Role updated", user });
};

// Check if user exists in MongoDB (for frontend to detect first login)
export const checkProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) return res.status(404).json({ exists: false });
    res.status(200).json({ exists: true, user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to check profile", details: err.message });
  }
};
