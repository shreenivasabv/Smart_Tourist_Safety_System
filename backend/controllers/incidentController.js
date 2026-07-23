const Incident = require("../models/Incident");
const Tourist = require("../models/Tourist");

const allowedUpdates = ["type", "priority", "status", "title", "description", "locationLabel", "location", "reportedBy", "assignedTo", "resolutionNote"];

function createReference() {
  return `INC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function validPoint(location) {
  return Array.isArray(location?.coordinates) && location.coordinates.length === 2 && location.coordinates.every(Number.isFinite);
}

exports.listIncidents = async (req, res) => {
  try {
    const { status, priority, limit = 100 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const incidents = await Incident.find(filter).populate("tourist", "fullName phone email").sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 100, 250));
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to load incidents" });
  }
};

exports.getIncidentSummary = async (_req, res) => {
  try {
    const counts = await Incident.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const priorityCounts = await Incident.aggregate([{ $match: { status: { $nin: ["resolved", "closed"] } } }, { $group: { _id: "$priority", count: { $sum: 1 } } }]);
    const byStatus = Object.fromEntries(counts.map((item) => [item._id, item.count]));
    const byPriority = Object.fromEntries(priorityCounts.map((item) => [item._id, item.count]));
    res.json({ success: true, data: { open: (byStatus.open || 0) + (byStatus.acknowledged || 0) + (byStatus.responding || 0), critical: byPriority.critical || 0, resolvedToday: await Incident.countDocuments({ resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to load incident summary" });
  }
};

exports.createIncident = async (req, res) => {
  try {
    const payload = { ...req.body, reference: createReference() };
    if (payload.tourist) {
      const tourist = await Tourist.findById(payload.tourist).select("fullName currentLocation");
      if (!tourist) return res.status(404).json({ success: false, message: "Tourist not found" });
      payload.touristName = tourist.fullName;
      if (!validPoint(payload.location) && validPoint(tourist.currentLocation) && tourist.currentLocation.coordinates.some((value) => value !== 0)) payload.location = tourist.currentLocation.toObject();
    }
    if (!validPoint(payload.location)) delete payload.location;
    const incident = await Incident.create(payload);
    const populated = await incident.populate("tourist", "fullName phone email");
    res.status(201).json({ success: true, message: "Incident created", data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to create incident" });
  }
};

exports.updateIncident = async (req, res) => {
  try {
    const update = Object.fromEntries(allowedUpdates.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key]]));
    if (update.location && !validPoint(update.location)) return res.status(400).json({ success: false, message: "location must contain longitude and latitude" });
    if (["resolved", "closed"].includes(update.status)) update.resolvedAt = new Date();
    if (update.status && !["resolved", "closed"].includes(update.status)) update.resolvedAt = null;
    const incident = await Incident.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate("tourist", "fullName phone email");
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
    res.json({ success: true, message: "Incident updated", data: incident });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to update incident" });
  }
};
