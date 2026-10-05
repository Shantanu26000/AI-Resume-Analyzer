const analyzeRoutes = require("./routes/analyze");
const uploadRoutes = require("./routes/upload");
const jobMatchRoutes = require("./routes/jobMatch");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/job-match", jobMatchRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ResumeIQ Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});