const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "data.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function query(sql, params = []) {
  const converted = sql
    .replace(/\$\d+/g, "?")
    .replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");
  const stmt = db.prepare(converted);
  const isSelect = /^\s*SELECT/i.test(converted);
  if (isSelect) {
    return { rows: stmt.all(...params) };
  }
  const info = stmt.run(...params);
  if (/RETURNING\s+\bid\b/i.test(converted)) {
    return { rows: [{ id: info.lastInsertRowid }] };
  }
  return { rows: [] };
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL REFERENCES roles(id),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      created_by_user_id INTEGER REFERENCES users(id),
      full_name TEXT NOT NULL,
      document_id TEXT,
      birth_date TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      status TEXT NOT NULL DEFAULT 'activo',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS clinical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL REFERENCES patients(id),
      dentist_user_id INTEGER REFERENCES users(id),
      full_name TEXT, document_id TEXT, birth_date TEXT, phone TEXT,
      reason TEXT, medical_history TEXT, diagnosis TEXT, treatment_plan TEXT,
      patient_photo TEXT, auxiliary_exams TEXT, budget_json TEXT,
      appointments_json TEXT, chart_json TEXT, chart_diagnosis TEXT,
      chart_observations TEXT, ortho_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS patient_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL REFERENCES patients(id),
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT OR IGNORE INTO roles (name, description) VALUES ('administrador', 'Acceso completo');
    INSERT OR IGNORE INTO roles (name, description) VALUES ('doctor', 'Gestiona historias y odontograma');
    INSERT OR IGNORE INTO roles (name, description) VALUES ('invitado', 'Acceso limitado de consulta');
  `);

  const hash = bcrypt.hashSync("huevos1", 10);
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("admin");
  if (existing) {
    db.prepare("UPDATE users SET password_hash = ?, active = 1 WHERE email = 'admin'").run(hash);
  } else {
    db.prepare("INSERT INTO users (role_id, full_name, email, password_hash) VALUES (1, 'Administrador', 'admin', ?)").run(hash);
  }

  console.log("Base de datos lista");
}

module.exports = { query, migrate };
