import razorpay from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import PrintOrder from '../models/PrintOrder.js';
import crypto from 'crypto';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const payment = await razorpay.orders.create({
      amount: Math.round(amount * 100), // INR paise
      currency: 'INR',
      receipt: orderId,
    });
    const newPayment = new Payment({
      orderId,
      userId: req.user._id,
      shopId: req.body.shopId,
      razorpayOrderId: payment.id,
      amount,
      status: 'created',
    });
    await newPayment.save();
    res.json({ order: payment });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create Razorpay order' });
  }
};

export const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (signature !== expectedSignature) return res.status(400).json({ error: 'Invalid signature' });
  const event = req.body.event;
  if (event === 'payment.captured') {
    const { order_id, id } = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ razorpayOrderId: order_id });
    if (payment) {
      payment.status = 'paid';
      payment.razorpayPaymentId = id;
      await payment.save();
      await PrintOrder.findByIdAndUpdate(payment.orderId, { status: 'accepted' });
    }
  }
  res.json({ received: true });
}; 