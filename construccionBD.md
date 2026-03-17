# Construcción de Base de Datos — CQ Talent Portal

**Proyecto:** CQ Talent Portal
**Cliente:** Café Quindío
**Rol:** Constructor de BD
**Fecha:** 2026-03-16
**Sprint activo:** Sprint 1 (entrega 20 mar 2026)

---

## Mapa Entidad-Relación

### Diagrama de Relaciones

```
USERS ──────────────────────────────────────────────────┐
  id (PK)                                               │ crea
  name                                                  │
  email                                                 ▼
  role                    ┌──────────┐    tiene    ┌──────────────────┐
  status                  │  JOBS    │────────────►│ JOB_REQUIREMENTS │
  password_hash           │──────────│             │──────────────────│
  created_at              │ id (PK)  │             │ id (PK)          │
                          │ title    │             │ job_id (FK)      │
                          │ location │             │ type             │
                          │ dept     │             │ label            │
                          │ area     │             │ content          │
                          │ type     │             │ order            │
                          │ date     │             └──────────────────┘
                          │ ref_id   │
                          │ descr.   │◄─────────────────────────┐
                          │ status   │                          │
                          │ views    │    APLICA A              │
                          │ ai_prompt│                          │
                          │ created_by (FK→users)               │
                          └──────────┘                          │
                                ▲                               │
                                │ pertenece a                   │
                                │                               │
                    ┌───────────────────────┐                   │
                    │    APPLICATIONS       │                   │
                    │───────────────────────│                   │
                    │ id (PK)               │                   │
                    │ candidate_id (FK) ────┼──┐                │
                    │ job_id (FK) ──────────┼──┘                │
                    │ applied_date          │                   │
                    │ ai_score              │                   │
                    │ ai_decision           │                   │
                    │ human_decision        │                   │
                    │ notes                 │                   │
                    └───────────────────────┘                   │
                                │                               │
                                │ postula                       │
                                ▼                               │
                    ┌──────────────────┐                        │
                    │   CANDIDATES     │     AI_TRAINING_CASES──┘
                    │──────────────────│     id (PK)
                    │ id (PK)          │     candidate_id (FK)
                    │ name             │     job_id (FK)
                    │ email            │     ai_decision
                    │ phone            │     ai_score
                    │ location         │     human_decision
                    │ cv_url           │     is_correct
                    │ created_at       │     reviewed_by (FK→users)
                    └──────────────────┘     reviewed_date
                          │   │   │
              ┌───────────┘   │   └───────────────┐
              ▼               ▼                   ▼
    CANDIDATE_EXPERIENCE  CANDIDATE_EDUCATION  CANDIDATE_LANGUAGES
```

---

## Diagrama Detallado — CANDIDATES y sus tablas hijas

```
                        ┌─────────────────────────────┐
                        │         CANDIDATES           │
                        │─────────────────────────────│
                        │ id          UUID  (PK)       │
                        │ name        VARCHAR(100)     │
                        │ email       VARCHAR(150)     │
                        │ phone       VARCHAR(20)      │
                        │ location    VARCHAR(100)     │
                        │ cv_url      VARCHAR(500)     │
                        │ created_at  TIMESTAMP        │
                        └─────────────────────────────┘
                               │         │         │
              1:N              │         │         │              1:N
       ┌───────────────────────┘         │         └──────────────────────────┐
       │                              1:N│                                    │
       ▼                                 ▼                                    ▼
┌─────────────────────┐   ┌──────────────────────────┐   ┌────────────────────────┐
│ CANDIDATE_EXPERIENCE│   │   CANDIDATE_EDUCATION    │   │  CANDIDATE_LANGUAGES   │
│─────────────────────│   │──────────────────────────│   │────────────────────────│
│ id           SERIAL │   │ id             SERIAL    │   │ id           SERIAL    │
│ candidate_id UUID   │   │ candidate_id   UUID      │   │ candidate_id UUID      │
│ position  VARCHAR   │   │ degree         ENUM      │   │ language  VARCHAR(50)  │
│ company   VARCHAR   │   │   Bachiller               │   │ level     ENUM         │
│ start_date   DATE   │   │   Tecnico                 │   │   Básico               │
│ end_date     DATE   │   │   Tecnólogo               │   │   Intermedio           │
│ details      TEXT   │   │   Pregrado                │   │   Avanzado             │
│                     │   │   Especialización         │   │   Nativo/Bilingüe      │
│ * end_date NULL     │   │   Maestría                │   └────────────────────────┘
│   = trabajo actual  │   │   Doctorado               │
└─────────────────────┘   │ institution  VARCHAR      │
                          │ field_of_study VARCHAR    │
                          │ graduation_date DATE      │
                          └──────────────────────────┘

Ejemplo de datos para un mismo candidato (id = abc-123):
─────────────────────────────────────────────────────────────────────
CANDIDATES
  abc-123 | Juan Pérez | juan@email.com | Medellín

CANDIDATE_EXPERIENCE
  1 | abc-123 | Barista      | Starbucks    | 2022-01-01 | 2024-06-30 | ...
  2 | abc-123 | Cajero       | Juan Valdez  | 2024-07-01 | NULL (actual)

CANDIDATE_EDUCATION
  1 | abc-123 | Tecnólogo    | SENA         | Gastronomía   | 2021-11-15
  2 | abc-123 | Especialización | UPB       | Gestión RRHH  | 2023-05-20

CANDIDATE_LANGUAGES
  1 | abc-123 | Español      | Nativo/Bilingüe
  2 | abc-123 | Inglés       | Intermedio
─────────────────────────────────────────────────────────────────────
```

---

## Entidades y Atributos Completos

### 1. `users` — Administradores y Reclutadores

| Campo         | Tipo                                      | Restricción         |
|---------------|-------------------------------------------|---------------------|
| id            | UUID / SERIAL                             | PK                  |
| name          | VARCHAR(100)                              | NOT NULL            |
| email         | VARCHAR(150)                              | UNIQUE, NOT NULL    |
| role          | ENUM('admin', 'recruiter', 'viewer')      | NOT NULL            |
| status        | ENUM('activo', 'inactivo')                | DEFAULT 'activo'    |
| password_hash | VARCHAR(255)                              | NOT NULL            |
| created_at    | TIMESTAMP                                 | DEFAULT NOW()       |

---

### 2. `jobs` — Convocatorias

| Campo       | Tipo                                         | Restricción          |
|-------------|----------------------------------------------|----------------------|
| id          | UUID / SERIAL                                | PK                   |
| title       | VARCHAR(200)                                 | NOT NULL             |
| location    | VARCHAR(100)                                 |                      |
| department  | VARCHAR(100)                                 |                      |
| area        | VARCHAR(100)                                 |                      |
| type        | VARCHAR(50)                                  | (tiempo completo…)   |
| date_posted | DATE                                         | DEFAULT NOW()        |
| ref_id      | VARCHAR(50)                                  | UNIQUE               |
| description | TEXT                                         |                      |
| status      | ENUM('activa', 'borrador', 'cerrada')        | DEFAULT 'borrador'   |
| views       | INT                                          | DEFAULT 0            |
| ai_prompt   | TEXT                                         |                      |
| created_by  | UUID / INT                                   | FK → users.id        |
| created_at  | TIMESTAMP                                    | DEFAULT NOW()        |

---

### 3. `job_requirements` — Funciones, Requisitos y Perfil Ideal

> Separa los arrays `functions`, `requirements` e `idealCandidate` del frontend en una tabla normalizada.

| Campo   | Tipo                                               | Restricción       |
|---------|----------------------------------------------------|-------------------|
| id      | SERIAL                                             | PK                |
| job_id  | UUID / INT                                         | FK → jobs.id      |
| type    | ENUM('funcion', 'requisito', 'perfil_ideal')       | NOT NULL          |
| label   | VARCHAR(100)                                       | Solo perfil_ideal |
| content | TEXT                                               | NOT NULL          |
| order   | INT                                                |                   |

---

### 4. `candidates` — Postulantes

| Campo      | Tipo          | Restricción       |
|------------|---------------|-------------------|
| id         | UUID / SERIAL | PK                |
| name       | VARCHAR(100)  | NOT NULL          |
| email      | VARCHAR(150)  | UNIQUE, NOT NULL  |
| phone      | VARCHAR(20)   |                   |
| location   | VARCHAR(100)  |                   |
| cv_url     | VARCHAR(500)  |                   |
| created_at | TIMESTAMP     | DEFAULT NOW()     |

---

### 5. `applications` — Postulaciones (tabla puente M:N)

| Campo          | Tipo                                                                  | Restricción                       |
|----------------|-----------------------------------------------------------------------|-----------------------------------|
| id             | UUID / SERIAL                                                         | PK                                |
| candidate_id   | UUID / INT                                                            | FK → candidates.id                |
| job_id         | UUID / INT                                                            | FK → jobs.id                      |
| applied_date   | TIMESTAMP                                                             | DEFAULT NOW()                     |
| ai_score       | DECIMAL(5,2)                                                          | CHECK (0 ≤ ai_score ≤ 100)        |
| ai_decision    | ENUM('aprobado', 'rechazado', 'pendiente')                            | DEFAULT 'pendiente'               |
| human_decision | ENUM('nuevo', 'revisado', 'entrevista', 'aprobado', 'rechazado')      | DEFAULT 'nuevo'                   |
| notes          | TEXT                                                                  |                                   |
| —              | UNIQUE (candidate_id, job_id)                                         | Un candidato por vacante          |

---

### 6. `candidate_experience` — Experiencia Laboral

| Campo        | Tipo          | Restricción           |
|--------------|---------------|-----------------------|
| id           | SERIAL        | PK                    |
| candidate_id | UUID / INT    | FK → candidates.id    |
| position     | VARCHAR(150)  | NOT NULL              |
| company      | VARCHAR(150)  | NOT NULL              |
| start_date   | DATE          |                       |
| end_date     | DATE          | NULL = trabajo actual |
| details      | TEXT          |                       |

---

### 7. `candidate_education` — Educación

| Campo           | Tipo                                                                              | Restricción        |
|-----------------|-----------------------------------------------------------------------------------|--------------------|
| id              | SERIAL                                                                            | PK                 |
| candidate_id    | UUID / INT                                                                        | FK → candidates.id |
| degree          | ENUM('Bachiller','Tecnico','Tecnólogo','Pregrado','Especialización','Maestría','Doctorado') |           |
| institution     | VARCHAR(200)                                                                      |                    |
| field_of_study  | VARCHAR(200)                                                                      |                    |
| graduation_date | DATE                                                                              |                    |

---

### 8. `candidate_languages` — Idiomas

| Campo        | Tipo                                                      | Restricción        |
|--------------|-----------------------------------------------------------|--------------------|
| id           | SERIAL                                                    | PK                 |
| candidate_id | UUID / INT                                                | FK → candidates.id |
| language     | VARCHAR(50)                                               |                    |
| level        | ENUM('Básico', 'Intermedio', 'Avanzado', 'Nativo/Bilingüe') |                  |

---

### 9. `ai_weights` — Pesos de Configuración IA

| Campo       | Tipo                                          | Restricción               |
|-------------|-----------------------------------------------|---------------------------|
| id          | VARCHAR(50)                                   | PK                        |
| label       | VARCHAR(100)                                  | NOT NULL                  |
| description | TEXT                                          |                           |
| weight      | INT                                           | CHECK (0 ≤ weight ≤ 100)  |
| category    | ENUM('tecnico', 'cultural', 'experiencia')    |                           |

---

### 10. `ai_training_cases` — Casos de Entrenamiento IA

| Campo          | Tipo                                       | Restricción           |
|----------------|--------------------------------------------|-----------------------|
| id             | SERIAL                                     | PK                    |
| candidate_id   | UUID / INT                                 | FK → candidates.id    |
| job_id         | UUID / INT                                 | FK → jobs.id          |
| ai_decision    | ENUM('aprobado', 'rechazado', 'pendiente') |                       |
| ai_score       | DECIMAL(5,2)                               |                       |
| human_decision | ENUM('aprobado', 'rechazado')              |                       |
| is_correct     | BOOLEAN                                    |                       |
| reviewed_by    | UUID / INT                                 | FK → users.id         |
| reviewed_date  | TIMESTAMP                                  |                       |

---

### 11. `ai_metrics_history` — Historial de Métricas IA

| Campo             | Tipo          | Restricción   |
|-------------------|---------------|---------------|
| id                | SERIAL        | PK            |
| recorded_at       | TIMESTAMP     | DEFAULT NOW() |
| precision         | DECIMAL(5,2)  |               |
| recall            | DECIMAL(5,2)  |               |
| f1_score          | DECIMAL(5,2)  |               |
| total_decisions   | INT           |               |
| correct_decisions | INT           |               |
| training_cases    | INT           |               |

---

## Relaciones Completas

| Entidad Origen      | Cardinalidad | Entidad Destino        | Descripción                                  |
|---------------------|:------------:|------------------------|----------------------------------------------|
| users               | 1 ── N       | jobs                   | Un usuario crea múltiples convocatorias      |
| users               | 1 ── N       | ai_training_cases      | Un usuario revisa múltiples casos IA         |
| jobs                | 1 ── N       | job_requirements       | Una vacante tiene múltiples req/funciones    |
| jobs                | M ── N       | candidates             | via `applications`                           |
| candidates          | 1 ── N       | applications           | Un candidato tiene múltiples postulaciones   |
| candidates          | 1 ── N       | candidate_experience   | Un candidato tiene múltiples experiencias    |
| candidates          | 1 ── N       | candidate_education    | Un candidato tiene múltiples estudios        |
| candidates          | 1 ── N       | candidate_languages    | Un candidato habla múltiples idiomas         |
| candidates + jobs   | M ── N       | ai_training_cases      | Pares candidato-vacante usados en training   |

---

## DDL SQL — PostgreSQL

```sql
-- ============================================================
-- CQ TALENT PORTAL — Schema PostgreSQL
-- Motor recomendado: PostgreSQL 15+
-- ORM recomendado: SQLAlchemy (FastAPI — Sprint 2)
-- ============================================================

-- USERS
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    role        VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'recruiter', 'viewer')),
    status      VARCHAR(10)  NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    password_hash VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- JOBS (Convocatorias)
CREATE TABLE jobs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200) NOT NULL,
    location    VARCHAR(100),
    department  VARCHAR(100),
    area        VARCHAR(100),
    type        VARCHAR(50),
    date_posted DATE         NOT NULL DEFAULT CURRENT_DATE,
    ref_id      VARCHAR(50)  UNIQUE,
    description TEXT,
    status      VARCHAR(10)  NOT NULL DEFAULT 'borrador' CHECK (status IN ('activa', 'borrador', 'cerrada')),
    views       INT          NOT NULL DEFAULT 0,
    ai_prompt   TEXT,
    created_by  UUID         REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- JOB REQUIREMENTS (funciones, requisitos, perfil ideal)
CREATE TABLE job_requirements (
    id      SERIAL PRIMARY KEY,
    job_id  UUID        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    type    VARCHAR(20) NOT NULL CHECK (type IN ('funcion', 'requisito', 'perfil_ideal')),
    label   VARCHAR(100),
    content TEXT        NOT NULL,
    "order" INT         NOT NULL DEFAULT 0
);

-- CANDIDATES (Postulantes)
CREATE TABLE candidates (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    phone      VARCHAR(20),
    location   VARCHAR(100),
    cv_url     VARCHAR(500),
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- APPLICATIONS (Postulaciones — M:N entre candidates y jobs)
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID         NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id          UUID         NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applied_date    TIMESTAMP    NOT NULL DEFAULT NOW(),
    ai_score        DECIMAL(5,2) CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_decision     VARCHAR(10)  NOT NULL DEFAULT 'pendiente' CHECK (ai_decision IN ('aprobado', 'rechazado', 'pendiente')),
    human_decision  VARCHAR(15)  NOT NULL DEFAULT 'nuevo' CHECK (human_decision IN ('nuevo', 'revisado', 'entrevista', 'aprobado', 'rechazado')),
    notes           TEXT,
    UNIQUE (candidate_id, job_id)
);

-- CANDIDATE EXPERIENCE (Experiencia laboral)
CREATE TABLE candidate_experience (
    id            SERIAL PRIMARY KEY,
    candidate_id  UUID         NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    position      VARCHAR(150) NOT NULL,
    company       VARCHAR(150) NOT NULL,
    start_date    DATE,
    end_date      DATE,    -- NULL = trabajo actual
    details       TEXT
);

-- CANDIDATE EDUCATION (Educación)
CREATE TABLE candidate_education (
    id               SERIAL PRIMARY KEY,
    candidate_id     UUID         NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    degree           VARCHAR(30)  CHECK (degree IN ('Bachiller','Tecnico','Tecnólogo','Pregrado','Especialización','Maestría','Doctorado')),
    institution      VARCHAR(200),
    field_of_study   VARCHAR(200),
    graduation_date  DATE
);

-- CANDIDATE LANGUAGES (Idiomas)
CREATE TABLE candidate_languages (
    id            SERIAL PRIMARY KEY,
    candidate_id  UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    language      VARCHAR(50),
    level         VARCHAR(20) CHECK (level IN ('Básico', 'Intermedio', 'Avanzado', 'Nativo/Bilingüe'))
);

-- AI WEIGHTS (Configuración de pesos IA)
CREATE TABLE ai_weights (
    id          VARCHAR(50) PRIMARY KEY,
    label       VARCHAR(100) NOT NULL,
    description TEXT,
    weight      INT          NOT NULL CHECK (weight >= 0 AND weight <= 100),
    category    VARCHAR(20)  NOT NULL CHECK (category IN ('tecnico', 'cultural', 'experiencia'))
);

-- AI TRAINING CASES (Casos de entrenamiento)
CREATE TABLE ai_training_cases (
    id              SERIAL PRIMARY KEY,
    candidate_id    UUID         NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id          UUID         NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    ai_decision     VARCHAR(10)  NOT NULL CHECK (ai_decision IN ('aprobado', 'rechazado', 'pendiente')),
    ai_score        DECIMAL(5,2),
    human_decision  VARCHAR(10)  NOT NULL CHECK (human_decision IN ('aprobado', 'rechazado')),
    is_correct      BOOLEAN      NOT NULL,
    reviewed_by     UUID         REFERENCES users(id) ON DELETE SET NULL,
    reviewed_date   TIMESTAMP
);

-- AI METRICS HISTORY (Historial de métricas)
CREATE TABLE ai_metrics_history (
    id                 SERIAL PRIMARY KEY,
    recorded_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    precision          DECIMAL(5,2),
    recall             DECIMAL(5,2),
    f1_score           DECIMAL(5,2),
    total_decisions    INT,
    correct_decisions  INT,
    training_cases     INT
);

-- ============================================================
-- ÍNDICES RECOMENDADOS
-- ============================================================
CREATE INDEX idx_jobs_status        ON jobs(status);
CREATE INDEX idx_jobs_area          ON jobs(area);
CREATE INDEX idx_jobs_created_by    ON jobs(created_by);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_job       ON applications(job_id);
CREATE INDEX idx_applications_ai_score  ON applications(ai_score DESC);
CREATE INDEX idx_training_job       ON ai_training_cases(job_id);
CREATE INDEX idx_training_candidate ON ai_training_cases(candidate_id);
```

---

## Decisiones de Diseño

### Motor de BD: PostgreSQL 15+
- Soporte nativo UUID, JSONB, ENUMs, y full-text search
- Compatible con SQLAlchemy (FastAPI, Sprint 2)
- Ideal para relaciones complejas con integridad referencial

### IDs: UUID vs SERIAL
- **UUID** para entidades expuestas al exterior (`users`, `jobs`, `candidates`, `applications`) — evita enumeración de IDs
- **SERIAL** para tablas de soporte interno (`job_requirements`, `candidate_experience`, etc.)

### Normalización
- `job_requirements` separa los arrays `functions[]`, `requirements[]` e `idealCandidate[]` del frontend en filas atómicas con campo `type`
- `applications` actúa como tabla puente M:N pero con atributos propios (score IA, decisión humana)

### ON DELETE Strategy
- `CASCADE` en tablas hijo cuando el padre es el propietario lógico (experiencias, educación, postulaciones)
- `SET NULL` cuando la relación es referencial pero no de propiedad (convocatorias creadas por un user eliminado)

---

## Pendientes / Próximas Iteraciones

| # | Decisión pendiente | Sprint |
|---|-------------------|--------|
| 1 | Agregar tabla `notifications` para alertas del sistema | Sprint 2 |
| 2 | Agregar tabla `application_status_history` para auditoría de cambios de estado | Sprint 2 |
| 3 | Evaluar si `ai_weights` es global o por-convocatoria | Sprint 2 |
| 4 | Definir tabla `companies` si el portal escala a multi-empresa | Post-MVP |
| 5 | Agregar soporte para adjuntos adicionales en candidatos (cartas, portafolios) | Post-MVP |
