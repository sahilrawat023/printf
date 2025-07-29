import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, requireRole('admin'), getStats);

export default router; 