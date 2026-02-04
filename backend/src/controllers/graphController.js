const StudyLog = require("../models/StudyLog");
const User = require("../models/User");

// Single user graph (if still used elsewhere)
const getStudyGraph = async (req, res) => {
  try {
    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    // Fetch all users in the same group
    const users = await User.find({ group: req.user.group }).select("_id name");

    const userIds = users.map((u) => u._id);

    // Fetch logs for all group users
    const logs = await StudyLog.aggregate([
      {
        $match: {
          user: { $in: userIds },
        },
      },
      {
        $group: {
          _id: {
            user: "$user",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
                timezone: "Asia/Kolkata",
              },
            },
          },
          totalMinutes: { $sum: "$minutes" },
        },
      },
    ]);

    res.json({
      users,
      logs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch group study graph" });
  }
};

// All users comparison graph
const getAllUsersStudyGraph = async (req, res) => {
  try {
    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    const users = await User.find({ group: req.user.group }).lean();

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
        name: u.username,
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

    // Cap endDate to today so we don't show future dates
    if (endDate > now) {
      endDate.setTime(now.getTime());
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (!req.user.group) {
      return res.status(403).json({ message: "User has no group" });
    }

    const users = await User.find({ group: req.user.group }).lean();

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
        name: u.username,
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
