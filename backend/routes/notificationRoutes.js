import express from 'express';
import { sendNotification } from '../controllers/notificationController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import authorizeRole from '../middleware/authorizeRole.js';

const router = express.Router();

router.post('/send', verifyJWT, authorizeRole(['admin', 'shopOwner']), sendNotification);

export default router; 