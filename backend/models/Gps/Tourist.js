const mongoose = require('mongoose');

/**
 * Tourist model
 * Extend this with your existing auth/profile fields (Module 1/2).
 * The fields below are the ones required by Module 3 (GPS Tracking)
 * and Module 4 (Geofencing) so the dashboard (Module 5) can query them directly.
 */
const touristSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },

    // ---- GPS Tracking (Module 3) ----
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        // [longitude, latitude]  <-- GeoJSON order, NOT [lat, lng]
        type: [Number],
        default: [0, 0],
      },
    },
    lastSpeedKmh: { type: Number, default: 0 },
    lastSeen: { type: Date, default: null },
    onlineStatus: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },

    // ---- Geofencing (Module 4) ----
    zoneStatus: {
      type: String,
      enum: ['inside', 'outside', 'unknown'],
      default: 'unknown',
    },
    currentZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      default: null,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);

// 2dsphere index enables $geoWithin / $geoIntersects / $near queries
touristSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Tourist', touristSchema);
