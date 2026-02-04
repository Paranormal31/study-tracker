const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const studyLogRoutes = require("./routes/studyLogRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const graphRoutes = require("./routes/graphRoutes");
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://study-tracker-woad-alpha.vercel.app", // production frontend
];
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser()); // 👈 Moved here (BEFORE routes)

app.use("/api/users", userRoutes);
app.use("/api/study-logs", studyLogRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/graphs", graphRoutes);

app.get("/", (req, res) => {
  res.send("Leaderboard API is running 🚀");
});

module.exports = app;
