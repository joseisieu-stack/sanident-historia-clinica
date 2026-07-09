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

router.get("/", auth, async (req, res) => {
  try {
    const search = (req.query.search || "").trim().toLowerCase();
    const sort = req.query.sort || "";
    let data, error;
    if (search) {
      const result = await supabase
        .from("patients")
        .select("id, full_name, document_id, phone, created_at")
        .or(`full_name.ilike.%${search}%,document_id.ilike.%${search}%,phone.ilike.%${search}%`)
        .order("updated_at", { ascending: false });
      data = result.data;
      error = result.error;
    } else if (sort === "alpha") {
      const result = await supabase
        .from("patients")
        .select("id, full_name, document_id, phone, created_at")
        .order("full_name", { ascending: true });
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("patients")
        .select("id, full_name, document_id, phone, created_at")
        .order("updated_at", { ascending: false })
        .limit(50);
      data = result.data;
      error = result.error;
    }
    if (error) throw error;
    res.json((data || []).map((p) => ({
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

    const { data, error } = await supabase
      .from("patients")
      .insert({ created_by_user_id: req.user.id, full_name: fullName, document_id: documentId || "", phone: phone || "" })
      .select();

    if (error) throw error;
    res.json({ id: String(data[0].id), success: true });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/deduplicate", auth, async (req, res) => {
  try {
    const { data: patients, error } = await supabase
      .from("patients")
      .select("id, full_name, updated_at");
    if (error) throw error;

    const groups = {};
    for (const p of patients) {
      const key = p.full_name.trim().toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push({ id: p.id, updatedAt: p.updated_at });
    }

    let removed = 0;
    for (const ids of Object.values(groups)) {
      if (ids.length > 1) {
        ids.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const keepId = ids[0].id;
        for (let i = 1; i < ids.length; i++) {
          await supabase.from("clinical_records").update({ patient_id: keepId }).eq("patient_id", ids[i].id);
          await supabase.from("patient_files").delete().eq("patient_id", ids[i].id);
          await supabase.from("patients").delete().eq("id", ids[i].id);
          removed++;
        }
      }
    }

    const { data: updated } = await supabase
      .from("patients")
      .select("id, full_name, document_id, phone, created_at")
      .order("full_name", { ascending: true });

    res.json({
      removed,
      patients: (updated || []).map((p) => ({
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

module.exports = router;
