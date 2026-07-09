-- Run this in Supabase Dashboard > SQL Editor

-- Drop tables if they exist (clean slate)
DROP TABLE IF EXISTS patient_files CASCADE;
DROP TABLE IF EXISTS clinical_records CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create patients table with TEXT id
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
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
);

-- Create clinical_records table
CREATE TABLE clinical_records (
  id SERIAL PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
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
);

-- Create patient_files table
CREATE TABLE patient_files (
  id SERIAL PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed roles
INSERT INTO roles (name, description) VALUES
  ('administrador', 'Acceso completo'),
  ('doctor', 'Gestiona historias y odontograma'),
  ('invitado', 'Acceso limitado de consulta')
ON CONFLICT (name) DO NOTHING;

-- Seed admin user (password: huevos1)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO users (role_id, full_name, email, password_hash)
SELECT id, 'Administrador', 'admin', crypt('huevos1', gen_salt('bf', 10))
FROM roles WHERE name = 'administrador'
ON CONFLICT (email) DO UPDATE SET password_hash = crypt('huevos1', gen_salt('bf', 10));
