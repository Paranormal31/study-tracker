const StudyLog = require("../models/StudyLog");
const mongoose = require("mongoose");

// POST /api/study-logs
const createOrUpdateStudyLog = async (req, res) => {
  try {
    const { userId, date, minutes } = req.body;

    if (!userId || !date || minutes == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Normalize date to start of day
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const log = await StudyLog.findOneAndUpdate(
      { user: userId, date: normalizedDate },
      { minutes },
      {
        new: true, // return updated document
        upsert: true, // create if not exists
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrUpdateStudyLog };
