const express = require("express");
const jwt = require("jsonwebtoken");
const { supabase } = require("../db");

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
    const { data: records, error } = await supabase
      .from("clinical_records")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    const record = records?.[0];
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

    const { data: patient } = await supabase.from("patients").select("id").eq("id", patientId).maybeSingle();
    if (!patient) {
      await supabase.from("patients").insert({
        id: patientId,
        created_by_user_id: req.user.id,
        full_name: (data.patient?.fullName || "").trim() || "Paciente",
      });
    } else {
      await supabase.from("patients").update({
        full_name: data.patient?.fullName || "",
        document_id: data.patient?.documentId || "",
        phone: data.patient?.phone || "",
        updated_at: new Date().toISOString(),
      }).eq("id", patientId);
    }

    const { data: existing } = await supabase
      .from("clinical_records")
      .select("id")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(1);

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

    if (existing?.length) {
      await supabase.from("clinical_records").update({ ...recordData, updated_at: new Date().toISOString() }).eq("patient_id", patientId);
    } else {
      await supabase.from("clinical_records").insert({ patient_id: patientId, dentist_user_id: req.user.id, ...recordData });
    }

    res.json({ success: true, id: String(patientId) });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
