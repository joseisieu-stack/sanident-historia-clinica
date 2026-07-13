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
    const r = query(`SELECT count(*) as c FROM roles`);
    const u = query(`SELECT count(*) as c FROM users`);
    const a = query(`SELECT id FROM users WHERE email = 'admin'`);
    res.json({ status: "ok", roles: r.rows[0]?.c || 0, users: u.rows[0]?.c || 0, admin: !!a.rows[0] });
  } catch (e) {
    res.json({ status: "ok", db: false, error: e.message });
  }
});

app.get("/api/debug", (req, res) => {
  try {
    const { email, password } = req.query;
    if (!email) return res.json({ error: "missing email" });
    const sql = `
      SELECT u.id, u.full_name, u.email, u.password_hash, u.active, r.name as role
      FROM users u JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? AND u.active = 1
    `;
    const stmt = require("./db").db.prepare(sql);
    const rows = stmt.all(email);
    res.json({ sql, params: [email], result: rows, paramsCount: 1, placeholders: stmt.parameters });
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sanident backend running on http://localhost:${PORT}`);
  migrate();
});
