const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const {
  getAllTimeLeaderboard,
} = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getLeaderboard);
router.get("/all-time", authMiddleware, getAllTimeLeaderboard);

module.exports = router;
