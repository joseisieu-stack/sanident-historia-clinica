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

router.get("/:patientId", auth, (req, res) => {
  const { patientId } = req.params;
  const record = db.prepare(`
    SELECT * FROM clinical_records WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(patientId);

  if (!record) return res.json(null);

  res.json({
    id: String(record.id),
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
    savedAt: record.created_at,
  });
});

router.post("/:patientId", auth, (req, res) => {
  const { patientId } = req.params;
  const data = req.body;

  const patient = db.prepare("SELECT id FROM patients WHERE id = ?").get(patientId);
  if (!patient) {
    db.prepare("INSERT INTO patients (id, created_by_user_id, full_name) VALUES (?, ?, ?)").run(
      patientId, req.user.id, (data.patient?.fullName || "").trim() || "Paciente"
    );
  } else {
    db.prepare("UPDATE patients SET full_name = ?, document_id = ?, phone = ?, updated_at = datetime('now') WHERE id = ?").run(
      data.patient?.fullName || "",
      data.patient?.documentId || "",
      data.patient?.phone || "",
      patientId
    );
  }

  const existing = db.prepare("SELECT id FROM clinical_records WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1").get(patientId);

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
  };

  if (existing) {
    const cols = Object.keys(recordData).map((k) => `${k} = ?`).join(", ");
    const vals = Object.values(recordData);
    db.prepare(`UPDATE clinical_records SET ${cols}, updated_at = datetime('now') WHERE patient_id = ?`).run(...vals, patientId);
  } else {
    const cols = ["patient_id", "dentist_user_id", ...Object.keys(recordData)];
    const placeholders = cols.map(() => "?").join(", ");
    const vals = [patientId, req.user.id, ...Object.values(recordData)];
    db.prepare(`INSERT INTO clinical_records (${cols.join(", ")}) VALUES (${placeholders})`).run(...vals);
  }

  res.json({ success: true, id: String(patientId) });
});

module.exports = router;
