const Tourist = require("../models/Tourist");

const ONLINE_THRESHOLD_MINUTES = 5;
const CHECK_INTERVAL_MS = 60 * 1000; // run every 1 minute

/**
 * Periodically flips any tourist who hasn't sent a GPS ping within the
 * threshold window from 'online' to 'offline'. Keeps the DB state consistent
 * with what getOnlineStatus() would compute live, so dashboard counts
 * (e.g. Active Tourists) stay accurate without recomputing on every read.
 */
function startOfflineStatusJob() {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000);
      const result = await Tourist.updateMany(
        { onlineStatus: "online", lastSeen: { $lt: cutoff } },
        { $set: { onlineStatus: "offline" } }
      );
      if (result.modifiedCount > 0) {
        console.log(`[offlineStatusJob] Marked ${result.modifiedCount} tourist(s) offline`);
      }
    } catch (err) {
      console.error('[offlineStatusJob] error:', err.message);
    }
  }, CHECK_INTERVAL_MS);
}

module.exports = startOfflineStatusJob;
