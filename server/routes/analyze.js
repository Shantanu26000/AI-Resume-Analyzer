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

    res.json(JSON.parse(cleaned));

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;