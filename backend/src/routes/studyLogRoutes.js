const express = require("express");
const {
  createOrUpdateStudyLog,
  getGroupStudyLogs,
  updateStudyLog,
  deleteStudyLog,
} = require("../controllers/studyLogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrUpdateStudyLog);
router.get("/", authMiddleware, getGroupStudyLogs);
router.put("/:id", authMiddleware, updateStudyLog);
router.delete("/:id", authMiddleware, deleteStudyLog);

module.exports = router;
