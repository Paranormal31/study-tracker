const mongoose = require("mongoose");

const studyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

// Prevent duplicate logs per user per day
studyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("StudyLog", studyLogSchema);
