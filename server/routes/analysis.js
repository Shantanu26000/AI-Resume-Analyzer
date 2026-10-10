const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      resumeFile,
      atsScore,
      scoreBreakdown,
      missingSkills,
      suggestions,
    } = req.body;

    if (!resumeFile || atsScore === undefined) {
      return res.status(400).json({
        message: "Resume file and ATS score are required",
      });
    }

    const sql = `
      INSERT INTO resume_analyses
      (user_id, resume_file, ats_score, score_breakdown, missing_skills, suggestions)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        req.user.id,
        resumeFile,
        atsScore,
        JSON.stringify(scoreBreakdown),
        JSON.stringify(missingSkills),
        JSON.stringify(suggestions),
      ],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);

          return res.status(500).json({
            message: "Failed to save analysis",
          });
        }

        res.status(201).json({
          message: "Analysis saved successfully",
          analysisId: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error("Save Analysis Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", authMiddleware, (req, res) => {
  const sql = `
    SELECT
      id,
      resume_file,
      ats_score,
      score_breakdown,
      missing_skills,
      suggestions,
      created_at
    FROM resume_analyses
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        message: "Failed to fetch analysis history",
      });
    }

    res.json(results);
  });
});

router.get("/:id", authMiddleware, (req, res) => {
  const sql = `
    SELECT
      id,
      resume_file,
      ats_score,
      score_breakdown,
      missing_skills,
      suggestions,
      created_at
    FROM resume_analyses
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [req.params.id, req.user.id],
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);

        return res.status(500).json({
          message: "Failed to fetch analysis",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Analysis not found",
        });
      }

      const analysis = results[0];

      res.json({
        id: analysis.id,
        resumeFile: analysis.resume_file,
        atsScore: analysis.ats_score,
        scoreBreakdown:
          typeof analysis.score_breakdown === "string"
            ? JSON.parse(analysis.score_breakdown)
            : analysis.score_breakdown,
        missingSkills:
          typeof analysis.missing_skills === "string"
            ? JSON.parse(analysis.missing_skills)
            : analysis.missing_skills,
        suggestions:
          typeof analysis.suggestions === "string"
            ? JSON.parse(analysis.suggestions)
            : analysis.suggestions,
        createdAt: analysis.created_at,
      });
    }
  );
});

router.delete("/:id", authMiddleware, (req, res) => {
  const sql = `
    DELETE FROM resume_analyses
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);

        return res.status(500).json({
          message: "Failed to delete analysis",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Analysis not found",
        });
      }

      res.json({
        message: "Analysis deleted successfully",
      });
    }
  );
});

module.exports = router;