const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const studyLogRoutes = require("./routes/studyLogRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const graphRoutes = require("./routes/graphRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/study-logs", studyLogRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/graphs", graphRoutes);

app.get("/", (req, res) => {
  res.send("Leaderboard API is running 🚀");
});

module.exports = app;
