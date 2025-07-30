import PrintOrder from '../models/PrintOrder.js';
import PrintShop from '../models/PrintShop.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../utils/razorpay.js';
import { sendNotification } from '../utils/notificationSender.js';

// Create order and generate Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { shopId, documentIds, services, quantity, totalCost } = req.body;
    // Validate shop and documents
    const shop = await PrintShop.findById(shopId);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totalCost);
    const order = await PrintOrder.create({
      userId: req.user._id,
      shopId,
      documentIds,
      services,
      quantity,
      totalCost,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });
    // Notify shop owner
    sendNotification(shop.ownerId, 'New order placed');
    res.status(201).json({ order, razorpayOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

// Verify payment
export const verifyOrderPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const order = await PrintOrder.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const isValid = verifyRazorpaySignature(order.razorpayOrderId, paymentId, signature);
    if (!isValid) return res.status(400).json({ error: 'Invalid payment signature' });
    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;
    order.status = 'accepted';
    await order.save();
    // Notify customer
    sendNotification(order.userId, 'Order payment verified and accepted');
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify payment', details: err.message });
  }
};

// Get user order history
export const getUserOrders = async (req, res) => {
  try {
    const orders = await PrintOrder.find({ userId: req.user._id }).populate('shopId documentIds');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
};

// Get shop orders (for shop owner)
export const getShopOrders = async (req, res) => {
  try {
    const shop = await PrintShop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    const orders = await PrintOrder.find({ shopId: shop._id }).populate('userId documentIds');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shop orders', details: err.message });
  }
};

// Update order status (by shop owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await PrintOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const shop = await PrintShop.findById(order.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    order.status = req.body.status;
    await order.save();
    // Notify user
    sendNotification(order.userId, `Order status updated to ${order.status}`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
}; 