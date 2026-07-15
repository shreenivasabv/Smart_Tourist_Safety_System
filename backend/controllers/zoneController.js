const Zone = require("../models/Gps/Zone");
const Tourist = require("../models/Tourist");
const { isPointInPolygon } = require("../utils/geoUtils");
const { findContainingZone } = require("../utils/zoneService");

/**
 * Ensures a polygon ring is closed (first point === last point), as GeoJSON requires.
 */
function closeRingIfNeeded(ring) {
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) {
    ring.push([firstLng, firstLat]);
  }
  return ring;
}

/**
 * POST /api/zones
 * Body: { name, description, riskLevel, zoneType, coordinates: [[lng,lat], ...] }
 * `coordinates` is a single ring of at least 3 points (outer ring only).
 */
exports.createZone = async (req, res) => {
  try {
    const { name, description, riskLevel, zoneType, coordinates, createdBy } = req.body;

    if (!name || !Array.isArray(coordinates) || coordinates.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'name and at least 3 [lng,lat] coordinate pairs are required',
      });
    }

    const ring = closeRingIfNeeded([...coordinates]);

    const zone = await Zone.create({
      name,
      description,
      riskLevel,
      zoneType,
      createdBy,
      polygon: { type: 'Polygon', coordinates: [ring] },
    });

    return res.status(201).json({ success: true, data: zone });
  } catch (err) {
    console.error('createZone error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * PUT /api/zones/:id
 * Any subset of { name, description, riskLevel, zoneType, isActive, coordinates }.
 */
exports.updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, riskLevel, zoneType, isActive, coordinates } = req.body;

    const zone = await Zone.findById(id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    if (name !== undefined) zone.name = name;
    if (description !== undefined) zone.description = description;
    if (riskLevel !== undefined) zone.riskLevel = riskLevel;
    if (zoneType !== undefined) zone.zoneType = zoneType;
    if (isActive !== undefined) zone.isActive = isActive;
    if (Array.isArray(coordinates) && coordinates.length >= 3) {
      zone.polygon = { type: 'Polygon', coordinates: [closeRingIfNeeded([...coordinates])] };
    }

    await zone.save();
    return res.status(200).json({ success: true, data: zone });
  } catch (err) {
    console.error('updateZone error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * DELETE /api/zones/:id
 */
exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByIdAndDelete(id);

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    return res.status(200).json({ success: true, message: 'Zone deleted' });
  } catch (err) {
    console.error('deleteZone error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/zones
 * List all zones (for the "Marker planning map" on the Monitoring dashboard).
 */
exports.getZones = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';

    const zones = await Zone.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (err) {
    console.error('getZones error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/zones/:id
 */
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    return res.status(200).json({ success: true, data: zone });
  } catch (err) {
    console.error('getZoneById error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * POST /api/zones/check
 * Body: { latitude, longitude }
 * Ad-hoc check: is this point inside any active zone? Uses MongoDB geo query,
 * with an in-memory ray-cast fallback for verification/testing without an index.
 */
exports.checkPointInZone = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });
    }

    const coords = [Number(longitude), Number(latitude)];
    const zone = await findContainingZone(coords);

    return res.status(200).json({
      success: true,
      data: {
        point: coords,
        insideZone: !!zone,
        zone: zone || null,
      },
    });
  } catch (err) {
    console.error('checkPointInZone error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * POST /api/zones/recalculate-all
 * Admin utility: re-evaluates every tourist's currentLocation against all zones.
 * Useful right after a zone's polygon has been edited.
 */
exports.recalculateAllTouristZones = async (req, res) => {
  try {
    const zones = await Zone.find({ isActive: true });
    const tourists = await Tourist.find({});

    let updated = 0;

    for (const tourist of tourists) {
      const coords = tourist.currentLocation?.coordinates;
      if (!coords || (coords[0] === 0 && coords[1] === 0)) continue;

      let matchedZone = null;
      for (const zone of zones) {
        const ring = zone.polygon.coordinates[0];
        if (isPointInPolygon(coords, ring)) {
          matchedZone = zone;
          break;
        }
      }

      tourist.zoneStatus = matchedZone && matchedZone.zoneType === 'safe' ? 'inside' : 'outside';
      tourist.currentZone = matchedZone ? matchedZone._id : null;
      tourist.riskLevel = matchedZone ? matchedZone.riskLevel : 'high';
      await tourist.save();
      updated += 1;
    }

    return res.status(200).json({ success: true, message: `Recalculated ${updated} tourists` });
  } catch (err) {
    console.error('recalculateAllTouristZones error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
