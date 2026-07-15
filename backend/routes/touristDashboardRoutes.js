const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/touristDashboardController");

router.get("/", getDashboardStats);

module.exports = router;
