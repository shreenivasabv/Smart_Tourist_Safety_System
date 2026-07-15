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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tourist", touristSchema);