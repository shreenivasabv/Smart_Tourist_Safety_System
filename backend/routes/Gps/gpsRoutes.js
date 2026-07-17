const express = require("express");
const router = express.Router();
const gpsController = require("../../controllers/gpsController");
// const { protect } = require('../middleware/authMiddleware'); // plug in your existing JWT middleware

router.post("/update", gpsController.updateLocation);
router.post("/mobile-update", gpsController.updateLocationFromMobile);
router.get("/current/:touristId", gpsController.getCurrentLocation);
router.get("/history/:touristId", gpsController.getLocationHistory);
router.get("/status/:touristId", gpsController.getOnlineStatus);
router.get("/all-current", gpsController.getAllCurrentLocations);

module.exports = router;
