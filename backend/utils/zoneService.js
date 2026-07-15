const Zone = require("../models/Gps/Zone");

/**
 * Finds the first active zone (if any) whose polygon contains the given point.
 * Uses MongoDB's native $geoIntersects (requires the 2dsphere index on Zone.polygon).
 *
 * @param {[number, number]} coordinates [longitude, latitude]
 * @returns {Promise<Object|null>} the matching Zone document, or null if outside all zones
 */
async function findContainingZone(coordinates) {
  const zone = await Zone.findOne({
    isActive: true,
    polygon: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
      },
    },
  });

  return zone;
}

/**
 * Given a point, returns the zone status + zone doc + derived risk level.
 * This is the "Automatic Status Update" logic used after every GPS ping.
 */
async function evaluateZoneStatus(coordinates) {
  const zone = await findContainingZone(coordinates);

  if (!zone) {
    return {
      zoneStatus: 'outside',
      currentZone: null,
      riskLevel: 'high', // outside all known safe zones => treat as high risk by default
    };
  }

  // Inside a zone: if it's a "restricted" or "sensitive" zone, risk follows the zone's own riskLevel.
  // If it's a "safe" zone, risk is whatever the zone defines (usually low).
  return {
    zoneStatus: zone.zoneType === 'safe' ? 'inside' : 'outside',
    currentZone: zone._id,
    riskLevel: zone.riskLevel,
  };
}

module.exports = { findContainingZone, evaluateZoneStatus };
