import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/create-razorpay-order', verifyJWT, createRazorpayOrder);
router.post('/verify', verifyJWT, verifyPayment);

export default router; 