import express from 'express';
import { createRazorpayOrder, handleWebhook } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/razorpay-order', requireAuth, createRazorpayOrder);
router.post('/webhook', handleWebhook);

export default router; 