const Tourist = require("../models/Tourist");
const LocationHistory = require("../models/Gps/LocationHistory");
const { calculateSpeedKmh, computeOnlineStatus } = require("../utils/geoUtils");
const { evaluateZoneStatus } = require("../utils/zoneService");

/**
 * POST /api/gps/update
 * Body: { touristId, latitude, longitude, accuracy? }
 * Called by the mobile app periodically (e.g. every 15-30s).
 */
exports.updateLocation = async (req, res) => {
  try {
    const { touristId, latitude, longitude, accuracy } = req.body;

    if (!touristId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "touristId, latitude and longitude are required",
      });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: "Tourist not found" });
    }

    const newCoords = [Number(longitude), Number(latitude)]; // GeoJSON order
    const now = new Date();

    // ---- Speed calculation (based on previous stored point) ----
    let speedKmh = 0;
    const prevCoords = tourist.currentLocation?.coordinates;
    const prevSeen = tourist.lastSeen;
    if (prevCoords && prevCoords.length === 2 && (prevCoords[0] !== 0 || prevCoords[1] !== 0) && prevSeen) {
      speedKmh = calculateSpeedKmh(prevCoords, prevSeen, newCoords, now);
    }

    // ---- Geofence check (Module 4 auto status update) ----
    const { zoneStatus, currentZone, riskLevel } = await evaluateZoneStatus(newCoords);

    // ---- Persist history record ----
    await LocationHistory.create({
      tourist: touristId,
      location: { type: "Point", coordinates: newCoords },
      speedKmh,
      accuracy: accuracy ?? null,
      zoneStatusAtPoint: zoneStatus,
      recordedAt: now,
    });

    // ---- Update tourist's live snapshot ----
    tourist.currentLocation = { type: "Point", coordinates: newCoords };
    tourist.lastSpeedKmh = speedKmh;
    tourist.lastSeen = now;
    tourist.onlineStatus = "online";
    tourist.zoneStatus = zoneStatus;
    tourist.currentZone = currentZone;
    tourist.riskLevel = riskLevel;
    await tourist.save();

    return res.status(200).json({
      success: true,
      message: "Location updated",
      data: {
        touristId,
        location: newCoords,
        speedKmh,
        zoneStatus,
        currentZone,
        riskLevel,
        lastSeen: now,
      },
    });
  } catch (err) {
    console.error("updateLocation error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * GET /api/gps/current/:touristId
 * Returns the latest known location + online status for one tourist.
 */
exports.getCurrentLocation = async (req, res) => {
  try {
    const { touristId } = req.params;
    const tourist = await Tourist.findById(touristId).select(
      "fullName currentLocation lastSpeedKmh lastSeen onlineStatus zoneStatus currentZone riskLevel"
    );

    if (!tourist) {
      return res.status(404).json({ success: false, message: "Tourist not found" });
    }

    // Recompute online status live (in case no ping came in and no cron has run yet)
    const liveStatus = computeOnlineStatus(tourist.lastSeen);

    return res.status(200).json({
      success: true,
      data: { ...tourist.toObject(), onlineStatus: liveStatus },
    });
  } catch (err) {
    console.error("getCurrentLocation error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * GET /api/gps/history/:touristId?from=&to=&limit=
 * Returns stored location history for a tourist, optionally filtered by date range.
 */
exports.getLocationHistory = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { from, to, limit = 200 } = req.query;

    const filter = { tourist: touristId };
    if (from || to) {
      filter.recordedAt = {};
      if (from) filter.recordedAt.$gte = new Date(from);
      if (to) filter.recordedAt.$lte = new Date(to);
    }

    const history = await LocationHistory.find(filter)
      .sort({ recordedAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) {
    console.error("getLocationHistory error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * GET /api/gps/status/:touristId
 * Quick online/offline + last-seen lookup.
 */
exports.getOnlineStatus = async (req, res) => {
  try {
    const { touristId } = req.params;
    const tourist = await Tourist.findById(touristId).select("lastSeen onlineStatus");

    if (!tourist) {
      return res.status(404).json({ success: false, message: "Tourist not found" });
    }

    const status = computeOnlineStatus(tourist.lastSeen);

    return res.status(200).json({
      success: true,
      data: { touristId, lastSeen: tourist.lastSeen, onlineStatus: status },
    });
  } catch (err) {
    console.error("getOnlineStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
