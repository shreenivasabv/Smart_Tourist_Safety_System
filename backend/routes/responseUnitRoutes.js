const express = require("express");
const controller = require("../controllers/responseUnitController");
const router = express.Router();

router.route("/").get(controller.listUnits).post(controller.createUnit);
router.route("/:id").patch(controller.updateUnit).delete(controller.deleteUnit);

module.exports = router;
