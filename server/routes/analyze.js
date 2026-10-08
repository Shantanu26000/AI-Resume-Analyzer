const db = require("../db");
const analyzeResume = require("../gemini");
const express = require("express");
const fs = require("fs");
const pdf = require("pdf-parse");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const filePath = "uploads/" + req.body.file;

    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);

    const result = await analyzeResume(data.text);

    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  const analysis = JSON.parse(cleaned);

const sql = `
  INSERT INTO resume_analyses
  (user_id, resume_file, ats_score, score_breakdown, missing_skills, suggestions)
  VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(
  sql,
  [
    req.user.id,
    req.body.file,
    analysis.atsScore,
    JSON.stringify(analysis.scoreBreakdown),
    JSON.stringify(analysis.missingSkills),
    JSON.stringify(analysis.suggestions),
  ],
  (err) => {
    if (err) {
      console.error("Failed to save analysis:", err);

      return res.status(500).json({
        message: "Analysis generated but failed to save it",
      });
    }

    res.json(analysis);
  }
);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;