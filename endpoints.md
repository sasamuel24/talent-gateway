# CQ Talent Portal — Referencia Completa de Endpoints

**Proyecto:** CQ Talent Portal
**Cliente:** Café Quindío
**Backend:** FastAPI 0.110+ · Python 3.12 · PostgreSQL 15+
**Base URL (dev):** `http://localhost:8000`
**Base URL (producción):** `https://api.talent.cafequindio.com`
**Versión API:** `v1`
**Prefijo global:** `/api/v1`
**Fecha:** 2026-03-17
**Sprint activo:** Sprint 1 (entrega 20 mar 2026)

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Autenticación JWT](#autenticacion-jwt)
3. [Filtros y Paginación Estándar](#filtros-y-paginacion-estandar)
4. [Códigos de Respuesta HTTP](#codigos-de-respuesta-http)
5. [Módulo: auth](#modulo-auth)
6. [Módulo: usuarios](#modulo-usuarios)
7. [Módulo: convocatorias](#modulo-convocatorias)
8. [Módulo: candidatos](#modulo-candidatos)
9. [Módulo: aplicaciones](#modulo-aplicaciones)
10. [Módulo: areas](#modulo-areas)
11. [Módulo: dashboard](#modulo-dashboard)
12. [Módulo: ia](#modulo-ia)
13. [Prioridad de Implementación por Sprint](#prioridad-de-implementacion-por-sprint)

---

## Resumen Ejecutivo

La API de CQ Talent Portal expone **33 endpoints** distribuidos en 8 módulos. La arquitectura sigue el patrón `Router → Service → Repository → Database` con separación estricta de responsabilidades (Clean Architecture).

| Módulo          | Endpoints | Auth requerida | Uso principal                              |
|-----------------|:---------:|:--------------:|--------------------------------------------|
| `auth`          | 1         | No             | Login de administradores y reclutadores    |
| `usuarios`      | 5         | Sí             | CRUD de usuarios internos del sistema      |
| `convocatorias` | 8         | Mixto          | Gestión y consulta pública de vacantes     |
| `candidatos`    | 7         | Mixto          | Registro y perfil completo de postulantes  |
| `aplicaciones`  | 5         | Mixto          | Postulaciones y decisiones de selección    |
| `areas`         | 2         | No             | Catálogo de áreas y estadísticas           |
| `dashboard`     | 1         | Sí             | Métricas del panel administrativo          |
| `ia`            | 6         | Sí             | Motor de scoring y configuración de IA     |
| **Health**      | 1         | No             | Estado del servicio                        |
| **Total**       | **36**    |                |                                            |

---

## Autenticacion JWT

### Mecanismo

La API usa autenticación basada en **JSON Web Tokens (JWT)** con el esquema `Bearer`. El token se genera en el endpoint `/api/v1/auth/login` y debe incluirse en el header `Authorization` de cada solicitud protegida.

```
Authorization: Bearer <access_token>
```

### Configuración del Token

| Parámetro               | Valor                |
|-------------------------|----------------------|
| Algoritmo               | HS256                |
| Expiración por defecto  | 30 minutos           |
| Campo subject (`sub`)   | UUID del usuario     |
| Librería                | `python-jose`        |

### Flujo de Autenticación

```
1. Cliente  →  POST /api/v1/auth/login  →  { email, password }
2. API      →  Verifica credenciales en tabla `users`
3. API      →  Genera JWT con { sub: user_id, exp: now + 30min }
4. Cliente  ←  { access_token, token_type: "bearer", user: {...} }
5. Cliente  →  Guarda token en memoria (localStorage / sessionStorage)
6. Cliente  →  Todas las solicitudes protegidas incluyen: Authorization: Bearer <token>
7. API      →  Verifica firma y expiración del token en cada request
8. API      ←  401 Unauthorized si el token es inválido o expirado
```

### Manejo de Expiración

Cuando el token expira, el cliente recibe `401 Unauthorized` con el detalle `"No se pudo validar las credenciales"`. El cliente debe redirigir al login para obtener un nuevo token.

> **Nota Sprint 2:** Se planifica implementar refresh tokens para evitar interrupciones de sesión durante el trabajo de los reclutadores.

### Roles de Usuario

| Rol         | Descripción                                               |
|-------------|-----------------------------------------------------------|
| `admin`     | Acceso total: CRUD usuarios, configuración IA, reportes   |
| `recruiter` | Gestión de convocatorias, candidatos y decisiones         |
| `viewer`    | Solo lectura del dashboard y listados                     |

---

## Filtros y Paginacion Estandar

Los endpoints de listado aceptan los siguientes query parameters de forma consistente:

### Paginación

| Parámetro | Tipo  | Default | Descripción                                    |
|-----------|-------|---------|------------------------------------------------|
| `skip`    | `int` | `0`     | Número de registros a omitir (offset)          |
| `limit`   | `int` | `100`   | Número máximo de registros a retornar (1-500)  |

**Ejemplo:** `GET /api/v1/convocatorias?skip=0&limit=20`

### Filtros por Módulo

**Convocatorias:**

| Parámetro  | Tipo     | Descripción                                         |
|------------|----------|-----------------------------------------------------|
| `status`   | `string` | Filtrar por estado: `activa`, `borrador`, `cerrada` |
| `area`     | `string` | Filtrar por área funcional (ej: `barismo`)          |
| `location` | `string` | Filtrar por ciudad o sede                           |
| `search`   | `string` | Búsqueda de texto libre en título y descripción     |

**Aplicaciones:**

| Parámetro        | Tipo   | Descripción                                               |
|------------------|--------|-----------------------------------------------------------|
| `job_id`         | `UUID` | Filtrar postulaciones de una convocatoria específica      |
| `ai_decision`    | `string` | Filtrar por decisión IA: `aprobado`, `rechazado`, `pendiente` |
| `human_decision` | `string` | Filtrar por etapa: `nuevo`, `revisado`, `entrevista`, `aprobado`, `rechazado` |

**Casos de entrenamiento IA:**

| Parámetro | Tipo  | Default | Descripción           |
|-----------|-------|---------|-----------------------|
| `skip`    | `int` | `0`     | Paginación estándar   |
| `limit`   | `int` | `100`   | Paginación estándar   |

---

## Codigos de Respuesta HTTP

| Código | Estado                | Cuándo se usa                                                     |
|--------|-----------------------|-------------------------------------------------------------------|
| `200`  | OK                    | Solicitud exitosa con cuerpo de respuesta                         |
| `201`  | Created               | Recurso creado exitosamente (POST)                                |
| `204`  | No Content            | Eliminación exitosa (DELETE) — sin cuerpo                        |
| `400`  | Bad Request           | Datos de entrada inválidos o regla de negocio violada             |
| `401`  | Unauthorized          | Token JWT ausente, inválido o expirado                            |
| `403`  | Forbidden             | Token válido pero sin permisos suficientes para la operación      |
| `404`  | Not Found             | Recurso no encontrado por el ID proporcionado                     |
| `409`  | Conflict              | Duplicado: email ya registrado, candidato ya postulado, etc.      |
| `422`  | Unprocessable Entity  | Error de validación Pydantic (tipos de datos, patrones, rangos)   |
| `500`  | Internal Server Error | Error inesperado del servidor (reportar al equipo de desarrollo)  |

### Formato de Error Estándar (422)

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "input": "no-es-un-email"
    }
  ]
}
```

### Formato de Error de Negocio (400 / 404 / 409)

```json
{
  "detail": "El candidato ya tiene una postulación activa para esta convocatoria."
}
```

---

## Modulo: auth

**Prefijo:** `/api/v1/auth`
**Tag FastAPI:** `auth`
**Descripción:** Autenticación de usuarios internos (administradores y reclutadores). No expone endpoints de registro público; los usuarios son creados por administradores vía el módulo `usuarios`.

### Tabla de Endpoints

| Método | Ruta           | Descripción                              | Auth requerida | Usado en                     |
|--------|----------------|------------------------------------------|:--------------:|------------------------------|
| `POST` | `/auth/login`  | Autenticar usuario y obtener token JWT   | No             | AdminDashboard (login guard) |

### POST /api/v1/auth/login

Autentica un usuario del sistema (admin, recruiter o viewer) y retorna un token JWT.

**Request Body:**

```json
{
  "email": "maria.gomez@cafequindio.com",
  "password": "MiPasswordSeguro123"
}
```

| Campo      | Tipo     | Requerido | Descripción                |
|------------|----------|:---------:|----------------------------|
| `email`    | `string` | Sí        | Email corporativo del usuario |
| `password` | `string` | Sí        | Contraseña en texto plano (se compara con bcrypt hash) |

**Response 200 — Login exitoso:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NWE3ZjM0MC0xMjM0LTQ1NjctODkwYS1hYmNkZWYxMjM0NTYiLCJleHAiOjE3NTgzMDAwMDB9.HxAbCdEfGhIjKlMnOpQrStUvWxYz",
  "token_type": "bearer",
  "user": {
    "id": "55a7f340-1234-4567-890a-abcdef123456",
    "name": "María Gómez",
    "email": "maria.gomez@cafequindio.com",
    "role": "recruiter",
    "status": "activo",
    "created_at": "2026-02-28T08:00:00Z"
  }
}
```

**Response 401 — Credenciales incorrectas:**

```json
{
  "detail": "No se pudo validar las credenciales"
}
```

---

## Modulo: usuarios

**Prefijo:** `/api/v1/usuarios`
**Tag FastAPI:** `usuarios`
**Auth:** Todos los endpoints requieren token JWT válido.
**Descripción:** CRUD de usuarios internos del sistema (administradores, reclutadores y visualizadores). Solo accesible desde el panel administrativo.

### Tabla de Endpoints

| Método   | Ruta                  | Descripción                          | Auth requerida | Usado en              |
|----------|-----------------------|--------------------------------------|:--------------:|-----------------------|
| `GET`    | `/usuarios/`          | Listar todos los usuarios del sistema| Sí             | AdminConfiguracion.tsx |
| `POST`   | `/usuarios/`          | Crear nuevo usuario interno          | Sí             | AdminConfiguracion.tsx |
| `GET`    | `/usuarios/{user_id}` | Obtener detalle de un usuario        | Sí             | AdminConfiguracion.tsx |
| `PUT`    | `/usuarios/{user_id}` | Actualizar datos de un usuario       | Sí             | AdminConfiguracion.tsx |
| `DELETE` | `/usuarios/{user_id}` | Eliminar usuario (baja lógica)       | Sí             | AdminConfiguracion.tsx |

### GET /api/v1/usuarios/

Retorna la lista paginada de usuarios del sistema.

**Query Params:** `skip=0`, `limit=100`

**Response 200:**

```json
[
  {
    "id": "55a7f340-1234-4567-890a-abcdef123456",
    "name": "María Gómez",
    "email": "maria.gomez@cafequindio.com",
    "role": "recruiter",
    "status": "activo",
    "created_at": "2026-02-28T08:00:00Z"
  },
  {
    "id": "aabb1234-5678-90ab-cdef-012345678901",
    "name": "Carlos Ríos",
    "email": "carlos.rios@cafequindio.com",
    "role": "admin",
    "status": "activo",
    "created_at": "2026-02-01T10:30:00Z"
  }
]
```

### POST /api/v1/usuarios/

Crea un nuevo usuario interno. La contraseña se hashea con bcrypt antes de almacenarla.

**Request Body:**

```json
{
  "name": "Laura Pineda",
  "email": "laura.pineda@cafequindio.com",
  "password": "CafeBaristaAdmin2026",
  "role": "viewer",
  "status": "activo"
}
```

| Campo      | Tipo     | Requerido | Valores posibles                    | Descripción                   |
|------------|----------|:---------:|-------------------------------------|-------------------------------|
| `name`     | `string` | Sí        | max 100 chars                       | Nombre completo               |
| `email`    | `string` | Sí        | formato email válido                | Email corporativo único       |
| `password` | `string` | Sí        | min 8 caracteres                    | Contraseña en texto plano     |
| `role`     | `string` | No        | `admin`, `recruiter`, `viewer`      | Rol por defecto: `viewer`     |
| `status`   | `string` | No        | `activo`, `inactivo`                | Estado por defecto: `activo`  |

**Response 201:**

```json
{
  "id": "cc112233-4455-6677-8899-aabbccddeeff",
  "name": "Laura Pineda",
  "email": "laura.pineda@cafequindio.com",
  "role": "viewer",
  "status": "activo",
  "created_at": "2026-03-17T14:22:00Z"
}
```

### PUT /api/v1/usuarios/{user_id}

Actualiza parcialmente un usuario. Todos los campos son opcionales; solo se actualizan los campos enviados.

**Request Body (ejemplo — cambio de rol):**

```json
{
  "role": "recruiter"
}
```

**Request Body (ejemplo — actualización completa):**

```json
{
  "name": "Laura Pineda Montoya",
  "role": "recruiter",
  "status": "activo",
  "password": "NuevaPassword2026"
}
```

**Response 200:** Objeto `UserResponse` con los datos actualizados (mismo formato que POST).

### DELETE /api/v1/usuarios/{user_id}

Elimina un usuario del sistema. Si el usuario tiene convocatorias creadas, la FK `created_by` en `jobs` se establece en `NULL` (SET NULL).

**Response 204:** Sin cuerpo de respuesta.

---

## Modulo: convocatorias

**Prefijo:** `/api/v1/convocatorias`
**Tag FastAPI:** `convocatorias`
**Auth:** Mixto — listado y detalle público, creación/edición/eliminación protegida.
**Descripción:** Gestión completa del ciclo de vida de las convocatorias laborales. Incluye CRUD, gestión de requisitos, contador de vistas y filtros públicos para el portal del candidato.

### Tabla de Endpoints

| Método    | Ruta                              | Descripción                                    | Auth requerida | Usado en                              |
|-----------|-----------------------------------|------------------------------------------------|:--------------:|---------------------------------------|
| `GET`     | `/convocatorias/`                 | Listar convocatorias con filtros y paginación  | No             | Index.tsx, AdminConvocatorias.tsx     |
| `POST`    | `/convocatorias/`                 | Crear nueva convocatoria                       | Sí             | AdminConvocatoriaForm.tsx             |
| `GET`     | `/convocatorias/{job_id}`         | Obtener detalle completo de una convocatoria   | No             | JobDetail.tsx                         |
| `PUT`     | `/convocatorias/{job_id}`         | Actualizar convocatoria existente              | Sí             | AdminConvocatoriaForm.tsx             |
| `DELETE`  | `/convocatorias/{job_id}`         | Eliminar convocatoria                          | Sí             | AdminConvocatorias.tsx                |
| `POST`    | `/convocatorias/{job_id}/requirements` | Agregar requisito/función/perfil a vacante | Sí         | AdminConvocatoriaForm.tsx             |
| `PATCH`   | `/convocatorias/{job_id}/views`   | Incrementar contador de vistas                 | No             | JobDetail.tsx (al cargar la página)   |

### GET /api/v1/convocatorias/

Retorna el listado de convocatorias. El portal público usa `status=activa`; el admin puede filtrar por cualquier estado.

**Query Params:**

| Parámetro  | Tipo     | Ejemplo             | Descripción                                        |
|------------|----------|---------------------|----------------------------------------------------|
| `skip`     | `int`    | `0`                 | Offset de paginación                               |
| `limit`    | `int`    | `20`                | Máximo de registros                                |
| `status`   | `string` | `activa`            | Filtrar por estado de la convocatoria              |
| `area`     | `string` | `barismo`           | Filtrar por área funcional                         |
| `location` | `string` | `Armenia`           | Filtrar por ciudad o sede                          |
| `search`   | `string` | `barista%20lider`   | Búsqueda en título y descripción (URL-encoded)     |

**Ejemplo de request del portal público:**
```
GET /api/v1/convocatorias?status=activa&location=Armenia&skip=0&limit=20
```

**Response 200:**

```json
[
  {
    "id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
    "title": "Barista Líder — Tienda Armenia Centro",
    "location": "Armenia, Quindío",
    "department": "Operaciones",
    "area": "barismo",
    "type": "Tiempo completo",
    "date_posted": "2026-03-10",
    "ref_id": "CQ-2026-021",
    "status": "activa",
    "views": 147,
    "created_at": "2026-03-10T09:00:00Z"
  },
  {
    "id": "8c4b2f3d-6g9e-5b0c-c3d2-e4f5g6789012",
    "title": "Coordinador de Tienda — Bogotá",
    "location": "Bogotá, Cundinamarca",
    "department": "Gestión de Tiendas",
    "area": "administracion",
    "type": "Tiempo completo",
    "date_posted": "2026-03-08",
    "ref_id": "CQ-2026-020",
    "status": "activa",
    "views": 89,
    "created_at": "2026-03-08T11:30:00Z"
  }
]
```

> El listado retorna `JobListResponse` (versión resumida sin descripción completa ni requisitos) para optimizar performance en el listado.

### POST /api/v1/convocatorias/

Crea una nueva convocatoria. Los requisitos, funciones y perfil ideal se agregan en un segundo paso vía el endpoint `/requirements`.

**Request Body:**

```json
{
  "title": "Barista Senior — Tienda El Cable",
  "location": "Manizales, Caldas",
  "department": "Operaciones",
  "area": "barismo",
  "type": "Tiempo completo",
  "date_posted": "2026-03-17",
  "ref_id": "CQ-2026-025",
  "description": "Buscamos un Barista Senior apasionado por el café de origen colombiano para liderar el equipo de preparación en nuestra tienda emblemática de El Cable.",
  "status": "borrador",
  "ai_prompt": "Evaluar candidatos con experiencia en métodos de extracción de espresso, conocimiento en cafés de origen colombiano y habilidades de liderazgo de pequeños equipos.",
  "created_by": "55a7f340-1234-4567-890a-abcdef123456"
}
```

| Campo         | Tipo     | Requerido | Descripción                                                          |
|---------------|----------|:---------:|----------------------------------------------------------------------|
| `title`       | `string` | Sí        | Título del cargo (max 200 chars)                                     |
| `location`    | `string` | No        | Ciudad y departamento (max 100 chars)                                |
| `department`  | `string` | No        | Departamento interno de la empresa                                   |
| `area`        | `string` | No        | Área funcional para filtros (barismo, rrhh, administracion, etc.)    |
| `type`        | `string` | No        | Modalidad: Tiempo completo, Medio tiempo, Freelance                  |
| `date_posted` | `date`   | No        | Fecha de publicación (YYYY-MM-DD). Default: hoy                      |
| `ref_id`      | `string` | No        | Código interno único (ej: CQ-2026-025, max 50 chars)                 |
| `description` | `string` | No        | Descripción general de la vacante en texto libre                     |
| `status`      | `string` | No        | `activa`, `borrador`, `cerrada`. Default: `borrador`                 |
| `ai_prompt`   | `string` | No        | Instrucciones en lenguaje natural para el motor IA de scoring        |
| `created_by`  | `UUID`   | No        | UUID del usuario que crea la convocatoria                            |

**Response 201:**

```json
{
  "id": "9d5c3g4e-7h0f-6c1d-d4e3-f5g6h7890123",
  "title": "Barista Senior — Tienda El Cable",
  "location": "Manizales, Caldas",
  "department": "Operaciones",
  "area": "barismo",
  "type": "Tiempo completo",
  "date_posted": "2026-03-17",
  "ref_id": "CQ-2026-025",
  "description": "Buscamos un Barista Senior apasionado por el café de origen colombiano...",
  "status": "borrador",
  "ai_prompt": "Evaluar candidatos con experiencia en métodos de extracción de espresso...",
  "views": 0,
  "created_by": "55a7f340-1234-4567-890a-abcdef123456",
  "created_at": "2026-03-17T15:00:00Z",
  "requirements": []
}
```

### GET /api/v1/convocatorias/{job_id}

Retorna el detalle completo de una convocatoria, incluyendo todos sus requisitos, funciones y perfil ideal anidados.

**Path Params:** `job_id` — UUID de la convocatoria

**Response 200 (JobResponse completo con requirements):**

```json
{
  "id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
  "title": "Barista Líder — Tienda Armenia Centro",
  "location": "Armenia, Quindío",
  "department": "Operaciones",
  "area": "barismo",
  "type": "Tiempo completo",
  "date_posted": "2026-03-10",
  "ref_id": "CQ-2026-021",
  "description": "Lidera el equipo de preparación y garantiza la experiencia sensorial del cliente en nuestra tienda insignia de Armenia.",
  "status": "activa",
  "ai_prompt": "Evaluar experiencia en café de especialidad, habilidades de liderazgo y orientación al servicio al cliente.",
  "views": 148,
  "created_by": "55a7f340-1234-4567-890a-abcdef123456",
  "created_at": "2026-03-10T09:00:00Z",
  "requirements": [
    {
      "id": 1,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "funcion",
      "label": null,
      "content": "Preparar bebidas de espresso y métodos alternativos garantizando estándares de calidad CQ.",
      "order": 1
    },
    {
      "id": 2,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "funcion",
      "label": null,
      "content": "Capacitar y supervisar al equipo de baristas junior durante los turnos.",
      "order": 2
    },
    {
      "id": 3,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "requisito",
      "label": null,
      "content": "Experiencia mínima de 2 años como barista en café de especialidad.",
      "order": 1
    },
    {
      "id": 4,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "requisito",
      "label": null,
      "content": "Certificación SCA (Specialty Coffee Association) — nivel Foundation o superior.",
      "order": 2
    },
    {
      "id": 5,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "perfil_ideal",
      "label": "Habilidades técnicas",
      "content": "Dominio de métodos de extracción: espresso, V60, Chemex, AeroPress.",
      "order": 1
    },
    {
      "id": 6,
      "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
      "type": "perfil_ideal",
      "label": "Actitud",
      "content": "Pasión genuina por el café colombiano de origen y cultura de servicio al cliente.",
      "order": 2
    }
  ]
}
```

### PUT /api/v1/convocatorias/{job_id}

Actualiza los campos de una convocatoria. Todos los campos son opcionales.

**Request Body (ejemplo — publicar un borrador):**

```json
{
  "status": "activa",
  "date_posted": "2026-03-17"
}
```

**Request Body (ejemplo — actualización completa):**

```json
{
  "title": "Barista Líder Senior — Tienda Armenia Centro",
  "location": "Armenia, Quindío",
  "department": "Operaciones",
  "area": "barismo",
  "type": "Tiempo completo",
  "date_posted": "2026-03-17",
  "description": "Descripción actualizada...",
  "status": "activa",
  "ai_prompt": "Prompt actualizado para el motor IA."
}
```

**Response 200:** Objeto `JobResponse` completo con requirements anidados.

### DELETE /api/v1/convocatorias/{job_id}

Elimina una convocatoria y en cascada sus `job_requirements`. Las `applications` asociadas también se eliminan en cascada.

**Response 204:** Sin cuerpo de respuesta.

### POST /api/v1/convocatorias/{job_id}/requirements

Agrega un ítem de tipo función, requisito o perfil ideal a una convocatoria existente.

**Path Params:** `job_id` — UUID de la convocatoria

**Request Body:**

```json
{
  "type": "funcion",
  "label": null,
  "content": "Gestionar el inventario de insumos y realizar pedidos semanales al proveedor.",
  "order": 3
}
```

| Campo     | Tipo      | Requerido | Valores posibles                                | Descripción                                  |
|-----------|-----------|:---------:|-------------------------------------------------|----------------------------------------------|
| `type`    | `string`  | Sí        | `funcion`, `requisito`, `perfil_ideal`          | Categoría del ítem                           |
| `label`   | `string`  | No        | Texto libre (max 100 chars)                     | Etiqueta visual. Recomendado para `perfil_ideal` |
| `content` | `string`  | Sí        | Texto libre                                     | Descripción del requisito, función o perfil  |
| `order`   | `integer` | No        | Entero positivo. Default: `0`                   | Posición en el listado (orden ascendente)    |

**Response 201:**

```json
{
  "id": 7,
  "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
  "type": "funcion",
  "label": null,
  "content": "Gestionar el inventario de insumos y realizar pedidos semanales al proveedor.",
  "order": 3
}
```

### PATCH /api/v1/convocatorias/{job_id}/views

Incrementa en 1 el contador `views` de la convocatoria. Se invoca automáticamente cuando el candidato abre el detalle de una vacante.

**Request Body:** No requerido (body vacío).

**Response 200:** Objeto `JobResponse` completo con el campo `views` actualizado.

---

## Modulo: candidatos

**Prefijo:** `/api/v1/candidatos`
**Tag FastAPI:** `candidatos`
**Auth:** Mixto — creación de candidato y autopostulación son públicas; listados y perfiles completos requieren auth.
**Descripción:** Gestión del perfil completo del postulante, incluyendo datos personales, historial de experiencia laboral, formación académica e idiomas.

### Tabla de Endpoints

| Método | Ruta                                   | Descripción                              | Auth requerida | Usado en                      |
|--------|----------------------------------------|------------------------------------------|:--------------:|-------------------------------|
| `GET`  | `/candidatos/`                         | Listar todos los candidatos              | Sí             | AdminCandidatos.tsx           |
| `POST` | `/candidatos/`                         | Crear perfil de candidato                | No             | Apply.tsx                     |
| `GET`  | `/candidatos/{candidate_id}`           | Obtener perfil completo de un candidato  | Sí             | AdminCandidatos.tsx           |
| `PUT`  | `/candidatos/{candidate_id}`           | Actualizar datos básicos del candidato   | Sí             | AdminCandidatos.tsx           |
| `POST` | `/candidatos/{candidate_id}/experience`| Agregar experiencia laboral              | Sí             | Apply.tsx (paso 2), Admin     |
| `POST` | `/candidatos/{candidate_id}/education` | Agregar formación académica              | Sí             | Apply.tsx (paso 3), Admin     |
| `POST` | `/candidatos/{candidate_id}/languages` | Agregar idioma                           | Sí             | Apply.tsx (paso 4), Admin     |

> **Nota de flujo Apply.tsx:** La postulación crea primero el candidato (sin auth), y luego los pasos de experiencia/educación/idiomas pueden requerir un token temporal o flujo de sesión efímera. Este comportamiento se definirá en Sprint 2.

### GET /api/v1/candidatos/

Retorna la lista paginada de candidatos. Incluye experiencia, educación e idiomas anidados.

**Query Params:** `skip=0`, `limit=100`

**Response 200:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
    "name": "Juan Carlos Pérez Ríos",
    "email": "juancarlos.perez@gmail.com",
    "phone": "+57 310 5551234",
    "location": "Armenia, Quindío",
    "cv_url": "https://storage.cafequindio.com/cvs/juancarlos-perez-2026.pdf",
    "created_at": "2026-03-15T10:30:00Z",
    "experience": [
      {
        "id": 1,
        "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
        "position": "Barista Senior",
        "company": "Juan Valdez Café",
        "start_date": "2023-01-15",
        "end_date": null,
        "details": "Preparación de bebidas de especialidad, atención al cliente y capacitación de personal nuevo."
      }
    ],
    "education": [
      {
        "id": 1,
        "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
        "degree": "Tecnólogo",
        "institution": "SENA",
        "field_of_study": "Gastronomía y Gestión de Restaurantes",
        "graduation_date": "2022-11-30"
      }
    ],
    "languages": [
      {
        "id": 1,
        "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
        "language": "Español",
        "level": "Nativo/Bilingüe"
      },
      {
        "id": 2,
        "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
        "language": "Inglés",
        "level": "Intermedio"
      }
    ]
  }
]
```

### POST /api/v1/candidatos/

Crea el perfil básico del candidato durante el proceso de postulación. Es el primer paso del flujo `Apply.tsx`.

**Request Body:**

```json
{
  "name": "Valentina Herrera Ospina",
  "email": "valentina.herrera@hotmail.com",
  "phone": "+57 315 7778899",
  "location": "Pereira, Risaralda",
  "cv_url": "https://storage.cafequindio.com/cvs/valentina-herrera-2026.pdf"
}
```

| Campo      | Tipo     | Requerido | Descripción                                       |
|------------|----------|:---------:|---------------------------------------------------|
| `name`     | `string` | Sí        | Nombre completo (max 100 chars)                   |
| `email`    | `string` | Sí        | Email único del candidato                         |
| `phone`    | `string` | No        | Teléfono de contacto (max 20 chars)               |
| `location` | `string` | No        | Ciudad de residencia (max 100 chars)              |
| `cv_url`   | `string` | No        | URL del CV subido previamente al almacenamiento   |

**Response 201:** Objeto `CandidateResponse` completo con arrays `experience`, `education` y `languages` vacíos.

**Response 409 — Email duplicado:**

```json
{
  "detail": "Ya existe un candidato registrado con este correo electrónico."
}
```

### POST /api/v1/candidatos/{candidate_id}/experience

Agrega un registro de experiencia laboral al perfil del candidato.

**Request Body:**

```json
{
  "position": "Barista",
  "company": "Starbucks Colombia — CC Unicentro Pereira",
  "start_date": "2021-06-01",
  "end_date": "2023-12-31",
  "details": "Preparación de bebidas calientes y frías, mantenimiento de equipos de espresso, atención al cliente en temporadas de alto tráfico."
}
```

| Campo        | Tipo     | Requerido | Descripción                                          |
|--------------|----------|:---------:|------------------------------------------------------|
| `position`   | `string` | Sí        | Cargo ocupado (max 150 chars)                        |
| `company`    | `string` | Sí        | Nombre de la empresa (max 150 chars)                 |
| `start_date` | `date`   | No        | Fecha de inicio en formato `YYYY-MM-DD`              |
| `end_date`   | `date`   | No        | Fecha de fin. `null` si es el trabajo actual         |
| `details`    | `string` | No        | Descripción de responsabilidades y logros            |

**Response 201:**

```json
{
  "id": 5,
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "position": "Barista",
  "company": "Starbucks Colombia — CC Unicentro Pereira",
  "start_date": "2021-06-01",
  "end_date": "2023-12-31",
  "details": "Preparación de bebidas calientes y frías..."
}
```

### POST /api/v1/candidatos/{candidate_id}/education

Agrega un registro de formación académica al perfil del candidato.

**Request Body:**

```json
{
  "degree": "Tecnólogo",
  "institution": "SENA — Centro Agroindustrial del Quindío",
  "field_of_study": "Producción de Café Especial",
  "graduation_date": "2023-06-15"
}
```

| Campo             | Tipo     | Requerido | Valores posibles                                                                         |
|-------------------|----------|:---------:|------------------------------------------------------------------------------------------|
| `degree`          | `string` | No        | `Bachiller`, `Tecnico`, `Tecnólogo`, `Pregrado`, `Especialización`, `Maestría`, `Doctorado` |
| `institution`     | `string` | No        | Nombre de la institución educativa (max 200 chars)                                       |
| `field_of_study`  | `string` | No        | Área o programa de estudio (max 200 chars)                                               |
| `graduation_date` | `date`   | No        | Fecha de grado en formato `YYYY-MM-DD`                                                   |

**Response 201:**

```json
{
  "id": 3,
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "degree": "Tecnólogo",
  "institution": "SENA — Centro Agroindustrial del Quindío",
  "field_of_study": "Producción de Café Especial",
  "graduation_date": "2023-06-15"
}
```

### POST /api/v1/candidatos/{candidate_id}/languages

Agrega un idioma al perfil del candidato.

**Request Body:**

```json
{
  "language": "Inglés",
  "level": "Intermedio"
}
```

| Campo      | Tipo     | Requerido | Valores posibles                                       |
|------------|----------|:---------:|--------------------------------------------------------|
| `language` | `string` | No        | Nombre del idioma (max 50 chars)                       |
| `level`    | `string` | No        | `Básico`, `Intermedio`, `Avanzado`, `Nativo/Bilingüe`  |

**Response 201:**

```json
{
  "id": 3,
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "language": "Inglés",
  "level": "Intermedio"
}
```

---

## Modulo: aplicaciones

**Prefijo:** `/api/v1/aplicaciones`
**Tag FastAPI:** `aplicaciones`
**Auth:** Mixto — la postulación es pública; los listados y actualizaciones de decisión requieren auth.
**Descripción:** Gestión de postulaciones (tabla puente M:N entre candidatos y convocatorias). Centraliza el flujo de decisión IA y humana del proceso de selección.

### Tabla de Endpoints

| Método    | Ruta                                      | Descripción                                    | Auth requerida | Usado en                      |
|-----------|-------------------------------------------|------------------------------------------------|:--------------:|-------------------------------|
| `GET`     | `/aplicaciones/`                          | Listar postulaciones con filtros               | Sí             | AdminCandidatos.tsx           |
| `POST`    | `/aplicaciones/`                          | Registrar postulación de candidato a vacante   | No             | Apply.tsx                     |
| `GET`     | `/aplicaciones/{application_id}`          | Obtener detalle de una postulación             | Sí             | AdminCandidatos.tsx           |
| `PATCH`   | `/aplicaciones/{application_id}/decision` | Actualizar decisión humana del reclutador      | Sí             | AdminCandidatos.tsx           |
| `PATCH`   | `/aplicaciones/{application_id}/score`    | Actualizar score y decisión del motor IA       | Sí             | AdminIA.tsx (disparado por IA)|

### GET /api/v1/aplicaciones/

Retorna el listado de postulaciones. Soporte de filtros para el panel de seguimiento de candidatos.

**Query Params:**

| Parámetro        | Tipo     | Ejemplo      | Descripción                                               |
|------------------|----------|--------------|-----------------------------------------------------------|
| `skip`           | `int`    | `0`          | Offset de paginación                                      |
| `limit`          | `int`    | `50`         | Máximo de registros                                       |
| `job_id`         | `UUID`   | `7b3a1e2c-…` | Filtrar postulaciones de una convocatoria específica      |
| `ai_decision`    | `string` | `aprobado`   | Filtrar por decisión del motor IA                         |
| `human_decision` | `string` | `entrevista` | Filtrar por etapa del proceso de selección humano         |

**Response 200:**

```json
[
  {
    "id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
    "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
    "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
    "applied_date": "2026-03-16T14:22:00Z",
    "ai_score": "87.50",
    "ai_decision": "aprobado",
    "human_decision": "entrevista",
    "notes": "Candidato con perfil técnico sobresaliente. Agendar entrevista la semana del 23 de marzo."
  }
]
```

### POST /api/v1/aplicaciones/

Registra la postulación de un candidato a una convocatoria. Se invoca al final del flujo `Apply.tsx`.

**Request Body:**

```json
{
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
  "notes": "El candidato indicó disponibilidad inmediata y flexibilidad de horarios."
}
```

| Campo          | Tipo     | Requerido | Descripción                               |
|----------------|----------|:---------:|-------------------------------------------|
| `candidate_id` | `UUID`   | Sí        | UUID del candidato registrado             |
| `job_id`       | `UUID`   | Sí        | UUID de la convocatoria                   |
| `notes`        | `string` | No        | Notas adicionales del proceso             |

**Response 201:**

```json
{
  "id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
  "applied_date": "2026-03-17T15:45:00Z",
  "ai_score": null,
  "ai_decision": "pendiente",
  "human_decision": "nuevo",
  "notes": "El candidato indicó disponibilidad inmediata y flexibilidad de horarios."
}
```

**Response 409 — Postulación duplicada:**

```json
{
  "detail": "Este candidato ya tiene una postulación activa para esta convocatoria."
}
```

### PATCH /api/v1/aplicaciones/{application_id}/decision

El reclutador actualiza manualmente la etapa del proceso de selección para una postulación.

**Request Body:**

```json
{
  "human_decision": "entrevista",
  "notes": "Perfil técnico validado. Agendar entrevista para el 24 de marzo con el Gerente de Tienda."
}
```

| Campo            | Tipo     | Requerido | Valores posibles                                             |
|------------------|----------|:---------:|--------------------------------------------------------------|
| `human_decision` | `string` | No        | `nuevo`, `revisado`, `entrevista`, `aprobado`, `rechazado`   |
| `notes`          | `string` | No        | Observaciones del reclutador                                 |

**Ciclo de vida recomendado de `human_decision`:**

```
nuevo → revisado → entrevista → aprobado
                             → rechazado
```

**Response 200:** Objeto `ApplicationResponse` con los campos actualizados.

### PATCH /api/v1/aplicaciones/{application_id}/score

Actualiza el score calculado por el motor IA y la decisión automática. Típicamente invocado por el servicio IA internamente.

**Request Body:**

```json
{
  "ai_score": 87.50,
  "ai_decision": "aprobado"
}
```

| Campo         | Tipo      | Requerido | Rango / Valores posibles                      |
|---------------|-----------|:---------:|-----------------------------------------------|
| `ai_score`    | `decimal` | No        | 0.00 a 100.00                                 |
| `ai_decision` | `string`  | No        | `aprobado`, `rechazado`, `pendiente`          |

**Response 200:** Objeto `ApplicationResponse` con el score actualizado.

---

## Modulo: areas

**Prefijo:** `/api/v1/areas`
**Tag FastAPI:** `areas`
**Auth:** No requerida — datos de catálogo público.
**Descripción:** Proporciona el catálogo de áreas funcionales derivado dinámicamente de las convocatorias existentes. Alimenta los filtros del portal del candidato y las estadísticas del dashboard.

### Tabla de Endpoints

| Método | Ruta            | Descripción                                        | Auth requerida | Usado en                        |
|--------|-----------------|----------------------------------------------------|:--------------:|---------------------------------|
| `GET`  | `/areas/`       | Listar áreas únicas disponibles                    | No             | Index.tsx (filtro de área)      |
| `GET`  | `/areas/stats`  | Estadísticas de vacantes y postulaciones por área  | No             | AdminDashboard.tsx              |

### GET /api/v1/areas/

Retorna la lista de valores únicos del campo `area` de la tabla `jobs`. Usada para poblar el filtro de áreas en el portal del candidato.

**Response 200:**

```json
[
  "administracion",
  "barismo",
  "cocina",
  "logistica",
  "marketing",
  "rrhh",
  "servicio_al_cliente"
]
```

### GET /api/v1/areas/stats

Retorna estadísticas agrupadas por área: total de convocatorias activas y total de postulaciones recibidas.

**Response 200:**

```json
[
  {
    "area": "barismo",
    "total_jobs": 8,
    "total_aplicaciones": 234
  },
  {
    "area": "administracion",
    "total_jobs": 3,
    "total_aplicaciones": 87
  },
  {
    "area": "servicio_al_cliente",
    "total_jobs": 5,
    "total_aplicaciones": 156
  },
  {
    "area": "cocina",
    "total_jobs": 2,
    "total_aplicaciones": 45
  }
]
```

---

## Modulo: dashboard

**Prefijo:** `/api/v1/dashboard`
**Tag FastAPI:** `dashboard`
**Auth:** Todos los endpoints requieren token JWT válido.
**Descripción:** Proporciona métricas agregadas para el panel administrativo. Centraliza los KPIs del proceso de selección en tiempo real.

### Tabla de Endpoints

| Método | Ruta               | Descripción                                | Auth requerida | Usado en             |
|--------|--------------------|--------------------------------------------|:--------------:|----------------------|
| `GET`  | `/dashboard/stats` | Métricas generales del proceso de selección| Sí             | AdminDashboard.tsx   |

### GET /api/v1/dashboard/stats

Retorna las métricas principales del sistema de selección para el panel del administrador.

**Response 200:**

```json
{
  "total_jobs_activas": 12,
  "total_candidatos": 847,
  "total_aplicaciones": 1523,
  "aplicaciones_hoy": 34,
  "tasa_aprobacion": 23.5
}
```

| Campo               | Tipo    | Descripción                                                              |
|---------------------|---------|--------------------------------------------------------------------------|
| `total_jobs_activas`| `int`   | Convocatorias con `status = 'activa'`                                    |
| `total_candidatos`  | `int`   | Total de candidatos registrados en el sistema                            |
| `total_aplicaciones`| `int`   | Total de postulaciones en todos los estados                              |
| `aplicaciones_hoy`  | `int`   | Postulaciones recibidas durante el día actual                            |
| `tasa_aprobacion`   | `float` | Porcentaje de aplicaciones con `human_decision = 'aprobado'`             |

> **Próximas métricas (Sprint 2):** tiempo promedio de revisión, distribución por etapa (`human_decision`), tendencia de postulaciones por día (últimos 30 días) y top 5 convocatorias por número de aplicaciones.

---

## Modulo: ia

**Prefijo:** `/api/v1/ia`
**Tag FastAPI:** `ia`
**Auth:** Todos los endpoints requieren token JWT válido.
**Descripción:** Configuración y operación del motor de inteligencia artificial para scoring automático de candidatos. Incluye gestión de pesos, ejecución de scoring, métricas de precisión y casos de entrenamiento.

### Tabla de Endpoints

| Método | Ruta                          | Descripción                                           | Auth requerida | Usado en          |
|--------|-------------------------------|-------------------------------------------------------|:--------------:|-------------------|
| `GET`  | `/ia/weights`                 | Obtener configuración actual de pesos del motor IA    | Sí             | AdminIA.tsx       |
| `PUT`  | `/ia/weights/{weight_id}`     | Actualizar el peso de un criterio de evaluación       | Sí             | AdminIA.tsx       |
| `POST` | `/ia/score`                   | Calcular score IA para un candidato en una vacante    | Sí             | AdminIA.tsx       |
| `GET`  | `/ia/metrics`                 | Obtener métricas de precisión del motor IA            | Sí             | AdminIA.tsx       |
| `GET`  | `/ia/training-cases`          | Listar casos de entrenamiento con paginación          | Sí             | AdminIA.tsx       |
| `POST` | `/ia/training-cases`          | Registrar nuevo caso de entrenamiento                 | Sí             | AdminIA.tsx       |

### GET /api/v1/ia/weights

Retorna la configuración actual de los criterios de evaluación del motor IA, organizados por categoría.

**Response 200:**

```json
[
  {
    "id": "tecnico_espresso",
    "label": "Conocimiento en extracción de espresso",
    "description": "Evalúa el dominio técnico de parámetros de extracción: temperatura, presión, molienda y tiempos.",
    "weight": 30,
    "category": "tecnico"
  },
  {
    "id": "tecnico_metodos_alternativos",
    "label": "Métodos de preparación alternativos",
    "description": "V60, Chemex, AeroPress, Prensa Francesa, Cold Brew.",
    "weight": 15,
    "category": "tecnico"
  },
  {
    "id": "experiencia_anos",
    "label": "Años de experiencia en barismo",
    "description": "Número de años de experiencia documentada como barista en cafés de especialidad.",
    "weight": 25,
    "category": "experiencia"
  },
  {
    "id": "experiencia_certificaciones",
    "label": "Certificaciones especializadas",
    "description": "Certificaciones SCA, Q-Grader, SCAE o equivalentes.",
    "weight": 10,
    "category": "experiencia"
  },
  {
    "id": "cultural_servicio",
    "label": "Orientación al servicio al cliente",
    "description": "Indicadores de actitud, empatía y comunicación con el cliente.",
    "weight": 15,
    "category": "cultural"
  },
  {
    "id": "cultural_trabajo_equipo",
    "label": "Trabajo en equipo y adaptabilidad",
    "description": "Evidencia de colaboración efectiva en equipos de alto rendimiento.",
    "weight": 5,
    "category": "cultural"
  }
]
```

> Los pesos deben sumar 100 para garantizar un scoring normalizado. La validación de esta regla se implementará en Sprint 2.

### PUT /api/v1/ia/weights/{weight_id}

Actualiza la configuración de un criterio de evaluación del motor IA.

**Path Params:** `weight_id` — ID del criterio (ej: `tecnico_espresso`)

**Request Body:**

```json
{
  "weight": 35,
  "description": "Evalúa el dominio técnico avanzado de parámetros de extracción: temperatura, presión, molienda, tiempos y calibración de equipos La Marzocco."
}
```

| Campo         | Tipo      | Requerido | Descripción                                            |
|---------------|-----------|:---------:|--------------------------------------------------------|
| `label`       | `string`  | No        | Nombre legible del criterio (max 100 chars)            |
| `description` | `string`  | No        | Descripción detallada del criterio                     |
| `weight`      | `int`     | No        | Peso numérico del criterio (0-100)                     |
| `category`    | `string`  | No        | `tecnico`, `cultural`, `experiencia`                   |

**Response 200:** Objeto `AIWeightResponse` con los datos actualizados.

### POST /api/v1/ia/score

Dispara el cálculo del score IA para un par candidato-vacante específico. Retorna el puntaje total y el desglose por criterio.

**Request Body:**

```json
{
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901"
}
```

**Response 200:**

```json
{
  "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
  "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
  "score": "87.50",
  "decision": "aprobado",
  "breakdown": [
    {
      "criterion": "Conocimiento en extracción de espresso",
      "weight": 30,
      "raw_score": 92.0,
      "weighted_score": 27.6
    },
    {
      "criterion": "Métodos de preparación alternativos",
      "weight": 15,
      "raw_score": 80.0,
      "weighted_score": 12.0
    },
    {
      "criterion": "Años de experiencia en barismo",
      "weight": 25,
      "raw_score": 95.0,
      "weighted_score": 23.75
    },
    {
      "criterion": "Certificaciones especializadas",
      "weight": 10,
      "raw_score": 70.0,
      "weighted_score": 7.0
    },
    {
      "criterion": "Orientación al servicio al cliente",
      "weight": 15,
      "raw_score": 85.0,
      "weighted_score": 12.75
    },
    {
      "criterion": "Trabajo en equipo y adaptabilidad",
      "weight": 5,
      "raw_score": 80.0,
      "weighted_score": 4.0
    }
  ]
}
```

| Campo del response | Descripción                                                                    |
|--------------------|--------------------------------------------------------------------------------|
| `score`            | Puntaje final ponderado (0.00 a 100.00)                                        |
| `decision`         | Decisión automática: `aprobado` (score ≥ 70), `rechazado` (score < 50), `pendiente` (50-69) |
| `breakdown`        | Desglose por criterio con peso, puntaje bruto y puntaje ponderado              |

> **Estado en Sprint 1:** Implementación placeholder. El motor real de scoring (integración con LLM) se desarrolla en Sprint 2.

### GET /api/v1/ia/metrics

Retorna las métricas de precisión más recientes del motor IA, calculadas contra los casos de entrenamiento etiquetados.

**Response 200:**

```json
{
  "id": 42,
  "recorded_at": "2026-03-16T23:00:00Z",
  "precision": "0.84",
  "recall": "0.79",
  "f1_score": "0.81",
  "total_decisions": 350,
  "correct_decisions": 294,
  "training_cases": 180
}
```

| Campo               | Tipo      | Descripción                                                        |
|---------------------|-----------|--------------------------------------------------------------------|
| `precision`         | `decimal` | Proporción de decisiones IA correctas sobre el total de `aprobado` |
| `recall`            | `decimal` | Capacidad del modelo de encontrar todos los candidatos aprobables  |
| `f1_score`          | `decimal` | Media armónica de precisión y recall                               |
| `total_decisions`   | `int`     | Total de decisiones IA evaluadas en el período                     |
| `correct_decisions` | `int`     | Decisiones IA que coincidieron con la decisión humana              |
| `training_cases`    | `int`     | Número de casos de entrenamiento disponibles                       |

> **Meta del proyecto:** Mantener `precision` ≥ 0.80 en producción.

### GET /api/v1/ia/training-cases

Retorna la lista paginada de casos de entrenamiento etiquetados por el equipo de RRHH.

**Query Params:** `skip=0`, `limit=100`

**Response 200:**

```json
[
  {
    "id": 1,
    "candidate_id": "a1b2c3d4-e5f6-7890-ab12-cdef34567890",
    "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
    "ai_decision": "aprobado",
    "ai_score": "87.50",
    "human_decision": "aprobado",
    "is_correct": true,
    "reviewed_by": "55a7f340-1234-4567-890a-abcdef123456",
    "reviewed_date": "2026-03-15T10:00:00Z"
  },
  {
    "id": 2,
    "candidate_id": "b2c3d4e5-f6g7-8901-bc23-def456789012",
    "job_id": "7b3a1e2c-5f8d-4a9b-b2c1-d3e4f5678901",
    "ai_decision": "aprobado",
    "ai_score": "72.00",
    "human_decision": "rechazado",
    "is_correct": false,
    "reviewed_by": "55a7f340-1234-4567-890a-abcdef123456",
    "reviewed_date": "2026-03-15T10:15:00Z"
  }
]
```

### POST /api/v1/ia/training-cases

Registra un nuevo caso de entrenamiento etiquetado por un reclutador. Estos casos se usan para evaluar y reentrenar el motor IA.

**Request Body:**

```json
{
  "candidate_id": "c3d4e5f6-g7h8-9012-cd34-ef5678901234",
  "job_id": "8c4b2f3d-6g9e-5b0c-c3d2-e4f5g6789012",
  "ai_decision": "rechazado",
  "ai_score": "48.00",
  "human_decision": "aprobado",
  "is_correct": false,
  "reviewed_by": "55a7f340-1234-4567-890a-abcdef123456"
}
```

| Campo            | Tipo      | Requerido | Descripción                                                                |
|------------------|-----------|:---------:|----------------------------------------------------------------------------|
| `candidate_id`   | `UUID`    | Sí        | UUID del candidato evaluado                                                |
| `job_id`         | `UUID`    | Sí        | UUID de la convocatoria correspondiente                                    |
| `ai_decision`    | `string`  | No        | Decisión que tomó el motor IA: `aprobado`, `rechazado`, `pendiente`        |
| `ai_score`       | `decimal` | No        | Score calculado por el motor IA (0.00 a 100.00)                            |
| `human_decision` | `string`  | No        | Decisión final del reclutador: `aprobado`, `rechazado`                     |
| `is_correct`     | `boolean` | No        | `true` si la decisión IA coincide con la humana                            |
| `reviewed_by`    | `UUID`    | No        | UUID del usuario (reclutador/admin) que etiquetó el caso                   |

**Response 201:** Objeto `TrainingCaseResponse` con `reviewed_date` registrado automáticamente.

---

## Prioridad de Implementacion por Sprint

### Sprint 1 — Portal Público + Auth + Base Admin
**Entrega:** 20 de marzo de 2026
**Objetivo:** Portal candidato funcional y autenticación operativa.

| Prioridad | Endpoint                                          | Justificación                                              |
|:---------:|---------------------------------------------------|------------------------------------------------------------|
| 1         | `POST /auth/login`                                | Bloquea acceso al panel admin                              |
| 2         | `GET /convocatorias/`                             | Listado principal del portal candidato (Index.tsx)         |
| 3         | `GET /convocatorias/{job_id}`                     | Detalle de vacante (JobDetail.tsx)                         |
| 4         | `PATCH /convocatorias/{job_id}/views`             | Contador de visitas del portal                             |
| 5         | `GET /areas/`                                     | Filtros de área en el portal candidato                     |
| 6         | `POST /candidatos/`                               | Registro del candidato (Apply.tsx — paso 1)                |
| 7         | `POST /aplicaciones/`                             | Postulación final (Apply.tsx — paso final)                 |
| 8         | `GET /dashboard/stats`                            | Métricas básicas para AdminDashboard.tsx                   |
| 9         | `GET /convocatorias/` (admin filters)             | Gestión de convocatorias en AdminConvocatorias.tsx         |
| 10        | `POST /convocatorias/`                            | Crear nueva convocatoria desde el admin                    |
| 11        | `PUT /convocatorias/{job_id}`                     | Editar convocatoria desde AdminConvocatoriaForm.tsx        |
| 12        | `POST /convocatorias/{job_id}/requirements`       | Agregar requisitos a la convocatoria                       |
| 13        | `DELETE /convocatorias/{job_id}`                  | Eliminar convocatoria desde el admin                       |

### Sprint 2 — IA + Panel Admin Completo
**Entrega:** 13 de abril de 2026
**Objetivo:** Motor IA operativo, gestión completa de candidatos y decisiones de selección.

| Prioridad | Endpoint                                          | Justificación                                              |
|:---------:|---------------------------------------------------|------------------------------------------------------------|
| 14        | `GET /aplicaciones/`                              | Listado de postulaciones para AdminCandidatos.tsx          |
| 15        | `PATCH /aplicaciones/{id}/decision`               | Flujo de decisión humana del reclutador                    |
| 16        | `GET /candidatos/`                                | Listado de candidatos para AdminCandidatos.tsx             |
| 17        | `GET /candidatos/{candidate_id}`                  | Perfil completo en modal de AdminCandidatos.tsx            |
| 18        | `POST /candidatos/{id}/experience`                | Enriquecer perfil desde el flujo Apply.tsx                 |
| 19        | `POST /candidatos/{id}/education`                 | Enriquecer perfil desde el flujo Apply.tsx                 |
| 20        | `POST /candidatos/{id}/languages`                 | Enriquecer perfil desde el flujo Apply.tsx                 |
| 21        | `GET /ia/weights`                                 | Configuración de pesos en AdminIA.tsx                      |
| 22        | `PUT /ia/weights/{weight_id}`                     | Ajuste de criterios de scoring en AdminIA.tsx              |
| 23        | `POST /ia/score`                                  | Scoring automático de candidatos                           |
| 24        | `PATCH /aplicaciones/{id}/score`                  | Registrar resultado del scoring IA                         |
| 25        | `GET /ia/metrics`                                 | Métricas de precisión en AdminIA.tsx                       |
| 26        | `GET /ia/training-cases`                          | Revisión de casos de entrenamiento                         |
| 27        | `POST /ia/training-cases`                         | Registrar correcciones del reclutador                      |

### Sprint 3 — Base de Datos + Comunicaciones + Estabilización
**Entrega:** 4 de mayo de 2026
**Objetivo:** Módulos restantes, notificaciones y preparación para UAT.

| Prioridad | Endpoint                               | Justificación                                          |
|:---------:|----------------------------------------|--------------------------------------------------------|
| 28        | `GET /areas/stats`                     | Estadísticas avanzadas del dashboard                   |
| 29        | `GET /usuarios/`                       | Gestión de usuarios en AdminConfiguracion.tsx          |
| 30        | `POST /usuarios/`                      | Crear nuevos usuarios internos                         |
| 31        | `PUT /usuarios/{user_id}`              | Actualizar usuarios internos                           |
| 32        | `DELETE /usuarios/{user_id}`           | Eliminar usuarios internos                             |
| 33        | `GET /aplicaciones/{application_id}`   | Detalle de postulación individual                      |
| 34        | `GET /usuarios/{user_id}`              | Detalle de perfil de usuario                           |
| 35        | `PUT /candidatos/{candidate_id}`       | Edición de datos básicos del candidato desde el admin  |

---

## Health Check

| Método | Ruta | Descripción               | Auth requerida |
|--------|------|---------------------------|:--------------:|
| `GET`  | `/`  | Estado del servicio (ping)| No             |

**Response 200:**

```json
{
  "status": "ok",
  "service": "CQ Talent Gateway API"
}
```

---

## Apendice — Variables de Entorno Requeridas

| Variable                      | Descripción                           | Valor de ejemplo                                        |
|-------------------------------|---------------------------------------|---------------------------------------------------------|
| `DATABASE_URL`                | Cadena de conexión PostgreSQL         | `postgresql+asyncpg://user:pass@localhost:5432/talent_gateway` |
| `SECRET_KEY`                  | Clave para firma de JWT               | Cadena aleatoria de 64+ caracteres (hex o base64)       |
| `ALGORITHM`                   | Algoritmo de firma JWT                | `HS256`                                                 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token en minutos         | `30` (dev) / `480` (prod — 8 horas)                     |
| `ENVIRONMENT`                 | Entorno de ejecución                  | `development` / `production`                            |

---

*Documento generado el 2026-03-17 — Sprint 1 activo (entrega 20 mar 2026)*
*Próxima revisión: inicio de Sprint 2 — 21 mar 2026*
