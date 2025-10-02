import Record from '../models/Record.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * GET /api/records: Returns recent, validated records. (Module B5)
 */
const getRecentRecords = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const records = await Record.find({ validated: true })
      .sort({ timestamp: -1 })
      .limit(limit);
      
    res.json(records);
  } catch (error) {
    console.error('Error fetching recent records:', error);
    res.status(500).json({ message: 'Error fetching records' });
  }
};

/**
 * GET /api/leaderboard: Aggregates points by user. (Module B5)
 * Points simplified: 1 point per validated record.
 */
const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const leaderboard = await Record.aggregate([
      { $match: { validated: true } },
      { $group: { _id: '$userId', points: { $sum: 1 }, contributions: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { userId: '$_id', username: '$user.username', firstName: '$user.firstName', points: 1, contributions: 1 } }
    ]);

    res.json(leaderboard.map(item => ({
      userId: item.userId,
      username: item.username || null,
      firstName: item.firstName || null,
      points: item.points || 0,
      contributions: item.contributions || 0
    })));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error generating leaderboard' });
  }
};

/**
 * GET /api/leaderboard/top - returns top N contributors (default 3)
 */
const getTopContributors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const top = await Record.aggregate([
      { $match: { validated: true } },
      { $group: { _id: '$userId', points: { $sum: 1 }, contributions: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $limit: limit },
      {
        $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { userId: '$_id', username: '$user.username', firstName: '$user.firstName', points: 1, contributions: 1 } }
    ]);

    res.json(top.map(item => ({
      userId: item.userId,
      username: item.username || null,
      firstName: item.firstName || null,
      points: item.points || 0,
      contributions: item.contributions || 0
    })));
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    res.status(500).json({ message: 'Error fetching top contributors' });
  }
};

/**
 * GET /api/leaderboard/full - returns full leaderboard (supports ?limit)
 */
const getFullLeaderboard = async (req, res) => {
  return getLeaderboard(req, res);
};

/**
 * GET /api/leaderboard/me - returns user's rank, points, contributions (requires auth)
 */
const getMyLeaderboard = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: missing user' });

    const leaderboard = await Record.aggregate([
      { $match: { validated: true } },
      { $group: { _id: '$userId', points: { $sum: 1 }, contributions: { $sum: 1 } } },
      { $sort: { points: -1 } }
    ]);

    let rank = null;
    let userStat = null;
    for (let i = 0; i < leaderboard.length; i++) {
      const item = leaderboard[i];
      if (item._id.toString() === userId.toString()) {
        rank = i + 1;
        userStat = { userId: item._id, points: item.points, contributions: item.contributions };
        break;
      }
    }

    if (!userStat) {
      const totalContributions = await Record.countDocuments({ userId: mongoose.Types.ObjectId(userId) });
      return res.json({ rank: null, points: 0, contributions: totalContributions });
    }

    res.json({ rank, ...userStat });
  } catch (error) {
    console.error('Error fetching my leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard data for user' });
  }
};

/**
 * GET /api/achievements/me - derive simple achievements for the current user
 */
const getMyAchievements = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: missing user' });

    const totalUploads = await Record.countDocuments({ userId: mongoose.Types.ObjectId(userId) });
    const validatedUploads = await Record.countDocuments({ userId: mongoose.Types.ObjectId(userId), validated: true });

    const achievements = [];
    if (totalUploads >= 1) achievements.push({ name: 'First Upload', achieved: true });
    if (totalUploads >= 10) achievements.push({ name: '10 Uploads', achieved: true });
    if (totalUploads >= 50) achievements.push({ name: '50 Uploads', achieved: true });
    if (validatedUploads >= 1) achievements.push({ name: 'First Validated', achieved: true });
    if (validatedUploads >= 10) achievements.push({ name: '10 Validated', achieved: true });

    res.json({ totalUploads, validatedUploads, achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

/**
 * GET /api/progress/monthly/me - returns current month progress for the user
 */
const getMyMonthlyProgress = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: missing user' });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthCount = await Record.countDocuments({ userId: mongoose.Types.ObjectId(userId), timestamp: { $gte: startOfMonth, $lt: endOfMonth } });
    const target = 10;

    res.json({ monthCount, target, percent: Math.min(100, Math.round((monthCount / target) * 100)) });
  } catch (error) {
    console.error('Error fetching monthly progress:', error);
    res.status(500).json({ message: 'Error fetching monthly progress' });
  }
};

/**
 * GET /api/hotspots: Aggregates frequent lat/lng clusters. (Module B5)
 * Uses aggregation to group records by location (approximated for simplicity).
 */
const getHotspots = async (req, res) => {
  try {
    const hotspots = await Record.aggregate([
        { $match: { validated: true } },
        {
            $project: {
                lat_binned: { $round: ["$lat", 3] }, // Group by rounded lat/lng
                lng_binned: { $round: ["$lng", 3] }
            }
        },
        {
            $group: {
                _id: { lat: "$lat_binned", lng: "$lng_binned" },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 50 }
    ]);
    
    // Format the output
    const formattedHotspots = hotspots.map(item => ({
        lat: item._id.lat,
        lng: item._id.lng,
        count: item.count
    }));

    res.json(formattedHotspots);

  } catch (error) {
    console.error('Error fetching hotspots:', error);
    res.status(500).json({ message: 'Error generating hotspots' });
  }
};

export { getRecentRecords, getLeaderboard, getHotspots, getTopContributors, getFullLeaderboard, getMyLeaderboard, getMyAchievements, getMyMonthlyProgress };
