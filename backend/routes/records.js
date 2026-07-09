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

router.get("/:patientId", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = query(
      `SELECT * FROM clinical_records WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [patientId]
    );
    const record = result.rows[0];
    if (!record) return res.json(null);

    res.json({
      patient: {
        fullName: record.full_name || "",
        documentId: record.document_id || "",
        birthDate: record.birth_date || "",
        phone: record.phone || "",
        reason: record.reason || "",
        medicalHistory: record.medical_history || "",
        diagnosis: record.diagnosis || "",
        treatmentPlan: record.treatment_plan || "",
      },
      patientPhoto: record.patient_photo || "",
      auxiliaryExams: record.auxiliary_exams ? JSON.parse(record.auxiliary_exams) : [],
      budget: record.budget_json ? JSON.parse(record.budget_json) : {},
      appointments: record.appointments_json ? JSON.parse(record.appointments_json) : [],
      chart: record.chart_json ? JSON.parse(record.chart_json) : {},
      chartNotes: {
        diagnosis: record.chart_diagnosis || "",
        observations: record.chart_observations || "",
      },
      ortho: record.ortho_json ? JSON.parse(record.ortho_json) : null,
      savedAt: record.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/:patientId", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = req.body;

    const patient = query(`SELECT id FROM patients WHERE id = $1`, [patientId]).rows[0];
    if (!patient) {
      query(
        `INSERT INTO patients (id, created_by_user_id, full_name) VALUES ($1, $2, $3)`,
        [patientId, req.user.id, (data.patient?.fullName || "").trim() || "Paciente"]
      );
    } else {
      query(
        `UPDATE patients SET full_name = $1, document_id = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
        [data.patient?.fullName || "", data.patient?.documentId || "", data.patient?.phone || "", patientId]
      );
    }

    const existing = query(
      `SELECT id FROM clinical_records WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [patientId]
    ).rows[0];

    const recordData = {
      full_name: data.patient?.fullName || "",
      document_id: data.patient?.documentId || "",
      birth_date: data.patient?.birthDate || "",
      phone: data.patient?.phone || "",
      reason: data.patient?.reason || "",
      medical_history: data.patient?.medicalHistory || "",
      diagnosis: data.patient?.diagnosis || "",
      treatment_plan: data.patient?.treatmentPlan || "",
      patient_photo: data.patientPhoto || "",
      auxiliary_exams: JSON.stringify(data.auxiliaryExams || []),
      budget_json: JSON.stringify(data.budget || {}),
      appointments_json: JSON.stringify(data.appointments || []),
      chart_json: JSON.stringify(data.chart || {}),
      chart_diagnosis: data.chartNotes?.diagnosis || "",
      chart_observations: data.chartNotes?.observations || "",
      ortho_json: JSON.stringify(data.ortho || {}),
    };

    if (existing) {
      const cols = Object.keys(recordData).map((k, i) => `${k} = $${i + 1}`).join(", ");
      const vals = Object.values(recordData);
      query(`UPDATE clinical_records SET ${cols}, updated_at = CURRENT_TIMESTAMP WHERE patient_id = $${vals.length + 1}`,
        [...vals, patientId]);
    } else {
      const cols = ["patient_id", "dentist_user_id", ...Object.keys(recordData)];
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
      const vals = [patientId, req.user.id, ...Object.values(recordData)];
      query(`INSERT INTO clinical_records (${cols.join(", ")}) VALUES (${placeholders})`, vals);
    }

    res.json({ success: true, id: String(patientId) });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
