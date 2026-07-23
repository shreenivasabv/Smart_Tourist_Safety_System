const Tourist = require("../models/Tourist");
const LocationHistory = require("../models/Gps/LocationHistory");
const { calculateSpeedKmh, computeOnlineStatus } = require("../utils/geoUtils");
const { evaluateZoneStatus } = require("../utils/zoneService");

async function persistLocationUpdate({
  touristId,
  latitude,
  longitude,
  accuracy = null,
  source = "manual",
  deviceTimestamp = null,
  batteryLevel = null,
  heading = null,
  altitude = null,
}) {
  if (!touristId || latitude === undefined || longitude === undefined) {
    const error = new Error("touristId, latitude and longitude are required");
    error.statusCode = 400;
    throw error;
  }

  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    const error = new Error("Tourist not found");
    error.statusCode = 404;
    throw error;
  }

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    const error = new Error("latitude and longitude must be valid numbers");
    error.statusCode = 400;
    throw error;
  }

  const newCoords = [parsedLongitude, parsedLatitude];
  const now = new Date();
  const parsedDeviceTimestamp = deviceTimestamp ? new Date(deviceTimestamp) : null;

  let speedKmh = 0;
  const prevCoords = tourist.currentLocation?.coordinates;
  const prevSeen = tourist.lastSeen;
  if (prevCoords && prevCoords.length === 2 && (prevCoords[0] !== 0 || prevCoords[1] !== 0) && prevSeen) {
    speedKmh = calculateSpeedKmh(prevCoords, prevSeen, newCoords, now);
  }

  const { zoneStatus, currentZone, riskLevel } = await evaluateZoneStatus(newCoords);

  await LocationHistory.create({
    tourist: touristId,
    location: { type: "Point", coordinates: newCoords },
    speedKmh,
    accuracy: accuracy ?? null,
    source,
    deviceTimestamp: parsedDeviceTimestamp,
    batteryLevel: batteryLevel ?? null,
    heading: heading ?? null,
    altitude: altitude ?? null,
    zoneStatusAtPoint: zoneStatus,
    recordedAt: now,
  });

  tourist.currentLocation = { type: "Point", coordinates: newCoords };
  tourist.lastSpeedKmh = speedKmh;
  tourist.lastSeen = now;
  tourist.onlineStatus = "online";
  tourist.zoneStatus = zoneStatus;
  tourist.currentZone = currentZone;
  tourist.riskLevel = riskLevel;
  tourist.lastLocationSource = source;
  tourist.lastLocationAccuracy = accuracy ?? null;
  tourist.lastDeviceTimestamp = parsedDeviceTimestamp;
  await tourist.save();

  return {
    touristId,
    fullName: tourist.fullName,
    location: newCoords,
    speedKmh,
    zoneStatus,
    currentZone,
    riskLevel,
    lastSeen: now,
    lastLocationSource: source,
    lastLocationAccuracy: accuracy ?? null,
    lastDeviceTimestamp: parsedDeviceTimestamp,
  };
}

/**
 * POST /api/gps/update
 * Body: { touristId, latitude, longitude, accuracy? }
 * Called by the mobile app periodically (e.g. every 15-30s).
 */
exports.updateLocation = async (req, res) => {
  try {
    const data = await persistLocationUpdate({
      touristId: req.body.touristId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy,
      source: req.body.source || "manual",
      deviceTimestamp: req.body.deviceTimestamp,
      batteryLevel: req.body.batteryLevel,
      heading: req.body.heading,
      altitude: req.body.altitude,
    });

    return res.status(200).json({
      success: true,
      message: "Location updated",
      data,
    });
  } catch (err) {
    console.error("updateLocation error:", err);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server error", error: err.message });
  }
};

/**
 * POST /api/gps/mobile-update
 * Body: { touristId, latitude, longitude, accuracy?, deviceTimestamp?, batteryLevel?, heading?, altitude?, source? }
 * Mobile-ready endpoint for future Android/iOS apps.
 */
exports.updateLocationFromMobile = async (req, res) => {
  try {
    const data = await persistLocationUpdate({
      touristId: req.body.touristId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy,
      source: req.body.source || "android-app",
      deviceTimestamp: req.body.deviceTimestamp,
      batteryLevel: req.body.batteryLevel,
      heading: req.body.heading,
      altitude: req.body.altitude,
    });

    return res.status(202).json({
      success: true,
      message: "Mobile location accepted",
      data,
    });
  } catch (err) {
    console.error("updateLocationFromMobile error:", err);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server error", error: err.message });
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



/**
 * GET /api/gps/all-current
 * Returns latest location + status for all tourists with a valid fix.
 * Used by the Monitoring dashboard to render every marker at once.
 */
exports.getAllCurrentLocations = async (req, res) => {
  try {
    const tourists = await Tourist.find({
      "currentLocation.coordinates.0": { $ne: 0 },
    }).select("fullName currentLocation lastSpeedKmh lastSeen onlineStatus zoneStatus currentZone riskLevel lastLocationSource lastLocationAccuracy lastDeviceTimestamp");

    const data = tourists.map((t) => ({
      ...t.toObject(),
      onlineStatus: computeOnlineStatus(t.lastSeen),
    }));

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error("getAllCurrentLocations error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
