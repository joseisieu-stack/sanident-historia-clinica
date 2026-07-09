const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "sanident-secret-key-cambiar-en-produccion";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("id, full_name, email, password_hash, active, role:roles!inner(name)")
      .eq("email", email)
      .eq("active", 1);

    if (error) throw error;
    const user = users?.[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const roleMap = { administrador: "Administrador", doctor: "Doctor", invitado: "Invitado" };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: roleMap[user.role] || user.role, fullName: user.full_name },
      SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("id, full_name, email, active, role:roles(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(users.map(u => ({ ...u, role: u.role?.name })));
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Nombre, usuario y contraseña requeridos" });
    }

    const { data: existing } = await supabase.from("users").select("id").eq("email", email);
    if (existing?.length) {
      return res.status(400).json({ error: "Ese usuario ya existe" });
    }

    const { data: roleRow } = await supabase.from("roles").select("id").eq("name", (role || "doctor").toLowerCase());
    if (!roleRow?.length) return res.status(400).json({ error: "Rol inválido" });

    const hash = bcrypt.hashSync(password, 10);
    const { error } = await supabase.from("users").insert({
      role_id: roleRow[0].id,
      full_name: fullName,
      email,
      password_hash: hash,
    });

    if (error) throw error;
    res.json({ success: true, message: "Usuario creado" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { id } = req.params;
    const { fullName, email, password, role } = req.body;

    const { data: users } = await supabase.from("users").select("email, active").eq("id", id);
    const user = users?.[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes editar al administrador principal" });

    if (email && email !== user.email) {
      const { data: existing } = await supabase.from("users").select("id").eq("email", email).neq("id", id);
      if (existing?.length) return res.status(400).json({ error: "Ese nombre de usuario ya está en uso" });
    }

    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (email) updates.email = email;
    if (password) updates.password_hash = bcrypt.hashSync(password, 10);
    if (role) {
      const { data: roleRow } = await supabase.from("roles").select("id").eq("name", role.toLowerCase());
      if (roleRow?.length) updates.role_id = roleRow[0].id;
    }

    if (Object.keys(updates).length) {
      updates.updated_at = new Date().toISOString();
      await supabase.from("users").update(updates).eq("id", id);
    }

    res.json({ success: true, message: "Usuario actualizado" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { id } = req.params;
    const { data: users } = await supabase.from("users").select("email").eq("id", id);
    const user = users?.[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes desactivar al administrador principal" });

    await supabase.from("users").update({ active: 0 }).eq("id", id);
    res.json({ success: true, message: "Acceso quitado" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
