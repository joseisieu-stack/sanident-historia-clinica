const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { migrate } = require("./db");

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
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Sanident backend running on http://localhost:${PORT}`);
  try { migrate(); } catch (err) { console.error("Migracion fallo:", err.message); }
});
