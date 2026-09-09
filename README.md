# EduConnect - Plataforma de Gestión de Tutorías Académicas

Plataforma web para facilitar la organización y administración de tutorías académicas en la Facultad de Ingeniería de la Universidad de San Carlos de Guatemala.
---

## Integrantes del Equipo

| Nombre | Carnet | Rol Principal |
| :--- | :---: | :--- |
| **Diego Eduardo España Vásquez** | 202307716 | Product Owner / Development Team |
| **Yeison Omar Lopez Dueñas** | 202102688 | Scrum Master / Development Team |
| **Oliverio Abraham Caarl Artola** | 202303864 | Development Team |
| **Sebastian Levi Velásquez Valle** | 202300580 | Development Team |
| **Angel Jose Cardenas Pocon** | 202304063 | Development Team |
| **Hector Antonio Cardona Cos** | 202307354 | Development Team |
| **Luis Pablo Carlos Tapia** | 202203257 | Development Team |

> **Universidad:** Universidad de San Carlos de Guatemala
> **Facultad:** Facultad de Ingeniería  
> **Escuela:** Escuela de Ciencias y Sistemas  
> **Curso:** Análisis y Diseño de Sistemas 1  
> **Semestre:** Segundo Semestre 2026  
> **Grupo:** Grupo 8  

---

## Información General

**EduConnect** es un sistema web creado para facilitar la comunicación entre estudiantes y tutores académicos.

La plataforma permite organizar el proceso de solicitud y realización de tutorías, desde que un estudiante busca un tutor hasta que la tutoría es aceptada y realizada.

El sistema cuenta con tres áreas principales:

- **Área del Estudiante:** Permite crear una cuenta, administrar su información, buscar tutores por materia o disponibilidad, solicitar tutorías, consultar el historial y administrar su cuenta.
- **Área del Tutor:** Permite crear una cuenta, indicar las materias que puede impartir y los horarios en los que está disponible. También puede aceptar o rechazar solicitudes de tutoría y llevar un control de sus sesiones.
- **Área del Administrador:** Permite revisar y administrar las cuentas de estudiantes y tutores, aprobar o rechazar registros, dar de baja usuarios y consultar información general del sistema.
---

## Objetivos

- **General:** Desarrollar una plataforma web que permita organizar y administrar las tutorías académicas de una manera sencilla y ordenada, utilizando una metodología de trabajo que permita al equipo organizar y dar seguimiento al desarrollo del proyecto.
- **Específicos:**
- Facilitar el registro y acceso de estudiantes y tutores de forma segura.
- Permitir que los estudiantes puedan buscar tutores y solicitar tutorías.
- Permitir que los tutores puedan administrar sus horarios y solicitudes.
- Permitir al administrador revisar y administrar las cuentas de los usuarios.
- Llevar un registro de las tutorías realizadas.
- Mostrar información que ayude a conocer el funcionamiento general del sistema.
- Permitir que el proyecto pueda ejecutarse de manera sencilla en diferentes computadoras.
---

## Tecnologías Utilizadas

### Frontend
- **Next.js:** Utilizado para crear las páginas y la parte visual del sistema.
- **React:** Utilizado para crear los diferentes elementos de la página.
- **JavaScript:** Lenguaje utilizado para desarrollar la aplicación.
- **Tailwind CSS:** Utilizado para diseñar y organizar la apariencia de las páginas.
- **Lucide React:** Utilizado para agregar iconos al sistema.

### Backend
- **Node.js**: Permite ejecutar la parte del servidor.
- **Express.js**: Utilizado para crear las funciones que conectan la página con la información del sistema.
- **JWT**: Utilizado para mantener la sesión de los usuarios de forma segura.
- **2FA**: Agrega un segundo paso para verificar la identidad del usuario al iniciar sesión.
- **Nodemailer**: Utilizado para enviar correos electrónicos.
- **Cloudinary**: Utilizado para guardar las imágenes utilizadas en el sistema.

### Base de Datos
- **PostgreSQL**: Base de datos donde se guarda la información del sistema.
- **Neon**: Servicio utilizado para tener la base de datos disponible en internet.

### Infraestructura y Herramientas
- **Docker**: Permite preparar el proyecto para que pueda ejecutarse de una forma similar en diferentes computadoras.
- **Git y GitHub**: Utilizados para guardar y controlar los cambios realizados en el proyecto.
- **Trello**: Utilizado para organizar las tareas del equipo.
- **Draw.io / Lucidchart**: Utilizados para realizar diagramas del sistema.
---

## Estructura del Proyecto

```text
AYD1_2S_G8/
├── README.md                   # Documentación general
└── ProyectoFase1/
    ├── docker-compose.yml      # Orquestación de contenedores (Frontend y Backend)
    ├── client/                 # Aplicación Frontend (Next.js)
    │   ├── app/                # Rutas y páginas de Next.js (App Router)
    │   ├── components/         # Componentes reutilizables de UI
    │   ├── lib/                # Utilidades y cliente API (Axios / Fetch)
    │   ├── public/             # Archivos estáticos
    │   └── Dockerfile          # Dockerfile para el Frontend
    └── server/                 # Aplicación Backend (Node.js + Express)
        ├── src/
        │   ├── config/         # Configuración de base de datos y entorno
        │   ├── controllers/    # Lógica de negocio y controladores
        │   ├── routes/         # Definición de endpoints API
        │   ├── services/       # Servicios (Email/Nodemailer, 2FA, Cloudinary)
        │   └── app.js          # Configuración principal de Express
        ├── server.js           # Punto de entrada del servidor backend
        ├── .env.example        # Plantilla de variables de entorno
        └── Dockerfile          # Dockerfile para el Backend
    └── Documentacion/
        ├── Diagramas      # Diagramas del sistema
        └── Manuales      # Especificaciones y manuales
```

---

## Guía de Instalación y Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) e instalado y corriendo.
- [Git](https://git-scm.com/)

### 1. Clonar el repositorio
```bash
git clone https://github.com/SebastianVelasquezValle/AYD1_2S_G8.git
cd AYD1_2S_G8/ProyectoFase1
```

### 2. Configurar variables de entorno
Crear el archivo `.env` dentro del directorio `ProyectoFase1/server/.env` tomando como base `.env.example`:


### 3. Levantar la aplicación con Docker Compose
Desde la carpeta `ProyectoFase1`:
```bash
docker compose up --build
```

### 4. Accesos a la aplicación
- **Aplicación:** [http://localhost:3000](http://localhost:3000)
---

## Evidencias y Grabaciones de la Metodología SCRUM

En esta sección se presentan las grabaciones de las sesiones de trabajo desarrolladas bajo la metodología **SCRUM** (Sprint Planning, Dailys, Sprint Review y Sprint Retrospective).
---

### Product Backlog
| **Product Backlog** | Definición del Product Backlog, selección de historias del Product Backlog y estimación. | [ Ver Grabación](https://drive.google.com/file/d/1q75YWuFa7XgK7U2YHy_UWOzyobt_FT-K/view?usp=drive_link) |

### Sprint 1

| Evento SCRUM | Descripción / Objetivo | Enlace a la Grabación (Google Drive) |
| :--- | :--- | :---: |
| **Sprint Planning 1** | Definición del Sprint Goal, selección de historias del Product Backlog y estimación. | [ Ver Grabación](https://drive.google.com/file/d/17FYFGTOuUTabm2TiIGbLNlvwbJ0wjLkO/view?usp=drive_link) |
| **Daily 1** | Sincronización diaria: Avances en modelos de BD y estructura base. | [ Ver Grabación](https://drive.google.com/file/d/1-tcu-1SQwWTm5admJVLWlc7WgzcyH6Ob/view?usp=drive_link) |
| **Daily 2** | Sincronización diaria: Integración de endpoints de autenticación y registro. | [ Ver Grabación](https://drive.google.com/file/d/1dOtGiRd__jCMIxxWdehIx3wtix-zDhdD/view?usp=drive_link) |
| **Daily 3** | Sincronización diaria: Desarrollo de vistas de login y 2FA en el frontend. | [ Ver Grabación](https://drive.google.com/file/d/1RICKlzAkMFdB0Gkhh5be_P-Mh2hRoid0/view?usp=drive_link) |
| **Daily 4** | Sincronización diaria: Primeras pruebas de logins y creacion de usuarios, tutores y administradores. | [ Ver Grabación](https://drive.google.com/file/d/1PT4QoUdLQzsIcKRKAt8XXV01dkDZ2_ER/view?usp=drive_link) |
| **Daily 5** | Sincronización diaria: Ajustes y cambios en el frontend | [ Ver Grabación](https://drive.google.com/file/d/16FrCgIzBomOrMsruRuFzVflnTrxRjKVi/view?usp=drive_link) |
| **Daily 6** | Sincronización diaria: Finalizacion de las historias de usuario con los estados de prioridad alta. | [ Ver Grabación](https://drive.google.com/file/d/1d214mUCGeHfCZjb3v-fI4iCM88UG77pt/view?usp=drive_link) |
| **Sprint Retrospective 1** | Análisis de aciertos, oportunidades de mejora y compromisos para el siguiente sprint. | [ Ver Grabación](https://drive.google.com/file/d/19M0bHMSx0y79Q4j3cfZ24VijYwZcW8Uz/view?usp=drive_link) |

---

### Sprint 2

| Evento SCRUM | Descripción / Objetivo | Enlace a la Grabación (Google Drive) |
| :--- | :--- | :---: |
| **Sprint Planning 2** | Planificación de historias de gestión de tutorías, bajas de usuarios y reportes. | [ Ver Grabación](https://drive.google.com/file/d/18F_hiD1wqGPuwVtZo3DGNiah3e9-lmmN/view?usp=drive_link) |
| **Daily 2.1** | Sincronización diaria: Implementación de solicitudes de tutoría y estados. | [ Ver Grabación](https://drive.google.com/file/d/1o3HP9X_bro9ykAGz_jCPubwFNIEAbB-R/view?usp=drive_link) |
| **Daily 2.2** | Sincronización diaria: Módulo de baja de estudiantes y tutores con notificación por correo. | [ Ver Grabación](https://drive.google.com/file/d/14kCPHVE5tuGOm6eXcAESIk26q4f9Yadv/view?usp=drive_link) |
| **Daily 2.3** | Sincronización diaria: Avance con las historias de usuario y endpoints faltantes. | [ Ver Grabación](https://drive.google.com/file/d/1MFU_74S5Qd__oPYh_XA3B_E7zfnGMTmW/view?usp=drive_link) |
| **Daily 2.4** | Sincronización diaria: Finalización de historias de usuario y pruebas de codigo. | [ Ver Grabación](https://drive.google.com/file/d/1HHZomNgzBASHns-N-noK5we3XyHpe_V0/view?usp=drive_link) |
| **Daily 2.5** | Sincronización diaria: Terminacion de historias de usuario, documentacion y diagramas. | [ Ver Grabación](Pendiente) | 
| **Daily 2.6** | Sincronización diaria: Ultimas pruebas del codigo trabajado en equipo | [ Ver Grabación]() |
| **Sprint Retrospective 2** | Evaluación de desempeño del equipo, cumplimiento de metas y cierre del proyecto. | [ Ver Grabación](Pendiente) |
| **Sprint SCRUMBAN** | Definición del Sprint Goal, selección de historias del Product Backlog y estimación. | [ Ver Grabación](https://drive.google.com/file/d/1Q2MIQMZnxJVWzAHD0ipHHYAuteBN_05A/view?usp=drive_link) |

---

## Historias de Usuario Principales

- **[HU-001/002] Registro y Perfil de Estudiantes y Tutores:** Formulario dinámico con subida de imágenes y validación de campos.
- **[HU-003] Autenticación y Seguridad (2FA):** Inicio de sesión protegido con tokens JWT y verificación por código TOTP/QR.
- **[HU-005] Aprobación o Rechazo de Registro:** Módulo del administrador para aprobar/rechazar solicitudes enviando correos automáticos.
- **[HU-006/007] Gestión y Baja de Usuarios Aprobados:** Visualización de tutores y estudiantes activos, baja con modal de confirmación, eliminación física en base de datos y correo informativo de suspensión.
- **[HU-017/019/020] Programación y Seguimiento de Tutorías:** Flujo completo de reserva de tutorías, aceptación por parte del tutor y consulta de historial.

---
