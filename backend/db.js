const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = new Database(path.join(__dirname, "sanident.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by_user_id INTEGER,
    full_name TEXT NOT NULL,
    document_id TEXT,
    birth_date TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'activo',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS clinical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    dentist_user_id INTEGER,
    full_name TEXT,
    document_id TEXT,
    birth_date TEXT,
    phone TEXT,
    reason TEXT,
    medical_history TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    patient_photo TEXT,
    auxiliary_exams TEXT,
    budget_json TEXT,
    appointments_json TEXT,
    chart_json TEXT,
    chart_diagnosis TEXT,
    chart_observations TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (dentist_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS patient_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  );
`);

const roleStmt = db.prepare("INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)");
roleStmt.run("administrador", "Acceso completo");
roleStmt.run("doctor", "Gestiona historias y odontograma");
roleStmt.run("invitado", "Acceso limitado de consulta");

const adminRole = db.prepare("SELECT id FROM roles WHERE name = ?").get("administrador");
const hash = bcrypt.hashSync("ISIDRO2026", 10);
const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get("admin");
if (existingAdmin) {
  db.prepare("UPDATE users SET password_hash = ? WHERE email = ?").run(hash, "admin");
} else {
  db.prepare("INSERT INTO users (role_id, full_name, email, password_hash) VALUES (?, ?, ?, ?)").run(
    adminRole.id, "Administrador Sani Dent", "admin", hash
  );
}

module.exports = db;
