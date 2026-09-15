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

## Documentación del Sistema

A continuación se detallan las distintas áreas de documentación técnica, metodológica y operativa desarrolladas para el proyecto EduConnect. Cada sección cuenta con un enlace directo hacia su respectivo documento explicativo.

### Metodología SCRUM y Scrumban
Organización del proyecto bajo la metodología ágil SCRUM y Scrumban, incluyendo artefactos, reuniones, prototipos y evaluación del equipo:

- **[Actas y Grabaciones de Reuniones SCRUM](ProyectoFase1/documentacion/scrumban/scrumn_meetings.md):** Registro de actas y grabaciones de Sprint Planning, Daily Scrums y Sprint Retrospectives.
- **[Historias de Usuario (Product Backlog)](ProyectoFase1/documentacion/scrumban/historias_usuario.md):** Especificación completa del Product Backlog con criterios de aceptación.
- **[Sprint Backlog](ProyectoFase1/documentacion/scrumban/sprint_backlog.md):** Planificación y desglose de tareas asignadas para el Sprint 1 y Sprint 2.
- **[Tablero Kanban / Scrumban](ProyectoFase1/documentacion/scrumban/tablero_kanban.md):** Estructura del flujo de trabajo, estados de desarrollo y seguimiento del tablero Kanban.
- **[Prototipos de Pantallas](ProyectoFase1/documentacion/scrumban/prototipos.md):** Bocetos y diseños preliminares de la interfaz del sistema.
- **[Evaluación y Calificación SCRUM](ProyectoFase1/documentacion/scrumban/calificacion_scrum.md):** Matriz de evaluación del desempeño y rendimiento de los integrantes del equipo.

### Diagramas del Sistema
Contiene los diagramas conceptuales, de diseño de base de datos y modelado de procesos del sistema:

- **[Diagrama Entidad-Relación (ER)](ProyectoFase1/documentacion/diagramas/diagrama-ER.md):** Modelo de datos relacional implementado en PostgreSQL (Neon DB).
- **[Casos de Uso de Negocio Nivel 0 (CUN Core)](ProyectoFase1/documentacion/diagramas/diagrama-CUN-Core.md):** Diagrama general de los procesos centrales del sistema.
- **[Casos de Uso Nivel 1 (Primera Descomposición)](ProyectoFase1/documentacion/diagramas/diagrama-CUN-primera-descomposicion.md):** Desglose inicial de los módulos de la aplicación.
- **[Casos de Uso Nivel 2 (Casos Expandidos)](ProyectoFase1/documentacion/diagramas/diagrama-CUN-expandidos.md):** Detalle de interacción para flujos complejos del sistema.
- **[Descripciones Textuales de Casos de Uso](ProyectoFase1/documentacion/diagramas/descripciones-textuales.md):** Especificación completa de actores, precondiciones, flujo principal y excepciones.

### Manuales del Sistema
Documentos guía para desarrolladores, diseñadores y usuarios finales:

- **[Manual Técnico del Sistema](ProyectoFase1/documentacion/manuales/Manual_Tecnico.md):** Arquitectura del sistema, configuración de Docker, infraestructura backend, frontend y endpoints de API.
- **[Manual de Usuario](ProyectoFase1/documentacion/manuales/Manual_Usuario.md):** Guía paso a paso para la navegación de Estudiantes, Tutores y Administradores.
- **[Manual de UI / UX y Guía de Diseño](ProyectoFase1/documentacion/manuales/Manual_UI_UX.md):** Especificación del sistema de diseño, componentes visuales y paleta de colores.

### Requerimientos del Sistema
Especificación detallada de los requisitos del software:

- **[Requerimientos Funcionales (RFs)](ProyectoFase1/documentacion/requerimientos/RFs-requerimientos-funcionales.md):** Lista de funcionalidades exigidas por el sistema.
- **[Requerimientos No Funcionales / Calidad (EACs)](ProyectoFase1/documentacion/requerimientos/EACs-requerimientos-calidad.md):** Escenarios de atributos de calidad como rendimiento, disponibilidad y seguridad.
- **[Requerimientos de Restricción (RRs)](ProyectoFase1/documentacion/requerimientos/RRs-requerimientos-restriccion.md):** Limitan las opciones de diseño e implementación del proyecto.

---

## Historias de Usuario Principales

- **[HU-001/002] Registro y Perfil de Estudiantes y Tutores:** Formulario dinámico con subida de imágenes y validación de campos.
- **[HU-003] Autenticación y Seguridad (2FA):** Inicio de sesión protegido con tokens JWT y verificación por código TOTP/QR.
- **[HU-005] Aprobación o Rechazo de Registro:** Módulo del administrador para aprobar/rechazar solicitudes enviando correos automáticos.
- **[HU-006/007] Gestión y Baja de Usuarios Aprobados:** Visualización de tutores y estudiantes activos, baja con modal de confirmación, eliminación física en base de datos y correo informativo de suspensión.
- **[HU-017/019/020] Programación y Seguimiento de Tutorías:** Flujo completo de reserva de tutorías, aceptación por parte del tutor y consulta de historial.

---
