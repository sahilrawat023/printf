import express from 'express';
import { placeOrder, getUserOrders, getShopOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, placeOrder);
router.get('/user', requireAuth, getUserOrders);
router.get('/shop', requireAuth, requireRole('shopOwner'), getShopOrders);
router.patch('/:id/status', requireAuth, requireRole('shopOwner'), updateOrderStatus);

export default router; 