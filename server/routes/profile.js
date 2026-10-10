
const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get the logged-in user's profile
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("Profile fetch error:", err);
        return res.status(500).json({
          message: "Failed to fetch profile",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(results[0]);
    }
  );
});

// Update the logged-in user's profile
router.put("/", authMiddleware, (req, res) => {
  const { name, email } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [cleanName, cleanEmail, req.user.id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "This email is already registered",
          });
        }

        console.error("Profile update error:", err);
        return res.status(500).json({
          message: "Failed to update profile",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Profile updated successfully",
        name: cleanName,
        email: cleanEmail,
      });
    }
  );
});

module.exports = router;
