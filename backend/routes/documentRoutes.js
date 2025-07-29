import express from 'express';
import { uploadDocument, getUserDocuments, deleteDocument } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/', requireAuth, uploadSingle, uploadDocument);
router.get('/', requireAuth, getUserDocuments);
router.delete('/:id', requireAuth, deleteDocument);

export default router; 