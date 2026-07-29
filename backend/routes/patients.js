const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
      const result = query(`
        SELECT id, full_name, document_id, phone, created_at
        FROM patients
        WHERE LOWER(full_name) LIKE $1 OR document_id LIKE $1 OR phone LIKE $1
        ORDER BY updated_at DESC
      `, [`%${search}%`]);
      rows = result.rows;
    } else if (sort === "alpha") {
      rows = query(`SELECT id, full_name, document_id, phone, created_at FROM patients ORDER BY full_name ASC`).rows;
    } else {
      rows = query(`SELECT id, full_name, document_id, phone, created_at FROM patients ORDER BY updated_at DESC LIMIT 50`).rows;
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

    const patientId = crypto.randomUUID();
    query(
      `INSERT INTO patients (id, created_by_user_id, full_name, document_id, phone) VALUES ($1, $2, $3, $4, $5)`,
      [patientId, req.user.id, fullName, documentId || "", phone || ""]
    );

    res.json({ id: String(patientId), success: true });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/deduplicate", auth, async (req, res) => {
  try {
    const patients = query(`SELECT id, full_name, updated_at FROM patients`).rows;

    const groups = {};
    for (const p of patients) {
      const key = p.full_name.trim().toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }

    let removed = 0;
    for (const ids of Object.values(groups)) {
      if (ids.length > 1) {
        ids.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        const keepId = ids[0].id;
        for (let i = 1; i < ids.length; i++) {
          query(`UPDATE clinical_records SET patient_id = $1 WHERE patient_id = $2`, [keepId, ids[i].id]);
          query(`DELETE FROM patient_files WHERE patient_id = $1`, [ids[i].id]);
          query(`DELETE FROM patients WHERE id = $1`, [ids[i].id]);
          removed++;
        }
      }
    }

    const result = query(`SELECT id, full_name, document_id, phone, created_at FROM patients ORDER BY full_name ASC`);
    res.json({
      removed,
      patients: result.rows.map((p) => ({
        id: String(p.id),
        fullName: p.full_name,
        documentId: p.document_id || "",
        phone: p.phone || "",
        savedAt: p.created_at,
      })),
    });
  } catch (err) {
    console.error("Error deduplicating:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { id } = req.params;
    const patient = query(`SELECT id FROM patients WHERE id = $1`, [id]).rows[0];
    if (!patient) return res.status(404).json({ error: "Paciente no encontrado" });

    query(`DELETE FROM clinical_records WHERE patient_id = $1`, [id]);
    query(`DELETE FROM patient_files WHERE patient_id = $1`, [id]);
    query(`DELETE FROM patients WHERE id = $1`, [id]);

    res.json({ success: true, message: "Paciente eliminado" });
  } catch (err) {
    console.error("Error eliminando paciente:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
