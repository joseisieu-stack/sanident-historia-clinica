# Lista tecnica de base de datos - Sani Dent

## Objetivo
Guardar en internet la historia clinica odontologica, odontograma, archivos, citas, tratamientos, pagos y auditoria de la clinica Sani Dent con usuarios y clave.

## Tablas principales

### roles
- id
- name: administrador, doctor, invitado
- description

### users
- id
- role_id
- full_name
- document_id
- email
- phone
- specialty
- password_hash
- active
- created_at
- updated_at

### patients
- id
- created_by_user_id
- full_name
- document_id
- birth_date
- sex
- phone
- email
- address
- occupation
- emergency_contact_name
- emergency_contact_phone
- status: activo, inactivo, finalizado
- created_at
- updated_at

### clinical_histories
- id
- patient_id
- dentist_user_id
- reason
- medical_history
- dental_history
- allergies
- current_medication
- systemic_diseases
- habits
- diagnosis
- treatment_plan
- observations
- created_at
- updated_at

### odontograms
- id
- patient_id
- dentist_user_id
- title
- chart_json
- created_at
- updated_at

### odontogram_items
- id
- odontogram_id
- tooth_number
- surface
- finding_code
- finding_label
- color
- metadata_json
- created_at

### patient_files
- id
- patient_id
- uploaded_by_user_id
- file_type: foto_paciente, radiografia, examen_auxiliar, foto_intraoral, foto_extraoral, documento
- file_name
- file_url
- notes
- created_at

### appointments
- id
- patient_id
- dentist_user_id
- scheduled_at
- reason
- status: programada, confirmada, atendida, cancelada, no_asistio
- notes
- created_at
- updated_at

### diagnoses
- id
- patient_id
- dentist_user_id
- diagnosis
- notes
- created_at

### treatments
- id
- patient_id
- dentist_user_id
- diagnosis_id
- name
- description
- tooth_number
- status: pendiente, en_proceso, finalizado, cancelado
- started_at
- finished_at
- created_at
- updated_at

### treatment_evolutions
- id
- treatment_id
- dentist_user_id
- evolution_date
- notes
- created_at

### budgets
- id
- patient_id
- created_by_user_id
- total
- discount
- status: pendiente, parcial, pagado, cancelado
- created_at
- updated_at

### budget_items
- id
- budget_id
- treatment_name
- tooth_number
- quantity
- unit_price
- subtotal

### payments
- id
- patient_id
- budget_id
- amount
- payment_method
- payment_date
- notes
- created_by_user_id

### audit_logs
- id
- user_id
- action
- entity_type
- entity_id
- old_data_json
- new_data_json
- ip_address
- created_at

## Indices para busqueda rapida
- patients.full_name
- patients.document_id
- patients.phone
- appointments.scheduled_at
- odontograms.patient_id
- clinical_histories.patient_id
- treatments.patient_id

## Seguridad minima
- Contraseñas cifradas con bcrypt o el sistema de autenticacion de Supabase.
- Cada usuario debe tener rol.
- El doctor puede editar historia clinica, odontograma y tratamientos.
- El invitado tiene acceso limitado de consulta.
- Auditoria para cambios criticos.
- Archivos privados, no publicos.
- Conexion HTTPS.
- Copias de seguridad automaticas.

## Endpoints principales
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/patients?search=
- POST /api/patients
- GET /api/patients/:id
- PUT /api/patients/:id
- GET /api/patients/:id/clinical-history
- POST /api/patients/:id/clinical-history
- GET /api/patients/:id/odontograms
- POST /api/patients/:id/odontograms
- POST /api/patients/:id/files
- GET /api/patients/:id/files
- GET /api/appointments
- POST /api/appointments
- POST /api/treatments
- POST /api/payments
- GET /api/reports/patient/:id/pdf

## MVP recomendado
1. Login.
2. Registro y busqueda de pacientes.
3. Historia clinica.
4. Odontograma.
5. Archivos del paciente.
6. Impresion PDF.
7. Roles basicos: administrador, doctor e invitado.
