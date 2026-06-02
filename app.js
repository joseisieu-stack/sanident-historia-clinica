const teeth = {
  upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  temporaryUpper: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  temporaryLower: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
  lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

const surfaceDetails = {
  "restoration-good": { label: "Restauracion definitiva en buen estado", code: "R", color: "blue", style: "fill", kind: "restoration" },
  "restoration-bad": { label: "Restauracion definitiva en mal estado", code: "R", color: "red", style: "fill", kind: "restoration" },
  "restoration-temp": { label: "Restauracion temporal", code: "RT", color: "red", style: "outline", kind: "restoration" },
  "caries-mb": { label: "Mancha blanca", code: "MB", color: "red", style: "fill", kind: "caries" },
  "caries-enamel": { label: "Caries en esmalte", code: "CE", color: "red", style: "fill", kind: "caries" },
  "caries-dentin": { label: "Caries en dentina", code: "CD", color: "red", style: "fill", kind: "caries" },
  "caries-pulp": { label: "Caries con compromiso pulpar", code: "CDP", color: "red", style: "fill", kind: "caries" },
  wear: { label: "Superficie desgastada", code: "DES", color: "red", style: "fill", kind: "wear" },
};

const findings = {
  orthodontic: { label: "Aparato ortodontico", code: "AO", color: "blue", mark: "span-fixed", span: true, usesOrthoChoice: true },
  "ortho-fixed-good": { label: "Aparato ortodontico fijo en buen estado", code: "AOF", color: "blue", mark: "span-fixed", span: true, hidden: true },
  "ortho-fixed-bad": { label: "Aparato ortodontico fijo en mal estado", code: "AOF", color: "red", mark: "span-fixed", span: true, hidden: true },
  "ortho-removable-good": { label: "Aparato ortodontico removible en buen estado", code: "AOR", color: "blue", mark: "span-zigzag", span: true, hidden: true },
  "ortho-removable-bad": { label: "Aparato ortodontico removible en mal estado", code: "AOR", color: "red", mark: "span-zigzag", span: true, hidden: true },
  crown: { label: "Corona", code: "CM", color: "blue", mark: "border", usesCrownType: true },
  "crown-good": { label: "Corona en buen estado", code: "CM", color: "blue", mark: "border", hidden: true },
  "crown-bad": { label: "Corona en mal estado", code: "CM", color: "red", mark: "border", hidden: true },
  "crown-temp": { label: "Corona temporal", code: "CT", color: "red", mark: "border", hidden: true },
  diastema: { label: "Diastema", code: "DIA", color: "blue", mark: "diastema", span: true },
  "post-core": { label: "Espigo munon", code: "EM", color: "blue", mark: "post", usesStatus: true },
  "post-core-good": { label: "Espigo munon en buen estado", code: "EM", color: "blue", mark: "post", hidden: true },
  "post-core-bad": { label: "Espigo munon en mal estado", code: "EM", color: "red", mark: "post", hidden: true },
  "deep-pits": { label: "Fosas y fisuras profundas", code: "FFP", color: "blue", mark: "text" },
  fracture: { label: "Fractura dental", code: "FRA", color: "red", mark: "fracture", usesFractureType: true },
  fusion: { label: "Fusion", code: "FUS", color: "blue", mark: "circle", span: true },
  gemination: { label: "Geminacion", code: "GEM", color: "blue", mark: "circle" },
  rotation: { label: "Giroversion", code: "GIR", color: "blue", mark: "crown-arrow" },
  impaction: { label: "Impactacion", code: "I", color: "blue", mark: "code-only" },
  missing: { label: "Pieza ausente", code: "DNE", color: "blue", mark: "x", hidden: true },
  "missing-dne": { label: "Diente no erupcionado", code: "DNE", color: "blue", mark: "x", hidden: true },
  "missing-dex": { label: "Ausente por extraccion/caries", code: "DEX", color: "blue", mark: "x", hidden: true },
  "missing-dao": { label: "Ausente por otras razones", code: "DAO", color: "blue", mark: "x", hidden: true },
  extraction: { label: "Extraccion indicada", code: "EX", color: "red", mark: "x" },
  "peg-tooth": { label: "Pieza dentaria en clavija", code: "CLV", color: "blue", mark: "root-triangle" },
  ectopic: { label: "Pieza dentaria ectopica", code: "E", color: "blue", mark: "text" },
  eruption: { label: "Pieza dentaria en erupcion", code: "ERU", color: "blue", mark: "eruption-zigzag" },
  extruded: { label: "Pieza dentaria extruida", code: "EXT", color: "blue", mark: "crown-arrow-up" },
  intruded: { label: "Pieza dentaria intruida", code: "INT", color: "blue", mark: "crown-arrow-in" },
  supernumerary: { label: "Pieza supernumeraria", code: "S", color: "blue", mark: "supernumerary", usesSupernumerarySide: true },
  implant: { label: "Implante", code: "IMP", color: "blue", mark: "code-only", usesStatus: true },
  "implant-good": { label: "Implante en buen estado", code: "IMP", color: "blue", mark: "code-only", hidden: true },
  "implant-bad": { label: "Implante en mal estado", code: "IMP", color: "red", mark: "code-only", hidden: true },
  endodontics: { label: "Endodoncia", code: "TC", color: "blue", mark: "vertical", usesStatus: true },
  "endo-good": { label: "Endodoncia en buen estado", code: "TC", color: "blue", mark: "vertical", hidden: true },
  "endo-bad": { label: "Endodoncia en mal estado", code: "TC", color: "red", mark: "vertical", hidden: true },
  pulpectomy: { label: "Pulpectomia", code: "PC", color: "blue", mark: "vertical", usesStatus: true },
  "pulpectomy-good": { label: "Pulpectomia en buen estado", code: "PC", color: "blue", mark: "vertical", hidden: true },
  "pulpectomy-bad": { label: "Pulpectomia en mal estado", code: "PC", color: "red", mark: "vertical", hidden: true },
  pulpotomy: { label: "Pulpotomia", code: "PP", color: "blue", mark: "pulp", usesStatus: true },
  "pulpotomy-good": { label: "Pulpotomia en buen estado", code: "PP", color: "blue", mark: "pulp", hidden: true },
  "pulpotomy-bad": { label: "Pulpotomia en mal estado", code: "PP", color: "red", mark: "pulp", hidden: true },
  sealant: { label: "Sellante", code: "S", color: "blue", mark: "text", usesStatus: true },
  "sealant-good": { label: "Sellante en buen estado", code: "S", color: "blue", mark: "text", hidden: true },
  "sealant-bad": { label: "Sellante en mal estado", code: "S", color: "red", mark: "text", hidden: true },
  opacity: { label: "Opacidad del esmalte", code: "O", color: "red", mark: "text", hidden: true },
  pigmentation: { label: "Pigmentacion del esmalte", code: "PE", color: "red", mark: "text" },
  macro: { label: "Macrodoncia", code: "MAC", color: "blue", mark: "code-only" },
  micro: { label: "Microdoncia", code: "MIC", color: "blue", mark: "code-only" },
  mobility: { label: "Movilidad", code: "M", color: "red", mark: "text", usesMobilityGrade: true },
  mobility1: { label: "Movilidad grado 1", code: "M1", color: "red", mark: "text", hidden: true },
  mobility2: { label: "Movilidad grado 2", code: "M2", color: "red", mark: "text", hidden: true },
  mobility3: { label: "Movilidad grado 3", code: "M3", color: "red", mark: "text", hidden: true },
  "dental-position": { label: "POSICION ANOMAL DENTARIA", code: "POS", color: "blue", mark: "code-only", usesPositionType: true },
  "position-m": { label: "Mesializado", code: "M", color: "blue", mark: "text", hidden: true },
  "position-d": { label: "Distalizado", code: "D", color: "blue", mark: "text", hidden: true },
  "position-v": { label: "Vestibularizado", code: "V", color: "blue", mark: "text", hidden: true },
  "position-p": { label: "Palatinizado", code: "P", color: "blue", mark: "text", hidden: true },
  "position-l": { label: "Lingualizado", code: "L", color: "blue", mark: "text", hidden: true },
  "edentulous-total": { label: "Edentulo total superior/inferior", code: "ED", color: "blue", mark: "edentulous-line", span: true },
  "fixed-prosthesis": { label: "Protesis parcial fija", code: "PPF", color: "blue", mark: "span-fixed-prosthesis", span: true, usesStatus: true },
  "fixed-prosthesis-good": { label: "Protesis parcial fija en buen estado", code: "PPF", color: "blue", mark: "span-fixed-prosthesis", span: true, hidden: true },
  "fixed-prosthesis-bad": { label: "Protesis parcial fija en mal estado", code: "PPF", color: "red", mark: "span-fixed-prosthesis", span: true, hidden: true },
  "complete-prosthesis": { label: "Protesis completa", code: "PCO", color: "blue", mark: "span-double-line", span: true, usesStatus: true },
  "complete-prosthesis-good": { label: "Protesis completa en buen estado", code: "PCO", color: "blue", mark: "span-double-line", span: true, hidden: true },
  "complete-prosthesis-bad": { label: "Protesis completa en mal estado", code: "PCO", color: "red", mark: "span-double-line", span: true, hidden: true },
  "removable-prosthesis": { label: "Protesis parcial removible", code: "PPR", color: "blue", mark: "span-double-line", span: true, usesStatus: true },
  "removable-prosthesis-good": { label: "Protesis parcial removible en buen estado", code: "PPR", color: "blue", mark: "span-double-line", span: true, hidden: true },
  "removable-prosthesis-bad": { label: "Protesis parcial removible en mal estado", code: "PPR", color: "red", mark: "span-double-line", span: true, hidden: true },
  "root-remnant": { label: "Remanente radicular", code: "RR", color: "red", mark: "text" },
  transposition: { label: "Transposicion dentaria", code: "TRA", color: "blue", mark: "arrow" },
};

const surfaceNames = {
  top: "vestibular",
  center: "oclusal/incisal",
  left: "mesial/distal",
  right: "distal/mesial",
  bottom: "palatino/lingual",
};

const state = {
  activeTool: "restoration",
  activeFinding: "",
  pendingSpanStart: "",
  selectedTooth: "",
  chart: {},
};

const API_URL = localStorage.getItem("sanident.apiUrl") || "http://localhost:3000/api";
const storageKey = "odontologia.historiaClinica.v2";
const patientIndexKey = "odontologia.pacientes.index.v1";
const patientRecordPrefix = "odontologia.paciente.";
const sessionKey = "odontologia.session.v1";
const usersKey = "odontologia.usuarios.v1";
const defaultAdmin = {
  id: "admin",
  fullName: "Administrador Sani Dent",
  email: "admin",
  password: "admin",
  role: "Administrador",
  active: true,
};
const tokenKey = "sanident.token";

function getToken() {
  return sessionStorage.getItem(tokenKey);
}

function setToken(token) {
  if (token) sessionStorage.setItem(tokenKey, token);
  else sessionStorage.removeItem(tokenKey);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}
const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginRole = document.querySelector("#loginRole");
const loginMessage = document.querySelector("#loginMessage");
const sessionUser = document.querySelector("#sessionUser");
const manageUsersButton = document.querySelector("#manageUsersButton");
const userAdmin = document.querySelector("#userAdmin");
const userForm = document.querySelector("#userForm");
const userList = document.querySelector("#userList");
const userAdminMessage = document.querySelector("#userAdminMessage");
const newUserName = document.querySelector("#newUserName");
const newUserEmail = document.querySelector("#newUserEmail");
const newUserPassword = document.querySelector("#newUserPassword");
const newUserRole = document.querySelector("#newUserRole");
const clinicalView = document.querySelector("#clinicalView");
const chartView = document.querySelector("#chartView");
const form = document.querySelector("#clinicalForm");
const odontogram = document.querySelector("#odontogram");
const selectedTooth = document.querySelector("#selectedTooth");
const saveStatus = document.querySelector("#saveStatus");
const chartDiagnosis = document.querySelector("#chartDiagnosis");
const chartObservations = document.querySelector("#chartObservations");
const diagnosisTags = document.querySelector("#diagnosisTags");
const addDiagnosisButton = document.querySelector("#addDiagnosisButton");
const budgetItems = document.querySelector("#budgetItems");
const budgetTotal = document.querySelector("#budgetTotal");
const budgetAdvance = document.querySelector("#budgetAdvance");
const budgetBalance = document.querySelector("#budgetBalance");
const appointmentItems = document.querySelector("#appointmentItems");
const addBudgetItemButton = document.querySelector("#addBudgetItemButton");
const addAppointmentButton = document.querySelector("#addAppointmentButton");
const patientSearch = document.querySelector("#patientSearch");
const patientList = document.querySelector("#patientList");
const patientCount = document.querySelector("#patientCount");
const patientPhotoInput = document.querySelector("#patientPhotoInput");
const patientPhotoPreview = document.querySelector("#patientPhotoPreview");
const auxiliaryExamsInput = document.querySelector("#auxiliaryExamsInput");
const examList = document.querySelector("#examList");
const restorationDetail = document.querySelector("#restorationDetail");
const cariesDetail = document.querySelector("#cariesDetail");
const restorationMaterial = document.querySelector("#restorationMaterial");
const missingReason = document.querySelector("#missingReason");
const crownType = document.querySelector("#crownType");
const crownStatus = document.querySelector("#crownStatus");
const orthoChoice = document.querySelector("#orthoChoice");
const treatmentStatus = document.querySelector("#treatmentStatus");
const mobilityGrade = document.querySelector("#mobilityGrade");
const fractureType = document.querySelector("#fractureType");
const supernumerarySide = document.querySelector("#supernumerarySide");
const positionType = document.querySelector("#positionType");
const findingQuickButtons = document.querySelector("#findingQuickButtons");
const restorationOptions = document.querySelector("#restorationOptions");
const cariesOptions = document.querySelector("#cariesOptions");
const missingOptions = document.querySelector("#missingOptions");
const crownOptions = document.querySelector("#crownOptions");
const orthoOptions = document.querySelector("#orthoOptions");
const statusOptions = document.querySelector("#statusOptions");
const mobilityOptions = document.querySelector("#mobilityOptions");
const fractureOptions = document.querySelector("#fractureOptions");
const supernumeraryOptions = document.querySelector("#supernumeraryOptions");
const positionOptions = document.querySelector("#positionOptions");
const eraseSurfaceButton = document.querySelector("#eraseSurfaceButton");

let patientPhotoData = "";
let auxiliaryExamNames = [];
let currentPatientId = "";

function emptyToothRecord() {
  return { surfaces: {}, finding: "" };
}

function getToothRecord(number) {
  if (!state.chart[number]) state.chart[number] = emptyToothRecord();
  if (!state.chart[number].surfaces) state.chart[number].surfaces = {};
  return state.chart[number];
}

function createArch(label, items) {
  const wrapper = document.createElement("section");
  wrapper.className = `odontogram-section${label.includes("temporal") ? " temporary-section" : ""}`;

  const heading = document.createElement("div");
  heading.className = "arch-label";
  heading.textContent = label;
  wrapper.appendChild(heading);

  const arch = document.createElement("div");
  arch.className = "arch";

  items.forEach((number, index) => {
    const tooth = createTooth(number, label.includes("superior") ? "upper" : "lower");
    if (label.includes("temporal")) tooth.style.gridColumn = String(index + 4);
    arch.appendChild(tooth);
  });
  wrapper.appendChild(arch);
  return wrapper;
}

function rootType(number) {
  const quadrant = Number(String(number).slice(0, 1));
  const unit = Number(String(number).slice(-1));
  if ([5, 6, 7, 8].includes(quadrant) && [4, 5].includes(unit)) return "molar";
  if ([6, 7, 8].includes(unit)) return "molar";
  if (unit === 4) return "premolar";
  return "anterior";
}

function rootMarkup(number, jaw) {
  const type = rootType(number);
  const top = jaw === "upper";
  const baseY = top ? 55 : 75;
  const tipY = top ? 7 : 123;
  const midY = top ? 45 : 85;

  if (type === "molar") {
    return `
      <path class="root-line" d="M20 ${baseY} L30 ${tipY} L43 ${baseY}"></path>
      <path class="root-line" d="M36 ${baseY} L50 ${tipY} L64 ${baseY}"></path>
      <path class="root-line" d="M57 ${baseY} L72 ${tipY} L84 ${baseY}"></path>
    `;
  }

  if (type === "premolar") {
    return `
      <path class="root-line" d="M27 ${baseY} L42 ${tipY} L55 ${baseY}"></path>
      <path class="root-line" d="M45 ${baseY} L60 ${tipY} L74 ${baseY}"></path>
    `;
  }

  return `<path class="root-line" d="M34 ${baseY} L50 ${tipY} L66 ${baseY} L50 ${midY} Z"></path>`;
}

function crownMarkup(jaw) {
  const y1 = jaw === "upper" ? 55 : 5;
  const y2 = jaw === "upper" ? 125 : 75;
  const c1 = y1 + 20;
  const c2 = y2 - 20;
  const centerY = y1 + 35;

  return `
    <polygon class="surface" data-surface="top" points="15,${y1} 85,${y1} 65,${c1} 35,${c1}"></polygon>
    <polygon class="surface" data-surface="right" points="85,${y1} 85,${y2} 65,${c2} 65,${c1}"></polygon>
    <polygon class="surface" data-surface="bottom" points="15,${y2} 85,${y2} 65,${c2} 35,${c2}"></polygon>
    <polygon class="surface" data-surface="left" points="15,${y1} 35,${c1} 35,${c2} 15,${y2}"></polygon>
    <rect class="surface" data-surface="center" x="35" y="${centerY - 15}" width="30" height="30"></rect>
  `;
}

function createTooth(number, jaw) {
  const button = document.createElement("div");
  button.className = `tooth ${jaw === "lower" ? "lower-tooth" : "upper-tooth"}`;
  button.dataset.tooth = number;
  button.dataset.jaw = jaw;
  const quadrant = Number(String(number).slice(0, 1));
  const codeMarkup = `<div class="tooth-code" data-code></div>`;
  const svgMarkup = `
    <svg class="tooth-svg" viewBox="0 0 100 130" role="img" aria-label="Pieza ${number}">
      <g class="roots" aria-hidden="true">${rootMarkup(number, jaw)}</g>
      <g class="crown">${crownMarkup(jaw)}</g>
      <g data-overlay></g>
    </svg>
  `;
  button.innerHTML = [1, 2, 5, 6].includes(quadrant) ? `
    ${codeMarkup}
    <div class="tooth-number">${number}</div>
    ${svgMarkup}
  ` : `
    ${svgMarkup}
    <div class="tooth-number">${number}</div>
    ${codeMarkup}
  `;
  return button;
}

function renderOdontogram() {
  odontogram.innerHTML = "";
  odontogram.appendChild(createArch("Arcada superior", teeth.upper));
  odontogram.appendChild(createArch("Denticion temporal superior", teeth.temporaryUpper));
  odontogram.appendChild(createArch("Denticion temporal inferior", teeth.temporaryLower));
  odontogram.appendChild(createArch("Arcada inferior", teeth.lower));
  refreshToothStyles();
}

function sentenceLabel(text = "") {
  const lower = text.toLocaleLowerCase("es");
  return lower ? `${lower.charAt(0).toLocaleUpperCase("es")}${lower.slice(1)}` : "";
}

function renderFindingButtons() {
  const fragment = document.createDocumentFragment();
  const primaryTools = [
    { tool: "restoration", code: "R", label: "Restauracion", color: "blue" },
    { tool: "caries", code: "CD", label: "Caries", color: "red" },
    { finding: "root-remnant", code: "RR", label: "Remanente radicular", color: "red" },
    { tool: "missing", code: "X", label: "Pieza ausente", color: "blue" },
  ];

  primaryTools.forEach((tool) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `finding-chip tool-chip ${tool.color}-chip${tool.tool === "restoration" ? " active" : ""}`;
    if (tool.tool) button.dataset.tool = tool.tool;
    if (tool.finding) button.dataset.finding = tool.finding;
    button.title = tool.label;
    button.innerHTML = `<span class="finding-code">${tool.code}</span><span>${sentenceLabel(tool.label)}</span>`;
    fragment.appendChild(button);
  });

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "finding-chip clear-chip";
  clearButton.dataset.finding = "";
  clearButton.title = "Borrar hallazgo de la pieza";
  clearButton.innerHTML = `<span class="finding-code">Borrar</span><span>Borrar hallazgo</span>`;
  fragment.appendChild(clearButton);

  Object.entries(findings)
    .filter(([key, finding]) => !finding.hidden && key !== "root-remnant")
    .sort((a, b) => a[1].label.localeCompare(b[1].label, "es", { sensitivity: "base" }))
    .forEach(([key, finding]) => {
    if (finding.hidden) return;
    if (key === "root-remnant") return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `finding-chip ${finding.color}-chip`;
    button.dataset.finding = key;
    button.title = finding.label;
    button.innerHTML = `<span class="finding-code">${finding.code}</span><span>${sentenceLabel(finding.label)}</span>`;
    fragment.appendChild(button);
  });
  findingQuickButtons.innerHTML = "";
  findingQuickButtons.appendChild(fragment);
}

function apexY(jaw) {
  return jaw === "upper" ? 18 : 112;
}

function crownLineY(jaw) {
  return jaw === "upper" ? 92 : 38;
}

function showView(view) {
  clinicalView.classList.toggle("active", view === "clinical");
  chartView.classList.toggle("active", view === "chart");
}

function createUserId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `usuario-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function readUsers() {
  try {
    return await api("/auth/users");
  } catch {
    return [];
  }
}

async function writeUsers() {}

async function ensureDefaultAdmin() {}

function currentSession() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roleMap = { administrador: "Administrador", doctor: "Doctor", invitado: "Invitado" };
    return { email: payload.email, role: roleMap[payload.role] || payload.role, fullName: payload.fullName };
  } catch {
    return null;
  }
}

async function renderUserList() {
  const session = currentSession();
  let users;
  try { users = await readUsers(); } catch { users = []; }
  userList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  users.forEach((user) => {
    const row = document.createElement("div");
    row.className = `user-row${user.active ? "" : " inactive"}`;
    const canRemove = user.email !== defaultAdmin.email && user.email !== session?.email && user.active;
    row.innerHTML = `
      <div>
        <strong>${user.fullName}</strong>
        <span>${user.email} | ${user.role} | ${user.active ? "Activo" : "Sin acceso"}</span>
      </div>
      ${canRemove ? `<button class="small-danger-button" type="button" data-user-id="${user.id}">Quitar acceso</button>` : ""}
    `;
    fragment.appendChild(row);
  });

  userList.appendChild(fragment);
}

function applySession(session) {
  const roleMap = { administrador: "Administrador", doctor: "Doctor", invitado: "Invitado" };
  if (session) session.role = roleMap[session.role] || session.role;
  loginScreen.classList.toggle("hidden", Boolean(session));
  sessionUser.textContent = session ? `${session.role}: ${session.email}` : "";
  manageUsersButton.classList.toggle("hidden", session?.role !== "Administrador");
  if (session?.role !== "Administrador") userAdmin.classList.add("hidden");
  const readonly = session?.role === "Invitado";
  document.querySelector("#saveButton").classList.toggle("hidden", readonly);
  document.querySelector("#printButton").classList.toggle("hidden", readonly);
  document.querySelector("#addBudgetItemButton").classList.toggle("hidden", readonly);
  document.querySelector("#addAppointmentButton").classList.toggle("hidden", readonly);
  document.querySelector("#clearButton").classList.toggle("hidden", readonly);
  document.querySelector("#openChartButton").classList.toggle("hidden", readonly);
  form.querySelectorAll("input, textarea, select").forEach((el) => {
    el.readOnly = readonly;
  });
  document.querySelectorAll(".icon-danger-button, #eraseSurfaceButton, #resetChartButton, #addDiagnosisButton").forEach((el) => {
    el.classList.toggle("hidden", readonly);
  });
  if (session) renderPatientList();
}

function readSession() {
  return currentSession();
}

async function startSession(email, password) {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  applySession(data.user);
  return data.user;
}

function closeSession() {
  setToken(null);
  loginPassword.value = "";
  userAdmin.classList.add("hidden");
  applySession(null);
}

function renderPatientPhoto() {
  patientPhotoPreview.src = patientPhotoData || "";
  patientPhotoPreview.classList.toggle("has-photo", Boolean(patientPhotoData));
}

function renderExamList() {
  examList.textContent = auxiliaryExamNames.length
    ? auxiliaryExamNames.join(", ")
    : "Sin archivos cargados";
}

let diagnosisList = [];

function addDiagnosisTag(text) {
  text = text.trim();
  if (!text) return;
  if (diagnosisList.includes(text)) return;
  diagnosisList.push(text);
  renderDiagnosisTags();
  setDirty();
}

function removeDiagnosisTag(text) {
  diagnosisList = diagnosisList.filter((item) => item !== text);
  renderDiagnosisTags();
  setDirty();
}

function renderDiagnosisTags() {
  diagnosisTags.innerHTML = "";
  diagnosisList.forEach((text) => {
    const tag = document.createElement("span");
    tag.className = "diagnosis-tag";
    tag.innerHTML = `${text} <button type="button" class="tag-remove" data-value="${text}">&times;</button>`;
    diagnosisTags.appendChild(tag);
  });
  diagnosisTags.appendChild(document.createElement("span")).style.display = "none";
}

function getChartNotes() {
  return {
    diagnosis: diagnosisList.join(", "),
    observations: chartObservations.value.trim(),
  };
}

function fillChartNotes(notes = {}) {
  chartDiagnosis.value = "";
  diagnosisList = notes.diagnosis ? notes.diagnosis.split(",").map((s) => s.trim()).filter(Boolean) : [];
  renderDiagnosisTags();
  chartObservations.value = notes.observations || "";
}

function createBudgetRow(item = {}) {
  const row = document.createElement("div");
  row.className = "budget-row";
  row.innerHTML = `
    <label>
      Tratamiento
      <input class="budget-treatment" placeholder="Tratamiento realizado o indicado" value="${item.treatment || ""}">
    </label>
    <label>
      Precio
      <input class="budget-price" type="number" min="0" step="0.01" placeholder="0.00" value="${item.price || ""}">
    </label>
    <button class="icon-danger-button" type="button" title="Eliminar tratamiento">X</button>
  `;
  return row;
}

function createAppointmentRow(item = {}) {
  const row = document.createElement("div");
  row.className = "appointment-row";
  row.innerHTML = `
    <label>
      Motivo
      <input class="appointment-reason" placeholder="Control, tratamiento, evaluacion" value="${item.reason || ""}">
    </label>
    <label>
      Fecha y hora
      <input class="appointment-date" type="datetime-local" value="${item.dateTime || ""}">
    </label>
    <button class="icon-danger-button" type="button" title="Eliminar cita">X</button>
  `;
  return row;
}

function calculateBudget() {
  const total = Array.from(budgetItems.querySelectorAll(".budget-price"))
    .reduce((sum, input) => sum + (Number(input.value) || 0), 0);
  const advance = Number(budgetAdvance.value) || 0;
  budgetTotal.value = total.toFixed(2);
  budgetBalance.value = Math.max(total - advance, 0).toFixed(2);
}

function getBudgetData() {
  return {
    items: Array.from(budgetItems.querySelectorAll(".budget-row"))
      .map((row) => ({
        treatment: row.querySelector(".budget-treatment").value.trim(),
        price: row.querySelector(".budget-price").value,
      }))
      .filter((item) => item.treatment || item.price),
    advance: budgetAdvance.value,
  };
}

function fillBudgetData(data = {}) {
  budgetItems.innerHTML = "";
  const items = data.items?.length ? data.items : [{}];
  items.forEach((item) => budgetItems.appendChild(createBudgetRow(item)));
  budgetAdvance.value = data.advance || "";
  calculateBudget();
}

function getAppointmentsData() {
  return Array.from(appointmentItems.querySelectorAll(".appointment-row"))
    .map((row) => ({
      reason: row.querySelector(".appointment-reason").value.trim(),
      dateTime: row.querySelector(".appointment-date").value,
    }))
    .filter((item) => item.reason || item.dateTime);
}

function fillAppointmentsData(items = []) {
  appointmentItems.innerHTML = "";
  const rows = items.length ? items : [{}];
  rows.forEach((item) => appointmentItems.appendChild(createAppointmentRow(item)));
}

function postCoreMarkup(colorClass, jaw, number) {
  const type = rootType(number);
  const crownY = crownLineY(jaw);
  const squareY = crownY - 14;
  const lineStartY = jaw === "upper" ? squareY : squareY + 28;
  const rootY = apexY(jaw);
  const targets = type === "anterior" ? [50] : [38, 62];
  const lines = targets.map((x) => (
    `<line class="tooth-overlay ${colorClass}" x1="50" y1="${lineStartY}" x2="${x}" y2="${rootY}"></line>`
  )).join("");

  return `
    <rect class="tooth-overlay ${colorClass}" x="36" y="${squareY}" width="28" height="28"></rect>
    ${lines}
  `;
}

function fractureMarkup(colorClass, jaw, type) {
  const cY = crownLineY(jaw);
  const rY = apexY(jaw);

  if (type === "root") {
    return `<line class="tooth-overlay ${colorClass}" x1="30" y1="${rY + (jaw === "upper" ? 14 : -14)}" x2="70" y2="${rY + (jaw === "upper" ? -10 : 10)}"></line>`;
  }

  if (type === "angle") {
    return jaw === "upper"
      ? `<line class="tooth-overlay ${colorClass}" x1="64" y1="${cY - 34}" x2="88" y2="${cY - 10}"></line>`
      : `<line class="tooth-overlay ${colorClass}" x1="64" y1="${cY + 34}" x2="88" y2="${cY + 10}"></line>`;
  }

  return `<line class="tooth-overlay ${colorClass}" x1="18" y1="${cY}" x2="82" y2="${cY}"></line>`;
}

function overlayMarkup(finding, jaw = "upper", record = {}, number = 0) {
  if (!finding) return "";

  const colorClass = `${finding.color}-mark`;
  const role = record.spanRole || "single";
  const y = apexY(jaw);
  const crownY = crownLineY(jaw);

  if (finding.mark === "span-fixed") {
    const leftBox = role === "start" || role === "single"
      ? `<rect class="tooth-overlay ${colorClass}" x="6" y="${y - 8}" width="16" height="16"></rect>
         <line class="tooth-overlay ${colorClass}" x1="9" y1="${y}" x2="19" y2="${y}"></line>
         <line class="tooth-overlay ${colorClass}" x1="14" y1="${y - 5}" x2="14" y2="${y + 5}"></line>`
      : "";
    const rightBox = role === "end" || role === "single"
      ? `<rect class="tooth-overlay ${colorClass}" x="78" y="${y - 8}" width="16" height="16"></rect>
         <line class="tooth-overlay ${colorClass}" x1="81" y1="${y}" x2="91" y2="${y}"></line>
         <line class="tooth-overlay ${colorClass}" x1="86" y1="${y - 5}" x2="86" y2="${y + 5}"></line>`
      : "";
    return `<line class="tooth-overlay ${colorClass}" x1="0" y1="${y}" x2="100" y2="${y}"></line>${leftBox}${rightBox}`;
  }

  if (finding.mark === "span-zigzag") {
    return `<polyline class="tooth-overlay ${colorClass}" points="0,${y + 8} 12,${y - 8} 25,${y + 8} 37,${y - 8} 50,${y + 8} 62,${y - 8} 75,${y + 8} 87,${y - 8} 100,${y + 8}"></polyline>`;
  }

  if (finding.mark === "span-fixed-prosthesis") {
    const pillars = `${role === "start" || role === "single" ? `<line class="tooth-overlay ${colorClass}" x1="14" y1="${y - 18}" x2="14" y2="${y + 18}"></line>` : ""}
      ${role === "end" || role === "single" ? `<line class="tooth-overlay ${colorClass}" x1="86" y1="${y - 18}" x2="86" y2="${y + 18}"></line>` : ""}`;
    return `<line class="tooth-overlay ${colorClass}" x1="0" y1="${y}" x2="100" y2="${y}"></line>${pillars}`;
  }

  if (finding.mark === "span-double-line") {
    return `
      <line class="tooth-overlay ${colorClass}" x1="0" y1="${y - 8}" x2="100" y2="${y - 8}"></line>
      <line class="tooth-overlay ${colorClass}" x1="0" y1="${y + 8}" x2="100" y2="${y + 8}"></line>
    `;
  }

  if (finding.mark === "edentulous-line") {
    return `<line class="tooth-overlay ${colorClass}" x1="0" y1="${crownY}" x2="100" y2="${crownY}"></line>`;
  }

  if (finding.mark === "diastema") {
    if (role === "start") {
      return `<text class="tooth-symbol ${colorClass}" x="92" y="${crownY}">)</text>`;
    }
    if (role === "end") {
      return `<text class="tooth-symbol ${colorClass}" x="8" y="${crownY}">(</text>`;
    }
    return "";
  }

  if (finding.mark === "border") {
    return `<rect class="tooth-overlay ${colorClass}" x="9" y="9" width="82" height="112"></rect>`;
  }
  if (finding.mark === "line") {
    return `<line class="tooth-overlay ${colorClass}" x1="7" y1="65" x2="93" y2="65"></line>`;
  }
  if (finding.mark === "double-line") {
    return `
      <line class="tooth-overlay ${colorClass}" x1="7" y1="56" x2="93" y2="56"></line>
      <line class="tooth-overlay ${colorClass}" x1="7" y1="74" x2="93" y2="74"></line>
    `;
  }
  if (finding.mark === "x") {
    return `
      <line class="tooth-overlay ${colorClass}" x1="12" y1="12" x2="88" y2="118"></line>
      <line class="tooth-overlay ${colorClass}" x1="88" y1="12" x2="12" y2="118"></line>
    `;
  }
  if (finding.mark === "slash") {
    return `<line class="tooth-overlay ${colorClass}" x1="15" y1="115" x2="85" y2="15"></line>`;
  }
  if (finding.mark === "fracture") {
    return fractureMarkup(colorClass, jaw, record.fractureType || "root");
  }
  if (finding.mark === "vertical") {
    return `<line class="tooth-overlay ${colorClass}" x1="50" y1="12" x2="50" y2="118"></line>`;
  }
  if (finding.mark === "post") {
    return postCoreMarkup(colorClass, jaw, number);
  }
  if (finding.mark === "pulp") {
    return `<circle class="tooth-overlay ${colorClass}" cx="50" cy="65" r="15"></circle>`;
  }
  if (finding.mark === "code-only" || finding.mark === "text") {
    return "";
  }
  if (finding.mark === "circle") {
    if (record.finding === "fusion" || record.finding === "gemination") return "";
    return `<circle class="tooth-overlay ${colorClass}" cx="50" cy="65" r="42"></circle>`;
  }
  if (finding.mark === "supernumerary") {
    const cx = record.supernumerarySide === "left" ? 12 : 88;
    const cy = jaw === "upper" ? 30 : 100;
    return `
      <circle class="tooth-overlay ${colorClass}" cx="${cx}" cy="${cy}" r="15"></circle>
      <text class="tooth-symbol supernumerary-symbol ${colorClass}" x="${cx}" y="${cy}">S</text>
    `;
  }
  if (finding.mark === "triangle") {
    return `<polygon class="tooth-overlay ${colorClass}" points="50,12 88,118 12,118"></polygon>`;
  }
  if (finding.mark === "root-triangle") {
    return jaw === "upper"
      ? `<polygon class="tooth-overlay ${colorClass}" points="50,-8 38,10 62,10"></polygon>`
      : `<polygon class="tooth-overlay ${colorClass}" points="50,138 38,120 62,120"></polygon>`;
  }
  if (finding.mark === "zigzag") {
    return `<polyline class="tooth-overlay ${colorClass}" points="8,75 22,50 36,75 50,50 64,75 78,50 92,75"></polyline>`;
  }
  if (finding.mark === "eruption-zigzag") {
    return jaw === "upper"
      ? `
        <polyline class="tooth-overlay ${colorClass}" points="50,12 38,28 50,44 38,60 50,76 50,104"></polyline>
        <polyline class="tooth-overlay ${colorClass}" points="36,88 50,104 64,88"></polyline>
      `
      : `
        <polyline class="tooth-overlay ${colorClass}" points="50,118 38,102 50,86 38,70 50,54 50,26"></polyline>
        <polyline class="tooth-overlay ${colorClass}" points="36,42 50,26 64,42"></polyline>
      `;
  }
  if (finding.mark === "crown-arrow") {
    return `
      <path class="tooth-overlay ${colorClass}" d="M25 ${crownY - 12} C38 ${crownY - 24}, 62 ${crownY - 24}, 75 ${crownY - 12}"></path>
      <polyline class="tooth-overlay ${colorClass}" points="62,${crownY - 12} 75,${crownY - 12} 70,${crownY - 25}"></polyline>
    `;
  }
  if (finding.mark === "crown-arrow-up") {
    const arrowTop = 124;
    const arrowBottom = 150;
    return `
      <line class="tooth-overlay ${colorClass}" x1="50" y1="${arrowTop}" x2="50" y2="${arrowBottom}"></line>
      <polyline class="tooth-overlay ${colorClass}" points="40,${arrowBottom - 10} 50,${arrowBottom} 60,${arrowBottom - 10}"></polyline>
    `;
  }
  if (finding.mark === "crown-arrow-in") {
    const arrowTop = 124;
    const arrowBottom = 150;
    return `
      <line class="tooth-overlay ${colorClass}" x1="50" y1="${arrowBottom}" x2="50" y2="${arrowTop}"></line>
      <polyline class="tooth-overlay ${colorClass}" points="40,${arrowTop + 10} 50,${arrowTop} 60,${arrowTop + 10}"></polyline>
    `;
  }
  if (finding.mark === "arrow" || finding.mark === "arrow-up") {
    return `
      <line class="tooth-overlay ${colorClass}" x1="50" y1="112" x2="50" y2="18"></line>
      <polyline class="tooth-overlay ${colorClass}" points="35,34 50,18 65,34"></polyline>
    `;
  }
  if (finding.mark === "arrow-down") {
    return `
      <line class="tooth-overlay ${colorClass}" x1="50" y1="18" x2="50" y2="112"></line>
      <polyline class="tooth-overlay ${colorClass}" points="35,96 50,112 65,96"></polyline>
    `;
  }
  return "";
}

function findingForRecord(record) {
  const base = findings[record.finding];
  if (!base) return undefined;
  return {
    ...base,
    code: record.findingCode || base.code,
    color: record.findingColor || base.color,
    label: record.findingLabel || base.label,
  };
}

function normalizeSurfaceStatus(status) {
  if (!status) return null;
  if (typeof status === "object") return status;
  if (status === "restoration") return { code: "R", color: "blue", style: "fill", label: "Restauracion" };
  if (status === "caries") return { code: "CD", color: "red", style: "fill", label: "Caries" };
  return null;
}

function getSurfaceCode(status) {
  const normalized = normalizeSurfaceStatus(status);
  return normalized?.code || "";
}

function refreshToothStyles() {
  document.querySelectorAll(".tooth").forEach((tooth) => {
    const number = tooth.dataset.tooth;
    const record = state.chart[number] || emptyToothRecord();
    const finding = findingForRecord(record);
    const code = tooth.querySelector("[data-code]");
    const overlay = tooth.querySelector("[data-overlay]");
    const numberLabel = tooth.querySelector(".tooth-number");
    const surfaceCodes = Object.values(record.surfaces || {}).map(getSurfaceCode).filter(Boolean);
    const codes = [...new Set([finding?.code, ...surfaceCodes].filter(Boolean))];

    tooth.classList.toggle("selected", state.selectedTooth === number);
    numberLabel.classList.toggle("fusion-number", record.finding === "fusion");
    numberLabel.classList.toggle("fusion-start", record.finding === "fusion" && record.spanRole === "start");
    numberLabel.classList.toggle("fusion-end", record.finding === "fusion" && record.spanRole === "end");
    numberLabel.classList.toggle("gemination-number", record.finding === "gemination");
    code.textContent = codes.join(" ");
    code.classList.toggle("red-code", finding?.color === "red" || surfaceCodes.some((item) => ["MB", "CE", "CD", "CDP", "DES", "RT"].includes(item)));
    overlay.innerHTML = overlayMarkup(finding, tooth.dataset.jaw, record, Number(number));

    tooth.querySelectorAll(".surface").forEach((surface) => {
      const status = normalizeSurfaceStatus(record.surfaces?.[surface.dataset.surface]);
      surface.classList.toggle("restoration", status?.kind === "restoration" && status.color === "blue");
      surface.classList.toggle("caries", status?.kind === "caries");
      surface.classList.toggle("blue-fill", status?.color === "blue" && status?.style === "fill");
      surface.classList.toggle("red-fill", status?.color === "red" && status?.style === "fill");
      surface.classList.toggle("red-outline", status?.color === "red" && status?.style === "outline");
    });
  });
}

function setDirty() {
  saveStatus.textContent = "Cambios sin guardar";
  saveStatus.classList.remove("saved");
}

function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

function fillForm(data = {}) {
  form.reset();
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
}

function patientRecordKey(id) {
  return `${patientRecordPrefix}${id}`;
}

function createPatientId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `paciente-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function searchPatients(query) {
  try {
    return await api(`/patients?search=${encodeURIComponent(query)}`);
  } catch {
    return [];
  }
}

function renderPatientList() {
  const query = patientSearch.value.trim().toLowerCase();

  patientList.innerHTML = "";
  patientCount.textContent = "";

  if (!query) return;

  searchPatients(query).then((patients) => {
    patientCount.textContent = `${patients.length} paciente${patients.length === 1 ? "" : "s"}`;

    if (!patients.length) {
      patientList.innerHTML = `<div class="empty-list">No hay pacientes encontrados.</div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    patients.forEach((patient) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `patient-card${patient.id === currentPatientId ? " active" : ""}`;
      button.dataset.patientId = patient.id;
      const date = patient.savedAt ? new Date(patient.savedAt).toLocaleDateString("es-PE") : "";
      button.innerHTML = `
        <strong>${patient.fullName}</strong>
        <span>DNI/ID: ${patient.documentId || "sin documento"} | Tel: ${patient.phone || "sin telefono"} | ${date}</span>
      `;
      fragment.appendChild(button);
    });
    patientList.appendChild(fragment);
  });
}

async function saveRecord() {
  const session = currentSession();
  if (session?.role === "Invitado") {
    saveStatus.textContent = "Los invitados no pueden guardar";
    return;
  }
  if (!currentPatientId) currentPatientId = createPatientId();
  const payload = {
    id: currentPatientId,
    attendedBy: currentSession(),
    patient: getFormData(),
    patientPhoto: patientPhotoData,
    auxiliaryExams: auxiliaryExamNames,
    budget: getBudgetData(),
    appointments: getAppointmentsData(),
    chart: state.chart,
    chartNotes: getChartNotes(),
    savedAt: new Date().toISOString(),
  };

  try {
    await api(`/records/${currentPatientId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveStatus.textContent = "Guardado en la nube";
    saveStatus.classList.add("saved");
  } catch (err) {
    saveStatus.textContent = "Error al guardar";
    saveStatus.classList.remove("saved");
  }
}

async function printRecord() {
  const session = currentSession();
  if (session?.role === "Invitado") return;
  await saveRecord();
  document.body.classList.add("print-mode");
  window.print();
}

async function loadRecord(id = "") {
  try {
    const payload = id ? await api(`/records/${id}`) : null;
    if (!payload) return;

    currentPatientId = id || currentPatientId || createPatientId();
    fillForm(payload.patient);
    patientPhotoData = payload.patientPhoto || "";
    auxiliaryExamNames = payload.auxiliaryExams || [];
    fillBudgetData(payload.budget);
    fillAppointmentsData(payload.appointments || []);
    state.chart = payload.chart || {};
    fillChartNotes(payload.chartNotes);
    renderPatientPhoto();
    renderExamList();
    refreshToothStyles();
    saveStatus.textContent = "Registro recuperado";
    saveStatus.classList.add("saved");
  } catch {
    saveStatus.textContent = "Error al cargar";
  }
}

function updateSelectionLabel(number, detail = "") {
  const suffix = detail ? ` - ${detail}` : "";
  selectedTooth.textContent = `${number}${suffix}`;
}

function archForTooth(number) {
  if (teeth.upper.includes(Number(number))) return teeth.upper;
  if (teeth.temporaryUpper.includes(Number(number))) return teeth.temporaryUpper;
  if (teeth.temporaryLower.includes(Number(number))) return teeth.temporaryLower;
  if (teeth.lower.includes(Number(number))) return teeth.lower;
  return [];
}

function teethBetween(start, end) {
  const arch = archForTooth(start);
  const startIndex = arch.indexOf(Number(start));
  const endIndex = arch.indexOf(Number(end));
  if (startIndex === -1 || endIndex === -1) return [];
  const from = Math.min(startIndex, endIndex);
  const to = Math.max(startIndex, endIndex);
  return arch.slice(from, to + 1);
}

function setActiveTool(tool) {
  state.activeTool = tool;
  document.querySelectorAll(".finding-chip").forEach((item) => {
    const isTool = item.dataset.tool === tool;
    const isFinding = tool === "piece-finding" && item.dataset.finding === state.activeFinding;
    item.classList.toggle("active", isTool || isFinding);
  });
  eraseSurfaceButton.classList.toggle("active", tool === "healthy");
  if (tool !== "piece-finding") {
    state.activeFinding = "";
    state.pendingSpanStart = "";
  }
  updateOptionPanels();
}

function updateOptionPanels() {
  const finding = findings[state.activeFinding];
  restorationOptions.classList.toggle("active", state.activeTool === "restoration");
  cariesOptions.classList.toggle("active", state.activeTool === "caries");
  missingOptions.classList.toggle("active", state.activeTool === "missing");
  crownOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesCrownType));
  orthoOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesOrthoChoice));
  statusOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesStatus));
  mobilityOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesMobilityGrade));
  fractureOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesFractureType));
  supernumeraryOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesSupernumerarySide));
  positionOptions.classList.toggle("active", state.activeTool === "piece-finding" && Boolean(finding?.usesPositionType));
}

function clearFindingMetadata(record) {
  delete record.findingCode;
  delete record.findingColor;
  delete record.findingLabel;
  delete record.fractureType;
  delete record.supernumerarySide;
  delete record.positionType;
  delete record.spanId;
  delete record.spanRole;
}

function applySpanFinding(start, end, findingKey) {
  const range = findings[findingKey]?.mark === "diastema"
    ? [Number(start), Number(end)]
    : teethBetween(start, end);
  if (!range.length) {
    selectedTooth.textContent = "Selecciona piezas de la misma arcada";
    return;
  }

  const spanId = `${findingKey}-${Date.now()}`;
  range.forEach((number, index) => {
    const record = getToothRecord(number);
    record.finding = findingKey;
    clearFindingMetadata(record);
    if (findings[findingKey]?.usesStatus) {
      record.findingColor = treatmentStatus.value;
      record.findingLabel = `${findings[findingKey].label} ${treatmentStatus.value === "blue" ? "en buen estado" : "en mal estado"}`;
    }
    record.spanId = spanId;
    record.spanRole = range.length === 1
      ? "single"
      : index === 0
        ? "start"
        : index === range.length - 1
          ? "end"
          : "middle";
  });

  const finding = findings[findingKey];
  state.pendingSpanStart = "";
  selectedTooth.textContent = `${finding.label}: ${range[0]} a ${range[range.length - 1]}`;
  refreshToothStyles();
  setDirty();
}

function applyFindingToTooth(number, findingKey) {
  if (!findingKey) {
    const record = getToothRecord(number);
    const spanId = record.spanId;
    if (spanId) {
      Object.values(state.chart).forEach((item) => {
        if (item.spanId === spanId) {
          item.finding = "";
          clearFindingMetadata(item);
        }
      });
    } else {
      record.finding = "";
      clearFindingMetadata(record);
    }
    updateSelectionLabel(number, "hallazgo borrado");
    refreshToothStyles();
    setDirty();
    return;
  }

  const selectedFinding = findings[findingKey];
  const resolvedFindingKey = selectedFinding?.usesOrthoChoice ? orthoChoice.value : findingKey;
  const findingBase = findings[resolvedFindingKey];
  if (findingBase?.span) {
    if (!state.pendingSpanStart) {
      state.pendingSpanStart = number;
      selectedTooth.textContent = `${findingBase.label}: selecciona la pieza final`;
      refreshToothStyles();
      return;
    }
    applySpanFinding(state.pendingSpanStart, number, resolvedFindingKey);
    return;
  }

  const record = getToothRecord(number);
  record.finding = resolvedFindingKey;
  clearFindingMetadata(record);

  if (selectedFinding?.usesCrownType) {
    const selected = crownType.options[crownType.selectedIndex];
    record.finding = "crown";
    record.findingCode = crownType.value;
    record.findingColor = crownType.value === "CT" ? "red" : crownStatus.value;
    record.findingLabel = crownType.value === "CT"
      ? "Corona temporal"
      : `${selected.text} ${crownStatus.value === "blue" ? "en buen estado" : "en mal estado"}`;
  }

  if (selectedFinding?.usesStatus) {
    record.findingColor = treatmentStatus.value;
    record.findingLabel = `${selectedFinding.label} ${treatmentStatus.value === "blue" ? "en buen estado" : "en mal estado"}`;
  }

  if (selectedFinding?.usesMobilityGrade) {
    record.findingCode = `M${mobilityGrade.value}`;
    record.findingColor = "red";
    record.findingLabel = `Movilidad grado ${mobilityGrade.value}`;
  }

  if (selectedFinding?.usesFractureType) {
    const selected = fractureType.options[fractureType.selectedIndex];
    record.fractureType = fractureType.value;
    record.findingColor = "red";
    record.findingLabel = selected.text.replace(" - linea roja en raiz", "").replace(" - linea transversal roja", "").replace(" - linea roja en angulo coronario", "");
  }

  if (selectedFinding?.usesSupernumerarySide) {
    record.supernumerarySide = supernumerarySide.value;
    record.findingLabel = `${selectedFinding.label} a la ${supernumerarySide.options[supernumerarySide.selectedIndex].text.toLowerCase().replace(" de la raiz", "")}`;
  }

  if (selectedFinding?.usesPositionType) {
    const selected = positionType.options[positionType.selectedIndex];
    const [code, label] = selected.text.split(": ");
    record.findingCode = positionType.value;
    record.findingColor = "blue";
    record.positionType = positionType.value;
    record.findingLabel = label ? `${code}: ${label}` : selectedFinding.label;
  }

  const finding = findingForRecord(record);
  updateSelectionLabel(number, finding ? finding.label : "sin hallazgo por pieza");
  refreshToothStyles();
  setDirty();
}

findingQuickButtons.addEventListener("click", (event) => {
  const button = event.target.closest(".finding-chip");
  if (!button) return;

  if (button.dataset.tool) {
    setActiveTool(button.dataset.tool);
    selectedTooth.textContent = `Herramienta seleccionada: ${button.title}`;
    return;
  }

  state.activeFinding = button.dataset.finding;
  state.pendingSpanStart = "";
  setActiveTool("piece-finding");
  selectedTooth.textContent = state.activeFinding
    ? `Hallazgo seleccionado: ${findings[state.activeFinding].label}`
    : "Herramienta seleccionada: borrar hallazgo";
});

eraseSurfaceButton.addEventListener("click", () => {
  setActiveTool("healthy");
  selectedTooth.textContent = "Herramienta seleccionada: borrar superficie";
});

odontogram.addEventListener("click", (event) => {
  const tooth = event.target.closest(".tooth");
  if (!tooth) return;

  const number = tooth.dataset.tooth;
  state.selectedTooth = number;

  if (state.activeTool === "piece-finding") {
    applyFindingToTooth(number, state.activeFinding);
    return;
  }

  if (state.activeTool === "missing") {
    const record = getToothRecord(number);
    record.finding = missingReason.value;
    clearFindingMetadata(record);
    record.surfaces = {};
    updateSelectionLabel(number, findings[record.finding].label);
    refreshToothStyles();
    setDirty();
    return;
  }

  const surface = event.target.closest(".surface");
  if (surface) {
    const record = getToothRecord(number);
    const surfaceName = surface.dataset.surface;

    if (state.activeTool === "healthy") {
      delete record.surfaces[surfaceName];
    } else {
      const detailKey = state.activeTool === "caries"
        ? cariesDetail.value
        : restorationDetail.value;
      const detail = { ...surfaceDetails[detailKey] };
      if (detail.kind === "restoration" && detailKey !== "restoration-temp") {
        detail.code = restorationMaterial.value;
        detail.label = `${detail.label} - ${restorationMaterial.options[restorationMaterial.selectedIndex].text}`;
      }
      record.surfaces[surfaceName] = detail;
    }

    const status = normalizeSurfaceStatus(record.surfaces[surfaceName]);
    const action = state.activeTool === "healthy" ? "superficie borrada" : status.label.toLowerCase();
    updateSelectionLabel(number, `${action} en ${surfaceNames[surfaceName]}`);
    setDirty();
  } else {
    updateSelectionLabel(number);
  }

  refreshToothStyles();
});

form.addEventListener("input", setDirty);
chartDiagnosis.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addDiagnosisTag(chartDiagnosis.value);
    chartDiagnosis.value = "";
  }
});
addDiagnosisButton.addEventListener("click", () => {
  addDiagnosisTag(chartDiagnosis.value);
  chartDiagnosis.value = "";
});
diagnosisTags.addEventListener("click", (event) => {
  const button = event.target.closest(".tag-remove");
  if (button) removeDiagnosisTag(button.dataset.value);
});
chartDiagnosis.addEventListener("input", setDirty);
chartObservations.addEventListener("input", setDirty);
budgetItems.addEventListener("input", () => {
  calculateBudget();
  setDirty();
});
budgetAdvance.addEventListener("input", () => {
  calculateBudget();
  setDirty();
});
budgetItems.addEventListener("click", (event) => {
  if (!event.target.closest(".icon-danger-button")) return;
  event.target.closest(".budget-row").remove();
  if (!budgetItems.children.length) budgetItems.appendChild(createBudgetRow());
  calculateBudget();
  setDirty();
});
addBudgetItemButton.addEventListener("click", () => {
  budgetItems.appendChild(createBudgetRow());
  setDirty();
});
appointmentItems.addEventListener("input", setDirty);
appointmentItems.addEventListener("click", (event) => {
  if (!event.target.closest(".icon-danger-button")) return;
  event.target.closest(".appointment-row").remove();
  if (!appointmentItems.children.length) appointmentItems.appendChild(createAppointmentRow());
  setDirty();
});
addAppointmentButton.addEventListener("click", () => {
  appointmentItems.appendChild(createAppointmentRow());
  setDirty();
});
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginUser.value.trim().toLowerCase();
  const password = loginPassword.value;

  try {
    const user = await startSession(email, password);
    loginMessage.textContent = "";
    loginRole.value = user.role;
  } catch {
    loginMessage.textContent = "Usuario o contraseña incorrectos";
  }
});

document.querySelector("#saveButton").addEventListener("click", async () => { await saveRecord(); });
document.querySelector("#printButton").addEventListener("click", async () => { await printRecord(); });
document.querySelector("#openChartButton").addEventListener("click", () => showView("chart"));
document.querySelector("#backClinicalButton").addEventListener("click", () => showView("clinical"));
document.querySelector("#logoutButton").addEventListener("click", closeSession);
document.querySelector("#closeUsersButton").addEventListener("click", () => userAdmin.classList.add("hidden"));
manageUsersButton.addEventListener("click", async () => {
  await renderUserList();
  userAdmin.classList.remove("hidden");
});
window.addEventListener("afterprint", () => document.body.classList.remove("print-mode"));

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".toggle-pass");
  if (!btn) return;
  const input = document.querySelector(`#${btn.dataset.target}`);
  if (!input) return;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  btn.textContent = isPassword ? "🙈" : "👁";
  btn.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
});

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = newUserEmail.value.trim().toLowerCase();

  try {
    await api("/auth/users", {
      method: "POST",
      body: JSON.stringify({
        fullName: newUserName.value.trim(),
        email,
        password: newUserPassword.value,
        role: newUserRole.value,
      }),
    });
    userForm.reset();
    userAdminMessage.textContent = "Usuario creado";
    renderUserList();
  } catch (err) {
    userAdminMessage.textContent = err.message;
  }
});

userList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-user-id]");
  if (!button) return;

  try {
    await api(`/auth/users/${button.dataset.userId}`, { method: "DELETE" });
    userAdminMessage.textContent = "Acceso quitado. Sus registros se conservan.";
    renderUserList();
  } catch (err) {
    userAdminMessage.textContent = err.message;
  }
});

patientPhotoInput.addEventListener("change", () => {
  const file = patientPhotoInput.files?.[0];
  if (!file) {
    patientPhotoData = "";
    renderPatientPhoto();
    setDirty();
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    patientPhotoData = String(reader.result || "");
    renderPatientPhoto();
    setDirty();
  });
  reader.readAsDataURL(file);
});

auxiliaryExamsInput.addEventListener("change", () => {
  auxiliaryExamNames = Array.from(auxiliaryExamsInput.files || []).map((file) => file.name);
  renderExamList();
  setDirty();
});

document.querySelector("#clearButton").addEventListener("click", () => {
  currentPatientId = "";
  form.reset();
  patientPhotoInput.value = "";
  auxiliaryExamsInput.value = "";
  patientPhotoData = "";
  auxiliaryExamNames = [];
  state.chart = {};
  state.selectedTooth = "";
  selectedTooth.textContent = "Ninguna";
  fillChartNotes();
  fillBudgetData();
  fillAppointmentsData();
  renderPatientPhoto();
  renderExamList();
  renderPatientList();
  refreshToothStyles();
  setDirty();
});

patientSearch.addEventListener("input", renderPatientList);

patientList.addEventListener("click", async (event) => {
  const button = event.target.closest(".patient-card");
  if (!button) return;
  await loadRecord(button.dataset.patientId);
  renderPatientList();
});

document.querySelector("#resetChartButton").addEventListener("click", () => {
  state.chart = {};
  state.selectedTooth = "";
  selectedTooth.textContent = "Ninguna";
  fillChartNotes();
  refreshToothStyles();
  setDirty();
});

renderFindingButtons();
updateOptionPanels();
renderOdontogram();
renderPatientPhoto();
renderExamList();
fillBudgetData();
fillAppointmentsData();
renderPatientList();
applySession(readSession());
