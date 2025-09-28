import express from 'express';
import { getRecentRecords, getLeaderboard, getHotspots } from '../controllers/dataController.js';

const router = express.Router();

/**
 * GET /api/records - Recent validated records. (Module B5)
 */
router.get('/records', getRecentRecords);

/**
 * GET /api/leaderboard - Aggregate points by user. (Module B5)
 */
router.get('/leaderboard', getLeaderboard);

/**
 * GET /api/hotspots - Aggregate frequent location clusters. (Module B5)
 */
router.get('/hotspots', getHotspots);

export default router;
