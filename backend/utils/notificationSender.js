import axios from 'axios';
import User from '../models/User.js';

export const sendNotification = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user || !user.notificationToken) return;
  const payload = {
    to: user.notificationToken,
    notification: {
      title: 'PrintEase',
      body: message
    }
  };
  await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
    headers: {
      'Authorization': 'key=' + process.env.FCM_SERVER_KEY,
      'Content-Type': 'application/json'
    }
  });
}; 