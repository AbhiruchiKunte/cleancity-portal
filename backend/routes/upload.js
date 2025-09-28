import express from 'express';
import { uploadRecord } from '../controllers/uploadController.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

/**
 * POST /api/upload - File Upload + Classification API (Module B4)
 * Uses Multer middleware to handle 'image' file upload.
 */
router.post('/upload', upload.single('image'), uploadRecord);

export default router;
