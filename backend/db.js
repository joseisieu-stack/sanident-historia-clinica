const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://sanident_user:6gKb7hJ8OEfjPuFLGm65Lq5icT6DLqBs@dpg-d8fottl7vvec739ejkrg-a/sanident";

const pool = new Pool({ connectionString: DATABASE_URL });

async function query(text, params) {
  return pool.query(text, params);
}

async function migrate() {
  await query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      role_id INTEGER NOT NULL REFERENCES roles(id),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      created_by_user_id INTEGER REFERENCES users(id),
      full_name TEXT NOT NULL,
      document_id TEXT,
      birth_date TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      status TEXT NOT NULL DEFAULT 'activo',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS clinical_records (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      dentist_user_id INTEGER REFERENCES users(id),
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
      ortho_json TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Add ortho_json column if upgrading existing table
  await query(`ALTER TABLE clinical_records ADD COLUMN IF NOT EXISTS ortho_json TEXT`);

  await query(`
    CREATE TABLE IF NOT EXISTS patient_files (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Seed roles
  await query(`INSERT INTO roles (name, description) VALUES ('administrador', 'Acceso completo') ON CONFLICT (name) DO NOTHING`);
  await query(`INSERT INTO roles (name, description) VALUES ('doctor', 'Gestiona historias y odontograma') ON CONFLICT (name) DO NOTHING`);
  await query(`INSERT INTO roles (name, description) VALUES ('invitado', 'Acceso limitado de consulta') ON CONFLICT (name) DO NOTHING`);

  // Seed admin user
  const bcrypt = require("bcryptjs");
  const adminRole = (await query(`SELECT id FROM roles WHERE name = 'administrador'`)).rows[0];
  const existingAdmin = (await query(`SELECT id FROM users WHERE email = 'admin'`)).rows[0];
  const hash = bcrypt.hashSync("ISIDRO2026", 10);
  if (existingAdmin) {
    await query(`UPDATE users SET password_hash = $1 WHERE email = 'admin'`, [hash]);
  } else {
    await query(`INSERT INTO users (role_id, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`, [adminRole.id, "Administrador Sani Dent", "admin", hash]);
  }

  console.log("Base de datos lista");
}

module.exports = { query, migrate };
