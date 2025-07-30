import express from 'express';
import { createShop, updateShop, getNearbyShops, getMyShop } from '../controllers/shopController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

router.post('/create', verifyJWT, authorizeRole(['shopOwner', 'admin']), createShop);
router.patch('/:id', verifyJWT, authorizeRole(['shopOwner', 'admin']), updateShop);
router.get('/nearby', getNearbyShops);
router.get('/me', verifyJWT, authorizeRole(['shopOwner']), getMyShop);

export default router; 