const mongoose = require("mongoose");

const responseUnitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  type: { type: String, enum: ["police", "hospital"], required: true, index: true },
  coverageArea: { type: String, trim: true, default: "" },
  contact: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["available", "busy", "offline"], default: "available", index: true },
  capacity: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 1000, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("ResponseUnit", responseUnitSchema);
