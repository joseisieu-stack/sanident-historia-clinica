-- Crear tablas en Supabase SQL Editor
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_records (
  id SERIAL PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
  dentist_user_id INTEGER REFERENCES users(id),
  full_name TEXT, document_id TEXT, birth_date TEXT, phone TEXT,
  reason TEXT, medical_history TEXT, diagnosis TEXT, treatment_plan TEXT,
  patient_photo TEXT, auxiliary_exams TEXT, budget_json TEXT,
  appointments_json TEXT, chart_json TEXT, chart_diagnosis TEXT,
  chart_observations TEXT, ortho_json TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_files (
  id SERIAL PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed roles
INSERT INTO roles (name, description) VALUES ('administrador', 'Acceso completo') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('doctor', 'Gestiona historias y odontograma') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('invitado', 'Acceso limitado de consulta') ON CONFLICT (name) DO NOTHING;

-- Seed admin user (password: huevos1)
INSERT INTO users (role_id, full_name, email, password_hash)
VALUES (1, 'Administrador', 'admin', '$2a$10$cqTfxVZAd44.E2cCMOsMRuZKwyHJeaPNkC0SiKrXTxUWhnWlheGli')
ON CONFLICT (email) DO NOTHING;
