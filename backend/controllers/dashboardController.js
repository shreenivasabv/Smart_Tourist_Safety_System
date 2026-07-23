const Tourist = require("../models/Tourist");
const Zone = require("../models/Gps/Zone");
const { computeOnlineStatus } = require("../utils/geoUtils");

const ONLINE_THRESHOLD_MINUTES = 5;

/**
 * GET /api/dashboard/active-tourists
 * Count + list of tourists currently online (pinged within the last N minutes).
 */
exports.getActiveTourists = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000);

    const activeTourists = await Tourist.find({ lastSeen: { $gte: cutoff } }).select(
      "fullName currentLocation lastSeen zoneStatus riskLevel"
    );

    return res.status(200).json({
      success: true,
      count: activeTourists.length,
      data: activeTourists,
    });
  } catch (err) {
    console.error('getActiveTourists error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/dashboard/outside-safe-zone
 * Count + list of tourists currently marked "outside" a safe zone.
 */
exports.getOutsideSafeZone = async (req, res) => {
  try {
    const tourists = await Tourist.find({ zoneStatus: 'outside' }).select(
      "fullName currentLocation lastSeen riskLevel currentZone"
    );

    return res.status(200).json({
      success: true,
      count: tourists.length,
      data: tourists,
    });
  } catch (err) {
    console.error('getOutsideSafeZone error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/dashboard/risk-level
 * Breakdown of tourists by risk level (low / medium / high).
 */
exports.getRiskLevelBreakdown = async (req, res) => {
  try {
    const breakdown = await Tourist.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    ]);

    const result = { low: 0, medium: 0, high: 0 };
    breakdown.forEach((b) => {
      if (b._id) result[b._id] = b.count;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('getRiskLevelBreakdown error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/dashboard/stats
 * Single combined payload for the "Monitoring" dashboard screen —
 * matches the cards seen in the frontend (Planned marker points, Sensitive route
 * segments, Geo-fence rules planned, plus live tourist stats).
 */
exports.getLiveStats = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000);

    const [
      totalTourists,
      activeTouristsCount,
      outsideSafeZoneCount,
      riskBreakdownRaw,
      totalZones,
      sensitiveZones,
    ] = await Promise.all([
      Tourist.countDocuments({}),
      Tourist.countDocuments({ lastSeen: { $gte: cutoff } }),
      Tourist.countDocuments({ zoneStatus: 'outside' }),
      Tourist.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
      Zone.countDocuments({ isActive: true }),
      Zone.countDocuments({ isActive: true, zoneType: 'sensitive' }),
    ]);

    const riskLevel = { low: 0, medium: 0, high: 0 };
    riskBreakdownRaw.forEach((r) => {
      if (r._id) riskLevel[r._id] = r.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalTourists,
        activeTourists: activeTouristsCount,
        outsideSafeZone: outsideSafeZoneCount,
        insideSafeZone: totalTourists - outsideSafeZoneCount,
        riskLevel,
        plannedMarkerPoints: totalZones, // adjust source if markers are tracked separately
        sensitiveRouteSegments: sensitiveZones,
        geoFenceRulesPlanned: totalZones,
        generatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('getLiveStats error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/dashboard/tourists-live
 * Full live feed: every tourist's latest position + status, recomputing
 * online/offline in real time (useful for a live map on the dashboard).
 */
exports.getTouristsLive = async (req, res) => {
  try {
    const tourists = await Tourist.find({}).select(
      "fullName currentLocation lastSpeedKmh lastSeen zoneStatus currentZone riskLevel lastLocationSource lastLocationAccuracy lastDeviceTimestamp"
    );

    const data = tourists.map((t) => ({
      ...t.toObject(),
      onlineStatus: computeOnlineStatus(t.lastSeen, ONLINE_THRESHOLD_MINUTES),
    }));

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('getTouristsLive error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
