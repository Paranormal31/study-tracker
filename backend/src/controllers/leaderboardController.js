const StudyLog = require("../models/StudyLog");

const getLeaderboard = async (req, res) => {
  try {
    const { type } = req.query;

    let startDate = null;
    const now = new Date();

    if (type === "daily") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    if (type === "weekly") {
      const day = now.getDay(); // 0 (Sun) - 6 (Sat)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
    }

    if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const matchStage = startDate ? { date: { $gte: startDate } } : {};

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
          name: "$user.name",
          totalMinutes: 1,
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
