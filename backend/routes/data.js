import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
	getRecentRecords,
	getLeaderboard,
	getHotspots,
	getTopContributors,
	getFullLeaderboard,
	getMyLeaderboard,
	getMyAchievements,
	getMyMonthlyProgress
} from '../controllers/dataController.js';

const router = express.Router();

// Public endpoints
router.get('/records', getRecentRecords);
router.get('/hotspots', getHotspots);
router.get('/leaderboard/top', getTopContributors);
router.get('/leaderboard', getFullLeaderboard);

// Authenticated user endpoints
router.get('/leaderboard/me', authMiddleware, getMyLeaderboard);
router.get('/achievements/me', authMiddleware, getMyAchievements);
router.get('/progress/monthly/me', authMiddleware, getMyMonthlyProgress);

export default router;
