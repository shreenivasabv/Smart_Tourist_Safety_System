const ResponseUnit = require("../models/ResponseUnit");

exports.listUnits = async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const data = await ResponseUnit.find(filter).sort({ status: 1, name: 1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) { res.status(500).json({ success: false, message: error.message || "Unable to load response units" }); }
};

exports.createUnit = async (req, res) => {
  try { res.status(201).json({ success: true, data: await ResponseUnit.create(req.body) }); }
  catch (error) { res.status(400).json({ success: false, message: error.message || "Unable to create response unit" }); }
};

exports.updateUnit = async (req, res) => {
  try {
    const data = await ResponseUnit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: "Response unit not found" });
    res.json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: error.message || "Unable to update response unit" }); }
};

exports.deleteUnit = async (req, res) => {
  try {
    const data = await ResponseUnit.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Response unit not found" });
    res.json({ success: true, message: "Response unit removed" });
  } catch (error) { res.status(500).json({ success: false, message: error.message || "Unable to remove response unit" }); }
};
