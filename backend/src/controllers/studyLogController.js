const StudyLog = require("../models/StudyLog");
const mongoose = require("mongoose");

// POST /api/study-logs
const createOrUpdateStudyLog = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, minutes } = req.body;

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

// GET /api/study-logs (Group logs)
const getGroupStudyLogs = async (req, res) => {
  try {
    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all users in the group
    const User = require("../models/User");
    const users = await User.find({ group: req.user.group }).distinct("_id");

    const logs = await StudyLog.find({ user: { $in: users } })
      .populate("user", "username")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

// PUT /api/study-logs/:id
const updateStudyLog = async (req, res) => {
  try {
    const { minutes } = req.body;
    const log = await StudyLog.findByIdAndUpdate(
      req.params.id,
      { minutes },
      { new: true },
    ).populate("user", "username");
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Failed to update log" });
  }
};

// DELETE /api/study-logs/:id
const deleteStudyLog = async (req, res) => {
  try {
    await StudyLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete log" });
  }
};

module.exports = {
  createOrUpdateStudyLog,
  getGroupStudyLogs,
  updateStudyLog,
  deleteStudyLog,
};
