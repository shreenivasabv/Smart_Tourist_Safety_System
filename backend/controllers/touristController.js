const Tourist = require("../models/Tourist");

// Register Tourist
exports.registerTourist = async (req, res) => {
  try {

    const tourist = await Tourist.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tourist Registered Successfully",
      tourist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get All Tourists
exports.getAllTourists = async (req, res) => {

  try {

    const tourists = await Tourist.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      total: tourists.length,
      tourists,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Get Tourist By Id
exports.getTourist = async (req, res) => {

  try {

    const tourist = await Tourist.findById(req.params.id);

    if (!tourist) {

      return res.status(404).json({
        success: false,
        message: "Tourist Not Found",
      });

    }

    res.json({
      success: true,
      tourist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Update Tourist
exports.updateTourist = async (req, res) => {

  try {

    const tourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Tourist Updated",
      tourist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Delete Tourist
exports.deleteTourist = async (req, res) => {

  try {

    await Tourist.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Tourist Deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};