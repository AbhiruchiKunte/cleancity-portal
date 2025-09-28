import express from 'express';
import { authenticateAdmin } from '../utils/auth.js';
import { validateRecord, exportRecords } from '../controllers/adminController.js';

const router = express.Router();

// Apply admin authentication to all admin routes
router.use(authenticateAdmin);

/**
 * POST /api/admin/validate/:id - Validate a single record. (Module B6)
 */
router.post('/validate/:id', validateRecord);

/**
 * GET /api/admin/export - CSV export of validated records. (Module B6)
 */
router.get('/export', exportRecords);

export default router;
