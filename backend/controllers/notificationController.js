import { sendNotification as sendNotificationUtil } from '../utils/notificationSender.js';
import User from '../models/User.js';

// Send notification to a user
export const sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'userId and message required' });
    const user = await User.findById(userId);
    if (!user || !user.notificationToken) return res.status(404).json({ error: 'User or notification token not found' });
    await sendNotificationUtil(userId, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
}; 