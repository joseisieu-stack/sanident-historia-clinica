const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "sanident-secret-key-cambiar-en-produccion";

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

router.get("/", auth, (req, res) => {
  const search = (req.query.search || "").trim().toLowerCase();
  let patients;
  if (search) {
    patients = db.prepare(`
      SELECT id, full_name, document_id, phone, created_at
      FROM patients
      WHERE LOWER(full_name) LIKE ? OR document_id LIKE ? OR phone LIKE ?
      ORDER BY updated_at DESC
    `).all(`%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    patients = db.prepare(`
      SELECT id, full_name, document_id, phone, created_at
      FROM patients ORDER BY updated_at DESC LIMIT 50
    `).all();
  }
  res.json(patients.map((p) => ({
    id: String(p.id),
    fullName: p.full_name,
    documentId: p.document_id || "",
    phone: p.phone || "",
    savedAt: p.created_at,
  })));
});

router.post("/", auth, (req, res) => {
  const { fullName, documentId, phone } = req.body;
  if (!fullName) return res.status(400).json({ error: "Nombre requerido" });

  const result = db.prepare(`
    INSERT INTO patients (created_by_user_id, full_name, document_id, phone)
    VALUES (?, ?, ?, ?)
  `).run(req.user.id, fullName, documentId || "", phone || "");

  res.json({ id: String(result.lastInsertRowid), success: true });
});

module.exports = router;
