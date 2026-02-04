const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getStudyGraph,
  getAllUsersStudyGraph,
  getMonthlyCumulativePerUserGraph,
} = require("../controllers/graphController");

router.get("/study-time", authMiddleware, getStudyGraph);
router.get("/all-users", authMiddleware, getAllUsersStudyGraph);
router.get(
  "/monthly-cumulative",
  authMiddleware,
  getMonthlyCumulativePerUserGraph,
);

module.exports = router;
