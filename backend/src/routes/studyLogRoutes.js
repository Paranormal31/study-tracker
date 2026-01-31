const express = require("express");
const { createOrUpdateStudyLog } = require("../controllers/studyLogController");

const router = express.Router();

router.post("/", createOrUpdateStudyLog);

module.exports = router;
