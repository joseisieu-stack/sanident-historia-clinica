const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "sanident-secret-key-cambiar-en-produccion";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    const result = query(`
      SELECT u.id, u.full_name, u.email, u.password_hash, u.active, r.name as role
      FROM users u JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1 AND u.active = 1
    `, [email]);

    const user = result.rows[0];
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
    res.status(500).json({ error: "Error del servidor", detail: err.message });
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

    const result = query(`
      SELECT u.id, u.full_name, u.email, u.active, r.name as role
      FROM users u JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
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

    const existing = query(`SELECT id FROM users WHERE email = $1`, [email]).rows[0];
    if (existing) {
      return res.status(400).json({ error: "Ese usuario ya existe" });
    }

    const roleRow = query(`SELECT id FROM roles WHERE name = $1`, [(role || "doctor").toLowerCase()]).rows[0];
    if (!roleRow) return res.status(400).json({ error: "Rol inválido" });

    const hash = bcrypt.hashSync(password, 10);
    query(`INSERT INTO users (role_id, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`,
      [roleRow.id, fullName, email, hash]);

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
    const user = query(`SELECT email, active FROM users WHERE id = $1`, [id]).rows[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes editar al administrador principal" });

    if (email && email !== user.email) {
      const existing = query(`SELECT id FROM users WHERE email = $1 AND id != $2`, [email, id]).rows[0];
      if (existing) return res.status(400).json({ error: "Ese nombre de usuario ya está en uso" });
    }

    const sets = [];
    const vals = [];
    let idx = 1;
    if (fullName) { sets.push(`full_name = $${idx++}`); vals.push(fullName); }
    if (email) { sets.push(`email = $${idx++}`); vals.push(email); }
    if (password) { sets.push(`password_hash = $${idx++}`); vals.push(bcrypt.hashSync(password, 10)); }
    if (role) {
      const roleRow = query(`SELECT id FROM roles WHERE name = $1`, [role.toLowerCase()]).rows[0];
      if (roleRow) { sets.push(`role_id = $${idx++}`); vals.push(roleRow.id); }
    }

    if (sets.length) {
      vals.push(id);
      query(`UPDATE users SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx}`, vals);
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
    const user = query(`SELECT email FROM users WHERE id = $1`, [id]).rows[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.email === "admin") return res.status(400).json({ error: "No puedes desactivar al administrador principal" });

    query(`UPDATE users SET active = 0 WHERE id = $1`, [id]);
    res.json({ success: true, message: "Acceso quitado" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
