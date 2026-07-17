const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    speedKmh: { type: Number, default: 0 },
    accuracy: { type: Number, default: null }, // meters, optional from device GPS
    source: { type: String, default: "manual" },
    deviceTimestamp: { type: Date, default: null },
    batteryLevel: { type: Number, default: null },
    heading: { type: Number, default: null },
    altitude: { type: Number, default: null },
    zoneStatusAtPoint: {
      type: String,
      enum: ['inside', 'outside', 'unknown'],
      default: 'unknown',
    },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

locationHistorySchema.index({ location: '2dsphere' });
locationHistorySchema.index({ tourist: 1, recordedAt: -1 });

module.exports = mongoose.model('LocationHistory', locationHistorySchema);
