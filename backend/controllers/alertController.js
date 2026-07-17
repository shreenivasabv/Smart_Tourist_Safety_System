const Tourist = require("../models/Tourist");
const sendEmail = require("../utils/sendEmail");
const { isEmailConfigured } = require("../utils/sendEmail");

const DEFAULT_ALERT_SUBJECT = "Smart Tourist Safety Alert";

function buildAlertMessage(tourist, customMessage) {
  if (customMessage) {
    return customMessage;
  }

  return [
    `Safety update for ${tourist.fullName}.`,
    `Current status: ${tourist.zoneStatus}.`,
    `Risk level: ${tourist.riskLevel}.`,
    "Please follow the latest instructions from the safety team and stay within the designated tourist boundary.",
  ].join("\n");
}

exports.getAlertCapabilities = async (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      emailAlertsConfigured: isEmailConfigured(),
      pushDeliveryIntegrated: false,
      pushDeliveryMode: "device-token-registration-only",
      defaultAlertIntervalMs: Number(process.env.ALERT_JOB_INTERVAL_MS || 5 * 60 * 1000),
      endpoints: {
        registerDevice: "/api/alerts/device/register",
        sendAlert: "/api/alerts/send",
      },
    },
  });
};

exports.registerTouristDevice = async (req, res) => {
  try {
    const { touristId, deviceToken, devicePlatform = "android", preferredAlertChannel = "both" } = req.body;

    if (!touristId || !deviceToken) {
      return res.status(400).json({
        success: false,
        message: "touristId and deviceToken are required",
      });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: "Tourist not found" });
    }

    tourist.deviceToken = deviceToken;
    tourist.devicePlatform = devicePlatform;
    tourist.preferredAlertChannel = preferredAlertChannel;
    tourist.deviceLastRegisteredAt = new Date();
    await tourist.save();

    return res.status(200).json({
      success: true,
      message: "Device registered for future mobile alerts",
      data: {
        touristId: tourist._id,
        devicePlatform: tourist.devicePlatform,
        preferredAlertChannel: tourist.preferredAlertChannel,
        deviceLastRegisteredAt: tourist.deviceLastRegisteredAt,
      },
    });
  } catch (err) {
    console.error("registerTouristDevice error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.sendTouristAlert = async (req, res) => {
  try {
    const {
      touristId,
      email,
      subject = DEFAULT_ALERT_SUBJECT,
      message,
      channels = ["email"],
    } = req.body;

    let tourist = null;
    if (touristId) {
      tourist = await Tourist.findById(touristId);
      if (!tourist) {
        return res.status(404).json({ success: false, message: "Tourist not found" });
      }
    }

    const normalizedChannels = Array.isArray(channels) ? channels : [channels];
    const targetEmail = email || tourist?.email;
    const alertMessage = buildAlertMessage(tourist || { fullName: "Tourist", zoneStatus: "unknown", riskLevel: "unknown" }, message);
    const dispatchResults = [];

    if (normalizedChannels.includes("email")) {
      if (!targetEmail) {
        return res.status(400).json({ success: false, message: "An email or touristId with an email is required for email alerts" });
      }

      await sendEmail(targetEmail, subject, alertMessage);
      dispatchResults.push({ channel: "email", status: "sent", target: targetEmail });
    }

    if (normalizedChannels.includes("push")) {
      if (!tourist?.deviceToken) {
        dispatchResults.push({ channel: "push", status: "skipped", reason: "No device token registered yet" });
      } else {
        console.log(`[alertController] Placeholder push alert for tourist ${tourist._id} (${tourist.devicePlatform})`);
        dispatchResults.push({ channel: "push", status: "accepted", target: tourist.devicePlatform, note: "Integrate Firebase Cloud Messaging later" });
      }
    }

    if (tourist) {
      tourist.lastAlertSentAt = new Date();
      await tourist.save();
    }

    return res.status(200).json({
      success: true,
      message: "Alert processed",
      data: dispatchResults,
    });
  } catch (err) {
    console.error("sendTouristAlert error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error", error: err.message });
  }
};
