import Record from '../models/Record.js';
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
    const leaderboard = await Record.aggregate([
      // Only count validated records
      { $match: { validated: true } }, 
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: 1 } // 1 point per validated record
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 20 }
    ]);
    
    // Rename _id to userId for cleaner output
    const formattedLeaderboard = leaderboard.map(item => ({
        userId: item._id,
        totalPoints: item.totalPoints
    }));

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error generating leaderboard' });
  }
};

/**
 * GET /api/hotspots: Aggregates frequent lat/lng clusters. (Module B5)
 * Uses aggregation to group records by location (approximated for simplicity).
 */
const getHotspots = async (req, res) => {
  try {
    // Simple binning by rounding coordinates to 3 decimal places (approx 100m)
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

export { getRecentRecords, getLeaderboard, getHotspots };
