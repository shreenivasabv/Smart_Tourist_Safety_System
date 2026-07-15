const mongoose = require("mongoose");

const touristSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    emergencyContact: {
      type: String,
      required: true,
    },

    zone: {
      type: String,
      required: true,
    },

    hotel: {
      type: String,
      required: true,
    },

    visitPurpose: {
      type: String,
      required: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    trackingConsent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Safe", "Monitoring", "Support Needed"],
      default: "Safe",
    },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    lastSpeedKmh: {
      type: Number,
      default: 0,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    onlineStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    zoneStatus: {
      type: String,
      enum: ["inside", "outside", "unknown"],
      default: "unknown",
    },

    currentZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      default: null,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  {
    timestamps: true,
  }
);

touristSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Tourist", touristSchema);
