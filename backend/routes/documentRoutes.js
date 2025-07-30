import express from 'express';
import { uploadDocument } from '../controllers/documentController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import authorizeRole from '../middleware/authorizeRole.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', verifyJWT, authorizeRole(['customer', 'shopOwner', 'admin']), upload.single('file'), uploadDocument);

export default router; 