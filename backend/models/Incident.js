const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, sparse: true, index: true },
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", default: null, index: true },
    touristName: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["medical", "missing", "security", "lost", "accident", "other"],
      required: true,
    },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium", index: true },
    status: { type: String, enum: ["open", "acknowledged", "responding", "resolved", "closed"], default: "open", index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, default: "", maxlength: 2000 },
    locationLabel: { type: String, trim: true, default: "" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined },
    },
    reportedBy: { type: String, trim: true, default: "Control room" },
    assignedTo: { type: String, trim: true, default: "" },
    resolutionNote: { type: String, trim: true, default: "", maxlength: 2000 },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ location: "2dsphere", sparse: true });

module.exports = mongoose.model("Incident", incidentSchema);
