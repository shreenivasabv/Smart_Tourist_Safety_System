const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const registrations = [];

function createHash(payload) {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

router.post("/register", (req, res) => {
  const {
    name,
    email,
    phone,
    country,
    emergencyContact,
    deploymentArea,
    localStay,
    visitPurpose,
    arrivalDate,
    trackingConsent,
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "Name, email, and phone are required." });
  }

  const registrationPayload = {
    name,
    email,
    phone,
    country: country || "Unknown",
    emergencyContact: emergencyContact || "",
    deploymentArea: deploymentArea || "Pilot Tourist Safety Zone",
    localStay: localStay || "",
    visitPurpose: visitPurpose || "",
    arrivalDate: arrivalDate || "",
    trackingConsent: trackingConsent || "pending",
  };

  const record = {
    id: `USR-${String(registrations.length + 1).padStart(3, "0")}`,
    ...registrationPayload,
    createdAt: new Date().toISOString(),
    blockchainHash: createHash(registrationPayload),
  };

  registrations.push(record);

  return res.status(201).json({ success: true, data: record });
});

router.get("/registrations", (req, res) => {
  res.json({ success: true, data: registrations });
});

module.exports = router;
