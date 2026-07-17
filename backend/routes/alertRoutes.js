const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");

router.get("/capabilities", alertController.getAlertCapabilities);
router.post("/device/register", alertController.registerTouristDevice);
router.post("/send", alertController.sendTouristAlert);

module.exports = router;
