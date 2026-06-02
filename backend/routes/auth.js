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

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
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
    if (decoded.role !== "Administrador") {
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
    if (decoded.role !== "Administrador") {
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

    const roleRow = db.prepare("SELECT id FROM roles WHERE name = ?").get(role || "doctor");
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

router.delete("/users/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "Administrador") {
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
