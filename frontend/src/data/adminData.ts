import { Job, allJobs } from "./jobs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type JobStatus = "activa" | "borrador" | "cerrada";
export type CandidateStatus =
  | "nuevo"
  | "revisado"
  | "entrevista"
  | "aprobado"
  | "rechazado";
export type AIDecision = "aprobado" | "rechazado" | "pendiente";

// ─── Application detail types (mirror Apply form) ─────────────────────────────

export interface CandidateExperienceEntry {
  id: string;
  puesto: string;
  compania: string;
  fechaInicio: string;
  fechaFin?: string;
  detalles?: string;
}

export interface CandidateEducationEntry {
  id: string;
  grado: string;
  universidad: string;
  estudios: string;
  fechaTitulacion?: string;
}

export interface CandidateLanguageEntry {
  id: string;
  habilidad: string;
  nivel: string;
}

export interface CandidateAddress {
  direccion1?: string;
  direccion2?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  codigoPostal?: string;
}

export interface AdminJob extends Job {
  status: JobStatus;
  candidatesCount: number;
  views: number;
  createdBy: string;
  aiPrompt?: string; // criterios de IA específicos para esta convocatoria
}

export interface Candidate {
  id: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  education: string;
  skills: string[];
  aiScore: number;
  aiDecision: AIDecision;
  humanDecision: CandidateStatus;
  appliedDate: string;
  cvUrl?: string;
  notes?: string;
  // Extended application data (from Apply form)
  autorizado?: boolean;
  exColaborador?: boolean;
  address?: CandidateAddress;
  experienceEntries?: CandidateExperienceEntry[];
  educationEntries?: CandidateEducationEntry[];
  languageEntries?: CandidateLanguageEntry[];
}

export interface AIWeight {
  id: string;
  label: string;
  description: string;
  weight: number;
  category: "tecnico" | "cultural" | "experiencia";
}

export interface AITrainingCase {
  id: number;
  candidateId: number;
  jobId: number;
  aiDecision: AIDecision;
  aiScore: number;
  humanDecision: "aprobado" | "rechazado";
  isCorrect: boolean;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface AIMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  totalDecisions: number;
  correctDecisions: number;
  trainingCases: number;
  lastTraining: string;
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

export const adminJobs: AdminJob[] = [
  {
    ...allJobs[0],
    status: "activa",
    candidatesCount: 24,
    views: 312,
    createdBy: "Valentina Ospina",
    aiPrompt:
      "Prioriza candidatos con experiencia mínima de 1 año en barismo o atención al cliente en cafeterías. El dominio de técnicas de extracción (espresso, V60, Chemex) es muy valorado. Descarta candidatos que no demuestren vocación de servicio o no tengan disponibilidad para turnos rotativos. El fit cultural con la marca CQ es clave: busca personas apasionadas por el café colombiano.",
  },
  {
    ...allJobs[1],
    status: "activa",
    candidatesCount: 11,
    views: 187,
    createdBy: "Juan Camilo Ríos",
    aiPrompt:
      "Candidato ideal: formación en ingeniería de alimentos, industrial o afines. Mínimo 3 años en plantas de producción de alimentos con manejo de BPM y HACCP. Valorar certificaciones en calidad (ISO, HACCP). Descarta perfiles sin experiencia en industria alimentaria.",
  },
  {
    ...allJobs[2],
    status: "activa",
    candidatesCount: 18,
    views: 245,
    createdBy: "Valentina Ospina",
    aiPrompt:
      "Busca comunicadores o publicistas con portafolio activo en redes sociales. Experiencia comprobable con Meta Business Suite y/o Google Analytics es excluyente. Valora conocimiento de tendencias en café y gastronomía. Descarta perfiles sin portafolio digital o sin conocimiento de métricas de contenido.",
  },
  {
    ...allJobs[3],
    status: "activa",
    candidatesCount: 9,
    views: 143,
    createdBy: "Andrés Felipe Giraldo",
    aiPrompt:
      "Perfil logístico con experiencia en coordinación de rutas y distribución urbana. Licencia de conducción vigente es requisito excluyente. Valorar manejo de WMS o sistemas de gestión de inventario. Descarta sin experiencia en distribución de perecederos o alimentos.",
  },
  {
    ...allJobs[4],
    status: "borrador",
    candidatesCount: 0,
    views: 0,
    createdBy: "Juan Camilo Ríos",
  },
  {
    ...allJobs[5],
    status: "borrador",
    candidatesCount: 0,
    views: 22,
    createdBy: "Valentina Ospina",
  },
  {
    ...allJobs[6],
    status: "activa",
    candidatesCount: 31,
    views: 420,
    createdBy: "Andrés Felipe Giraldo",
    aiPrompt:
      "Practicante de último semestre en Psicología, Administración o RR.HH. Es obligatorio contar con aval universitario disponible. Valorar conocimiento básico de selección por competencias. Descarta candidatos que no estén en último semestre o no tengan aval de práctica disponible.",
  },
  {
    ...allJobs[7],
    status: "activa",
    candidatesCount: 16,
    views: 201,
    createdBy: "Valentina Ospina",
    aiPrompt:
      "Barista para tienda de alto tráfico. Mínimo 6 meses de experiencia en punto de venta de café. Habilidades de ventas y caja registradora son un plus. Prioriza candidatos con certificación en barismo o cursos de café. Actitud positiva y trabajo en equipo son indispensables.",
  },
  {
    ...allJobs[8],
    status: "cerrada",
    candidatesCount: 42,
    views: 589,
    createdBy: "Juan Camilo Ríos",
  },
  {
    ...allJobs[9],
    status: "cerrada",
    candidatesCount: 27,
    views: 378,
    createdBy: "Andrés Felipe Giraldo",
  },
  {
    ...allJobs[10],
    status: "activa",
    candidatesCount: 7,
    views: 99,
    createdBy: "Valentina Ospina",
  },
  {
    ...allJobs[11],
    status: "cerrada",
    candidatesCount: 19,
    views: 267,
    createdBy: "Juan Camilo Ríos",
  },
  {
    ...allJobs[12],
    status: "borrador",
    candidatesCount: 0,
    views: 5,
    createdBy: "Andrés Felipe Giraldo",
  },
  {
    ...allJobs[13],
    status: "activa",
    candidatesCount: 13,
    views: 158,
    createdBy: "Valentina Ospina",
  },
  {
    ...allJobs[14],
    status: "cerrada",
    candidatesCount: 34,
    views: 441,
    createdBy: "Juan Camilo Ríos",
  },
];

export const candidates: Candidate[] = [
  {
    id: 1,
    jobId: 1,
    name: "Sofía Ramírez Cardona",
    email: "sofia.ramirez@gmail.com",
    phone: "3112345678",
    location: "Montenegro, Quindío",
    experience: 2,
    education: "Técnico en Barismo – SENA",
    skills: ["Café de especialidad", "Latte Art", "Caja registradora", "Servicio al cliente"],
    aiScore: 88,
    aiDecision: "aprobado",
    humanDecision: "entrevista",
    appliedDate: "10/03/2026",
    notes: "Candidata con excelente presentación y experiencia previa en Starbucks.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    autorizado: true,
    exColaborador: false,
    address: {
      direccion1: "Calle 15 # 8-42",
      ciudad: "Montenegro",
      estado: "Quindío",
      pais: "Colombia",
      codigoPostal: "632001",
    },
    experienceEntries: [
      {
        id: "e1",
        puesto: "Barista Senior",
        compania: "Starbucks Colombia – Armenia",
        fechaInicio: "2024-01-15",
        fechaFin: "2025-12-31",
        detalles: "Preparación de bebidas de especialidad, latte art, atención al cliente, manejo de caja y apertura/cierre de tienda.",
      },
      {
        id: "e2",
        puesto: "Auxiliar de cafetería",
        compania: "Café San Camilo",
        fechaInicio: "2023-03-01",
        fechaFin: "2023-12-31",
        detalles: "Atención al público, servicio de mesa y preparación de bebidas calientes básicas.",
      },
    ],
    educationEntries: [
      {
        id: "edu1",
        grado: "Técnico",
        universidad: "SENA – Regional Quindío",
        estudios: "Técnico en Barismo y Cafés Especiales",
        fechaTitulacion: "2022-11-30",
      },
      {
        id: "edu2",
        grado: "Bachiller",
        universidad: "Institución Educativa San José – Montenegro",
        estudios: "Bachillerato Académico",
        fechaTitulacion: "2019-11-30",
      },
    ],
    languageEntries: [
      { id: "l1", habilidad: "Español", nivel: "Nativo / Bilingüe" },
      { id: "l2", habilidad: "Inglés", nivel: "Básico" },
    ],
  },
  {
    id: 2,
    jobId: 1,
    name: "Diego Alejandro Moreno",
    email: "d.moreno@hotmail.com",
    phone: "3204567890",
    location: "Armenia, Quindío",
    experience: 1,
    education: "Bachiller Académico",
    skills: ["Atención al cliente", "Trabajo en equipo"],
    aiScore: 52,
    aiDecision: "pendiente",
    humanDecision: "nuevo",
    appliedDate: "09/03/2026",
    autorizado: true,
    exColaborador: false,
    address: {
      direccion1: "Carrera 19 # 22-10",
      ciudad: "Armenia",
      estado: "Quindío",
      pais: "Colombia",
    },
    experienceEntries: [
      {
        id: "e1",
        puesto: "Mesero",
        compania: "Restaurante El Fogón Quindiano",
        fechaInicio: "2025-01-10",
        detalles: "Atención de mesas, toma de pedidos y cobro a clientes.",
      },
    ],
    educationEntries: [
      {
        id: "edu1",
        grado: "Bachiller",
        universidad: "Colegio Inem José Celestino Mutis – Armenia",
        estudios: "Bachillerato con énfasis comercial",
        fechaTitulacion: "2023-11-30",
      },
    ],
    languageEntries: [
      { id: "l1", habilidad: "Español", nivel: "Nativo / Bilingüe" },
    ],
  },
  {
    id: 3,
    jobId: 1,
    name: "Camila Torres Agudelo",
    email: "camila.torres@gmail.com",
    phone: "3157890123",
    location: "Calarcá, Quindío",
    experience: 3,
    education: "Tecnólogo en Gestión de Servicios Gastronómicos",
    skills: ["Métodos de extracción", "V60", "Chemex", "Servicio personalizado", "Inglés básico"],
    aiScore: 94,
    aiDecision: "aprobado",
    humanDecision: "aprobado",
    appliedDate: "08/03/2026",
    notes: "Finalista. Excelente conocimiento técnico y actitud de servicio.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    autorizado: true,
    exColaborador: false,
    address: {
      direccion1: "Cra 7 # 11-50 Apto 302",
      ciudad: "Calarcá",
      estado: "Quindío",
      pais: "Colombia",
      codigoPostal: "632002",
    },
    experienceEntries: [
      {
        id: "e1",
        puesto: "Jefe de Bar",
        compania: "Café Quindío – Tienda Bolívar",
        fechaInicio: "2024-02-01",
        fechaFin: "2025-10-31",
        detalles: "Gestión del área de bar, entrenamiento de baristas, control de inventario y estándares de calidad.",
      },
      {
        id: "e2",
        puesto: "Barista",
        compania: "Pergamino Café – Medellín",
        fechaInicio: "2022-06-01",
        fechaFin: "2024-01-31",
        detalles: "Preparación de métodos filtrados (V60, Chemex, Aeropress) y espresso. Atención a clientes internacionales.",
      },
    ],
    educationEntries: [
      {
        id: "edu1",
        grado: "Tecnólogo",
        universidad: "Institución Universitaria Pascual Bravo",
        estudios: "Gestión de Servicios Gastronómicos",
        fechaTitulacion: "2022-05-15",
      },
    ],
    languageEntries: [
      { id: "l1", habilidad: "Español", nivel: "Nativo / Bilingüe" },
      { id: "l2", habilidad: "Inglés", nivel: "Intermedio" },
      { id: "l3", habilidad: "Portugués", nivel: "Básico" },
    ],
  },
  {
    id: 4,
    jobId: 2,
    name: "Hernán Darío Salazar",
    email: "hernan.salazar@outlook.com",
    phone: "3001234567",
    location: "Armenia, Quindío",
    experience: 5,
    education: "Ingeniero Industrial – Universidad del Quindío",
    skills: ["Lean Manufacturing", "HACCP", "BPM", "SAP", "Liderazgo de equipos"],
    aiScore: 91,
    aiDecision: "aprobado",
    humanDecision: "entrevista",
    appliedDate: "07/03/2026",
    notes: "Perfil muy sólido. 5 años en industria de alimentos.",
  },
  {
    id: 5,
    jobId: 2,
    name: "Paola Andrea Quintero",
    email: "p.quintero@gmail.com",
    phone: "3189876543",
    location: "Bogotá D.C.",
    experience: 3,
    education: "Ingeniera de Alimentos – Universidad Nacional",
    skills: ["Six Sigma", "ISO 9001", "Gestión de producción"],
    aiScore: 76,
    aiDecision: "aprobado",
    humanDecision: "revisado",
    appliedDate: "06/03/2026",
  },
  {
    id: 6,
    jobId: 3,
    name: "Laura Valentina Gómez",
    email: "lv.gomez@gmail.com",
    phone: "3135678901",
    location: "Bogotá D.C.",
    experience: 2,
    education: "Comunicadora Social – Universidad Javeriana",
    skills: ["Meta Business Suite", "Google Analytics", "Canva", "Redacción creativa", "SEO"],
    aiScore: 83,
    aiDecision: "aprobado",
    humanDecision: "entrevista",
    appliedDate: "05/03/2026",
    notes: "Portfolio de contenido muy bueno. Candidata recomendada.",
  },
  {
    id: 7,
    jobId: 3,
    name: "Carlos Andrés Muñoz",
    email: "c.munoz@yahoo.com",
    phone: "3162345678",
    location: "Medellín, Antioquia",
    experience: 4,
    education: "Publicista – Universidad Pontificia Bolivariana",
    skills: ["Pauta digital", "Google Ads", "TikTok Ads", "Analítica web"],
    aiScore: 79,
    aiDecision: "aprobado",
    humanDecision: "revisado",
    appliedDate: "04/03/2026",
  },
  {
    id: 8,
    jobId: 4,
    name: "Jorge Iván Peña",
    email: "jorge.pena@gmail.com",
    phone: "3104567890",
    location: "Cali, Valle del Cauca",
    experience: 3,
    education: "Tecnólogo en Logística – SENA",
    skills: ["WMS", "Ruteo de distribución", "Gestión de flota", "Excel avanzado"],
    aiScore: 67,
    aiDecision: "pendiente",
    humanDecision: "nuevo",
    appliedDate: "04/03/2026",
  },
  {
    id: 9,
    jobId: 4,
    name: "Tatiana Marcela López",
    email: "tatiana.lopez@gmail.com",
    phone: "3209871234",
    location: "Cali, Valle del Cauca",
    experience: 2,
    education: "Administradora de Empresas – Universidad del Valle",
    skills: ["Cadena de suministro", "Coordinación logística", "Licencia B1"],
    aiScore: 38,
    aiDecision: "rechazado",
    humanDecision: "rechazado",
    appliedDate: "03/03/2026",
    notes: "No cumple experiencia mínima requerida en supervisión.",
  },
  {
    id: 10,
    jobId: 7,
    name: "Valentina Correa Jiménez",
    email: "v.correa@gmail.com",
    phone: "3154321098",
    location: "Armenia, Quindío",
    experience: 0,
    education: "Estudiante de Psicología – UniQuindío (8° semestre)",
    skills: ["Selección de personal", "Entrevistas por competencias", "Office"],
    aiScore: 72,
    aiDecision: "aprobado",
    humanDecision: "entrevista",
    appliedDate: "01/03/2026",
    notes: "Candidata destacada con aval universitario listo.",
  },
  {
    id: 11,
    jobId: 7,
    name: "Sebastián Ríos Castaño",
    email: "seb.rios@outlook.com",
    phone: "3172345678",
    location: "Manizales, Caldas",
    experience: 0,
    education: "Estudiante de Administración de Empresas – U. de Caldas (9° semestre)",
    skills: ["Recursos Humanos", "Bienestar laboral", "Excel básico"],
    aiScore: 61,
    aiDecision: "pendiente",
    humanDecision: "revisado",
    appliedDate: "28/02/2026",
  },
  {
    id: 12,
    jobId: 8,
    name: "Natalia Montoya Álvarez",
    email: "natalia.m@gmail.com",
    phone: "3006789012",
    location: "Medellín, Antioquia",
    experience: 2,
    education: "Técnico en Barismo – SENA",
    skills: ["Espresso", "Bebidas frías", "Milk steaming", "Ventas al detal"],
    aiScore: 85,
    aiDecision: "aprobado",
    humanDecision: "aprobado",
    appliedDate: "27/02/2026",
    notes: "Contratada. Inicio el 15 de marzo.",
  },
  {
    id: 13,
    jobId: 11,
    name: "Ricardo Forero Medina",
    email: "r.forero@gmail.com",
    phone: "3123456789",
    location: "Cali, Valle del Cauca",
    experience: 4,
    education: "Bachiller con Licencia C2",
    skills: ["Distribución urbana", "Manejo de carga", "Cobro en ruta"],
    aiScore: 78,
    aiDecision: "aprobado",
    humanDecision: "revisado",
    appliedDate: "22/02/2026",
  },
  {
    id: 14,
    jobId: 14,
    name: "Manuela Espinosa Vargas",
    email: "mane.espinosa@gmail.com",
    phone: "3148765432",
    location: "Armenia, Quindío",
    experience: 0,
    education: "Estudiante de Logística – SENA (Último semestre)",
    skills: ["Excel", "Gestión de inventarios", "Power BI básico"],
    aiScore: 45,
    aiDecision: "rechazado",
    humanDecision: "rechazado",
    appliedDate: "14/02/2026",
    notes: "No tiene aval universitario disponible aún.",
  },
  {
    id: 15,
    jobId: 15,
    name: "Alejandro Bermúdez Cano",
    email: "a.bermudez@gmail.com",
    phone: "3195671234",
    location: "Medellín, Antioquia",
    experience: 3,
    education: "Administrador Comercial – EAFIT",
    skills: ["Ventas B2B", "CRM Salesforce", "Negociación", "Prospección comercial"],
    aiScore: 89,
    aiDecision: "aprobado",
    humanDecision: "aprobado",
    appliedDate: "12/02/2026",
    notes: "Excelente perfil comercial. Aprobado por gerencia.",
  },
];

export const aiWeights: AIWeight[] = [
  {
    id: "exp_relevante",
    label: "Experiencia relevante",
    description: "Años en cargo similar al ofertado",
    weight: 30,
    category: "tecnico",
  },
  {
    id: "nivel_educativo",
    label: "Nivel educativo",
    description: "Formación académica acorde al perfil requerido",
    weight: 20,
    category: "tecnico",
  },
  {
    id: "habilidades_tecnicas",
    label: "Habilidades técnicas específicas",
    description: "Dominio de herramientas y conocimientos del área",
    weight: 50,
    category: "tecnico",
  },
  {
    id: "años_exp_total",
    label: "Años de experiencia total",
    description: "Trayectoria laboral acumulada",
    weight: 40,
    category: "experiencia",
  },
  {
    id: "trayectoria",
    label: "Trayectoria profesional",
    description: "Calidad y progresión de la carrera profesional",
    weight: 60,
    category: "experiencia",
  },
  {
    id: "fit_cultural",
    label: "Fit cultural",
    description: "Alineación con los valores de Café Quindío",
    weight: 45,
    category: "cultural",
  },
  {
    id: "valores_actitudes",
    label: "Valores y actitudes",
    description: "Disposición hacia el servicio y el trabajo en equipo",
    weight: 35,
    category: "cultural",
  },
  {
    id: "disponibilidad",
    label: "Disponibilidad y flexibilidad",
    description: "Disponibilidad horaria y geográfica requerida",
    weight: 20,
    category: "cultural",
  },
];

export const aiTrainingCases: AITrainingCase[] = [
  {
    id: 1,
    candidateId: 3,
    jobId: 1,
    aiDecision: "aprobado",
    aiScore: 94,
    humanDecision: "aprobado",
    isCorrect: true,
    reviewedBy: "Valentina Ospina",
    reviewedDate: "09/03/2026",
  },
  {
    id: 2,
    candidateId: 9,
    jobId: 4,
    aiDecision: "rechazado",
    aiScore: 38,
    humanDecision: "rechazado",
    isCorrect: true,
    reviewedBy: "Andrés Felipe Giraldo",
    reviewedDate: "04/03/2026",
  },
  {
    id: 3,
    candidateId: 12,
    jobId: 8,
    aiDecision: "aprobado",
    aiScore: 85,
    humanDecision: "aprobado",
    isCorrect: true,
    reviewedBy: "Valentina Ospina",
    reviewedDate: "28/02/2026",
  },
  {
    id: 4,
    candidateId: 14,
    jobId: 14,
    aiDecision: "rechazado",
    aiScore: 45,
    humanDecision: "rechazado",
    isCorrect: true,
    reviewedBy: "Andrés Felipe Giraldo",
    reviewedDate: "15/02/2026",
  },
  {
    id: 5,
    candidateId: 15,
    jobId: 15,
    aiDecision: "aprobado",
    aiScore: 89,
    humanDecision: "aprobado",
    isCorrect: true,
    reviewedBy: "Juan Camilo Ríos",
    reviewedDate: "13/02/2026",
  },
  {
    id: 6,
    candidateId: 8,
    jobId: 4,
    aiDecision: "pendiente",
    aiScore: 67,
    humanDecision: "aprobado",
    isCorrect: false,
    reviewedBy: "Andrés Felipe Giraldo",
    reviewedDate: "05/03/2026",
  },
  {
    id: 7,
    candidateId: 11,
    jobId: 7,
    aiDecision: "pendiente",
    aiScore: 61,
    humanDecision: "aprobado",
    isCorrect: false,
    reviewedBy: "Valentina Ospina",
    reviewedDate: "01/03/2026",
  },
  {
    id: 8,
    candidateId: 2,
    jobId: 1,
    aiDecision: "pendiente",
    aiScore: 52,
    humanDecision: "rechazado",
    isCorrect: false,
  },
];

export const aiMetrics: AIMetrics = {
  precision: 87.4,
  recall: 82.1,
  f1Score: 84.7,
  totalDecisions: 156,
  correctDecisions: 132,
  trainingCases: 89,
  lastTraining: "05/03/2026",
};

export const aiMetricsHistory = [
  { fecha: "Oct 2025", precision: 71.2, f1: 68.5 },
  { fecha: "Nov 2025", precision: 74.8, f1: 72.1 },
  { fecha: "Dic 2025", precision: 78.3, f1: 76.4 },
  { fecha: "Ene 2026", precision: 81.0, f1: 79.2 },
  { fecha: "Feb 2026", precision: 84.6, f1: 82.8 },
  { fecha: "Mar 2026", precision: 87.4, f1: 84.7 },
];
