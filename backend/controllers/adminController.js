import User from '../models/User.js';
import PrintShop from '../models/PrintShop.js';
import PrintOrder from '../models/PrintOrder.js';
import Payment from '../models/Payment.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await PrintShop.countDocuments();
    const totalOrders = await PrintOrder.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$amount' } } },
    ]);
    res.json({
      totalUsers,
      totalShops,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch stats' });
  }
}; 