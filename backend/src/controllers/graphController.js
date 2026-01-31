const StudyLog = require("../models/StudyLog");
const User = require("../models/User");

// Single user graph (if still used elsewhere)
const getStudyGraph = async (req, res) => {
  try {
    const { userId } = req.query;

    const logs = await StudyLog.find({ user: userId }).lean();

    const data = logs.map((log) => ({
      date: log.date.toISOString().split("T")[0],
      totalMinutes: log.minutes,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch study graph" });
  }
};

// All users comparison graph
const getAllUsersStudyGraph = async (req, res) => {
  try {
    const users = await User.find().lean();

    const logs = await StudyLog.aggregate([
      {
        $project: {
          user: 1,
          minutes: 1,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
    ]);

    if (!logs.length) {
      return res.json({ dates: [], users: [] });
    }

    const dates = [...new Set(logs.map((l) => l.date))].sort();

    const graphUsers = users.map((u) => {
      const userLogs = logs.filter((l) => String(l.user) === String(u._id));

      const data = dates.map((d) => {
        const found = userLogs.find((l) => l.date === d);
        return found ? found.minutes : 0;
      });

      return {
        userId: u._id,
        name: u.name,
        data,
      };
    });

    res.json({ dates, users: graphUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch all users graph" });
  }
};

const getMonthlyCumulativePerUserGraph = async (req, res) => {
  try {
    const { from, to } = req.query;

    // If not provided, default to current month
    const now = new Date();

    const startDate = from
      ? new Date(from)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const endDate = to
      ? new Date(to)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const users = await User.find().lean();

    const logs = await StudyLog.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $project: {
          user: 1,
          minutes: 1,
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      {
        $group: {
          _id: { user: "$user", day: "$day" },
          dailyMinutes: { $sum: "$minutes" },
        },
      },
    ]);

    // Build timeline from start → end
    const dates = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }

    const graphUsers = users.map((u) => {
      let cumulative = 0;

      const data = dates.map((d) => {
        const found = logs.find(
          (l) => String(l._id.user) === String(u._id) && l._id.day === d,
        );
        if (found) cumulative += found.dailyMinutes;
        return cumulative;
      });

      return {
        userId: u._id,
        name: u.name,
        data,
      };
    });

    res.json({ dates, users: graphUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cumulative graph" });
  }
};

module.exports = {
  getStudyGraph,
  getAllUsersStudyGraph,
  getMonthlyCumulativePerUserGraph,
};
