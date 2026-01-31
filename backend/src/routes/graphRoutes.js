const express = require("express");
const router = express.Router();

const {
  getStudyGraph,
  getAllUsersStudyGraph,
  getMonthlyCumulativePerUserGraph,
} = require("../controllers/graphController");

router.get("/study-time", getStudyGraph);
router.get("/all-users", getAllUsersStudyGraph);

// ✅ ONLY monthly route you need now
router.get("/monthly-cumulative", getMonthlyCumulativePerUserGraph);

module.exports = router;
