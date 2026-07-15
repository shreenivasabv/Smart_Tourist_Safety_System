const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/dashboardController");
// const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get("/active-tourists", dashboardController.getActiveTourists);
router.get("/outside-safe-zone", dashboardController.getOutsideSafeZone);
router.get("/risk-level", dashboardController.getRiskLevelBreakdown);
router.get("/tourists-live", dashboardController.getTouristsLive);
router.get("/stats", dashboardController.getLiveStats);

module.exports = router;
