const express = require("express");
const controller = require("../controllers/incidentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);
router.get("/summary", controller.getIncidentSummary);
router.get("/", controller.listIncidents);
router.post("/", controller.createIncident);
router.patch("/:id", controller.updateIncident);

module.exports = router;
