const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "sanident-secret-key-cambiar-en-produccion";

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  const user = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.password_hash, u.active, r.name as role
    FROM users u JOIN roles r ON u.role_id = r.id
    WHERE u.email = ? AND u.active = 1
  `).get(email);

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
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
});

router.get("/users", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const users = db.prepare(`
      SELECT u.id, u.full_name, u.email, u.active, r.name as role
      FROM users u JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `).all();

    res.json(users);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

router.post("/users", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña requeridos" });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(400).json({ error: "Ese usuario ya existe" });
    }

    const roleRow = db.prepare("SELECT id FROM roles WHERE name = ?").get((role || "doctor").toLowerCase());
    if (!roleRow) return res.status(400).json({ error: "Rol inválido" });

    const hash = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO users (role_id, full_name, email, password_hash) VALUES (?, ?, ?, ?)").run(
      roleRow.id, fullName, email, hash
    );

    res.json({ success: true, message: "Usuario creado" });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

router.put("/users/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { id } = req.params;
    const { fullName, email, password, role } = req.body;
    const user = db.prepare("SELECT email, active FROM users WHERE id = ?").get(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes editar al administrador principal" });

    if (email && email !== user.email) {
      const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, id);
      if (existing) return res.status(400).json({ error: "Ese nombre de usuario ya está en uso" });
    }

    const roleRow = role ? db.prepare("SELECT id FROM roles WHERE name = ?").get(role.toLowerCase()) : null;
    const roleId = roleRow?.id;

    const updates = [];
    const values = [];
    if (fullName) { updates.push("full_name = ?"); values.push(fullName); }
    if (email) { updates.push("email = ?"); values.push(email); }
    if (password) { updates.push("password_hash = ?"); values.push(bcrypt.hashSync(password, 10)); }
    if (roleId) { updates.push("role_id = ?"); values.push(roleId); }

    if (updates.length) {
      values.push(id);
      db.prepare(`UPDATE users SET ${updates.join(", ")}, updated_at = datetime('now') WHERE id = ?`).run(...values);
    }

    res.json({ success: true, message: "Usuario actualizado" });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

router.delete("/users/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role?.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    const { id } = req.params;
    const user = db.prepare("SELECT email FROM users WHERE id = ?").get(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes desactivar al administrador principal" });

    db.prepare("UPDATE users SET active = 0 WHERE id = ?").run(id);
    res.json({ success: true, message: "Acceso quitado" });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

module.exports = router;
