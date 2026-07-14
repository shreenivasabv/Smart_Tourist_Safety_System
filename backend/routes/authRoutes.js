const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  logoutAdmin,
} = require("../controllers/authController");

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/logout", logoutAdmin);

module.exports = router;