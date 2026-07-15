const express = require("express");

const router = express.Router();

const {

registerTourist,

getAllTourists,

getTourist,

updateTourist,

deleteTourist,

} = require("../controllers/touristController");

router.post("/", registerTourist);

router.get("/", getAllTourists);

router.get("/:id", getTourist);

router.put("/:id", updateTourist);

router.delete("/:id", deleteTourist);

module.exports = router;