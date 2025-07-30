import express from 'express';
import { createOrder, verifyOrderPayment, getUserOrders, getShopOrders, updateOrderStatus } from '../controllers/orderController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

router.post('/create', verifyJWT, authorizeRole(['customer']), createOrder);
router.post('/verify', verifyJWT, authorizeRole(['customer']), verifyOrderPayment);
router.get('/user', verifyJWT, authorizeRole(['customer']), getUserOrders);
router.get('/shop', verifyJWT, authorizeRole(['shopOwner', 'admin']), getShopOrders);
router.patch('/:id/status', verifyJWT, authorizeRole(['shopOwner', 'admin']), updateOrderStatus);

export default router; 