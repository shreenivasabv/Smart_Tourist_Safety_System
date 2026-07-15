/**
 * Geo utility functions shared by GPS tracking and geofencing modules.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Haversine distance between two [lng, lat] points, in kilometers.
 */
function haversineDistanceKm([lng1, lat1], [lng2, lat2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate speed in km/h given a previous and current point + timestamps.
 * @param {[number,number]} prevCoords [lng, lat]
 * @param {Date|string} prevTime
 * @param {[number,number]} currCoords [lng, lat]
 * @param {Date|string} currTime
 * @returns {number} speed in km/h, 0 if time delta is invalid/too small
 */
function calculateSpeedKmh(prevCoords, prevTime, currCoords, currTime) {
  const distanceKm = haversineDistanceKm(prevCoords, currCoords);
  const timeDeltaHours =
    (new Date(currTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60 / 60;

  if (timeDeltaHours <= 0) return 0;

  const speed = distanceKm / timeDeltaHours;
  // Clamp unrealistic GPS-jitter spikes (e.g. > 300 km/h) to avoid false alerts
  return Number.isFinite(speed) ? Math.min(speed, 300) : 0;
}

/**
 * Ray-casting point-in-polygon algorithm.
 * Used as an in-memory fallback / validation alongside MongoDB's $geoWithin.
 * @param {[number,number]} point [lng, lat]
 * @param {[number,number][]} polygonCoords single ring: [[lng,lat], ...]
 */
function isPointInPolygon([lng, lat], polygonCoords) {
  let inside = false;
  for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
    const [xi, yi] = polygonCoords[i];
    const [xj, yj] = polygonCoords[j];

    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Determine online/offline status from lastSeen timestamp.
 * Default threshold: 5 minutes of silence => offline.
 */
function computeOnlineStatus(lastSeen, thresholdMinutes = 5) {
  if (!lastSeen) return 'offline';
  const diffMinutes = (Date.now() - new Date(lastSeen).getTime()) / 1000 / 60;
  return diffMinutes <= thresholdMinutes ? 'online' : 'offline';
}

module.exports = {
  haversineDistanceKm,
  calculateSpeedKmh,
  isPointInPolygon,
  computeOnlineStatus,
};
