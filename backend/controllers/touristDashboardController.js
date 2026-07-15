const Tourist = require("../models/Tourist");

exports.getDashboardStats = async (req, res) => {

    try {

        const totalTourists = await Tourist.countDocuments();

        const trackingReady = await Tourist.countDocuments({
            trackingConsent: true,
        });

        const zonePending = await Tourist.countDocuments({
            zone: "",
        });

        const safeVisitors = await Tourist.countDocuments({
            status: "Safe",
        });

        const monitoringVisitors = await Tourist.countDocuments({
            status: "Monitoring",
        });

        const supportVisitors = await Tourist.countDocuments({
            status: "Support Needed",
        });

        res.json({

            success: true,

            stats: {

                totalTourists,

                trackingReady,

                zonePending,

                safeVisitors,

                monitoringVisitors,

                supportVisitors,

            },

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};