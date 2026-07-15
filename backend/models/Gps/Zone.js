const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },

    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },

    zoneType: {
      type: String,
      enum: ['safe', 'restricted', 'sensitive'],
      default: 'safe',
    },

    // GeoJSON Polygon: coordinates = [ [ [lng,lat], [lng,lat], ..., [firstPointAgain] ] ]
    // First and last coordinate pair MUST be identical (closed ring).
    polygon: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },

    isActive: { type: Boolean, default: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // adjust ref name to your existing admin/user model
    },
  },
  { timestamps: true }
);

zoneSchema.index({ polygon: '2dsphere' });

module.exports = mongoose.model('Zone', zoneSchema);
