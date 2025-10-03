import express from 'express';
import { authenticateAdmin } from '../utils/auth.js';
// Corrected the import to match the exports from the controller
import { loginAdmin, validateRecord, listPendingRecords, generateReport } from '../controllers/adminController.js';

const router = express.Router();

/**
 * POST /api/admin/login - Admin login route
 */
router.post('/login', loginAdmin);

/*
// The 'debugStats' function does not exist in the controller yet.
// This route is commented out to prevent a crash.
// You can uncomment it after you create the function.
router.get('/debug-stats', debugStats);
*/


// Protected routes - any route below this line will require admin authentication
router.use(authenticateAdmin);

router.post('/validate/:id', validateRecord);

/*
// The 'exportRecords' function does not exist in the controller yet.
// This route is commented out to prevent a crash.
router.get('/export', exportRecords);
*/

// Corrected this to use 'listPendingRecords' which is the actual function name
router.get('/pending', listPendingRecords);

router.post('/report', generateReport);

export default router;