const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // change to your MySQL user
  password: "", // change to your MySQL password
  database: "norplex_db"
});

// ✅ Test database connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// ✅ Institution Signup (save to pending_approval)
app.post("/institution/signup", (req, res) => {
  const { institutionName, email, password } = req.body;
  if (!institutionName || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO pending_approval (institutionName, email, password) VALUES (?, ?, ?)",
    [institutionName, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Signup successful! Pending approval" });
    }
  );
});

// ✅ Institution Login
app.post("/institution/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM pending_approval WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) {
      return res.status(400).json({ message: "Not found or pending approval" });
    }

    const institution = results[0];
    const isMatch = bcrypt.compareSync(password, institution.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", institutionName: institution.institutionName });
  });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
