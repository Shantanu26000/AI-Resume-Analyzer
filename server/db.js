
require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  connectTimeout: 10000,
});

db.connect((err) => {
  if (err) {
    console.error("Database Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
