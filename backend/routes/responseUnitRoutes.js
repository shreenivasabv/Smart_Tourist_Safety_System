const express = require("express");
const controller = require("../controllers/responseUnitController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.use(authMiddleware);

router.route("/").get(controller.listUnits).post(controller.createUnit);
router.route("/:id").patch(controller.updateUnit).delete(controller.deleteUnit);

module.exports = router;
