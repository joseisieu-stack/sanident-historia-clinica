const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

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

router.get("/", auth, async (req, res) => {
  try {
    const search = (req.query.search || "").trim().toLowerCase();
    const sort = req.query.sort || "";
    let rows;
    if (search) {
      const result = await query(`
        SELECT id, full_name, document_id, phone, created_at
        FROM patients
        WHERE LOWER(full_name) LIKE $1 OR document_id LIKE $1 OR phone LIKE $1
        ORDER BY updated_at DESC
      `, [`%${search}%`]);
      rows = result.rows;
    } else if (sort === "alpha") {
      const result = await query(`
        SELECT id, full_name, document_id, phone, created_at
        FROM patients ORDER BY full_name ASC
      `);
      rows = result.rows;
    } else {
      const result = await query(`
        SELECT id, full_name, document_id, phone, created_at
        FROM patients ORDER BY updated_at DESC LIMIT 50
      `);
      rows = result.rows;
    }
    res.json(rows.map((p) => ({
      id: String(p.id),
      fullName: p.full_name,
      documentId: p.document_id || "",
      phone: p.phone || "",
      savedAt: p.created_at,
    })));
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { fullName, documentId, phone } = req.body;
    if (!fullName) return res.status(400).json({ error: "Nombre requerido" });

    const result = await query(
      `INSERT INTO patients (created_by_user_id, full_name, document_id, phone) VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.user.id, fullName, documentId || "", phone || ""]
    );

    res.json({ id: String(result.rows[0].id), success: true });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
