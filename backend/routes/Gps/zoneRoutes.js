const express = require("express");
const router = express.Router();
const zoneController = require("../../controllers/zoneController");
// const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post("/", zoneController.createZone);
router.get("/", zoneController.getZones);
router.post("/check", zoneController.checkPointInZone);
router.post("/recalculate-all", zoneController.recalculateAllTouristZones);
router.get("/:id", zoneController.getZoneById);
router.put("/:id", zoneController.updateZone);
router.delete("/:id", zoneController.deleteZone);

module.exports = router;
