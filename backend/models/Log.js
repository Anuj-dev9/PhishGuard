const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  input: String,
  type: String,
  result: String,
  severity: String,
  score: Number,
  signals: [String],
  urlAnalysis: [
    {
      domain: String,
      riskLevel: String,
      score: Number,
      reasons: [String],
    },
  ],
  userEmail: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", LogSchema);
