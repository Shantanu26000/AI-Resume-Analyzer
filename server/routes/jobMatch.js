const express = require("express");
const fs = require("fs");
const pdf = require("pdf-parse");

const authMiddleware = require("../middleware/authMiddleware");
const analyzeJobMatch = require("../jobMatch");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { file, jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const filePath = "uploads/" + file;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Resume file not found",
      });
    }

    // Read resume
    const dataBuffer = fs.readFileSync(filePath);

    // Extract resume text
    const data = await pdf(dataBuffer);

    // Send resume + job description to Gemini
    const result = await analyzeJobMatch(
      data.text,
      jobDescription
    );

    // Remove markdown code fences if Gemini adds them
    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);

    res.json(analysis);

  } catch (err) {
    console.error("Job Match Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;