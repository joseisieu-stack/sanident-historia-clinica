const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { query, migrate } = require("./db");

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const recordRoutes = require("./routes/records");

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);

app.get("/api/health", (req, res) => {
  try {
    const roles = query(`SELECT count(*) as count FROM roles`).rows[0];
    const users = query(`SELECT count(*) as count FROM users`).rows[0];
    const admin = query(`SELECT id FROM users WHERE email = 'admin'`).rows[0];
    res.json({ status: "ok", db: true, roles: roles.count, users: users.count, admin: !!admin });
  } catch (e) {
    res.json({ status: "ok", db: false, error: e.message, stack: e.stack?.split('\n').slice(0,3).join(' ') });
  }
});

app.listen(PORT, () => {
  console.log(`Sanident backend running on http://localhost:${PORT}`);
  migrate();
});
