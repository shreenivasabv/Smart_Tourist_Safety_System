const Tourist = require("../models/Tourist");
const sendEmail = require("./sendEmail");
const { isEmailConfigured } = require("./sendEmail");

const ALERT_JOB_INTERVAL_MS = Number(process.env.ALERT_JOB_INTERVAL_MS || 5 * 60 * 1000);
const ALERT_COOLDOWN_MS = Number(process.env.ALERT_COOLDOWN_MS || ALERT_JOB_INTERVAL_MS);

function shouldSendAlert(tourist, now) {
  if (!tourist.email) {
    return false;
  }

  if (!(tourist.zoneStatus === "outside" || tourist.riskLevel === "high")) {
    return false;
  }

  if (!tourist.lastAlertSentAt) {
    return true;
  }

  return now.getTime() - new Date(tourist.lastAlertSentAt).getTime() >= ALERT_COOLDOWN_MS;
}

function buildScheduledAlertMessage(tourist) {
  return [
    `Safety alert for ${tourist.fullName}.`,
    `Current zone status: ${tourist.zoneStatus}.`,
    `Current risk level: ${tourist.riskLevel}.`,
    `Last seen: ${tourist.lastSeen ? new Date(tourist.lastSeen).toISOString() : "unknown"}.`,
    "Please move back into the approved tourist boundary or contact the safety team immediately.",
  ].join("\n");
}

function startTouristAlertJob() {
  if (!isEmailConfigured()) {
    console.log("[touristAlertJob] Email alerts disabled because EMAIL or EMAIL_PASSWORD is not configured.");
    return;
  }

  setInterval(async () => {
    const now = new Date();

    try {
      const candidates = await Tourist.find({
        $or: [{ zoneStatus: "outside" }, { riskLevel: "high" }],
      }).select("fullName email zoneStatus riskLevel lastSeen lastAlertSentAt");

      let sentCount = 0;

      for (const tourist of candidates) {
        if (!shouldSendAlert(tourist, now)) {
          continue;
        }

        await sendEmail(
          tourist.email,
          "Smart Tourist Safety Reminder",
          buildScheduledAlertMessage(tourist)
        );

        tourist.lastAlertSentAt = now;
        await tourist.save();
        sentCount += 1;
      }

      if (sentCount > 0) {
        console.log(`[touristAlertJob] Sent ${sentCount} scheduled tourist alert(s).`);
      }
    } catch (err) {
      console.error("[touristAlertJob] error:", err.message);
    }
  }, ALERT_JOB_INTERVAL_MS);
}

module.exports = startTouristAlertJob;
