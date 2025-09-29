import express from 'express';
import { authenticateAdmin } from '../utils/auth.js';
import { validateRecord, exportRecords, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

/**
 * POST /api/admin/login - Admin login route
 */
router.post('/login', loginAdmin);

// Protected routes
router.use(authenticateAdmin);

router.post('/validate/:id', validateRecord);
router.get('/export', exportRecords);

export default router;