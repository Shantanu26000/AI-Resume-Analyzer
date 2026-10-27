
require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,

  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  connectTimeout: 15000,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }

  console.log("✅ MySQL pool connected to Railway");
  connection.release();
});

db.on("error", (err) => {
  console.error("❌ MySQL pool error:", err.message);
});

module.exports = db;

