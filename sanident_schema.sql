CREATE DATABASE IF NOT EXISTS sanident CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sanident;

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  document_id VARCHAR(30),
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(40),
  specialty VARCHAR(120),
  password_hash VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE patients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_by_user_id BIGINT,
  full_name VARCHAR(180) NOT NULL,
  document_id VARCHAR(30),
  birth_date DATE,
  sex VARCHAR(20),
  phone VARCHAR(40),
  email VARCHAR(160),
  address VARCHAR(255),
  occupation VARCHAR(120),
  emergency_contact_name VARCHAR(160),
  emergency_contact_phone VARCHAR(40),
  status VARCHAR(30) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  INDEX idx_patients_name (full_name),
  INDEX idx_patients_document (document_id),
  INDEX idx_patients_phone (phone)
);

CREATE TABLE clinical_histories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  dentist_user_id BIGINT,
  reason TEXT,
  medical_history TEXT,
  dental_history TEXT,
  allergies TEXT,
  current_medication TEXT,
  systemic_diseases TEXT,
  habits TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  observations TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (dentist_user_id) REFERENCES users(id),
  INDEX idx_clinical_patient (patient_id)
);

CREATE TABLE odontograms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  dentist_user_id BIGINT,
  title VARCHAR(120) DEFAULT 'Odontograma',
  chart_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (dentist_user_id) REFERENCES users(id),
  INDEX idx_odontograms_patient (patient_id)
);

CREATE TABLE odontogram_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  odontogram_id BIGINT NOT NULL,
  tooth_number VARCHAR(5) NOT NULL,
  surface VARCHAR(40),
  finding_code VARCHAR(20),
  finding_label VARCHAR(180),
  color VARCHAR(20),
  metadata_json JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (odontogram_id) REFERENCES odontograms(id),
  INDEX idx_odontogram_items_tooth (odontogram_id, tooth_number)
);

CREATE TABLE patient_files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  uploaded_by_user_id BIGINT,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id),
  INDEX idx_files_patient (patient_id)
);

CREATE TABLE appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  dentist_user_id BIGINT,
  scheduled_at DATETIME NOT NULL,
  reason VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'programada',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (dentist_user_id) REFERENCES users(id),
  INDEX idx_appointments_date (scheduled_at)
);

CREATE TABLE treatments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  dentist_user_id BIGINT,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  tooth_number VARCHAR(5),
  status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  started_at DATE,
  finished_at DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (dentist_user_id) REFERENCES users(id),
  INDEX idx_treatments_patient (patient_id)
);

CREATE TABLE budgets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  created_by_user_id BIGINT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  budget_id BIGINT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(60),
  payment_date DATE NOT NULL,
  notes TEXT,
  created_by_user_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (budget_id) REFERENCES budgets(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT,
  old_data_json JSON,
  new_data_json JSON,
  ip_address VARCHAR(80),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_entity (entity_type, entity_id)
);

INSERT INTO roles (name, description) VALUES
('administrador', 'Gestiona usuarios, seguridad y configuracion'),
('doctor', 'Registra historia clinica, odontograma y tratamientos'),
('invitado', 'Acceso limitado de consulta');
