import express from 'express';
import { syncClerkUser, getProfile, setRole } from '../controllers/authController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/sync', syncClerkUser);
router.get('/profile', verifyJWT, getProfile);
router.post('/set-role', verifyJWT, setRole);

export default router; 