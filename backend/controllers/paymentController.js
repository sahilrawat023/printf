import { createRazorpayOrder as createRazorpayOrderUtil, verifyRazorpaySignature } from '../utils/razorpay.js';
import PrintOrder from '../models/PrintOrder.js';

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });
    const order = await createRazorpayOrderUtil(amount);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) return res.status(400).json({ error: 'Missing fields' });
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
    if (!isValid) return res.status(400).json({ error: 'Invalid signature' });
    // Optionally update PrintOrder status here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify payment', details: err.message });
  }
}; 