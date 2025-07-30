import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['customer', 'shopOwner', 'admin'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  notificationToken: { type: String }, // for FCM/Web notifications
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
