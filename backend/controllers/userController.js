import User from '../models/User.js';

export const getProfile = (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    req.user.name = name || req.user.name;
    req.user.phone = phone || req.user.phone;
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
}; 