import express from 'express';
import { authenticateAdmin } from '../utils/auth.js';
import { validateRecord, exportRecords, loginAdmin, getPendingRecords, generateReport, debugStats } from '../controllers/adminController.js';

const router = express.Router();

/**
 * POST /api/admin/login - Admin login route
 */
router.post('/login', loginAdmin);

// debug stats route to inspect pending/validated counts
router.get('/debug-stats', debugStats);

// Protected routes
router.use(authenticateAdmin);
router.post('/validate/:id', validateRecord);
router.get('/export', exportRecords);
router.get('/pending', getPendingRecords);
router.post('/report', generateReport);

export default router;