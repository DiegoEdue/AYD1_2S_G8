# Manual Técnico — Backend EduConnect - G8

> **Servidor:** `server/` — Node.js + Express + PostgreSQL
> **Base URL:** `http://localhost:4000/api`

---

## Índice

- [Manual Técnico — Backend EduConnect - G8](#manual-técnico--backend-educonnect---g8)
  - [Índice](#índice)
  - [1. Dependencias y convenciones comunes](#1-dependencias-y-convenciones-comunes)
  - [2. Registro de Tutores y Estudiantes](#2-registro-de-tutores-y-estudiantes)
    - [2.1 Registro de Tutores](#21-registro-de-tutores)
      - [Body (JSON, todos requeridos)](#body-json-todos-requeridos)
      - [Flujo de ejecución](#flujo-de-ejecución)
      - [Respuestas](#respuestas)
    - [2.2 Registro de Estudiantes](#22-registro-de-estudiantes)
      - [Body (JSON)](#body-json)
      - [Flujo de ejecución](#flujo-de-ejecución-1)
      - [Respuestas](#respuestas-1)
  - [3. Módulo Administrador](#3-módulo-administrador)
    - [3.1 Historias de Usuario (HU-005 a HU-008)](#31-historias-de-usuario-hu-005-a-hu-008)
      - [\[HU-005\] Aprobación o Rechazo de Estudiantes](#hu-005-aprobación-o-rechazo-de-estudiantes)
      - [\[HU-006\] Aprobación o Rechazo de Tutores](#hu-006-aprobación-o-rechazo-de-tutores)
      - [\[HU-007\] Gestión y Baja de Estudiantes Aprobados](#hu-007-gestión-y-baja-de-estudiantes-aprobados)
      - [\[HU-008\] Gestión y Baja de Tutores Aprobados](#hu-008-gestión-y-baja-de-tutores-aprobados)
    - [3.2 Endpoints](#32-endpoints)
    - [3.3 Autenticación con Doble Factor (2FA/TOTP)](#33-autenticación-con-doble-factor-2fatotp)
      - [Utilidades de soporte (`utils/twoFactor.js`)](#utilidades-de-soporte-utilstwofactorjs)
      - [`loginAdmin` — `POST /api/admin/login`](#loginadmin--post-apiadminlogin)
      - [`verify2fa` — `POST /api/admin/verify-2fa`](#verify2fa--post-apiadminverify-2fa)
      - [`getProfileAdmin` — `GET /api/admin/profile`](#getprofileadmin--get-apiadminprofile)
    - [3.4 Generación de Reportes Analíticos](#34-generación-de-reportes-analíticos)
      - [`getReports` — `GET /api/admin/reportes`](#getreports--get-apiadminreportes)
    - [3.5 Funciones complementarias de administración](#35-funciones-complementarias-de-administración)
    - [3.6 Guía de pruebas (backend)](#36-guía-de-pruebas-backend)
  - [4. Módulo Tutor](#4-módulo-tutor)
    - [4.1 Registro y Login](#41-registro-y-login)
      - [Login — `POST /api/tutor/login` (pública)](#login--post-apitutorlogin-pública)
    - [4.2 Perfil](#42-perfil)
      - [Obtener perfil — `GET /api/tutor/profile`](#obtener-perfil--get-apitutorprofile)
      - [Actualizar perfil — `PATCH /api/tutor/profile`](#actualizar-perfil--patch-apitutorprofile)
    - [4.3 Horario de Atención (HU-010 / HU-011)](#43-horario-de-atención-hu-010--hu-011)
      - [Obtener horario — `GET /api/tutor/schedule`](#obtener-horario--get-apitutorschedule)
      - [Crear / actualizar horario (upsert) — `PUT /api/tutor/schedule`](#crear--actualizar-horario-upsert--put-apitutorschedule)
    - [4.4 Sesiones del Tutor](#44-sesiones-del-tutor)
      - [Pendientes (HU-012) — `GET /api/tutor/sessions/pending`](#pendientes-hu-012--get-apitutorsessionspending)
      - [Atender sesión (HU-013) — `PATCH /api/tutor/sessions/:id/attend`](#atender-sesión-hu-013--patch-apitutorsessionsidattend)
      - [Cancelar sesión (HU-014) — `PATCH /api/tutor/sessions/:id/cancel` (sin body)](#cancelar-sesión-hu-014--patch-apitutorsessionsidcancel-sin-body)
      - [Historial (HU-015) — `GET /api/tutor/sessions/history?page=&pageSize=`](#historial-hu-015--get-apitutorsessionshistorypagepagesize)
    - [4.5 Auth y errores (resumen tutor)](#45-auth-y-errores-resumen-tutor)
  - [5. Módulo Estudiante](#5-módulo-estudiante)
    - [5.1 Registro y Login](#51-registro-y-login)
      - [Login — `POST /api/estudiante/login` (pública)](#login--post-apiestudiantelogin-pública)
    - [5.2 Perfil (HU-024)](#52-perfil-hu-024)
      - [Actualizar perfil — `PUT /api/student/profile`](#actualizar-perfil--put-apistudentprofile)
    - [5.3 Catálogo y disponibilidad (HU-017 / HU-018 / HU-019)](#53-catálogo-y-disponibilidad-hu-017--hu-018--hu-019)
      - [Catálogo — `GET /api/student/catalog`](#catálogo--get-apistudentcatalog)
      - [Búsqueda avanzada — `GET /api/student/catalog/search`](#búsqueda-avanzada--get-apistudentcatalogsearch)
      - [Disponibilidad por fecha — `GET /api/student/tutor/:idTutor/availability?date=YYYY-MM-DD`](#disponibilidad-por-fecha--get-apistudenttutoridtutoravailabilitydateyyyy-mm-dd)
    - [5.4 Sesiones del Estudiante (HU-020 a HU-023)](#54-sesiones-del-estudiante-hu-020-a-hu-023)
      - [Crear sesión — `POST /api/student/sessions`](#crear-sesión--post-apistudentsessions)
      - [Activas / historial](#activas--historial)
      - [Cancelar sesión (HU-022) — `PATCH /api/student/sessions/:id/cancel`](#cancelar-sesión-hu-022--patch-apistudentsessionsidcancel)
    - [5.5 Auth y errores (resumen estudiante)](#55-auth-y-errores-resumen-estudiante)
  - [6. Arquitectura del cliente (frontend)](#6-arquitectura-del-cliente-frontend)
    - [6.1 Stack tecnológico y runtime](#61-stack-tecnológico-y-runtime)
    - [6.2 Estructura de carpetas del cliente](#62-estructura-de-carpetas-del-cliente)
    - [6.3 Autenticación y sesión del usuario](#63-autenticación-y-sesión-del-usuario)
    - [6.4 API client y manejo de errores](#64-api-client-y-manejo-de-errores)
    - [6.5 Routing por rol y navegación](#65-routing-por-rol-y-navegación)
    - [6.6 Estilos y componentes reutilizables](#66-estilos-y-componentes-reutilizables)
    - [6.7 Consideraciones de calidad y despliegue](#67-consideraciones-de-calidad-y-despliegue)
  - [7. Docker y entorno de desarrollo](#7-docker-y-entorno-de-desarrollo)
    - [7.1 Arquitectura del entorno](#71-arquitectura-del-entorno)
      - [Diagrama](#diagrama)
      - [Archivos](#archivos)
      - [Componentes](#componentes)
    - [7.2 Puesta en marcha](#72-puesta-en-marcha)
      - [Prerrequisitos](#prerrequisitos)
      - [Variables de entorno](#variables-de-entorno)
      - [Arranque y verificación](#arranque-y-verificación)
    - [7.3 Referencia de comandos](#73-referencia-de-comandos)
      - [Ciclo de vida](#ciclo-de-vida)
      - [Inspección](#inspección)
    - [7.4 Troubleshooting](#74-troubleshooting)
      - [Puerto ocupado (`EADDRINUSE :4000`)](#puerto-ocupado-eaddrinuse-4000)
      - [`Cannot find module` tras `up`](#cannot-find-module-tras-up)
      - [Next roto / `.next` corrupto](#next-roto--next-corrupto)
      - [`EACCES` en `server/`](#eacces-en-server)
      - [Frontend `fetch failed / Network error`](#frontend-fetch-failed--network-error)
      - [`.env` sin efecto](#env-sin-efecto)
      - [`npm install` lento en cada build](#npm-install-lento-en-cada-build)
  - [8. Referencias cruzadas](#8-referencias-cruzadas)

---

## 1. Dependencias y convenciones comunes

| Dependencia                 | Uso                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `bcryptjs`                  | Hash y comparación de contraseñas (costo 10).                                                                |
| `jsonwebtoken`              | Emisión y verificación de tokens JWT (expiración 8h).                                                        |
| `postgres` (`config/db`)    | Queries con tagged templates (`sql\`...\``).                                                                 |
| `pg` (`config/db`)          | Queries parametrizadas clásicas (`db.query` / `db.pool`).                                                    |
| `../utils/cloudinaryUpload` | Subida de fotos a Cloudinary (recibe data-URI, devuelve `secure_url`).                                       |
| `../middlewares/auth`       | `verifyToken`, `isTutor`, `isEstudiante`, `isAdmin` y `JWT_SECRET`. Sin token → `401`; rol distinto → `403`. |
| `../utils/twoFactor`        | Generación/cifrado de secretos TOTP, QR y verificación (detallado en §3.3).                                  |
| `../services/email`         | Envío de correos por Resend (aprobación, rechazo, baja, cancelación).                                        |

**Autenticación por rol (JWT, payload y middleware):**

| Rol        | Payload JWT                                          | Middleware                   |
| ---------- | ---------------------------------------------------- | ---------------------------- |
| Admin      | `{ id, nombre_usuario, rol:'admin' }`                | `verifyToken + isAdmin`      |
| Tutor      | `{ id, correo, rol:'tutor', nombre, apellido }`      | `verifyToken + isTutor`      |
| Estudiante | `{ id, correo, rol:'estudiante', nombre, apellido }` | `verifyToken + isEstudiante` |

---

## 2. Registro de Tutores y Estudiantes

### 2.1 Registro de Tutores

**Archivo:** `controllers/registro.tutor.js`
**Ruta:** `POST /api/tutor/registro` → `registroTutor` — **pública**

#### Body (JSON, todos requeridos)

| Campo                         | Tipo                   | Notas                                                                               |
| ----------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `nombre`, `apellido`          | string                 | —                                                                                   |
| `carnet_id`                   | string                 | único, ej. `T-001`                                                                  |
| `fecha_nacimiento`            | string `YYYY-MM-DD`    | —                                                                                   |
| `genero`                      | string                 | ej. `M` / `F`                                                                       |
| `direccion`, `telefono`       | string                 | —                                                                                   |
| `foto_url`                    | string base64 data-URL | se sube a Cloudinary (`educonnect/tutores`), límite global JSON 15 MB               |
| `numero_identificacion_tutor` | string                 | único                                                                               |
| `direccion_tutoria`           | string                 | ej. `Online` / dirección física                                                     |
| `correo`                      | string                 | regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, único por tabla `tutor`                       |
| `password`                    | string                 | `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/` (mín. 8, al menos una letra y un número) |
| `anio_inicio_tutorias`        | integer                | check DB 1950–año actual                                                            |
| `universidad_graduacion`      | string                 | —                                                                                   |
| `especialidad`                | string CSV             | ej. `"Matemática Básica, Programación I"`                                           |

#### Flujo de ejecución

1. Desestructura los campos del `req.body`.
2. Valida presencia de **todos** los campos → `400 "Todos los campos son requeridos"`.
3. Valida formato del correo → `400 "Correo electrónico inválido"`.
4. Valida contraseña con la regex indicada → `400` con mensaje descriptivo.
5. Genera el hash con `bcrypt.hash(password, 10)`.
6. **Verificaciones de unicidad** (cada una devuelve `400` si existe): `carnet_id`, `numero_identificacion_tutor`, `correo`.
7. Sube la foto a Cloudinary con `subirImagen(foto_url, 'educonnect/tutores')`. Si Cloudinary falla, se revierte todo (el `throw` cae en el `catch`).
8. **Transacción** `sql.begin`:
   1. `INSERT INTO tutor ... RETURNING id_tutor, nombre, apellido, carnet_id, correo`.
   2. `INSERT INTO solicitud (id_tutor, estado='pendiente', tipo_usuario='tutor')`.
   3. `especialidad` se interpreta como lista separada por comas: crea cada `materia` si no existe (`ON CONFLICT (nombre) DO NOTHING`) y la asocia en `tutor_materia` (`ON CONFLICT DO NOTHING`).
9. Responde `201` con el tutor y la solicitud creados.

#### Respuestas

`201`

```json
{
  "message": "Tutor registrado exitosamente",
  "tutor": {
    "id_tutor": 1,
    "nombre": "Carlos",
    "apellido": "López",
    "carnet_id": "T-001",
    "correo": "carlos@correo.com"
  },
  "solicitud": {
    "id": 1,
    "id_tutor": 1,
    "estado": "pendiente",
    "tipo_usuario": "tutor",
    "fecha_solicitud": "..."
  }
}
```

| Código | Caso                                                                                                                                                                                     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `201`  | Registro exitoso — `{ message, tutor, solicitud }`                                                                                                                                       |
| `400`  | Campos faltantes / correo inválido / password débil / `"El carnet ya está registrado"` / `"El número de identificación del tutor ya está registrado"` / `"El correo ya está registrado"` |
| `500`  | Error interno / fallo de Cloudinary / base de datos                                                                                                                                      |

**Manejo de errores:** `error.code === '23505'` (violación de UNIQUE, condición de carrera) → `400 "El tutor ya está registrado"`; otro error → `500 "Error al registrar tutor"`.

> **Nota:** el tutor queda con `estado_aprobacion='pendiente'` (default de la tabla); la `solicitud` queda `pendiente` hasta que el admin la procese (ver §3).

```bash
curl -X POST http://localhost:4000/api/tutor/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Carlos","apellido":"López","carnet_id":"T-001",
    "fecha_nacimiento":"1990-03-20","genero":"M",
    "direccion":"Zona 10","telefono":"55552222",
    "foto_url":"data:image/jpeg;base64,...",
    "numero_identificacion_tutor":"ID-9001","direccion_tutoria":"Online",
    "correo":"carlos@correo.com","password":"Pass1234",
    "anio_inicio_tutorias":2015,"universidad_graduacion":"USAC",
    "especialidad":"Matemática Básica, Programación I"
  }'
```

---

### 2.2 Registro de Estudiantes

**Archivo:** `controllers/registro.estudiante.js`
**Ruta:** `POST /api/student/register` (alias `POST /api/estudiante/register`) → `registerStudent` — **pública**

#### Body (JSON)

| Campo                   | Tipo                   | Notas                                                                  |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `nombre`, `apellido`    | string                 | requeridos                                                             |
| `carnet`                | string                 | requerido, único, ej. `202312345`                                      |
| `genero`                | string                 | requerido                                                              |
| `direccion`, `telefono` | string                 | requeridos                                                             |
| `fecha_nacimiento`      | string `YYYY-MM-DD`    | requerida                                                              |
| `foto_url`              | string base64 data-URL | requerida, se sube a Cloudinary `educonnect/estudiantes`, límite 15 MB |
| `correo`                | string                 | requerido, regex email (misma que tutor), único en `estudiante`        |
| `password`              | string                 | `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/` (misma política que tutor)  |

#### Flujo de ejecución

1. Desestructura los campos del `req.body`.
2. Valida que **todos** estén presentes → `400 "Todos los campos son obligatorios"`.
3. Valida formato de correo → `400`.
4. Valida la contraseña → `400`.
5. `bcrypt.hash(password, 10)`.
6. Verifica unicidad de `correo` → `400 "El correo electrónico ya está registrado"`, y de `carnet` → `400 "El carnet ya está registrado"`.
7. Sube la foto a Cloudinary en `educonnect/estudiantes`.
8. **Transacción** `sql.begin`:
   1. `INSERT INTO estudiante ... RETURNING id_estudiante, nombre, apellido, carnet, correo`.
   2. `INSERT INTO solicitud (id_estudiante, estado='pendiente', tipo_usuario='estudiante')`.
9. Responde `201` con `{ message, student, solicitud }`. Nunca se retorna `password_hash`.

#### Respuestas

`201`

```json
{
  "message": "Estudiante registrado exitosamente",
  "student": {
    "id_estudiante": 1,
    "nombre": "Ana",
    "apellido": "Pérez",
    "carnet": "202312345",
    "correo": "ana@correo.com"
  },
  "solicitud": {
    "id": 1,
    "id_estudiante": 1,
    "estado": "pendiente",
    "tipo_usuario": "estudiante"
  }
}
```

| Código | Caso                                                       |
| ------ | ---------------------------------------------------------- |
| `201`  | Registro exitoso — `{ message, student, solicitud }`       |
| `400`  | Campos faltantes, correo/contraseña inválidos o duplicados |
| `500`  | Error interno                                              |

**Manejo de errores:** `23505` → `400 "El correo o el carnet ya están registrados"` (protege contra carreras); otro → `500 "Error al registrar el estudiante"`.

```bash
curl -X POST http://localhost:4000/api/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Ana","apellido":"Pérez","carnet":"202312345",
    "genero":"F","direccion":"Zona 1, Mixco","telefono":"55551111",
    "fecha_nacimiento":"2002-05-10","foto_url":"data:image/jpeg;base64,...",
    "correo":"ana@correo.com","password":"Pass1234"
  }'
```

---

## 3. Módulo Administrador

**Archivo:** `controllers/admin.js`
**Rutas:** `routes/admin.routes.js` (montadas bajo `/api/admin`)
Todos los endpoints, salvo login y verify-2fa, están protegidos con `verifyToken` + `isAdmin` exigiendo `Authorization: Bearer <token_jwt>`.

```
POST /api/admin/login                      → loginAdmin       (público)
POST /api/admin/verify-2fa                 → verify2fa        (público)
─── a partir de aquí: verifyToken + isAdmin ───
GET  /api/admin/profile                    → getProfileAdmin
GET  /api/admin/students/pending           → getPendingStudents
GET  /api/admin/solicitudes                → getPendingStudents
PUT  /api/admin/students/:id/approve       → approveStudent
PUT  /api/admin/students/:id/reject        → rejectStudent
PATCH /api/admin/solicitudes/:id/aprobar   → approveStudent
PATCH /api/admin/solicitudes/:id/rechazar  → rejectStudent
GET  /api/admin/students/approved          → getApprovedStudents
PUT  /api/admin/students/:id/deactivate    → deactivateStudent
GET  /api/admin/tutors/approved            → getApprovedTutors
PUT  /api/admin/tutors/:id/deactivate      → deactivateTutor
GET  /api/admin/usuarios                   → getUsers
PATCH /api/admin/usuarios/:id/dar-de-baja  → deactivateUser
GET  /api/admin/reportes                   → getReports       (reportes analíticos)
```

### 3.1 Historias de Usuario (HU-005 a HU-008)

#### [HU-005] Aprobación o Rechazo de Estudiantes

- **Como** Administrador, **quiero** revisar el listado de estudiantes pendientes de aprobación **para** dar de alta o rechazar sus solicitudes de registro.
- **Criterios de aceptación:**
  1. Lista de pendientes con: fotografía (o imagen por defecto), nombre completo, carnet, género, fecha de nacimiento y correo electrónico.
  2. Cada registro cuenta con botones "Aceptar" y "Rechazar".
  3. "Aceptar" → estado `Aprobado` (puede iniciar sesión); "Rechazar" → estado `Rechazado`.
  4. El sistema envía correo automático notificando aprobación o rechazo.

#### [HU-006] Aprobación o Rechazo de Tutores

- **Como** Administrador, **quiero** examinar la lista de tutores pendientes de validación **para** autorizar o denegar su incorporación al cuerpo docente.
- **Criterios de aceptación:**
  1. Lista de tutores pendientes con: fotografía obligatoria, nombre completo, carnet/ID, género, especialidad, número de identificación de tutor y correo.
  2. Opciones claras de "Aceptar" y "Rechazar".
  3. Al aprobar, la cuenta se activa para iniciar sesión; al rechazar, queda inhabilitada.
  4. El sistema envía correo automático de notificación al tutor.

#### [HU-007] Gestión y Baja de Estudiantes Aprobados

- **Como** Administrador, **quiero** visualizar a todos los estudiantes activos, **para** poder darlos de baja por faltas o motivos válidos.
- **Criterios de aceptación:**
  1. Listado completo de estudiantes aprobados.
  2. Botón de "Dar de baja" por usuario.
  3. El sistema pide confirmación antes de procesar la baja, cambia el estado a "Dado de baja", impide el acceso y envía correo de notificación.

#### [HU-008] Gestión y Baja de Tutores Aprobados

- **Como** Administrador, **quiero** consultar la lista de tutores activos, **para** poder suspender o dar de baja a quienes no cumplan las políticas institucionales.
- **Criterios de aceptación:**
  1. Listado de tutores aceptados con sus datos principales.
  2. Botón de "Dar de baja" por tutor.
  3. El sistema pide confirmación, cambia el estado a "Dado de baja", impide el acceso y envía correo de notificación.

### 3.2 Endpoints

| Método  | Endpoint                                                                   | Descripción                                        | Body / Parámetros                 | Respuesta exitosa                                              |
| ------- | -------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------- | -------------------------------------------------------------- |
| `POST`  | `/api/admin/login`                                                         | Paso 1/2 del login (ver §3.3)                      | `{ nombre_usuario, password }`    | `200` `pending_2fa_setup` / `pending_2fa_verify`               |
| `POST`  | `/api/admin/verify-2fa`                                                    | Paso 2/2 del login, emite JWT                      | `{ adminId, token }`              | `200` `{ status, token, user }`                                |
| `GET`   | `/api/admin/profile`                                                       | Perfil del admin autenticado                       | N/A                               | `{ id_administrador, nombre_usuario, two_factor_enable, rol }` |
| `GET`   | `/api/admin/students/pending` (alias `/solicitudes`)                       | Solicitudes pendientes de estudiantes y tutores    | N/A                               | `{ status: "success", data: [...] }`                           |
| `PUT`   | `/api/admin/students/:id/approve` (alias `PATCH /solicitudes/:id/aprobar`) | Aprobar estudiante o tutor                         | Body opcional: `{ rol: "tutor" }` | `{ status: "success", message: "...aprobado exitosamente" }`   |
| `PUT`   | `/api/admin/students/:id/reject` (alias `PATCH /solicitudes/:id/rechazar`) | Rechazar estudiante o tutor                        | `{ motivo: "..." }`               | `{ status: "success", message: "...rechazado exitosamente" }`  |
| `GET`   | `/api/admin/students/approved`                                             | Lista de estudiantes aprobados                     | N/A                               | `{ status: "success", count, data: [...] }`                    |
| `PUT`   | `/api/admin/students/:id/deactivate`                                       | Dar de baja y eliminar físicamente a un estudiante | `{ motivo: "..." }`               | `{ status: "success", message: "...eliminado exitosamente" }`  |
| `GET`   | `/api/admin/tutors/approved`                                               | Lista de tutores aprobados (incluye horarios)      | N/A                               | `{ status: "success", count, data: [...] }`                    |
| `PUT`   | `/api/admin/tutors/:id/deactivate`                                         | Dar de baja y eliminar físicamente a un tutor      | `{ motivo: "..." }`               | `{ status: "success", message: "...eliminado exitosamente" }`  |
| `GET`   | `/api/admin/usuarios?rol=estudiante\|tutor`                                | Lista usuarios activos por rol                     | N/A                               | `{ data: [...] }`                                              |
| `PATCH` | `/api/admin/usuarios/:id/dar-de-baja`                                      | Dispatcher de baja por rol del body                | `{ rol }`                         | delega a `deactivateTutor`/`deactivateStudent`                 |
| `GET`   | `/api/admin/reportes`                                                      | Reportes analíticos agregados                      | N/A                               | ver §3.4                                                       |

### 3.3 Autenticación con Doble Factor (2FA/TOTP)

Implementa 2FA **TOTP** (RFC 6238): la primera vez se genera el secreto y se muestra el QR; en las siguientes se pide el código. Una vez validado el primer código, el 2FA queda habilitado permanentemente. El JWT **nunca** se emite en `loginAdmin`; se emite solo en `verify2fa` (login es un "paso 1 de 2").

#### Utilidades de soporte (`utils/twoFactor.js`)

| Función                              | Descripción                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `generateSecret()`                   | Genera secreto TOTP con `otplib.authenticator`.                     |
| `encryptSecret(secret)`              | Cifra con **AES-256-GCM**; devuelve `"iv:tag:encrypted"` en base64. |
| `decryptSecret(stored)`              | Descifra; lanza error si el formato no coincide.                    |
| `generateQrDataUrl(secret, usuario)` | Genera URI `otpauth://` (issuer `EduConnect`) y data-URL del QR.    |
| `verifyTotp(secret, token)`          | Verifica TOTP con **ventana de ±1 paso** (tolera desfase de reloj). |

La clave de cifrado proviene de `OTP_ENCRYPTION_KEY` (32 bytes UTF-8 o 64 chars hex); ausencia o longitud inválida lanza error.

#### `loginAdmin` — `POST /api/admin/login`

**Entrada:** `{ nombre_usuario, password }`

1. Valida ambos campos → `400`.
2. Busca el admin por `nombre_usuario` (trim) → no existe → `401 "Nombre de usuario o contraseña incorrectos"` (no revela cuál falló, evita enumeración).
3. `comparePassword` con bcrypt → `401` si no coincide.
4. **Caso A — 2FA no habilitado:** genera y cifra el secreto, genera el QR, responde `200` con `status: 'pending_2fa_setup'`, `adminId`, el secreto plano (para ingreso manual), `qr_code` y `qr_code_url`.
5. **Caso B — 2FA habilitado:** responde `200` con `status: 'pending_2fa_verify'` y `adminId`.

#### `verify2fa` — `POST /api/admin/verify-2fa`

**Entrada:** `{ adminId, token }`

1. Falta `adminId` o `token` → `400`.
2. Admin no existe → `404 "Administrador no encontrado"`; sin secreto configurado → `400`.
3. `decryptSecret` corrupto → `500 "Error al desencriptar el secreto 2FA. Verifique OTP_ENCRYPTION_KEY."`.
4. `verifyTotp` inválido/expirado → `401 "Código de verificación inválido o expirado"`.
5. Si era el primer setup → `UPDATE administrador SET two_factor_enable = TRUE` (queda permanente).
6. Firma el JWT: `jwt.sign({ id, nombre_usuario, rol: 'admin' }, JWT_SECRET, { expiresIn: '8h' })`.
7. Responde `200` con `status: 'success'`, `token` y `user`.

**Secuencia de login con 2FA:**

```
POST /api/admin/login  ──►  pending_2fa_setup   (1ª vez: QR + secret)
                         │  pending_2fa_verify  (habitual: code)
POST /api/admin/verify-2fa ──► success + JWT (válido 8h)
```

Headers para rutas protegidas: `Authorization: Bearer <token>`.

#### `getProfileAdmin` — `GET /api/admin/profile`

Toma `req.user.id` del token y devuelve `id_administrador, nombre_usuario, two_factor_enable` + `rol: 'admin'`. `404` si el admin ya no existe. Nunca devuelve `password_hash` ni `two_factor_secret`.

### 3.4 Generación de Reportes Analíticos

#### `getReports` — `GET /api/admin/reportes`

Ejecuta **4 consultas en paralelo** (`Promise.all`):

| Sección      | Consulta                                                                                        | Significado                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `totales`    | `COUNT(*)` sesiones, `COUNT(DISTINCT id_estudiante)`, `COUNT(DISTINCT id_tutor)` sobre `sesion` | Totales globales del sistema.                                                               |
| `porEstado`  | `GROUP BY estado`                                                                               | Distribución de sesiones (`Activa`, `Atendida`, `Cancelada_Estudiante`, `Cancelada_Tutor`). |
| `porMateria` | Sesiones `'Atendida'` agrupadas por `m.nombre`, orden descendente                               | Materias más atendidas.                                                                     |
| `porTutor`   | Sesiones `'Atendida'` agrupadas por tutor, orden descendente                                    | Ranking de tutores por sesiones atendidas.                                                  |

```json
{
  "status": "success",
  "data": {
    "totales": { "sesiones": 0, "estudiantes": 0, "tutores": 0 },
    "porEstado": [{ "estado": "...", "cantidad": 0 }],
    "porMateria": [{ "materia": "...", "cantidad": 0 }],
    "porTutor": [{ "tutor": "...", "sesiones": 0 }]
  }
}
```

Errores → `500 "Error interno al generar reportes"`.

### 3.5 Funciones complementarias de administración

| Función               | Ruta                                                          | Propósito                                                                                                                                                  | Detalle clave                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getPendingStudents`  | `GET /students/pending`, `GET /solicitudes`                   | Lista solicitudes pendientes de estudiantes y tutores (UNION ALL normalizado, `estado_aprobacion`/`estado` = `pendiente`), ordenadas por `fecha_registro`. | Devuelve `count` + `data`.                                                                                                                                                                                                                 |
| `approveStudent`      | `PUT /students/:id/approve`, `PATCH /solicitudes/:id/aprobar` | Aprueba a un estudiante **o** tutor (`rol` en body, default `'estudiante'`).                                                                               | `estado_aprobacion='aprobado'`, solicitud `'aceptada'` + `fecha_procesado`. Envía `sendApprovalEmail(approved:true)` fire-and-forget.                                                                                                      |
| `rejectStudent`       | `PUT /students/:id/reject`, `PATCH /solicitudes/:id/rechazar` | Rechaza a un estudiante o tutor con `motivo`.                                                                                                              | Estado `'rechazado'`, solicitud `'rechazada'` + `motivo_rechazo`. Envía `sendApprovalEmail(approved:false, reason)`.                                                                                                                       |
| `getApprovedStudents` | `GET /students/approved`                                      | Lista estudiantes `'aprobado'` ordenados por nombre.                                                                                                       |                                                                                                                                                                                                                                            |
| `getApprovedTutors`   | `GET /tutors/approved`                                        | Lista tutores `'aprobado'` incluyendo horarios (`hora_inicio_atencion`, `hora_fin_atencion`).                                                              |                                                                                                                                                                                                                                            |
| `getUsers`            | `GET /usuarios?rol=estudiante\|tutor`                         | Lista usuarios activos (`aprobado`/`baja`) por rol, normalizados a `{id, nombre, apellido, identificador, correo, estado, rol}`.                           | Sin filtro devuelve ambos roles.                                                                                                                                                                                                           |
| `deactivateUser`      | `PATCH /usuarios/:id/dar-de-baja`                             | **Dispatcher** por `rol` del body → delega a `deactivateTutor`/`deactivateStudent`.                                                                        | `400` si el rol es inválido.                                                                                                                                                                                                               |
| `deactivateStudent`   | `PUT /students/:id/deactivate`                                | Baja **física** (DELETE en cascada manual).                                                                                                                | Secuencia: `DELETE FROM sesion` → `DELETE FROM solicitud` → `DELETE FROM estudiante` (todas `WHERE id_estudiante = $1`). Consulta correo/nombre antes de borrar. Envía `sendDeactivationEmail`. Respuesta con `estado_aprobacion: 'baja'`. |
| `deactivateTutor`     | `PUT /tutors/:id/deactivate`                                  | Baja física (DELETE en cascada manual).                                                                                                                    | Secuencia: `DELETE FROM sesion` → `tutor_materia` → `tutor_dia_atencion` → `solicitud` → `tutor` (todas `WHERE id_tutor = $1`). Consulta correo/nombre antes de borrar. Envía `sendDeactivationEmail`.                                     |

**Servicio de correo (`services/email.js`):** configura `Resend` sobre SMTP de Gmail. Plantillas HTML: `sendApprovalEmail` (aprobación/rechazo), `sendDeactivationEmail` (baja), `sendCancellationEmail` (cancelación de sesión, ver §4.4).

> **Notas de seguridad:** todas las rutas de admin usan `verifyToken` + `isAdmin`. No se exponen hashes de contraseña ni secretos 2FA en ninguna respuesta; los correos se envían en segundo plano (`.catch` registra errores sin romper la petición).

### 3.6 Guía de pruebas (backend)

**1. Iniciar el servidor:**

```bash
cd ProyectoFase1
docker compose up --build
```

**2. Login y token de admin:**

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"nombre_usuario": "admin", "password": "adminpassword"}'
```

> Recordar completar el segundo paso (`/verify-2fa`) para obtener el JWT real (ver §3.3).

**3. Solicitudes pendientes:**

```bash
curl -X GET http://localhost:4000/api/admin/students/pending \
  -H "Authorization: Bearer <TOKEN>"
```

**4. Aprobación de usuario:**

```bash
curl -X PUT http://localhost:4000/api/admin/students/1/approve \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

**5. Usuarios aprobados:**

```bash
curl -X GET http://localhost:4000/api/admin/students/approved \
  -H "Authorization: Bearer <TOKEN>"

curl -X GET http://localhost:4000/api/admin/tutors/approved \
  -H "Authorization: Bearer <TOKEN>"
```

**6. Baja y eliminación definitiva:**

```bash
curl -X PUT http://localhost:4000/api/admin/students/1/deactivate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"motivo": "Incumplimiento de normas académicas"}'

curl -X PUT http://localhost:4000/api/admin/tutors/2/deactivate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"motivo": "Inasistencia a tutorías programadas"}'
```

---

## 4. Módulo Tutor

**Archivo:** `controllers/tutor.controller.js` (perfil/horario/sesiones) + `controllers/tutor.js` (login/registro)
**Rutas:** `routes/tutor.routes.js` (montadas bajo `/api/tutor`)

```
POST /api/tutor/registro                     → registroTutor (público)
POST /api/tutor/login                        → loginTutor (público)
─── a partir de aquí: verifyToken + isTutor ───
GET  /api/tutor/profile                      → getProfile
PATCH /api/tutor/profile                     → updateProfile
GET  /api/tutor/schedule                     → getSchedule
PUT  /api/tutor/schedule                     → upsertSchedule
GET  /api/tutor/sessions/pending             → getPendingSessions
PATCH /api/tutor/sessions/:id/attend         → attendSession
PATCH /api/tutor/sessions/:id/cancel         → cancelSession
GET  /api/tutor/sessions/history             → getHistorySessions
```

**Identidad del tutor:** `req.user.id` proviene del token JWT (rol `tutor`); ningún endpoint confía en un `id` del body/query para identificar al tutor.

**Constantes de validación:**

- `days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']`
- `timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/` — HH:MM de 00:00 a 23:59.
- `passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/`

### 4.1 Registro y Login

El registro (`POST /api/tutor/registro`) se documenta en §2.1.

#### Login — `POST /api/tutor/login` (pública)

Controlador: `src/controllers/tutor.js:6-100`
Body: `{ "correo": "carlos@correo.com", "password": "Pass1234" }`

`200`

```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "token": "<JWT 8h>",
  "user": { "id_tutor": 1, "nombre": "Carlos", "...": "...", "rol": "tutor" }
}
```

Sin `password_hash` en la respuesta.

| Código | Caso                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `400`  | falta `correo` o `password`                                                                                           |
| `401`  | correo inexistente o password incorrecta (`bcryptjs.compare`)                                                         |
| `403`  | `pendiente` → `"Su cuenta está pendiente de aprobación"`; `rechazado`/`baja`/otro → `"No cuenta con autorización..."` |

```bash
curl -X POST http://localhost:4000/api/tutor/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"carlos@correo.com","password":"Pass1234"}'
```

### 4.2 Perfil

#### Obtener perfil — `GET /api/tutor/profile`

Handler: `getProfile` en `src/controllers/tutor.js:105-135`

`200 { "status":"success", "data": { "id_tutor":1, "nombre":"...", "carnet_id":"...", "correo":"...", "hora_inicio_atencion":"08:00:00", "...": "...", "rol":"tutor" } }`
`404` tutor no encontrado.

```bash
curl http://localhost:4000/api/tutor/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### Actualizar perfil — `PATCH /api/tutor/profile`

Handler: `src/controllers/tutor.controller.js:237-319` + `src/models/tutor.js`

**Campos bloqueados** (`400` listándolos si se envían): `id, correo, carnetId, numeroIdentificacionTutor, estadoAprobacion, fechaRegistro, aprobadoPor, horaInicioAtencion, horaFinAtencion`.

**Campos editables** (`EDITABLE_FIELDS` del modelo, camelCase JS → snake_case DB): `nombre, apellido, fechaNacimiento, genero, direccion, telefono, fotoUrl, direccionTutoria, anioInicioTutorias, universidadGraduacion` + `password` especial.

**Cambio de contraseña:**

- Solo si `body.password` es string no vacío.
- Regla: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/` (mín. 8, mayúscula, minúscula, número y símbolo).
- Debe ser distinta a la actual (`findPasswordHashById` + `comparePassword` con `bcryptjs`) → `400 "La nueva contraseña no puede ser la misma que la actual."`.
- Se hashea y actualiza `password_hash`.

**Validación de año de inicio de tutorías:** entero entre `1950` y el año actual → `400`.

Sin campos válidos → `400`. Tutor inexistente → `404`.

`200 { "status":"success", "message":"Perfil actualizado exitosamente.", "data": {...perfil, "subjects":[{"id":1,"nombre":"..."}]}, "rol":"tutor" }`

```bash
curl -X PATCH http://localhost:4000/api/tutor/profile \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"telefono":"55559999","direccionTutoria":"Zona 4, aula 2"}'
```

### 4.3 Horario de Atención (HU-010 / HU-011)

Modelo: `src/models/schedule.js`

#### Obtener horario — `GET /api/tutor/schedule`

- Consulta `scheduleModel.findhorarioByTutorId(id)`.
- El horario se compone de: horas de atención (`hora_inicio_atencion` / `hora_fin_atencion` en tabla `tutor`) + días de atención (`tutor_dia_atencion`).
- Sin horario definido → `404 "Horario no encontrado"`.

`200 { "message":"Horario obtenido exitosamente", "status":"success", "data": { "id_Tutor":1, "dias":["Lunes","Miercoles"], "hora_inicio":"08:00", "hora_fin":"12:00" } }`

```bash
curl http://localhost:4000/api/tutor/schedule -H "Authorization: Bearer $TOKEN"
```

#### Crear / actualizar horario (upsert) — `PUT /api/tutor/schedule`

Acepta datos por **body o query** (`{ ...req.body, ...req.query }`). Actúa como _upsert_.

| Param       | Ejemplo                                                    | Validación                                                                                         |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `dias`      | `["Lunes","Miercoles"]`, `"Lunes,Miercoles"` o JSON string | cada valor en `days`; si no es array/vacío/día inválido → `400 "Días de atención inválidos."`      |
| `startTime` | `"08:00"`                                                  | `timeRegex` → `400 "Formato de hora invalido"`                                                     |
| `endTime`   | `"12:00"`                                                  | `timeRegex` + `startTime < endTime` → `400 "La hora de inicio debe ser menor que la hora de fin."` |

Faltan `dias`, `startTime` o `endTime` → `400 "Faltan parámetros requeridos."`.

**Integridad del horario (HU-011):** antes de persistir, `scheduleModel.findConflictingSessions(idTutor, { dias, startTime, endTime })` detecta sesiones **`Activa`** del tutor que quedarían **fuera** del nuevo rango (`hora_sesion < startTime` o `>= endTime`, o `dia_semana` fuera de los nuevos días — vía `EXTRACT(DOW ...)`). Considera sesiones activas aunque su fecha ya pasó. Si hay **cualquier conflicto** → `409` con la lista de sesiones conflictivas (`id, fecha, hora, estudiante, motivo`); no se modifica nada.

**Persistencia (`scheduleModel.upsert`):** transacción manual con `db.pool.connect()` + `BEGIN`/`COMMIT`/`ROLLBACK`:

1. `UPDATE tutor SET hora_inicio_atencion, hora_fin_atencion WHERE id_tutor`.
2. `DELETE FROM tutor_dia_atencion WHERE id_tutor`.
3. Inserta los nuevos días uno por uno.

`200 { "message":"Horario creado/actualizado exitosamente", "data": {...}, "status":"success" }`. Errores → `500`.

> Al cambiar el horario se protegen las sesiones activas; además, `updateProfile` marca `horaInicioAtencion`/`horaFinAtencion` como **no editables** (§4.2), forzando la modificación exclusivamente por este endpoint.

```bash
# vía body
curl -X PUT http://localhost:4000/api/tutor/schedule \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"dias":["Lunes","Miercoles"],"startTime":"08:00","endTime":"12:00"}'

# vía query (la usa el frontend actual)
curl -X PUT "http://localhost:4000/api/tutor/schedule?dias=Lunes,Miercoles&startTime=08:00&endTime=12:00" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.4 Sesiones del Tutor

Modelo base: `src/models/session.js` (estados `Activa, Atendida, Cancelada_Estudiante, Cancelada_Tutor`). Las "sesiones activas" equivalen a `estado = 'Activa'`.

#### Pendientes (HU-012) — `GET /api/tutor/sessions/pending`

`sessionModel.getSesionesPendientesByTutorId(id)` → todas las sesiones `Activa` del tutor, ordenadas por fecha/hora ascendentes.

`200 { "message":"Sesiones pendientes obtenidas exitosamente", "status":"success", "data":[{"id":1,"fecha":"2026-09-01","hora":"08:30","estudiante":"Ana Pérez","materia":"Matemática Básica","motivo":"..."}] }`

```bash
curl http://localhost:4000/api/tutor/sessions/pending -H "Authorization: Bearer $TOKEN"
```

#### Atender sesión (HU-013) — `PATCH /api/tutor/sessions/:id/attend`

Registro de atención + resumen (cierra una sesión activa):

1. Valida `id` → `400 "ID de sesión inválido."`.
2. Valida `resumen`: obligatorio, string no vacío (trim) → `400` (check DB `estado<>'Atendida' OR resumen IS NOT NULL`).
3. `findSessionByIdAndTutorId(id, idTutor)` → `404 "Sesión no encontrada."` si no pertenece al tutor.
4. `estado !== 'Activa'` → `400 "La sesión no está activa y no puede ser atendida."`.
5. `markAttended(id, idTutor, resumen.trim())` → `UPDATE sesion SET resumen, estado='Atendida', fecha_actualizacion=NOW()`.

`200 { "message":"Sesión atendida exitosamente", "status":"success", "data":{ "id":1, "estado":"Atendida", "resumen":"...", "fechaActualizacion":"..." } }`

```bash
curl -X PATCH http://localhost:4000/api/tutor/sessions/1/attend \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"resumen":"Se resolvieron dudas de límites, queda pendiente practicar derivadas."}'
```

#### Cancelar sesión (HU-014) — `PATCH /api/tutor/sessions/:id/cancel` (sin body)

1. `findSessionByIdAndTutorId` → `404` si no existe o no es suya.
2. `estado !== 'Activa'` → `400` (no se puede cancelar una ya cerrada).
3. `markCancelledByTutor` → `UPDATE sesion SET estado='Cancelada_Tutor', fecha_actualizacion=NOW()`.
4. **Notificación:** `sendCancellationEmail` al estudiante (tutor, estudiante, fecha, hora, materia, motivo). El fallo del correo **no** revierte la cancelación (`try/catch`, se loguea, `emailSent:false`).

`200 { "message":"Sesión cancelada exitosamente", "status":"success", "data":{ "id":1, "estado":"Cancelada_Tutor", "fechaCancelacion":"..." }, "emailSent": true }`

```bash
curl -X PATCH http://localhost:4000/api/tutor/sessions/1/cancel \
  -H "Authorization: Bearer $TOKEN"
```

#### Historial (HU-015) — `GET /api/tutor/sessions/history?page=&pageSize=`

Histórico de sesiones **cerradas** (`estado <> 'Activa'`), paginado. `page` (default 1, ≥1) y `pageSize`/`limit` (default 20, máx. 100); valores fuera de rango → default. `findHistoryByTutor(id, { page, limit })`, orden descendente, `LIMIT/OFFSET`.

Mapeo de estado a descripción legible: `Atendida` → `Atendido`; `Cancelada_Estudiante` → `Cancelado por estudiante`; `Cancelada_Tutor` → `Cancelado por tutor`.

`200 { "message":"Historial...", "status":"success", "data":[{"id":1,"fecha":"...","hora":"...","estudiante":"...","estado":"Atendida","estadoDescripcion":"Atendido"}], "total": 12 }`

> Nota: `total` actual = tamaño de página, no conteo global (a tener en cuenta en paginación cliente).

```bash
curl "http://localhost:4000/api/tutor/sessions/history?page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.5 Auth y errores (resumen tutor)

| Código | Cuándo                                                                                       |
| ------ | -------------------------------------------------------------------------------------------- |
| 400    | campos faltantes, `dias`/horas inválidas, `resumen` vacío, campo no editable, password débil |
| 401    | sin token / token inválido / login incorrecto (`verifyToken`, `comparePassword`)             |
| 403    | rol ≠ tutor, o cuenta `pendiente/rechazado/baja` en login                                    |
| 404    | perfil/horario/sesión no encontrados                                                         |
| 409    | horario choca con sesiones activas, o `23505` duplicados                                     |
| 500    | error interno (revisar logs `console.error`)                                                 |

Formato tutor: `{ "status":"success"|"error", "message":"...", "data"?/"token"?/"user"? }` (registro usa `{message}` plano sin `status`).

> **Nota de calidad:** en `tutor.controller.js` se usa `console.error` sin `return` dentro de `catch` (la respuesta se envía igual).

---

## 5. Módulo Estudiante

**Archivos:** `controllers/registro.estudiante.js`, `controllers/estudiante.js`, `controllers/student-profile.controller.js`, `controllers/student-catalog.controller.js`, `controllers/student-session.controller.js`
**Rutas:** montaje verificado en `src/app.js:51-57`: `app.use('/api/student', registro.estudiante.routes)` + `app.use('/api/student', student.routes)` + `app.use('/api/estudiante', estudiante.routes)`.

### 5.1 Registro y Login

El registro (`POST /api/student/register`) se documenta en §2.2.

#### Login — `POST /api/estudiante/login` (pública)

Controlador: `src/controllers/estudiante.js:loginEstudiante`
Body: `{ "correo": "...", "password": "..." }`

`200`

```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "token": "<JWT 8h>",
  "user": {
    "id_estudiante": 1,
    "nombre": "Ana",
    "...": "...",
    "rol": "estudiante"
  }
}
```

Errores: `400` faltantes, `401` incorrectos, `403` según `estado_aprobacion` (`pendiente/rechazado/baja`), igual que tutor.

```bash
curl -X POST http://localhost:4000/api/estudiante/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"ana@correo.com","password":"Pass1234"}'
```

### 5.2 Perfil (HU-024)

Hay dos rutas GET equivalentes (se documentan ambas por compatibilidad con frontend):

- `GET /api/estudiante/profile` — `getProfileEstudiante` (`src/controllers/estudiante.js:97-127`)
- `GET /api/student/profile` — `getStudentProfile` (`src/controllers/student-profile.controller.js:24-50`)

Ambas requieren `estudiante`, devuelven `SELECT id_estudiante,nombre,apellido,carnet,genero,direccion,telefono,fecha_nacimiento,foto_url,correo,estado_aprobacion,fecha_registro`.

`200 { "success": true, "data": {..., "rol":"estudiante"} }` (en `/api/estudiante/profile` el envelope es `{status:"success", data:...}`). `404` no encontrado.

#### Actualizar perfil — `PUT /api/student/profile`

Handler: `updateStudentProfile` (`student-profile.controller.js:53-166`).

Editables: `nombre, apellido, genero (solo "M"/"F"), direccion, telefono, fecha_nacimiento, foto_url`. `carnet/correo` no editables (se ignoran si se envían).

Cambio de password (opcional, atómico con lo anterior): `{ "password_actual": "...", "password_nueva": "..." }` — exige actual correcta (`bcryptjs.compare`) + complejidad nueva: mín. 8, mayúscula, minúscula, número y símbolo `!@#$%^&*(),.?":{}|<>`.

`200 { "success": true, "message":"Perfil actualizado correctamente", "data": {...} }`
`400` sin datos / campo vacío / género inválido / falta `password_actual` / complejidad insuficiente.

```bash
curl http://localhost:4000/api/student/profile -H "Authorization: Bearer $TOKEN"

curl -X PUT http://localhost:4000/api/student/profile \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"telefono":"55550000","direccion":"Zona 2"}'

curl -X PUT http://localhost:4000/api/student/profile \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"password_actual":"Pass1234","password_nueva":"NuevaPass1!"}'
```

### 5.3 Catálogo y disponibilidad (HU-017 / HU-018 / HU-019)

#### Catálogo — `GET /api/student/catalog`

Handler: `getTutorCatalog` (`student-catalog.controller.js:5-55`). Devuelve solo tutores `aprobado` con al menos una materia, **excluyendo** aquellos con los que el alumno ya tiene sesión `Activa`.

```json
{
  "success": true,
  "data": [
    {
      "id_tutor": 1,
      "nombre": "Carlos",
      "apellido": "López",
      "foto_url": "https://...",
      "direccion_tutoria": "Online",
      "hora_inicio_atencion": "08:00:00",
      "hora_fin_atencion": "12:00:00",
      "dias_atencion": ["Lunes", "Miércoles"],
      "materias": ["Matemática Básica"],
      "materias_detalle": [{ "id": 1, "nombre": "Matemática Básica" }]
    }
  ],
  "tutores_con_sesion_pendiente": [],
  "message": "Tienes 1 tutor(es) con sesion pendiente que no aparecen en el catalogo"
}
```

`message` solo aparece si hay excluidos.

```bash
curl http://localhost:4000/api/student/catalog -H "Authorization: Bearer $TOKEN"
```

#### Búsqueda avanzada — `GET /api/student/catalog/search`

Handler: `searchTutors` (`:266-355`). Query params: `materia, sexo, edadMin, edadMax, universidad, experienciaMin`.

| Query             | Efecto SQL                                            |
| ----------------- | ----------------------------------------------------- |
| `materia`         | `m.nombre ILIKE %...%`                                |
| `sexo`            | `t.genero = $`                                        |
| `edadMin/edadMax` | `EXTRACT(YEAR FROM AGE(fecha_nacimiento))` en rango   |
| `universidad`     | `universidad_graduacion ILIKE %...%`                  |
| `experienciaMin`  | `GREATEST(0, año_actual - anio_inicio_tutorias) >= N` |

Mismo envelope que catálogo. Si vacío: `data:[]` + `message:"No se encontraron tutores..."`.

```bash
curl "http://localhost:4000/api/student/catalog/search?materia=Matem%C3%A1tica&experienciaMin=3" \
  -H "Authorization: Bearer $TOKEN"
```

#### Disponibilidad por fecha — `GET /api/student/tutor/:idTutor/availability?date=YYYY-MM-DD`

Handler: `getTutorAvailability` (`:58-150`).

- `date` obligatorio (`400` si falta).
- Día no está en `tutor_dia_atencion` → `200 disponible:false + mensaje "El tutor no atiende los ..."`.
- Sin horario configurado → `400 "El tutor no tiene horario..."`.
- Si disponible → franjas cada 60 min entre `[inicio, fin)` marcadas `libre/ocupada` según sesiones `Activa` ese día.

```json
{
  "success": true,
  "data": {
    "tutor": { "id": 1, "nombre": "Carlos", "apellido": "López" },
    "dias_atencion": ["Lunes", "Miércoles"],
    "horario_general": { "inicio": "08:00:00", "fin": "12:00:00" },
    "fecha_consultada": "2026-09-02",
    "dia_semana": "Miércoles",
    "disponible": true,
    "franjas": [
      { "hora": "08:00", "estado": "libre" },
      { "hora": "09:00", "estado": "ocupada" }
    ]
  }
}
```

```bash
curl "http://localhost:4000/api/student/tutor/1/availability?date=2026-09-02" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.4 Sesiones del Estudiante (HU-020 a HU-023)

#### Crear sesión — `POST /api/student/sessions`

Handler: `createSession` (`:153-263`).

Body:

```json
{
  "idTutor": 1,
  "idMateria": 1,
  "fecha": "2026-09-02",
  "hora": "08:00",
  "motivo": "Dudas de límites"
}
```

Validaciones en orden:

1. Todos obligatorios, tutor `aprobado` (`404` si no).
2. Materia pertenece a `tutor_materia` (`400`).
3. `fecha` cae en día de atención (`400 "El tutor no atiende los ..."`).
4. `hora` dentro de `[inicio, fin)` y minutos = minutos de inicio (franjas exactas).
5. No duplicar `Activa` con mismo tutor (`409`), ni misma `fecha+hora` del alumno (`409`), ni misma `fecha+hora` del tutor (`409`). Respaldado por índices únicos parciales en `db/script.sql:134-146`.

`201 { "success": true, "message":"Sesion creada correctamente", "data": { "id_sesion":1, "...": "..." } }`

```bash
curl -X POST http://localhost:4000/api/student/sessions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"idTutor":1,"idMateria":1,"fecha":"2026-09-02","hora":"08:00","motivo":"Dudas de límites y derivadas"}'
```

#### Activas / historial

- `GET /api/student/sessions/active` (HU-021) → `estado=['Activa']`
- `GET /api/student/sessions/history` (HU-023) → `['Atendida','Cancelada_Estudiante','Cancelada_Tutor']`

Helper: `getStudentSessionsByState` (`student-helpers.js:46-71`). Item: `{id,fecha,hora,motivo,resumen,estado,materia,tutor,correoTutor}`.

```bash
curl http://localhost:4000/api/student/sessions/active -H "Authorization: Bearer $TOKEN"
curl http://localhost:4000/api/student/sessions/history -H "Authorization: Bearer $TOKEN"
```

#### Cancelar sesión (HU-022) — `PATCH /api/student/sessions/:id/cancel`

Handler: `cancelSession` (`student-session.controller.js:35-86`). `id` numérico. Solo si es propia y `Activa` → `Cancelada_Estudiante`.

`200 { "success": true, "message":"Sesión cancelada correctamente", "data":{ "id":1, "estado":"Cancelada_Estudiante", "fechaActualizacion":"..." } }`
`400` id inválido, `404` inexistente, `409` ya cancelada/atendida o de otro alumno.

```bash
curl -X PATCH http://localhost:4000/api/student/sessions/1/cancel \
  -H "Authorization: Bearer $TOKEN"
```

### 5.5 Auth y errores (resumen estudiante)

| Código | Cuándo                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| 400    | registro/login incompleto, email/password inválidos, `date` faltante, hora fuera de rango, `password_actual` faltante |
| 401    | sin token / inválido / credenciales incorrectas                                                                       |
| 403    | rol ≠ estudiante                                                                                                      |
| 404    | tutor/materia/sesión/perfil no encontrado                                                                             |
| 409    | duplicado correo/carnet, sesión traslapada (incluye `23505` por índices únicos)                                       |
| 500    | `{ "success": false, "message":"Error interno del servidor" }`                                                        |

Envoltorios: registro usa `{message}` plano; login usa `{status,message,token,user}`; catálogo/sesiones/perfil (`/api/student/*`) usan `{success,message,data}`.

---

## 6. Arquitectura del cliente (frontend)

El cliente de EduConnect está implementado en `client/` con Next.js 16 y React 19, usando el App Router de Next para organizar vistas, layouts y rutas según el rol del usuario. La lógica del front está pensada para operar con un flujo de autenticación por JWT y para consumir la API del backend de forma consistente desde una capa reutilizable de cliente HTTP.

### 6.1 Stack tecnológico y runtime

| Componente        | Descripción                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `Next.js 16`      | Enrutado por carpetas, renderizado del lado del cliente/servidor según la ruta y soporte de layouts. |
| `React 19`        | Base del árbol de componentes y del estado UI.                                                       |
| `motion`          | Librería de animación ligera para microinteracciones visuales.                                       |
| `Tailwind CSS v4` | Sistema de estilos utilitarios con tokens de diseño, colores y tipografías.                          |
| `ESLint`          | Revisión de calidad del código y estándares del proyecto.                                            |

La aplicación usa un layout raíz definido en `client/app/layout.jsx` que registra tipografías globales (`Fraunces`, `Inter`, `IBM Plex Mono`) y envuelve la app en `AuthProvider` y `ToastProvider` para ofrecer contexto global de sesión y notificaciones.

### 6.2 Estructura de carpetas del cliente

```text
client/
├─ app/                     # Rutas y layouts de Next.js (App Router)
│  ├─ (auth)/login/        # Login y segundo factor
│  ├─ admin/               # Módulo de administración
│  ├─ estudiante/          # Perfil, tutorías y sesiones del estudiante
│  ├─ tutor/               # Perfil, horarios y sesiones del tutor
│  ├─ globals.css          # Tokens visuales y estilos base
│  ├─ layout.jsx           # Layout raíz y providers globales
│  └─ page.jsx             # Inicio/landing
├─ components/
│  ├─ layout/              # Sidebar, Topbar, estructura de navegación
│  └─ ui/                  # Botones, cards, tabs, modales, toasts, formularios
├─ lib/
│  ├─ api/                 # Clientes para consumir backend
│  └─ auth-context.jsx     # Contexto de autenticación
├─ public/                 # Assets estáticos
├─ package.json            # Dependencias y scripts del cliente
├─ next.config.mjs         # Configuración de Next.js
├─ jsconfig.json           # Alias de imports (`@/*`)
└─ eslint.config.mjs       # Reglas de linting
```

La separación por módulos refleja la lógica de negocio: `admin`, `estudiante` y `tutor` comparten la misma base visual, pero cada dominio encapsula sus vistas y flujos específicos.

### 6.3 Autenticación y sesión del usuario

La sesión en el cliente se gestiona en `lib/auth-context.jsx` a través de `AuthContext` y `useAuth()`. El provider define los estados del usuario actual y expone funciones como:

- `login({ email, password })` para iniciar la sesión.
- `completarSegundoFactorAdmin({ archivo })` para el flujo de admin con validación adicional.
- `guardarUsuario(data)` para actualizar el estado global.
- `logout()` para cerrar la sesión y redirigir al login.

### 6.4 API client y manejo de errores

El cliente HTTP centraliza la conexión con el backend en `lib/api/client.js`. Su responsabilidad principal es:

1. Resolver la base de la API desde `NEXT_PUBLIC_API_URL` o el valor por defecto `http://localhost:8000/api`.
2. Leer y adjuntar el token JWT desde `localStorage` cuando exista.
3. Serializar el body como JSON.
4. Capturar errores de red y transformar los errores HTTP en una estructura uniforme.

La abstracción `apiFetch` devuelve errores tipados por `ApiError`, con propiedades como:

- `message`: mensaje legible para el usuario.
- `status`: código HTTP.
- `details`: payload crudo del backend.

Esto permite que el front maneje de manera uniforme errores de autenticación, validación y conflictos en la base de datos, evitando lógica duplicada en cada vista.

### 6.5 Routing por rol y navegación

La navegación principal se define en `components/layout/Sidebar.jsx`. Cada rol tiene un conjunto de rutas accesibles:

| Rol           | Rutas principales                                       |
| ------------- | ------------------------------------------------------- |
| Estudiante    | Buscar tutores, Mis sesiones, Historial, Mi perfil      |
| Tutor         | Sesiones pendientes, Mis horarios, Historial, Mi perfil |
| Administrador | Solicitudes, Usuarios, Reportes                         |

La selección activa se resuelve con `usePathname()`, y la URL se compara con la ruta actual para marcar el ítem de menú como seleccionado. Este patrón facilita la separación funcional por perfil y mantiene la experiencia consistente entre páginas.

### 6.6 Estilos y componentes reutilizables

El diseño del cliente está basado en una librería visual orientada a la aplicación académica: colores institucionales, cards, tabs, formularios, avatares y status pills. En `components/ui/` se encapsulan elementos comunes como:

- `Button.jsx` — botones con estados `loading`, `primary`, `secondary`.
- `FormField.jsx` — inputs con validación visual y mensajes de error.
- `Modal.jsx` — confirmaciones y acciones de alta prioridad.
- `SessionCard.jsx` — tarjetas para sesiones y tutorías.
- `StatusPill.jsx` — estados tipo "Pendiente", "Aceptado", "Cancelado".
- `Toast.jsx` — notificaciones emergentes.

La intención de estos componentes es centralizar la presentación y evitar duplicación de HTML/estilos en cada página, reduciendo errores UI y acelerando la consistencia visual.

### 6.7 Consideraciones de calidad y despliegue

Entre los puntos clave para mantener la calidad del front se destacan:

- `Next.js App Router`: la organización por carpetas facilita el crecimiento del proyecto sin mezclar lógica de UI y de negocio.
- `Contexto global de autenticación`: centraliza la sesión, pero debe evolucionar hacia un modelo más seguro cuando se integre el backend real.
- `Manejo unificado de errores`: clave para evitar pantallas rotas y para mostrar mensajes claros al usuario.
- `Tokens de diseño y reutilización`: reduce el riesgo de inconsistencia visual entre módulos.
- `Separación por rol`: permite una experiencia adaptada a tutor, estudiante y administrador.

En un entorno de despliegue, el cliente debería ejecutarse independiente del backend con variables de entorno como `NEXT_PUBLIC_API_URL`, y el build se compilaría con `npm run build` dentro de `client/` para asegurar que la app esté lista para producción.

---

## 7. Docker y entorno de desarrollo

Guía operativa de los contenedores configurados para desarrollo local de EduConnect.
La base de datos y servicios de terceros operan como servicios en la nube (Neon, Cloudinary, Resend); Docker solo levanta backend + frontend.

### 7.1 Arquitectura del entorno

#### Diagrama

```mermaid
flowchart TD
    subgraph Host["Host: navegador y sistema"]
        Browser["Navegador (localhost:3000)"]
    end
    subgraph Docker["Docker Compose: backend + frontend"]
        Front["frontend (educonnect-frontend) - Next.js dev :3000 - root"]
        Back["backend (educonnect-backend) - Express dev :4000 - user node"]
    end
    subgraph Cloud["Servicios externos"]
        Neon["Neon PostgreSQL"]
        Cloudinary["Cloudinary"]
        Resend["Resend"]
    end
    Browser -->|"UI (localhost:3000)"| Front
    Browser -->|"API client-side (NEXT_PUBLIC_API_URL)"| Back
    Front -.->|"SSR / fetch server-side"| Back
    Back --> Neon
    Back --> Cloudinary
    Back --> Resend
```

#### Archivos

```text
├── docker-compose.yml          # 2 servicios: backend (4000) + frontend (3000), solo dev
├── server/
│   ├── Dockerfile              # node:20-alpine, EXPOSE 4000, USER node, CMD npm run dev
│   ├── .dockerignore           # node_modules, .env, .git, uploads, dist
│   └── .env.example            # plantilla (DB, JWT, Cloudinary, Resend, SMTP)
└── client/
    ├── Dockerfile              # node:20-alpine, PORT 3000, HOSTNAME 0.0.0.0, CMD npm run dev (root)
    └── .dockerignore           # node_modules, .next, .env*
```

> Nota: no existe `client/.env.example` en el repo verificado. El frontend se configura con `client/.env.local` creado a mano.

#### Componentes

| Componente           | Configuración y propósito                                                                                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docker-compose.yml` | Servicios `backend` (build `./server`, `4000:4000`, `NODE_ENV=development`, `npm run dev`) y `frontend` (build `./client`, `3000:3000`). Sin DB local: delega a Neon (`server/src/config/db.js`, `GET /api/health`).                                          |
| `server/Dockerfile`  | Capas en orden caché-friendly: `COPY package*.json` → `RUN npm install` → `COPY .`. `USER node` (sin privilegios).                                                                                                                                            |
| `client/Dockerfile`  | Igual base + `ENV PORT=3000`, `ENV HOSTNAME=0.0.0.0` (Next debe escuchar fuera del container). Corre como root.                                                                                                                                               |
| Volúmenes            | Bind mount `./server:/usr/src/app` y `./client:/usr/src/app` = hot-reload sin rebuild. Volúmenes anónimos `/usr/src/app/node_modules` (ambos) y `/usr/src/app/.next` (frontend) evitan que archivos del host (ej. binarios Windows/macOS) pisen los de Linux. |

### 7.2 Puesta en marcha

#### Prerrequisitos

- Docker Desktop en ejecución (Engine 20.10+ y Compose v2+).
- Internet (Neon, Cloudinary, Resend).
- `server/.env` creado desde `server/.env.example`.

#### Variables de entorno

Backend (`server/.env`):

```bash
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/educonnect?sslmode=require"
JWT_SECRET="tu_secreto_super_seguro"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
RESEND_API_KEY="..."
```

Frontend (`client/.env.local`, crear a mano):

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> `NEXT_PUBLIC_API_URL` se evalúa en el navegador, debe ser `http://localhost:4000/api`, nunca `http://backend:4000` (nombre interno no resoluble desde el browser).

#### Arranque y verificación

```bash
# 1. Build + levantar en fondo
docker compose up --build -d

# 2. Estado
docker compose ps

# 3. Salud del backend
curl -s http://localhost:4000/api/health | jq
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "EduConnect API en ejecución",
  "database": { "connected": true, "provider": "Neon PostgreSQL (Cloud)" }
}
```

Frontend: `http://localhost:3000/login`.

> Código en `./server` o `./client` se recarga solo (volumen). `package.json` o `.env` exigen rebuild/recreate.

### 7.3 Referencia de comandos

#### Ciclo de vida

| Acción                                   | Comando                             |
| ---------------------------------------- | ----------------------------------- |
| Iniciar con rebuild (primer plano)       | `docker compose up --build`         |
| Iniciar en fondo                         | `docker compose up -d`              |
| Detener sin eliminar                     | `docker compose stop`               |
| Apagar y eliminar red/containers         | `docker compose down`               |
| Purga total (incluye volúmenes anónimos) | `docker compose down -v`            |
| Rebuild de un servicio                   | `docker compose up --build backend` |
| Reiniciar sin rebuild                    | `docker compose restart frontend`   |

#### Inspección

| Acción              | Comando                                  |
| ------------------- | ---------------------------------------- |
| Estado              | `docker compose ps`                      |
| Logs en vivo (todo) | `docker compose logs -f`                 |
| Logs de uno         | `docker compose logs -f backend`         |
| Recursos            | `docker stats`                           |
| Shell backend       | `docker exec -it educonnect-backend sh`  |
| Shell frontend      | `docker exec -it educonnect-frontend sh` |

### 7.4 Troubleshooting

#### Puerto ocupado (`EADDRINUSE :4000`)

Otra instancia local ocupa el puerto (`server/server.js` lo reporta).

```bash
# Linux / macOS
lsof -i :4000
kill -9 <PID>
# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 4000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

Alternativa: cambiar mapping a `"4001:4000"` en `docker-compose.yml`.

#### `Cannot find module` tras `up`

Se perdió el volumen anónimo y el `node_modules` del host tapó el del container. Verificar en `docker-compose.yml`:

```yaml
volumes:
  - ./server:/usr/src/app
  - /usr/src/app/node_modules # obligatorio
```

Luego `docker compose up --build -d`.

#### Next roto / `.next` corrupto

```bash
docker compose down
rm -rf client/.next   # Windows PS: Remove-Item -Recurse -Force client/.next
docker compose up --build frontend
```

#### `EACCES` en `server/`

El backend corre como `USER node` (UID 1000), distinto al dueño host. En Linux: `sudo chown -R 1000:1000 server/`.

#### Frontend `fetch failed / Network error`

1. `docker compose ps` — backend debe estar `Up`.
2. `NEXT_PUBLIC_API_URL` debe ser `http://localhost:4000/api`, no `http://backend:4000`.

#### `.env` sin efecto

`dotenv` lee al arrancar el proceso. Tras editar: `docker compose restart backend` (o `up -d` de nuevo). `.env` está en `.dockerignore` a propósito: no va en la imagen, entra por volumen/env.

#### `npm install` lento en cada build

Respetar el orden de capas (caché):

```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```

---

## 8. Referencias cruzadas

| Archivo                                              | Rol en el flujo                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `utils/twoFactor.js`                                 | Motor TOTP/QR/cifrado AES-256-GCM del 2FA de admin.                                              |
| `middlewares/auth.js`                                | `verifyToken` (JWT), `isTutor`, `isEstudiante`, `isAdmin`, `JWT_SECRET`.                         |
| `models/schedule.js`                                 | Lectura de horario, detección de sesiones en conflicto y upsert transaccional.                   |
| `models/session.js`                                  | Consulta/actualización de sesiones del tutor (estados y resúmenes).                              |
| `models/tutor.js`                                    | Perfil del tutor (campos editables, update, hash de contraseña).                                 |
| `services/email.js`                                  | Envíos Resend: aprobación/rechazo, baja y cancelación de sesión.                                 |
| `routes/admin.routes.js`                             | Enrutado de admin (2 rutas públicas + resto protegido `isAdmin`).                                |
| `routes/tutor.routes.js`                             | Enrutado de tutor (login/registro público + resto protegido `isTutor`).                          |
| `config/db.js`                                       | Pool `pg` (`.query`/`.pool`) y helper tagged-template `sql`.                                     |
| `config/cloudinary.js` + `utils/cloudinaryUpload.js` | Subida de fotos de perfil (estudiantes/tutores).                                                 |
| `student-helpers.js`                                 | Helper compartido para consultar sesiones del estudiante por estado.                             |
| `db/script.sql`                                      | Índices únicos parciales que respaldan las validaciones de sesiones duplicadas (líneas 134–146). |
| `client/app/layout.jsx`                              | Layout raíz y providers globales del frontend.                                                   |
| `client/lib/auth-context.jsx`                        | Contexto de autenticación y sesión del cliente.                                                  |
| `client/lib/api/client.js`                           | Wrapper centralizado de consumo de la API REST.                                                  |
| `client/components/layout/Sidebar.jsx`               | Navegación principal y acceso por rol.                                                           |
| `docker-compose.yml`                                 | Orquestación local de backend y frontend con puertos y volúmenes.                                |
| `server/Dockerfile`                                  | Imagen del backend Node.js para desarrollo local.                                                |
| `client/Dockerfile`                                  | Imagen del frontend Next.js para desarrollo local.                                               |
