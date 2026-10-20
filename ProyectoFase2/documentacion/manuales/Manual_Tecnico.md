# Manual Técnico Integral — EduConnect - G8 (Fase 1 y Fase 2)

> **Plataforma:** EduConnect — Plataforma de Gestión de Tutorías Académicas  
> **Servidor:** `server/` — Node.js 22 LTS + Express + PostgreSQL (Neon Cloud) + Cloudinary  
> **Cliente:** `client/` — Next.js 14 + React + Tailwind CSS / Vanilla CSS  
> **Base URL Local:** `http://localhost:4000/api`  
> **URL Producción AWS (Backend y Proyecto Completo):** [EduConnect - G8](http://107.21.86.168/login)  
> **URL Producción Vercel (Frontend):** [https://educonnect-lovat-five.vercel.app/login](https://educonnect-lovat-five.vercel.app/login)  

---

## Índice General

- [PARTE I: MANUAL TÉCNICO — FASE 1](#parte-i-manual-técnico--fase-1)
  - [1. Dependencias y convenciones comunes](#1-dependencias-y-convenciones-comunes)
  - [2. Registro de Tutores y Estudiantes](#2-registro-de-tutores-y-estudiantes)
    - [2.1 Registro de Tutores](#21-registro-de-tutores)
    - [2.2 Registro de Estudiantes](#22-registro-de-estudiantes)
  - [3. Módulo Administrador](#3-módulo-administrador)
    - [3.1 Historias de Usuario (HU-005 a HU-008)](#31-historias-de-usuario-hu-005-a-hu-008)
    - [3.2 Endpoints](#32-endpoints)
    - [3.3 Autenticación con Doble Factor (2FA/TOTP)](#33-autenticación-con-doble-factor-2fatotp)
    - [3.4 Generación de Reportes Analíticos](#34-generación-de-reportes-analíticos)
    - [3.5 Funciones complementarias de administración](#35-funciones-complementarias-de-administración)
    - [3.6 Guía de pruebas (backend)](#36-guía-de-pruebas-backend)
  - [4. Módulo Tutor](#4-módulo-tutor)
    - [4.1 Registro y Login](#41-registro-y-login)
    - [4.2 Perfil](#42-perfil)
    - [4.3 Horario de Atención (HU-010 / HU-011)](#43-horario-de-atención-hu-010--hu-011)
    - [4.4 Sesiones del Tutor](#44-sesiones-del-tutor)
    - [4.5 Auth y errores (resumen tutor)](#45-auth-y-errores-resumen-tutor)
  - [5. Módulo Estudiante](#5-módulo-estudiante)
    - [5.1 Registro y Login](#51-registro-y-login)
    - [5.2 Perfil (HU-024)](#52-perfil-hu-024)
    - [5.3 Catálogo y disponibilidad (HU-017 / HU-018 / HU-019)](#53-catálogo-y-disponibilidad-hu-017--hu-018--hu-019)
    - [5.4 Sesiones del Estudiante (HU-020 a HU-023)](#54-sesiones-del-estudiante-hu-020-a-hu-023)
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
    - [7.2 Puesta en marcha](#72-puesta-en-marcha)
    - [7.3 Referencia de comandos](#73-referencia-de-comandos)
    - [7.4 Troubleshooting](#74-troubleshooting)
  - [8. Referencias cruzadas](#8-referencias-cruzadas)
- [PARTE II: EXTENSIONES Y ALCANCE TÉCNICO — FASE 2](#parte-ii-extensiones-y-alcance-técnico--fase-2)
  - [9. Arquitectura General y Stack Tecnológico (Fase 2)](#9-arquitectura-general-y-stack-tecnológico-fase-2)
    - [9.1 Modelo de Capas y MVC en Node.js 22 LTS](#91-modelo-de-capas-y-mvc-en-nodejs-22-lts)
    - [9.2 Estructura de Directorios del Proyecto](#92-estructura-de-directorios-del-proyecto)
    - [9.3 Matriz de Tecnologías y Dependencias](#93-matriz-de-tecnologías-y-dependencias)
  - [10. Modelo Relacional de Base de Datos y Diagrama ER (Fase 2)](#10-modelo-relacional-de-base-de-datos-y-diagrama-er-fase-2)
    - [10.1 Diagrama Entidad-Relación Completo](#101-diagrama-entidad-relación-completo)
    - [10.2 Diccionario de Datos de las Nuevas Entidades](#102-diccionario-de-datos-de-las-nuevas-entidades)
    - [10.3 Concurrencia y Bloqueos de Fila (FOR UPDATE)](#103-concurrencia-y-bloqueos-de-fila-for-update)
  - [11. Módulo de Registro y Autenticación Unificada (Fase 2)](#11-módulo-de-registro-y-autenticación-unificada-fase-2)
    - [11.1 Registro de Estudiantes con Fotografía y Carné PDF](#111-registro-de-estudiantes-con-fotografía-y-carné-pdf)
    - [11.2 Registro de Tutores con Fotografía, CV PDF y Especialidades](#112-registro-de-tutores-con-fotografía-cv-pdf-y-especialidades)
    - [11.3 Sistema de Token de Verificación (6 dígitos) y Login Unificado](#113-sistema-de-token-de-verificación-6-dígitos-y-login-unificado)
    - [11.4 Reenvío de Token de Verificación](#114-reenvío-de-token-de-verificación)
  - [12. Módulo Administrador (Fase 2)](#12-módulo-administrador-fase-2)
    - [12.1 Aprobación y Rechazo con Visor Embebido de Documentos](#121-aprobación-y-rechazo-con-visor-embebido-de-documentos)
    - [12.2 Generación de URLs Firmadas Temporales (Cloudinary SDK, 15 min)](#122-generación-de-urls-firmadas-temporales-cloudinary-sdk-15-min)
    - [12.3 Proxy Seguro y Streaming de Documentos PDF](#123-proxy-seguro-y-streaming-de-documentos-pdf)
    - [12.4 Gestión de Estudiantes Activos (Regla de Inmutabilidad de Correo)](#124-gestión-de-estudiantes-activos-regla-de-inmutabilidad-de-correo)
    - [12.5 Gestión de Tutores Activos (Materias y Correo Bloqueado)](#125-gestión-de-tutores-activos-materias-y-correo-bloqueado)
    - [12.6 Bajas Administrativas con Purga Relacional en Cascada](#126-bajas-administrativas-con-purga-relacional-en-cascada)
    - [12.7 Moderación y Dictamen Formal de Denuncias](#127-moderación-y-dictamen-formal-de-denuncias)
    - [12.8 Auditoría y Reportes de Calificaciones](#128-auditoría-y-reportes-de-calificaciones)
    - [12.9 Motor Analítico Avanzado de Tutorías (6 Consultas Concurrentes)](#129-motor-analítico-avanzado-de-tutorías-6-consultas-concurrentes)
  - [13. Módulo Tutor (Fase 2)](#13-módulo-tutor-fase-2)
    - [13.1 Calificación de Estudiantes tras Sesión Atendida (rateStudent)](#131-calificación-de-estudiantes-tras-sesión-atendida-ratestudent)
    - [13.2 Reporte de Faltas Graves del Estudiante (reportStudent)](#132-reporte-de-faltas-graves-del-estudiante-reportstudent)
    - [13.3 Cierre Pedagógico y Seguimiento de Sesiones Atendidas](#133-cierre-pedagógico-y-seguimiento-de-sesiones-atendidas)
  - [14. Módulo Estudiante (Fase 2)](#14-módulo-estudiante-fase-2)
    - [14.1 Consulta Estructurada de Planes de Estudio](#141-consulta-estructurada-de-planes-de-estudio)
    - [14.2 Generación Vectorial A4 y Descarga de Constancia Oficial en PDF (PDFKit)](#142-generación-vectorial-a4-y-descarga-de-constancia-oficial-en-pdf-pdfkit)
    - [14.3 Calificación de la Atención del Tutor (rateTutor)](#143-calificación-de-la-atención-del-tutor-ratetutor)
    - [14.4 Reporte de Conducta del Tutor (reportTutor)](#144-reporte-de-conducta-del-tutor-reporttutor)
    - [14.5 Historial de Sesiones Enriquecido con Evaluaciones y Reportes](#145-historial-de-sesiones-enriquecido-con-evaluaciones-y-reportes)
  - [15. Servicios Transaccionales y Almacenamiento en la Nube](#15-servicios-transaccionales-y-almacenamiento-en-la-nube)
    - [15.1 Cloudinary SDK (Firmas Criptográficas SHA y CDN)](#151-cloudinary-sdk-firmas-criptográficas-sha-y-cdn)
    - [15.2 Despacho Asíncrono de Correos (Nodemailer y Resend)](#152-despacho-asíncrono-de-correos-nodemailer-y-resend)
  - [16. Aseguramiento de Calidad y Pruebas Automatizadas](#16-aseguramiento-de-calidad-y-pruebas-automatizadas)
    - [16.1 Estrategia de Aislamiento y Mocks](#161-estrategia-de-aislamiento-y-mocks)
    - [16.2 Inventario de Suites de Pruebas Unitarias](#162-inventario-de-suites-de-pruebas-unitarias)
    - [16.3 Pruebas de Frontend y Pruebas End-to-End (Cypress)](#163-pruebas-de-frontend-y-pruebas-end-to-end-cypress)
  - [17. Pipeline de Integración y Despliegue Continuo (CI/CD)](#17-pipeline-de-integración-y-despliegue-continuo-cicd)
    - [17.1 Arquitectura del Flujo en GitHub Actions](#171-arquitectura-del-flujo-en-github-actions)
    - [17.2 Etapas del Pipeline (.github/workflows/backend.yml)](#172-etapas-del-pipeline-githubworkflowsbackendyml)
  - [18. Arquitectura y Guía de Despliegue en la Nube (AWS EC2 y Vercel)](#18-arquitectura-y-guía-de-despliegue-en-la-nube-aws-ec2-y-vercel)
    - [18.1 Entornos de Despliegue y URLs de Producción](#181-entornos-de-despliegue-y-urls-de-producción)
    - [18.2 Topología de Red y Servidores en AWS](#182-topología-de-red-y-servidores-en-aws)
    - [18.3 Configuración de Nginx Reverse Proxy](#183-configuración-de-nginx-reverse-proxy)
    - [18.4 Gestión de Procesos en Producción con PM2](#184-gestión-de-procesos-en-producción-con-pm2)
    - [18.5 Despliegue del Frontend en Vercel (Edge Runtime)](#185-despliegue-del-frontend-en-vercel-edge-runtime)
  - [19. Catálogo Consolidado de Endpoints REST (Fase 2)](#19-catálogo-consolidado-de-endpoints-rest-fase-2)
  - [20. Decisiones Técnicas y Reglas de Negocio Justificadas (Fase 2)](#20-decisiones-técnicas-y-reglas-de-negocio-justificadas-fase-2)

---

# PARTE I: MANUAL TÉCNICO — FASE 1

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


---

# PARTE II: EXTENSIONES Y ALCANCE TÉCNICO — FASE 2

---

## 9. Arquitectura General y Stack Tecnológico (Fase 2)

### 9.1 Modelo de Capas y MVC en Node.js 22 LTS

Para dar respuesta a los nuevos requerimientos académicos, de auditoría y de evaluación continua incorporados en la Fase 2, el backend de EduConnect evoluciona manteniendo una arquitectura limpia en **Capas (Layered / MVC)**. Esta estructura desacopla estrictamente las responsabilidades entre la captura de peticiones HTTP, validación de contratos de entrada, lógica de negocio, persistencia relacional transaccional y comunicación con servicios periféricos en la nube.

```
                                  [ Cliente Web Next.js 14 / HTTP Clients ]
                                                     |
                                                     v
                                  [ Capa de Enrutamiento (Express Router) ]
                                                     |
                                    +----------------+---------------+
                                    |                                |
                        [ Middlewares de Autenticación ]   [ Middlewares de Carga ]
                         (verifyToken, isEstudiante,       (Multer / Base64 Parser)
                           isTutor, isAdmin, 2FA)
                                    |                                |
                                    +----------------+---------------+
                                                     |
                                                     v
                                  [ Capa de Controladores (Controllers) ]
                                 (Validación de esquemas, respuestas JSON)
                                                     |
                        +----------------------------+----------------------------+
                        |                                                         |
                        v                                                         v
             [ Capa de Servicios y Utils ]                          [ Capa de Acceso a Datos ]
           (studyPlanPdf, twoFactor, bcrypt,                         - Dual Client PostgreSQL:
            cloudinaryUpload, emailService)                           * postgres (sql tagged)
                        |                                             * pg (Pool connection)
                        +----------------------------+----------------------------+
                                                     |
                                                     v
                                 [ Servicios en la Nube y Almacenamiento ]
                                  - PostgreSQL Neon Cloud (Transaccional)
                                  - Cloudinary Media Storage (PDFs y Fotos)
                                  - SMTP / Resend API (Correos Transaccionales)
```

### 9.2 Estructura de Directorios del Proyecto

La organización del repositorio refleja la separación modular entre servidor y cliente:

```
ProyectoFase2/
├── client/                                    # Frontend Next.js 14 (App Router)
│   ├── app/                                   # Rutas por rol (/admin, /student, /tutor, /auth)
│   ├── components/                            # Componentes UI (modales, visores PDF, ratings)
│   ├── lib/                                   # Contextos de autenticación y cliente API HTTP
│   └── public/                                # Recursos estáticos
├── server/                                    # Backend Node.js 22 LTS
│   ├── assets/
│   │   └── logo-educonnect.png                # Logotipo institucional para generación de PDFs
│   ├── src/
│   │   ├── app.js                             # Configuración central de Express y CORS
│   │   ├── config/
│   │   │   ├── db.js                          # Conexión dual: tagged template (postgres) y Pool (pg)
│   │   │   └── cloudinary.js                  # Configuración del SDK oficial de Cloudinary
│   │   ├── controllers/
│   │   │   ├── admin.js                       # Aprobaciones, visores, moderación y analítica
│   │   │   ├── auth.js                        # Login unificado y reenvío de token de verificación
│   │   │   ├── estudiante.js                  # Perfil y consultas de estudiante
│   │   │   ├── tutor.js                       # Perfil y gestión de tutor
│   │   │   ├── registro.estudiante.js         # Registro con foto y carné PDF en Cloudinary
│   │   │   ├── registro.tutor.js              # Registro con foto y CV PDF en Cloudinary
│   │   │   ├── student-plan.controller.js     # Consulta de planes y descarga PDFKit
│   │   │   ├── student-feedback.controller.js # Calificación de tutor y reporte de conducta
│   │   │   └── student-helpers.js             # Normalizador de sesiones e historial enriquecido
│   │   ├── middlewares/
│   │   │   └── auth.js                        # verifyToken, isEstudiante, isTutor, isAdmin
│   │   ├── routes/
│   │   │   ├── admin.routes.js                # Rutas de administración protegidas
│   │   │   ├── auth.routes.js                 # Rutas de autenticación y tokens
│   │   │   ├── student.routes.js              # Rutas de estudiante autenticado
│   │   │   ├── tutor.routes.js                # Rutas de tutor autenticado
│   │   │   ├── registro.estudiante.routes.js  # Rutas públicas de registro estudiantil
│   │   │   └── registro.tutor.routes.js       # Rutas públicas de registro de tutor
│   │   ├── services/
│   │   │   └── email.js                       # Despacho transaccional (Resend / Nodemailer)
│   │   └── utils/
│   │       ├── bcrypt.js                      # Criptografía unidireccional (salt rounds = 10)
│   │       ├── cloudinaryUpload.js            # Upload de Base64/Data-URI y buffers
│   │       ├── studyPlanPdf.js                # Generador vectorial PDFKit (formato A4)
│   │       └── twoFactor.js                   # TOTP (otplib) y cifrado AES-256-GCM
│   ├── test/                                  # Pruebas unitarias de registro y administración
│   ├── test-student/                          # Pruebas unitarias y de integración de estudiante
│   ├── Dockerfile                             # Imagen de contenedor para backend
│   └── package.json                           # Manifiesto de dependencias y scripts de ejecución
├── .github/
│   └── workflows/
│       └── backend.yml                        # Pipeline automatizado de CI/CD (Build, Test, Deploy)
├── docker-compose.yml                         # Orquestación de contenedores para desarrollo local
└── README.md
```

### 9.3 Matriz de Tecnologías y Dependencias

| Componente | Tecnología | Versión | Justificación Técnica |
|---|---|---|---|
| **Runtime Backend** | Node.js | v22 LTS | Motor JavaScript asíncrono con soporte V8 optimizado y compatibilidad nativa Fetch. |
| **Framework HTTP** | Express.js | ^4.18 / ^5.2 | Router minimalista de alto rendimiento con encadenamiento modular de middlewares. |
| **Base de Datos** | PostgreSQL (Neon Cloud) | v15+ | Motor relacional con integridad referencial ACID, índices parciales y escalabilidad serverless. |
| **Cliente de BD** | Dual (`postgres` + `pg`) | ^3.4 / ^8.11 | Permite `sql.begin()` para transacciones atómicas y `db.query` para consultas directas. |
| **Almacenamiento de Medios** | Cloudinary SDK | ^2.11.0 | Subida segura de imágenes y documentos privados en PDF con generación de firmas SHA temporales. |
| **Motor de PDF** | PDFKit | ^0.15.0 | Generador vectorial de documentos A4 en memoria sin dependencias externas del sistema operativo. |
| **Autenticación** | JSON Web Tokens (`jsonwebtoken`) | ^9.0.2 | Autenticación stateless y segura mediante tokens firmados criptográficamente (duración 8h). |
| **Cifrado de Contraseñas** | `bcryptjs` | ^2.4.3 | Función hash adaptativa resistente a ataques de fuerza bruta (costo 10). |
| **Segundo Factor (2FA)** | `otplib` + `crypto` nativo | ^12.0.1 | Algoritmo TOTP estándar RFC 6238 con cifrado simétrico AES-256-GCM de secrets. |
| **Correo Transaccional** | Nodemailer / Resend API | ^6.9 / ^3.2 | Despacho asíncrono y tolerante a fallos de plantillas HTML responsivas. |
| **Testing Automatizado** | Jest & `node:test` | ^29.7 / v22 | Ejecución determinista de pruebas con aislamiento estricto mediante mocks de base de datos e I/O. |
| **Frontend Web** | Next.js / React | v14 / v18 | Renderizado híbrido (SSR/CSR), enrutamiento por roles y cliente API modular. |

---

## 10. Modelo Relacional de Base de Datos y Diagrama ER (Fase 2)

### 10.1 Diagrama Entidad-Relación Completo

El modelo de datos relacional de la Fase 2 integra 14 tablas que garantizan integridad referencial estricta, control de unicidad por sesión y trazabilidad completa de planes de estudio, calificaciones y auditoría disciplinaria:

```mermaid
erDiagram
    ADMINISTRADOR {
        int id_administrador PK
        string nombre_usuario UK
        string password_hash
        string two_factor_secret
        boolean two_factor_enable
    }

    ESTUDIANTE {
        int id_estudiante PK
        string nombre
        string apellido
        string carnet UK
        string correo UK
        string password_hash
        string foto_url
        string carnet_pdf_url
        string estado_aprobacion
        string verification_token
        boolean is_email_verified
        datetime token_created_at
        datetime fecha_registro
    }

    TUTOR {
        int id_tutor PK
        string nombre
        string apellido
        string carnet_id UK
        string numero_identificacion_tutor UK
        string correo UK
        string password_hash
        string foto_url
        string cv_pdf_url
        string direccion_tutoria
        string universidad_graduacion
        int anio_inicio_tutorias
        string estado_aprobacion
        string verification_token
        boolean is_email_verified
        datetime token_created_at
    }

    MATERIA {
        int id_materia PK
        string nombre UK
    }

    TUTOR_MATERIA {
        int id_tutor FK
        int id_materia FK
    }

    SESION {
        int id_sesion PK
        int id_estudiante FK
        int id_tutor FK
        int id_materia FK
        date fecha_sesion
        time hora_sesion
        string estado
        text resumen_sesion
    }

    SOLICITUD {
        int id_solicitud PK
        int id_estudiante FK
        int id_tutor FK
        string tipo_usuario
        string estado
        text motivo_rechazo
        datetime fecha_procesado
    }

    STUDY_PLANS {
        int id_plan PK
        int id_sesion FK, UK
        datetime created_at
    }

    IDENTIFIED_DIFFICULTIES {
        int id_dificultad PK
        int id_plan FK
        text dificultad
    }

    RECOMMENDED_RESOURCES {
        int id_recurso PK
        int id_plan FK
        string nombre
        string tipo
        text descripcion_uso
        string url
    }

    TUTOR_RATINGS {
        int id_rating PK
        int id_sesion FK, UK
        int id_estudiante FK
        int id_tutor FK
        int estrellas
        text comentario
        datetime fecha_calificacion
    }

    STUDENT_RATINGS {
        int id_rating PK
        int id_sesion FK, UK
        int id_tutor FK
        int id_estudiante FK
        int estrellas
        text comentario
        datetime fecha_calificacion
    }

    TUTOR_REPORTS {
        int id_reporte PK
        int id_sesion FK, UK
        int id_estudiante FK
        int id_tutor FK
        string categoria
        text descripcion
        string estado
        text resolucion
        datetime fecha_reporte
    }

    STUDENT_REPORTS {
        int id_reporte PK
        int id_sesion FK, UK
        int id_tutor FK
        int id_estudiante FK
        string categoria
        text descripcion
        string estado
        text resolucion
        datetime fecha_reporte
    }

    ESTUDIANTE ||--o{ SESION : "solicita"
    TUTOR ||--o{ SESION : "atiende"
    MATERIA ||--o{ SESION : "tematica"
    TUTOR ||--o{ TUTOR_MATERIA : "imparte"
    MATERIA ||--o{ TUTOR_MATERIA : "es_impartida"
    ESTUDIANTE ||--o{ SOLICITUD : "origina"
    TUTOR ||--o{ SOLICITUD : "origina"
    SESION ||--o| STUDY_PLANS : "genera"
    STUDY_PLANS ||--o{ IDENTIFIED_DIFFICULTIES : "contiene"
    STUDY_PLANS ||--o{ RECOMMENDED_RESOURCES : "recomienda"
    SESION ||--o| TUTOR_RATINGS : "calificada_por_estudiante"
    SESION ||--o| STUDENT_RATINGS : "calificada_por_tutor"
    SESION ||--o| TUTOR_REPORTS : "denuncia_a_tutor"
    SESION ||--o| STUDENT_REPORTS : "denuncia_a_estudiante"
```

### 10.2 Diccionario de Datos de las Nuevas Entidades

#### Tabla: `study_plans`
Almacena el encabezado del plan de estudio pedagógico asociado unívocamente a una sesión atendida.
- `id_plan` (SERIAL, PRIMARY KEY): Identificador secuencial del plan de estudio.
- `id_sesion` (INTEGER, UNIQUE, REFERENCES `sesion(id_sesion)` ON DELETE CASCADE): Clave foránea que restringe un único plan de estudio por sesión.
- `created_at` (TIMESTAMP DEFAULT NOW()): Marca temporal de generación del plan.

#### Tabla: `identified_difficulties`
Almacena las debilidades académicas diagnosticadas durante la tutoría.
- `id_dificultad` (SERIAL, PRIMARY KEY): Identificador de la dificultad.
- `id_plan` (INTEGER, REFERENCES `study_plans(id_plan)` ON DELETE CASCADE): Clave foránea al plan contenedor.
- `dificultad` (TEXT, NOT NULL): Descripción de la deficiencia detectada.

#### Tabla: `recommended_resources`
Catálogo de materiales y bibliografía recomendada al alumno para su refuerzo.
- `id_recurso` (SERIAL, PRIMARY KEY): Identificador del recurso.
- `id_plan` (INTEGER, REFERENCES `study_plans(id_plan)` ON DELETE CASCADE): Clave foránea al plan contenedor.
- `nombre` (VARCHAR(255), NOT NULL): Nombre del libro, guía o herramienta digital.
- `tipo` (VARCHAR(50), NOT NULL): Clasificación (`Libro`, `PDF`, `Video`, `Plataforma Web`, `Guía de Ejercicios`).
- `descripcion_uso` (TEXT): Instrucciones pedagógicas de uso.
- `url` (TEXT): Enlace de acceso directo al material.

#### Tabla: `tutor_ratings`
Calificación cualitativa y cuantitativa otorgada por el estudiante al tutor.
- `id_rating` (SERIAL, PRIMARY KEY): Identificador de la calificación.
- `id_sesion` (INTEGER, UNIQUE, REFERENCES `sesion(id_sesion)` ON DELETE CASCADE): Relación 1:1 con la sesión atendida.
- `id_estudiante` (INTEGER, REFERENCES `estudiante(id_estudiante)`): Alumno emisor.
- `id_tutor` (INTEGER, REFERENCES `tutor(id_tutor)`): Tutor evaluado.
- `estrellas` (INTEGER NOT NULL CHECK (estrellas >= 0 AND estrellas <= 5)): Puntaje entero asignado.
- `comentario` (TEXT NOT NULL DEFAULT ''): Reseña del alumno.
- `fecha_calificacion` (TIMESTAMP DEFAULT NOW()): Momento de la emisión.

#### Tabla: `student_ratings`
Calificación otorgada por el tutor al estudiante tras finalizar la asesoría.
- `id_rating` (SERIAL, PRIMARY KEY): Identificador de la evaluación.
- `id_sesion` (INTEGER, UNIQUE, REFERENCES `sesion(id_sesion)` ON DELETE CASCADE): Relación 1:1 con la sesión.
- `id_tutor` (INTEGER, REFERENCES `tutor(id_tutor)`): Tutor evaluador.
- `id_estudiante` (INTEGER, REFERENCES `estudiante(id_estudiante)`): Alumno evaluado.
- `estrellas` (INTEGER NOT NULL CHECK (estrellas >= 1 AND estrellas <= 5)): Puntaje de 1 a 5.
- `comentario` (TEXT NOT NULL): Comentario pedagógico obligatorio.
- `fecha_calificacion` (TIMESTAMP DEFAULT NOW()): Marca temporal.

#### Tablas: `tutor_reports` y `student_reports`
Módulo de auditoría disciplinaria y denuncias de conducta.
- `id_reporte` (SERIAL, PRIMARY KEY): Identificador del incidente.
- `id_sesion` (INTEGER, UNIQUE, REFERENCES `sesion(id_sesion)` ON DELETE CASCADE): Restringe un solo reporte por sesión.
- `categoria` (VARCHAR(100) NOT NULL): Tipología de falta tipificada en el sistema.
- `descripcion` (TEXT NOT NULL): Relato detallado de los hechos.
- `estado` (VARCHAR(30) DEFAULT 'Pendiente'): Estado de moderación (`Pendiente`, `Resuelta`, `Desestimada`).
- `resolucion` (TEXT): Dictamen formal redactado por el administrador.
- `fecha_reporte` (TIMESTAMP DEFAULT NOW()): Fecha del reporte.

### 10.3 Concurrencia y Bloqueos de Fila (FOR UPDATE)

Para evitar condiciones de carrera (Race Conditions) cuando un estudiante o tutor intenta registrar calificaciones o reportes simultáneos, el sistema ejecuta transacciones atómicas con bloqueo de fila explícito en PostgreSQL:

```sql
BEGIN;

-- Bloquea la fila de la sesión para evitar evaluaciones concurrentes duplicadas
SELECT id_sesion, estado, id_estudiante, id_tutor 
FROM sesion 
WHERE id_sesion = $1 
FOR UPDATE;

-- Verifica que el estado sea estrictamente 'Atendida'
-- Inserta la calificación con garantía de unicidad
INSERT INTO tutor_ratings (id_sesion, id_estudiante, id_tutor, estrellas, comentario)
VALUES ($1, $2, $3, $4, $5);

COMMIT;
```

---

## 11. Módulo de Registro y Autenticación Unificada (Fase 2)

### 11.1 Registro de Estudiantes con Fotografía y Carné PDF

#### Especificación del Endpoint
- **Ruta:** `POST /api/student/register` (alias: `POST /api/auth/registro/estudiante`)
- **Acceso:** Público.
- **Controlador:** `server/src/controllers/registro.estudiante.js` -> `registerStudent`

#### Reglas de Validación de Entrada:
1. **Datos personales obligatorios:** `nombre`, `apellido`, `carnet`, `genero`, `direccion`, `telefono`, `fecha_nacimiento`, `correo`, `password`.
2. **Fotografía de Perfil Obligatoria (`foto_url`):** Cadena en formato Data-URI (`data:image/...`). Se sube a Cloudinary en la carpeta `educonnect/estudiantes`.
3. **Carné Universitario PDF Obligatorio (`carnet_pdf_url` o `carnet_pdf`):** Debe incluir obligatoriamente el prefijo `data:application/pdf;base64,`. Se almacena en Cloudinary como recurso seguro de tipo `raw`.
4. **Validación Criptográfica de Contraseñas:** Se aplica expresión regular estricta:
   ```javascript
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
   if (!passwordRegex.test(password)) {
     return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números' });
   }
   ```
5. **Transacción Atómica de Inserción:**
   ```javascript
   const { newStudent, newSolicitud } = await sql.begin(async (tx) => {
     const [student] = await tx`
       INSERT INTO estudiante (
         nombre, apellido, carnet, genero, direccion, telefono,
         fecha_nacimiento, foto_url, carnet_pdf_url, correo, password_hash,
         verification_token, is_email_verified, token_created_at, estado_aprobacion
       ) VALUES (
         ${nombre}, ${apellido}, ${carnet}, ${genero}, ${direccion}, ${telefono},
         ${fecha_nacimiento}, ${fotoFinal}, ${carnetPdfFinal}, ${correo}, ${hashedPassword},
         ${verificationToken}, FALSE, NOW(), 'pendiente'
       ) RETURNING id_estudiante, nombre, apellido, carnet, correo;
     `;

     const [solicitud] = await tx`
       INSERT INTO solicitud (id_estudiante, estado, tipo_usuario)
       VALUES (${student.id_estudiante}, 'pendiente', 'estudiante')
       RETURNING *;
     `;

     return { newStudent: student, newSolicitud: solicitud };
   });
   ```
6. **Token de Activación:** Se genera un número aleatorio de 6 dígitos (`100000` a `999999`) y se despacha asíncronamente al correo del estudiante.

---

### 11.2 Registro de Tutores con Fotografía, CV PDF y Especialidades

#### Especificación del Endpoint
- **Ruta:** `POST /api/tutor/registro` (alias: `POST /api/auth/registro/tutor`)
- **Acceso:** Público.
- **Controlador:** `server/src/controllers/registro.tutor.js` -> `registroTutor`

#### Reglas de Validación:
1. **Datos personales y profesionales:** `nombre`, `apellido`, `carnet_id`, `numero_identificacion_tutor`, `genero`, `direccion`, `telefono`, `fecha_nacimiento`, `correo`, `password`, `direccion_tutoria`, `universidad_graduacion`, `anio_inicio_tutorias`, `especialidad`.
2. **Validación de Tamaño y Formato del Curriculum Vitae:**
   ```javascript
   const pdfRaw = cv_pdf_url || cv_pdf || '';
   if (!/^data:application\/pdf;base64,/.test(pdfRaw)) {
     return res.status(400).json({ message: 'El archivo de CV debe ser un PDF válido' });
   }
   const pdfSizeBytes = Math.round((pdfRaw.split(',')[1]?.length || 0) * 0.75);
   if (pdfSizeBytes > 5 * 1024 * 1024) {
     return res.status(400).json({ message: 'El CV en formato PDF no debe exceder los 5MB' });
   }
   ```
3. **Normalización Relacional de Especialidades:** La lista de materias recibida en texto separado por comas se normaliza insertando cada asignatura en la tabla `materia` de forma idempotente (`ON CONFLICT (nombre) DO NOTHING`) y asociándola en la tabla pivote `tutor_materia`.

---

### 11.3 Sistema de Token de Verificación (6 dígitos) y Login Unificado

#### Endpoints
- `POST /api/auth/login` (Inicio de sesión unificado para Estudiantes y Tutores)
- `POST /api/auth/resend-verification` (Reenvío de token de activación vencido o no recibido)

#### Diagrama de Máquina de Estados de Autenticación:
```
   +--------------------------------------------------------------+
   |                     Registro Inicial                         |
   |   (Cuenta creada en estado 'pendiente' y token despachado)   |
   +------------------------------+-------------------------------+
                                  |
                                  v
   +--------------------------------------------------------------+
   |          Aprobación Administrativa (Admin Módulo)            |
   |              (estado_aprobacion -> 'aprobado')               |
   +------------------------------+-------------------------------+
                                  |
                                  v
   +--------------------------------------------------------------+
   |                        Primer Login                          |
   |        Payload: { correo, password, verification_token }     |
   +------------------------------+-------------------------------+
                                  |
                 +----------------+----------------+
                 |                                 |
                 v (Válido y < 24 Horas)           v (Inválido o > 24 Horas)
   +------------------------------+  +-------------------------------+
   |   is_email_verified = TRUE   |  |        Error HTTP 400         |
   |   Generación de JWT (8h)     |  | (requiresVerification/expired)|
   +------------------------------+  +---------------+---------------+
                 |                                   |
                 |                                   v
                 |                   +-------------------------------+
                 |                   | POST /auth/resend-verification|
                 |                   | (Emite nuevo token de 6 dígs) |
                 |                   +-------------------------------+
                 v
   +--------------------------------------------------------------+
   |                      Logins Posteriores                      |
   |                  Payload: { correo, password }               |
   |             -> Acceso Inmediato y Emisión de JWT             |
   +--------------------------------------------------------------+
```

#### Reglas de Expiración y Desbloqueo:
- El token tiene una ventana de validez de exactamente 24 horas (`86,400,000 milisegundos`).
- Si `(Date.now() - token_created_at) > 86400000`, el sistema rechaza la solicitud indicando `tokenExpired`.
- Si el usuario no ha sido aprobado por el administrador, se devuelve `403 Forbidden` con el mensaje: `Tu cuenta aún no ha sido aprobada por un administrador`.
- Una vez verificado (`is_email_verified = TRUE`), el campo del token se vuelve opcional y se ignora en accesos futuros.

---

### 11.4 Reenvío de Token de Verificación

- **Endpoint:** `POST /api/auth/resend-verification`
- **Controlador:** `auth.controller.js` -> `resendVerificationToken`
- **Payload:** `{ "correo": "usuario@universidad.edu.gt" }`
- **Comportamiento:** Genera un nuevo código de 6 dígitos criptográficamente seguro, actualiza `verification_token` y `token_created_at = NOW()` en la tabla correspondiente (`estudiante` o `tutor`), y despacha un correo inmediato con la plantilla institucional formal.

---

## 12. Módulo Administrador (Fase 2)

### 12.1 Aprobación y Rechazo con Visor Embebido de Documentos

El administrador puede inspeccionar visualmente los documentos acreditantes antes de tomar una decisión de admisión:
- **Aprobación de Estudiante:** `PUT /api/admin/students/:id/approve` -> Actualiza `estado_aprobacion = 'aprobado'` y despacha correo de bienvenida (`sendApprovalEmail`) con el token de activación.
- **Rechazo de Estudiante:** `PUT /api/admin/students/:id/reject` -> Registra el motivo formal de rechazo en la solicitud y notifica al usuario vía email.
- **Aprobación/Rechazo de Tutores:** Mismo mecanismo transaccional sobre la entidad `tutor`.

---

### 12.2 Generación de URLs Firmadas Temporales (Cloudinary SDK, 15 min)

Para permitir la visualización directa del carné universitario y del CV sin exponer buckets de almacenamiento público:
- **Endpoints:**
  - `GET /api/admin/students/:id/documento`
  - `GET /api/admin/tutors/:id/documento`
- **Mecanismo Criptográfico:** Si el documento reside en Cloudinary en un bucket privado (`type: 'upload'`, `resource_type: 'raw'`), el servidor genera una URL temporal firmada con expiración estricta de 15 minutos (`900 segundos`):
  ```javascript
  const signedUrl = cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 900
  });
  ```

---

### 12.3 Proxy Seguro y Streaming de Documentos PDF

- **Endpoint:** `GET /api/admin/documento/stream`
- **Parámetros:** `?id=<id>&tipo=<estudiante|tutor>` o `?url=<URL_ENCODED>`
- **Justificación de Arquitectura:** Diversos navegadores y componentes de visualización PDF bloquean recursos externos debido a directivas de Same-Origin Policy (CORS) o la ausencia de la cabecera `Content-Disposition: inline`.
- **Implementación:** El servidor Node.js descarga el archivo en un buffer de memoria y lo retransmite al navegador cliente con las cabeceras requeridas:
  ```javascript
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="documento-verificacion.pdf"');
  res.setHeader('Cache-Control', 'public, max-age=1800');
  res.send(buffer);
  ```

---

### 12.4 Gestión de Estudiantes Activos (Regla de Inmutabilidad de Correo)

- **Listado de Aprobados:** `GET /api/admin/students/approved`
- **Actualización de Perfil:** `PUT /api/admin/students/:id`
- **Regla Estricta de Seguridad:** El correo electrónico institucional (`correo`) es inmutable. El controlador descarta cualquier intento de modificación de este campo en el payload, salvaguardando la identidad institucional y la integridad de las sesiones asociadas.

---

### 12.5 Gestión de Tutores Activos (Materias y Correo Bloqueado)

- **Listado de Aprobados con Materias Agregadas:** `GET /api/admin/tutors/approved`
  Utiliza subconsulta con `json_agg` para recuperar en una sola llamada eficiente todas las materias impartidas por cada tutor.
- **Actualización de Tutor:** `PUT /api/admin/tutors/:id`
  El correo electrónico institucional permanece inmutable. En el caso de las asignaturas impartidas, el backend ejecuta una transacción atómica que limpia las asignaciones previas en `tutor_materia` e inserta las nuevas materias seleccionadas por el administrador.

---

### 12.6 Bajas Administrativas con Purga Relacional en Cascada

- **Baja de Estudiante:** `PUT /api/admin/students/:id/deactivate`
- **Baja de Tutor:** `PUT /api/admin/tutors/:id/deactivate`
- Para no violar restricciones de clave foránea ni dejar registros huérfanos, el sistema ejecuta una purga transaccional ordenada en cascada:
  ```sql
  DELETE FROM tutor_ratings WHERE id_estudiante = $1;
  DELETE FROM student_ratings WHERE id_estudiante = $1;
  DELETE FROM tutor_reports WHERE id_estudiante = $1;
  DELETE FROM student_reports WHERE id_estudiante = $1;
  DELETE FROM sesion WHERE id_estudiante = $1;
  DELETE FROM solicitud WHERE id_estudiante = $1;
  DELETE FROM estudiante WHERE id_estudiante = $1;
  ```
  Posteriormente, se dispara una notificación formal por correo electrónico (`sendDeactivationEmail`).

---

### 12.7 Moderación y Dictamen Formal de Denuncias

- **Consulta:** `GET /api/admin/denuncias?tipo=tutor` o `?tipo=estudiante&estado=pendiente`
- **Resolución:** `PATCH /api/admin/denuncias/:id/resolver`
- **Payload:**
  ```json
  {
    "estado": "resuelta",
    "resolucion": "Se verificó la falta con la grabación y se procedió a suspender preventivamente al tutor."
  }
  ```
- Estados admitidos: `pendiente`, `resuelta`, `desestimada`.

---

### 12.8 Auditoría y Reportes de Calificaciones

- **Calificaciones de Tutores:** `GET /api/admin/ratings/tutors` -> Calcula el promedio de estrellas, desglose por puntuación y recopila reseñas cualitativas de estudiantes.
- **Calificaciones de Estudiantes:** `GET /api/admin/ratings/students` -> Consolida el rendimiento de los alumnos según la retroalimentación de los tutores.

---

### 12.9 Motor Analítico Avanzado de Tutorías (6 Consultas Concurrentes)

- **Endpoint:** `GET /api/admin/reportes`
- **Optimización de Rendimiento:** Ejecuta 6 consultas relacionales concurrentes en PostgreSQL mediante `Promise.all`:
  1. Conteo de sesiones agrupadas por estado (`Atendida`, `Pendiente`, `Cancelada por el tutor`, `Cancelada por el estudiante`).
  2. Materias con mayor número de sesiones concluidas satisfactoriamente.
  3. Ranking de tutores con mayor volumen de horas de asesoría impartidas.
  4. Indicadores globales: total de sesiones, total de estudiantes únicos y tutores únicos.
  5. **Top 5 materias con mayor tasa de cancelación:**
     ```sql
     SELECT m.nombre AS materia, COUNT(*)::integer AS total_canceladas
     FROM sesion s 
     JOIN materia m ON m.id_materia = s.id_materia
     WHERE s.estado LIKE 'Cancelada%'
     GROUP BY m.nombre 
     ORDER BY total_canceladas DESC 
     LIMIT 5;
     ```
  6. **Distribución de demanda por franjas horarias (Top 6 horas pico):**
     ```sql
     SELECT TO_CHAR(hora_sesion, 'HH24:00') AS franja_horaria, COUNT(*)::integer AS total_sesiones
     FROM sesion 
     GROUP BY TO_CHAR(hora_sesion, 'HH24:00')
     ORDER BY total_sesiones DESC 
     LIMIT 6;
     ```

---

## 13. Módulo Tutor (Fase 2)

### 13.1 Calificación de Estudiantes tras Sesión Atendida (rateStudent)

- **Endpoint:** `POST /api/tutor/sessions/:id/rating`
- **Controlador:** `rateStudent`
- **Parámetros de Entrada:**
  ```json
  {
    "estrellas": 4,
    "comentario": "El estudiante asistió puntualmente y con los ejercicios previos resueltos."
  }
  ```
- **Reglas de Negocio:**
  - `estrellas`: Número entero obligatorio entre `1` y `5`.
  - `comentario`: Obligatorio (no vacío), máximo 500 caracteres.
  - Implementa comportamiento **UPSERT**: si el tutor reevalúa la sesión, se actualizan los valores existentes devolviendo código `200 OK`; si es la primera calificación, se crea con código `201 Created`.
  - La sesión debe pertenecer a `req.user.id` (tutor autenticado) y estar en estado estricto `Atendida`.

---

### 13.2 Reporte de Faltas Graves del Estudiante (reportStudent)

- **Endpoint:** `POST /api/tutor/sessions/:id/report`
- **Controlador:** `reportStudent`
- **Categorías de Falta Grave Validadas:** `Conducta inapropiada`, `Falsificacion de documentos`, `Agresion verbal o fisica`, `Plagio_Copia`, `Inasistencia_Injustificada`, `Incumplimiento_Acuerdos`, `Acoso_Bullying`, `Portacion Objetos Peligrosos`, `Uso Indebido de la Tecnologia`.
- En caso de intento de reporte duplicado sobre la misma sesión, se intercepta la violación de clave única (código PostgreSQL `23505`) respondiendo `409 Conflict`.

---

### 13.3 Cierre Pedagógico y Seguimiento de Sesiones Atendidas

Al culminar una asesoría, el tutor registra el resumen de la sesión e interactúa con el subsistema de planes de estudio para alimentar el diagnóstico de dificultades del estudiante y recomendar los recursos bibliográficos pertinentes.

---

## 14. Módulo Estudiante (Fase 2)

### 14.1 Consulta Estructurada de Planes de Estudio

- **Endpoint:** `GET /api/student/study-plans`
- **Controlador:** `server/src/controllers/student-plan.controller.js` -> `getStudyPlans`
- **Seguridad:** Requiere encabezado `Authorization: Bearer <TOKEN_ESTUDIANTE>`.
- **Comportamiento:** Devuelve los planes generados para sesiones en estado estrictamente `Atendida` vinculadas al estudiante autenticado.

#### Ejemplo de Estructura de Respuesta JSON:
```json
[
  {
    "id": 14,
    "id_sesion": 105,
    "fechaUltimaSesion": "2026-10-18",
    "tutor": {
      "nombre": "Elena Morales",
      "especialidades": "Estructuras de Datos, Algoritmos Avanzados",
      "numero_identificacion": "TUT-8831"
    },
    "identified_difficulties": [
      {
        "id": 101,
        "dificultad": "Complejidad asintótica en árboles balanceados AVL y rotaciones dobles."
      }
    ],
    "recommended_resources": [
      {
        "id": 201,
        "nombre": "Introduction to Algorithms (CLRS) - Capítulo 13",
        "tipo": "Libro",
        "descripcion_uso": "Estudiar la demostración formal del costo de rebalanceo y resolver ejercicios 13.1-13.4.",
        "url": "https://biblioteca.usac.edu.gt/clrs-cap13.pdf"
      },
      {
        "id": 202,
        "nombre": "Visualgo.net - Módulo de Árboles AVL",
        "tipo": "Plataforma Web",
        "descripcion_uso": "Simular interactivamente las inserciones y eliminaciones para visualizar rotaciones simples y dobles.",
        "url": "https://visualgo.net/es/bst"
      }
    ]
  }
]
```

---

### 14.2 Generación Vectorial A4 y Descarga de Constancia Oficial en PDF (PDFKit)

- **Endpoint:** `GET /api/student/study-plans/:id/pdf`
- **Controlador:** `downloadStudyPlanPdf`
- **Motor de Render:** `server/src/utils/studyPlanPdf.js` mediante la librería **PDFKit**.
- **Cabeceras HTTP de Respuesta:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="educonnect-plan-<id>.pdf"`

#### Anatomía del Documento PDF Institucional Generado:
1. **Encabezado Institucional Corporativo:**
   - Logotipo oficial de EduConnect cargado desde `server/assets/logo-educonnect.png`.
   - Razón institucional: `EduConnect - Plataforma de Gestión de Tutorías Académicas`.
   - Fecha y hora exacta de emisión en formato ISO legible.
   - Teléfono de contacto de soporte oficial extraído de `process.env.EDUCONNECT_CONTACT_PHONE`.
2. **Tarjeta de Datos de la Tutoría:**
   - Nombre completo del estudiante y carné universitario.
   - Nombre completo del tutor y número de identificación profesional.
   - Asignatura impartida y fecha en que fue atendida la sesión.
3. **Sección de Diagnóstico Académico:**
   - Listado numerado de dificultades y deficiencias conceptuales identificadas por el tutor.
4. **Tabla de Recursos y Recomendaciones:**
   - Columnas estructuradas: **Nombre del Recurso**, **Tipo de Material**, **Instrucciones Pedagógicas de Uso** y **Enlace / Referencia**.
5. **Pie de Página Oficial y Metadatos:**
   - Firma emulada del tutor y matrícula profesional.
   - Numeración dinámica multi-página: `Página X de Y` mediante listeners de eventos `pageAdded` en PDFKit.

---

### 14.3 Calificación de la Atención del Tutor (rateTutor)

- **Endpoint:** `POST /api/student/sessions/:id/rating`
- **Controlador:** `server/src/controllers/student-feedback.controller.js` -> `rateTutor`
- **Parámetros de Entrada (Body JSON):**
  ```json
  {
    "estrellas": 5,
    "comentario": "Excelente explicación de los teoremas de cálculo, resolvió todas las dudas con claridad."
  }
  ```
- **Validaciones Técnicas:**
  - `estrellas`: Número entero en el rango de `0` a `5`.
  - `comentario`: Texto de hasta 500 caracteres (si se omite en la solicitud, se almacena como cadena vacía `""` para cumplir la restricción `NOT NULL`).
  - La sesión debe existir, pertenecer al estudiante (`id_estudiante = req.user.id`) y estar en estado estricto `Atendida`.
  - Se ejecuta bajo aislamiento transaccional para verificar que no exista calificación previa (`UNIQUE(id_sesion)`) con bloqueo de fila `FOR UPDATE`.

---

### 14.4 Reporte de Conducta del Tutor (reportTutor)

- **Consulta de Categorías:** `GET /api/student/report-categories`
  - `Etica y profesionalismo`
  - `Negligencia academica`
  - `Abuso o conducta inapropiada`
  - `Falsificacion de informacion`
  - `Otro`
- **Envío de Denuncia:** `POST /api/student/sessions/:id/report`
- **Validaciones:** Longitud de `descripcion` entre 10 y 2000 caracteres. Unicidad garantizada por `UNIQUE(id_sesion)` en `tutor_reports`.

---

### 14.5 Historial de Sesiones Enriquecido con Evaluaciones y Reportes

En `src/controllers/student-helpers.js`, la función `getStudentSessionsByState` vincula mediante subconsultas relacionales los objetos `calificacion` y `reporte` (o `null`) a cada sesión atendida. De este modo, la interfaz del estudiante sabe de inmediato si la sesión ya fue calificada o denunciada sin necesidad de realizar peticiones HTTP redundantes.

---

## 15. Servicios Transaccionales y Almacenamiento en la Nube

### 15.1 Cloudinary SDK (Firmas Criptográficas SHA y CDN)

- **Configuración:** `server/src/config/cloudinary.js`
- **Almacenamiento de Fotos:** Las imágenes de perfil de estudiantes y tutores se procesan con `resource_type: 'image'`, optimización automática de compresión y entrega a través de CDN global.
- **Almacenamiento de Documentos Confidenciales:** Los carnés universitarios y currículums en PDF se almacenan con `resource_type: 'raw'` y acceso restringido para proteger los datos personales de la comunidad estudiantil.

### 15.2 Despacho Asíncrono de Correos (Nodemailer y Resend)

- **Ubicación:** `server/src/services/email.js`
- **Plantillas HTML Transaccionales:**
  - `sendVerificationEmail`: Envío de token de activación de 6 dígitos numéricos con diseño institucional formal en verde (`#1B5E20`) y tipografía destacada.
  - `sendApprovalEmail`: Notificación de cuenta aprobada o rechazada con el motivo detallado.
  - `sendDeactivationEmail`: Notificación de baja administrativa por incumplimiento de términos.
  - `sendCancellationEmail`: Alerta de sesión cancelada por tutor o estudiante.

---

## 16. Aseguramiento de Calidad y Pruebas Automatizadas

### 16.1 Estrategia de Aislamiento y Mocks

Para garantizar que el conjunto de pruebas unitarias sea determinista, veloz y se ejecute sin dependencias de red en el pipeline de CI/CD:
- **Mock de Base de Datos:** Intercepta `db.query` y tagged templates `sql` retornando datasets predefinidos en memoria mediante espías `jest.fn()`.
- **Mock de Cloudinary:** Simula la subida de medios y retorna URLs sintéticas sin interactuar con los servidores externos.
- **Mock de Servicios de Correo:** Captura el despacho de correos en memoria verificando destinatarios y tokens generados.

### 16.2 Inventario de Suites de Pruebas Unitarias

#### 1. Suite de Pruebas de Registro (13 Tests Jest)
- **Archivo:** `server/test/register-student.test.js`
- **Casos:** Registro exitoso de estudiante, validación de campos obligatorios, rechazo por omisión de foto, rechazo por omisión de carné PDF, validación de regex de contraseñas, detección de correos y carnés duplicados, y rollback transaccional ante excepciones de base de datos.

#### 2. Suite de Pruebas del Módulo Estudiante (34 Tests Jest + 8 Tests node:test)
- **Directorio:** `server/test-student/UnitTest/`
- **Cobertura:** 84.15% en líneas globales y 100% de cobertura en `student-plan.controller.js`.
- **Casos:** Consulta de planes activos, aislamiento de datos entre estudiantes autenticados, generación y descarga de constancias en PDFKit, validación de escala de 0 a 5 estrellas, unicidad de reportes y control de estados de sesión.

#### 3. Suite de Pruebas del Módulo Administrador (42 Tests Jest)
- **Archivo:** `server/test/UnitTest/admin/admin.unit.test.js`
- **Resultados:** 42 casos ejecutados y aprobados al 100% en un tiempo promedio de 0.68 segundos.
- **Casos:** Aprobación y rechazo de solicitudes, firma criptográfica de URLs de carnés y CVs, streaming proxy de documentos, inmutabilidad de correo en edición, purga en cascada de usuarios y consultas analíticas concurrentes.

### 16.3 Pruebas de Frontend y Pruebas End-to-End (Cypress)

- **Pruebas Unitarias de Interfaz:** React Testing Library y Jest validan renderizado de formularios, modales y visores.
- **Pruebas End-to-End (E2E):** Implementadas con **Cypress** para verificar flujos completos de usuario:
  - Registro con adjuntos de foto y PDF y validación de token.
  - Flujo de solicitud y aprobación por el administrador.
  - Agendamiento y atención de sesión con generación de constancia PDF.
  - Evaluación bidireccional y auditoría administrativa de reportes.

---

## 17. Pipeline de Integración y Despliegue Continuo (CI/CD)

### 17.1 Arquitectura del Flujo en GitHub Actions

El repositorio cuenta con un pipeline de integración y despliegue continuo completamente automatizado, definido en `.github/workflows/backend.yml`:

```mermaid
flowchart TD
    A[Push a rama main / workflow_dispatch] --> B[Job 1: Build]
    subgraph Job 1: Build
        B1[Checkout Código] --> B2[Setup Node.js 22 + Cache npm]
        B2 --> B3[Instalar Dependencias: npm ci]
        B3 --> B4[Construir Imagen Docker: cicd-educonnect]
    end
    B4 --> C[Job 2: Test]
    subgraph Job 2: Test
        C1[Checkout Código] --> C2[Setup Node.js 22 + Cache npm]
        C2 --> C3[Instalar Dependencias: npm ci]
        C3 --> C4[Ejecutar Pruebas: npm run test:unit]
    end
    C4 --> D[Job 3: Deploy]
    subgraph Job 3: Deploy
        D1[Checkout Código] --> D2[Setup Node.js 22 + Cache npm]
        D2 --> D3[Instalar Solo Producción: npm ci --omit=dev]
        D3 --> D4[Arranque en Background: npm start &]
        D4 --> D5[Verificación de Liveness por 15 Segundos]
        D5 --> D6{¿Server vivo tras 15s? exit code 124}
        D6 -- Sí --> D7[Despliegue Simulado Exitoso]
        D6 -- No --> D8[Fallo del Pipeline]
    end
```

### 17.2 Etapas del Pipeline (.github/workflows/backend.yml)

El archivo de configuración oficial del flujo CI/CD del backend contiene las siguientes especificaciones:

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - "ProyectoFase2/server/**"
  workflow_dispatch:

defaults:
  run:
    working-directory: ProyectoFase2/server

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout código"
        uses: actions/checkout@v4

      - name: "Configurar Node.js 22 + cache npm"
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
          cache-dependency-path: ProyectoFase2/server/package-lock.json

      - name: "Instalar dependencias"
        run: npm ci

      - name: "Build imagen Docker"
        run: docker build -t cicd-educonnect .

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: "Checkout código"
        uses: actions/checkout@v4

      - name: "Configurar Node.js 22 + cache npm"
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
          cache-dependency-path: ProyectoFase2/server/package-lock.json

      - name: "Instalar dependencias (cached)"
        run: npm ci

      - name: "Ejecutar pruebas unitarias"
        run: npm run test:unit

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: "Checkout código"
        uses: actions/checkout@v4

      - name: "Configurar Node.js 22 + cache npm"
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
          cache-dependency-path: ProyectoFase2/server/package-lock.json

      - name: "Instalar solo dependencias de producción"
        run: npm ci --omit=dev

      - name: "Verificar que el server inicia y se mantiene vivo (15s)"
        env:
          PORT: 4000
          NODE_ENV: test
          OTP_ENCRYPTION_KEY: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          JWT_SECRET: "test-secret-for-ci-only-do-not-use-in-production"
          DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
        run: |
          npm start &
          SERVER_PID=$!
          timeout 15s tail --pid=$SERVER_PID -f /dev/null
          EXIT_CODE=$?
          kill $SERVER_PID 2>/dev/null || true

          if [ $EXIT_CODE -eq 124 ]; then
            echo "Server se mantuvo vivo 15 segundos - deploy simulado OK"
            exit 0
          else
            echo "Server crasheó o terminó prematuramente (exit code: $EXIT_CODE)"
            exit 1
          fi
```

---

## 18. Arquitectura y Guía de Despliegue en la Nube (AWS EC2 y Vercel)

### 18.1 Entornos de Despliegue y URLs de Producción

Para garantizar alta disponibilidad, desacoplamiento de componentes y redundancia operativa en la Fase 2, el proyecto EduConnect cuenta con dos infraestructuras de despliegue en la nube plenamente operativas y verificadas:

| Entorno / Plataforma | URL de Producción | Componentes Desplegados | Rol y Alcance Técnico |
|---|---|---|---|
| **AWS EC2 (Infraestructura Principal)** | [EduConnect - G8](http://107.21.86.168/login) | **Backend + Proyecto Completo (Full-Stack)** | Servidor en la nube en instancia AWS EC2 con IP pública fija `107.21.86.168`. Aloja la API RESTful de Node.js/Express (puerto 4000) y el build standalone de producción de Next.js (puerto 3000), orquestados con PM2 y unificados bajo Nginx como Reverse Proxy en el puerto 80. Sirvió para el despliegue del backend y también para el proyecto entero. |
| **Vercel (Plataforma Serverless Edge)** | [https://educonnect-lovat-five.vercel.app/login](https://educonnect-lovat-five.vercel.app/login) | **Frontend (Next.js)** | Despliegue en la red CDN Edge global de Vercel con integración continua y distribución geográfica de bajo tiempo de respuesta. Sirvió para el despliegue del frontend, consumiendo los endpoints de la API centralizada. |

#### Detalle de los Puntos de Acceso:
1. **Frontend en Vercel:**  
   - **URL Directa:** `https://educonnect-lovat-five.vercel.app/login`  
   - **Función:** Sirvió para el despliegue del frontend. Permite a estudiantes, tutores y administradores interactuar con una interfaz Next.js optimizada con renderizado híbrido y CDN serverless de alta velocidad.
2. **Backend y Proyecto Entero en AWS EC2:**  
   - **URL Directa:** [EduConnect - G8](http://107.21.86.168/login) (`http://107.21.86.168/login`)  
   - **Host / IP Pública:** `107.21.86.168`  
   - **Función:** Sirvió para el despliegue del backend y también para el proyecto entero. Gestiona los endpoints de la API en `http://107.21.86.168/api/` y aloja la aplicación completa sirviendo la versión cliente en la raíz `http://107.21.86.168/` mediante proxy inverso Nginx.

---

### 18.2 Topología de Red y Servidores en AWS

Para la puesta en producción en la infraestructura en la nube de **Amazon Web Services (AWS)** sobre una instancia **EC2 (Ubuntu 22.04 LTS o Amazon Linux 2023)** con IP pública fija `107.21.86.168`:

```
                          [ Clientes Web / Internet ]
                                      |
                                      v
                           [ AWS IP: 107.21.86.168 ]
                                      |
                                      v
                        [ Nginx Reverse Proxy (Puerto 80 HTTP) ]
                          |                                |
        /api/* -> Puerto 4000                              | /* -> Puerto 3000
                          v                                v
               [ PM2: Backend Node.js ]          [ PM2: Next.js Standalone ]
                          |                                |
                          +---------------+----------------+
                                          |
                                          v
                            [ PostgreSQL Neon Cloud (SSL) ]
                            [ Cloudinary Media Storage ]
```

---

### 18.3 Configuración de Nginx Reverse Proxy

Archivo de configuración del servidor web en `/etc/nginx/conf.d/educonnect.conf` en la instancia AWS EC2:

```nginx
server {
    listen 80;
    server_name 107.21.86.168;

    # Archivos estáticos de Next.js
    location /_next/static/ {
        alias /var/www/educonnect/ProyectoFase2/client/.next/static/;
        expires 365d;
        access_log off;
    }

    # API Backend (Node.js Express en puerto 4000)
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Aplicación Web Frontend Completa (Next.js en puerto 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 18.4 Gestión de Procesos en Producción con PM2

Para garantizar alta disponibilidad y autoreinicio ante excepciones o reinicios del servidor en AWS, se utiliza **PM2** configurado en `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'educonnect-backend',
      script: './server.js',
      cwd: '/var/www/educonnect/ProyectoFase2/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'educonnect-frontend',
      script: '.next/standalone/server.js',
      cwd: '/var/www/educonnect/ProyectoFase2/client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

#### Comandos de Puesta en Marcha en AWS EC2:
```bash
# 1. Instalar dependencias en servidor
sudo apt update && sudo apt install -y nginx git nodejs npm
sudo npm install -g pm2

# 2. Clonar repositorio
git clone https://github.com/SebastianVelasquezValle/AYD1_2S_G8.git /var/www/educonnect
cd /var/www/educonnect/ProyectoFase2/server
npm ci --production

# 3. Arrancar servicios con PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 4. Habilitar y recargar Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx
```

---

### 18.5 Despliegue del Frontend en Vercel (Edge Runtime)

El frontend Next.js de la plataforma cuenta con un despliegue serverless complementario en **Vercel** (`https://educonnect-lovat-five.vercel.app/login`), sirviendo como acceso distribuido:

1. **Configuración del Proyecto en Vercel:**
   - **Root Directory:** `./ProyectoFase2/client`
   - **Framework Preset:** `Next.js`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
2. **Variables de Entorno en Vercel:**
   - `NEXT_PUBLIC_API_URL`: Vinculada directamente al backend en AWS (`http://107.21.86.168/api`) para el consumo de autenticación unificada, gestión de planes de estudio, streaming de documentos y reportes analíticos.
3. **Beneficios Operativos:**
   - Entrega de recursos estáticos y páginas pre-renderizadas mediante CDN global con latencia mínima.
   - Despliegue continuo activado por commits y previsualizaciones instantáneas en ramas de desarrollo.

---

## 19. Catálogo Consolidado de Endpoints REST (Fase 2)

### Módulo de Registro y Autenticación (Públicos)
| Método | Endpoint | Controlador | Middleware de Auth | Descripción |
|---|---|---|---|---|
| POST | `/api/student/register` | `registerStudent` | Ninguno (Público) | Registro de estudiante con foto y carné en PDF. |
| POST | `/api/tutor/registro` | `registroTutor` | Ninguno (Público) | Registro de tutor con foto, CV en PDF y especialidades. |
| POST | `/api/auth/login` | `loginUnified` | Ninguno (Público) | Login unificado con verificación por token de 6 dígitos. |
| POST | `/api/auth/resend-verification` | `resendVerificationToken` | Ninguno (Público) | Reenvío de token de activación de cuenta. |

### Módulo Estudiante (Requiere Token de Estudiante)
| Método | Endpoint | Controlador | Middleware de Auth | Descripción |
|---|---|---|---|---|
| GET | `/api/student/study-plans` | `getStudyPlans` | `verifyToken`, `isEstudiante` | Consulta de planes de estudio de sesiones atendidas. |
| GET | `/api/student/study-plans/:id/pdf` | `downloadStudyPlanPdf` | `verifyToken`, `isEstudiante` | Descarga de constancia oficial vectorial en PDF (PDFKit). |
| POST | `/api/student/sessions/:id/rating` | `rateTutor` | `verifyToken`, `isEstudiante` | Calificación del tutor tras finalizar la sesión (0-5 estrellas). |
| GET | `/api/student/report-categories` | `getReportCategories` | `verifyToken`, `isEstudiante` | Catálogo oficial de causales de denuncia. |
| POST | `/api/student/sessions/:id/report` | `reportTutor` | `verifyToken`, `isEstudiante` | Denuncia formal contra tutor por falta disciplinaria. |
| GET | `/api/student/sessions/history` | `getStudentSessionsByState` | `verifyToken`, `isEstudiante` | Historial de sesiones enriquecido con ratings y reportes. |

### Módulo Tutor (Requiere Token de Tutor)
| Método | Endpoint | Controlador | Middleware de Auth | Descripción |
|---|---|---|---|---|
| POST | `/api/tutor/sessions/:id/rating` | `rateStudent` | `verifyToken`, `isTutor` | Calificación y feedback al estudiante (1-5 estrellas, upsert). |
| POST | `/api/tutor/sessions/:id/report` | `reportStudent` | `verifyToken`, `isTutor` | Reporte de falta grave cometida por el alumno (10 causales). |

### Módulo Administrador (Requiere Token de Administrador)
| Método | Endpoint | Controlador | Middleware de Auth | Descripción |
|---|---|---|---|---|
| GET | `/api/admin/students/pending` | `getPendingStudents` | `verifyToken`, `isAdmin` | Solicitudes de inscripción de estudiantes pendientes. |
| PUT | `/api/admin/students/:id/approve` | `approveStudent` | `verifyToken`, `isAdmin` | Aprobación de estudiante y despacho de correo de alta. |
| PUT | `/api/admin/students/:id/reject` | `rejectStudent` | `verifyToken`, `isAdmin` | Rechazo fundamentado de solicitud de estudiante. |
| GET | `/api/admin/students/:id/documento` | `getStudentDocument` | `verifyToken`, `isAdmin` | URL firmada temporal de carné universitario en PDF. |
| GET | `/api/admin/tutors/:id/documento` | `getTutorDocument` | `verifyToken`, `isAdmin` | URL firmada temporal de CV de tutor en PDF. |
| GET | `/api/admin/documento/stream` | `streamDocumento` | `verifyToken`, `isAdmin` | Streaming proxy de documentos PDF para visor embebido. |
| GET | `/api/admin/students/approved` | `getApprovedStudents` | `verifyToken`, `isAdmin` | Listado de estudiantes activos con paginación. |
| PUT | `/api/admin/students/:id` | `updateStudentAdmin` | `verifyToken`, `isAdmin` | Actualización de perfil (correo estrictamente bloqueado). |
| PUT | `/api/admin/students/:id/deactivate` | `deactivateStudent` | `verifyToken`, `isAdmin` | Baja administrativa con eliminación en cascada. |
| GET | `/api/admin/tutors/approved` | `getApprovedTutors` | `verifyToken`, `isAdmin` | Listado de tutores activos con materias agregadas (`json_agg`). |
| PUT | `/api/admin/tutors/:id` | `updateTutorAdmin` | `verifyToken`, `isAdmin` | Edición de tutor y sincronización de materias impartidas. |
| PUT | `/api/admin/tutors/:id/deactivate` | `deactivateTutor` | `verifyToken`, `isAdmin` | Baja administrativa de tutor con purga referencial. |
| GET | `/api/admin/denuncias` | `getDenuncias` | `verifyToken`, `isAdmin` | Consulta de denuncias filtradas por tipo y estado. |
| PATCH | `/api/admin/denuncias/:id/resolver` | `resolverDenuncia` | `verifyToken`, `isAdmin` | Resolución o desestimación formal de queja con dictamen. |
| GET | `/api/admin/ratings/tutors` | `getTutorRatings` | `verifyToken`, `isAdmin` | Auditoría de valoraciones y satisfacción de tutores. |
| GET | `/api/admin/ratings/students` | `getStudentRatings` | `verifyToken`, `isAdmin` | Auditoría de evaluaciones a estudiantes impartidas por tutores. |
| GET | `/api/admin/reportes` | `getReports` | `verifyToken`, `isAdmin` | Dashboard analítico consolidado (6 métricas concurrentes). |

---

## 20. Decisiones Técnicas y Reglas de Negocio Justificadas (Fase 2)

1. **Persistencia Híbrida de Documentos en la Nube y Local:**
   Para conciliar la alta disponibilidad de Cloudinary con entornos sin acceso a internet o pipelines de pruebas locales, se diseñó una estrategia de subida que almacena los documentos en Cloudinary mediante firmas seguras SHA y conserva respaldo local en el sistema de archivos del servidor.
2. **Inmutabilidad Absoluta del Correo Institucional en Ediciones:**
   El correo universitario actúa como identificador lógico institucional único. Permitir su mutabilidad en pantallas de administración representaría un riesgo severo de suplantación y rompería la integridad de la auditoría académica y de los tokens de autenticación previa.
3. **Generación de PDFs en Servidor (PDFKit) vs. Client-Side Rendering:**
   Se descartó generar constancias en el cliente con librerías como `html2pdf` o `canvas` debido a inconsistencias de fuentes tipográficas entre navegadores, márgenes erráticos y posibilidad de adulteración del DOM. Con PDFKit en Node.js, la constancia se construye vectorialmente con precisión milimétrica, logotipo institucional incrustado y foliado matemático uniforme.
4. **Firmas Criptográficas de Corta Duración (15 minutos):**
   Para salvaguardar la privacidad de datos personales contenidos en carnés universitarios y currículums vitae, los enlaces generados para el visor administrativo expiran rigurosamente a los 900 segundos. Transcurrido ese lapso, cualquier enlace compartido deja de ser accesible.
5. **Evaluación Restringida a Sesiones en Estado Atendida:**
   Ni el estudiante ni el tutor pueden calificar o reportar una asesoría que se encuentre en estado `Pendiente`, `Activa` o `Cancelada`. Únicamente el estado `Atendida` acredita la culminación pedagógica formal requerida para habilitar los formularios de feedback.
6. **Bloqueo a Nivel de Fila (SELECT ... FOR UPDATE) para Concurrencia:**
   En los módulos de feedback y resolución de denuncias, el uso de transacciones con bloqueo de fila previene condiciones de carrera cuando múltiples solicitudes simultáneas intentan actualizar la misma tupla relacional.
7. **Estrategia Dual de Despliegue en la Nube (AWS EC2 + Vercel):**
   La separación del frontend en Vercel (`https://educonnect-lovat-five.vercel.app/login`) permitió entregas ágiles y alta velocidad en el edge, mientras que la infraestructura en AWS EC2 (`http://107.21.86.168/login`) garantizó control absoluto sobre el backend, sockets, tareas en background y la opción de servir la aplicación completa full-stack.
