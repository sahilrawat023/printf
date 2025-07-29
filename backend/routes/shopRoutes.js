import express from 'express';
import { registerShop, updateShop, getMyShop, getNearbyShops } from '../controllers/shopController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('shopOwner'), uploadSingle, registerShop);
router.put('/', requireAuth, requireRole('shopOwner'), uploadSingle, updateShop);
router.get('/me', requireAuth, requireRole('shopOwner'), getMyShop);
router.get('/nearby', requireAuth, getNearbyShops);

export default router; 