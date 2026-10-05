const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.post(
  "/",
  authMiddleware,
  (req, res) => {
    upload.single("resume")(req, res, (err) => {

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 5 MB",
          });
        }

        return res.status(400).json({
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select a PDF resume",
        });
      }

      res.json({
        message: "Resume Uploaded Successfully",
        file: req.file.filename,
      });
    });
  }
);

module.exports = router;