const StudyLog = require("../models/StudyLog");
const User = require("../models/User");

const getAllTimeLeaderboard = async (req, res) => {
  try {
    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    // Get users in same group
    const usersInGroup = await User.find({ group: req.user.group }).select(
      "_id username",
    );

    const userIds = usersInGroup.map((u) => u._id);

    const leaderboard = await StudyLog.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: "$user",
          totalMinutes: { $sum: "$minutes" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          totalMinutes: 1,
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    const { type } = req.query;
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (type === "daily") {
      // "Daily" now means YESTERDAY
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1); // Go back 1 day
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    }

    if (type === "weekly") {
      const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
    }

    if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const usersInGroup = await User.find({ group: req.user.group }).select(
      "_id",
    );

    const userIds = usersInGroup.map((u) => u._id);

    const matchStage = {
      user: { $in: userIds },
      ...(startDate && {
        date: {
          $gte: startDate,
          ...(endDate && { $lte: endDate }),
        },
      }),
    };

    const leaderboard = await StudyLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$user",
          totalMinutes: { $sum: "$minutes" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          totalMinutes: 1,
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllTimeLeaderboard,
  getLeaderboard,
};
