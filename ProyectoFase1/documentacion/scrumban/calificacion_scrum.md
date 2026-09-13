# Evaluacion y Asignacion de Historias de Usuario - Proyecto EduConnect (Scrum)

Este documento contiene la matriz oficial de asignación de Historias de Usuario (HU), responsabilidades por rol y la plantilla de evaluación individual del desempeño para el proyecto **EduConnect** (2 Sprints).

---

## 1. Información General del Proyecto

- **Nombre del Proyecto:** EduConnect
- **Metodología:** Scrum Académico
- **Duración:** 2 Sprints
- **Scrum Master:** Yeison Omar López Dueñas

---

## 2. Resumen de Integrantes y Roles

| Integrante                         | Rol Principal                      | Cantidad de HU Asignadas |
| :--------------------------------- | :--------------------------------- | :----------------------: |
| **Oliverio Abraham Caarl Artola**  | Frontend Developer                 |            16            |
| **Angel Jose Cardenas Pocon**      | Backend Developer                  |            5             |
| **Sebastian Levi Velásquez Valle** | Backend Developer                  |            6             |
| **Luis Pablo Carlos Tapia**        | DevOps / Backend Developer         |            9             |
| **Diego Eduardo Españas Vasquez**  | Product Owner / Frontend Developer |            9             |
| **Hector Antonio Cardona Cos**     | Database Administrator / Backend   |            3             |
| **Yeison Omar Lopez Dueñas**       | Scrum Master / Backend Developer   |            5             |

---

## 3. Matriz Completa de Asignación por Sprint e Historia de Usuario

### **Sprint 1: Módulos Base, Autenticación y Arquitectura Inicial**

| Código HU  | Título de la Historia de Usuario              | Responsable Frontend          | Responsable Backend / DB / DevOps   |
| :--------: | :-------------------------------------------- | :---------------------------- | :---------------------------------- |
| **HU-001** | Registro de Estudiante                        | Oliverio Abraham Caarl Artola | Yeison Omar Lopez Dueñas (Backend)  |
| **HU-002** | Registro de Tutor                             | Oliverio Abraham Caarl Artola | Yeison Omar Lopez Dueñas (Backend)  |
| **HU-003** | Autenticación de Estudiante y Tutor           | Oliverio Abraham Caarl Artola | Angel Jose Cardenas Pocon (Backend) |
| **HU-004** | Autenticación de Dos Factores (2FA Admin)     | Diego Eduardo Españas Vasquez | Yeison Omar Lopez Dueñas (Backend)  |
| **HU-005** | Aprobación o Rechazo de Estudiantes           | Diego Eduardo Españas Vasquez | Angel Jose Cardenas Pocon (Backend) |
| **HU-006** | Aprobación o Rechazo de Tutores               | Diego Eduardo Españas Vasquez | Angel Jose Cardenas Pocon (Backend) |
| **HU-025** | Modelado e Implementación de Base de Datos    | N/A                           | Hector Antonio Cardona Cos (DB)     |
| **HU-026** | Contenedorización con Docker y Docker Compose | N/A                           | Luis Pablo Carlos Tapia (DevOps)    |

---

### **Sprint 2: Lógica de Tutorías, Agendamiento, Reportes y Documentación**

| Código HU  | Título de la Historia de Usuario                  | Responsable Frontend                                          | Responsable Backend / DB / DevOps                    |
| :--------: | :------------------------------------------------ | :------------------------------------------------------------ | :--------------------------------------------------- |
| **HU-007** | Gestión y baja de estudiantes aprobados           | Diego Eduardo Españas Vasquez                                 | Angel Jose Cardenas Pocon                            |
| **HU-008** | Gestión y baja de tutores aprobados               | Diego Eduardo Españas Vasquez                                 | Angel Jose Cardenas Pocon                            |
| **HU-009** | Generación de reportes analíticos del sistema     | Diego Eduardo Españas Vasquez                                 | Yeison Omar Lopez Dueñas                             |
| **HU-010** | Configuración de horarios de atención del tutor   | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-011** | Modificación de horarios y control de sesiones    | Oliverio Abraham Caarl Artola                                 | Yeison Omar Lopez Dueñas                             |
| **HU-012** | Visualización de sesiones pendientes del tutor    | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-013** | Registro de atención y resumen de tutoría         | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-014** | Cancelación por tutor con notificación por correo | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-015** | Historial de sesiones del tutor                   | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-016** | Consulta y actualización de perfil del tutor      | Oliverio Abraham Caarl Artola                                 | Sebastian Levi Velásquez Valle                       |
| **HU-017** | Visualización del catálogo de tutores disponibles | Oliverio Abraham Caarl Artola                                 | Luis Pablo Carlos Tapia                              |
| **HU-018** | Búsqueda avanzada y filtrado de tutores           | Diego Eduardo Españas Vasquez                                 | Luis Pablo Carlos Tapia                              |
| **HU-019** | Consulta de horarios y disponibilidad por fecha   | Oliverio Abraham Caarl Artola                                 | Luis Pablo Carlos Tapia                              |
| **HU-020** | Programación y validación de sesión de tutoría    | Oliverio Abraham Caarl Artola                                 | Luis Pablo Carlos Tapia                              |
| **HU-021** | Listado de sesiones activas del estudiante        | Diego Eduardo Españas Vasquez                                 | Luis Pablo Carlos Tapia                              |
| **HU-022** | Cancelación de sesión por parte del estudiante    | Oliverio Abraham Caarl Artola                                 | Luis Pablo Carlos Tapia                              |
| **HU-023** | Historial de tutorías del estudiante              | N/A (Compartido)                                              | Hector Antonio Cardona Cos / Luis Pablo Carlos Tapia |
| **HU-024** | Consulta y actualización de perfil del estudiante | Oliverio Abraham Caarl Artola                                 | Luis Pablo Carlos Tapia                              |
| **HU-027** | Documentación técnica, manuales y evidencias      | Oliverio Abraham Caarl Artola / Diego Eduardo Españas Vasquez | Hector Antonio Cardona Cos                           |

---

## 4. Desglose Individual de Tareas por Miembro del Equipo

### **1. Oliverio Abraham Caarl Artola (Rol: Frontend)**

- **Historias a cargo (16):** HU-001, HU-002, HU-003, HU-010, HU-011, HU-012, HU-013, HU-014, HU-015, HU-016, HU-017, HU-019, HU-020, HU-022, HU-024, HU-027 .
- **Responsabilidades Clave:**
  - Desarrollo de formularios de registro y login de estudiantes/tutores en UI.
  - Diseño e interfaz para la configuración de horarios, atención de sesiones, cancelación e historial del tutor.
  - Maquetación del catálogo de tutores, selección de fechas/horarios disponibles y agendamiento de sesiones.
  - Colaboración en la elaboración de manuales de usuario y evidencias del frontend.

### **2. Angel Jose Cardenas Pocon (Rol: Backend)**

- **Historias a cargo (5):** HU-003, HU-005, HU-006, HU-007, HU-008 .
- **Responsabilidades Clave:**
  - Endpoint y lógica de autenticación base de usuarios y validación de estados (aprobado/pendiente).
  - Endpoints de administración para aprobación y rechazo de estudiantes y tutores con envío de correos.
  - Endpoints para dar de baja a estudiantes y tutores activos del sistema.

### **3. Sebastian Levi Velásquez Valle (Rol: Backend)**

- **Historias a cargo (6):** HU-010, HU-012, HU-013, HU-014, HU-015, HU-016 .
- **Responsabilidades Clave:**
  - Lógica backend para gestión de disponibilidad de horarios del tutor.
  - Endpoints para listar tutorías pendientes, registro de atención con resumen obligatorio y guardado de historial.
  - Lógica de cancelación de tutoría por parte del tutor y servicio automático de envío de correos.
  - Servicio de actualización de perfil del tutor manteniendo bloqueado el email.

### **4. Luis Pablo Carlos Tapia (Rol: DevOps / Backend)**

- **Historias a cargo (9):** HU-017, HU-018, HU-019, HU-020, HU-021, HU-022, HU-023, HU-024, HU-026 .
- **Responsabilidades Clave:**
  - Configuración de Docker, Dockerfiles y `docker-compose.yml` para el despliegue local de Frontend, Backend y BD .
  - Endpoints para el catálogo de tutores, filtros multinivel y cálculo de disponibilidad por fecha.
  - Lógica de validación compleja contra traslapes de sesiones en la agendación de tutorías.
  - Endpoints para sesiones activas, cancelación por estudiante e historial del estudiante.

### **5. Diego Eduardo Españas Vasquez (Rol: Frontend)**

- **Historias a cargo (9):** HU-004, HU-005, HU-006, HU-007, HU-008, HU-009, HU-018, HU-021, HU-027 .
- **Responsabilidades Clave:**
  - Desarrollo de la interfaz de login 2FA para el Administrador.
  - Creación del panel administrativo para aprobación, rechazo y baja de usuarios.
  - Implementación de la vista de reportes analíticos con componentes gráficos en tiempo real.
  - Desarrollo de las vistas de búsqueda avanzada de tutores y listado de sesiones activas del estudiante.
  - Apoyo en la creación del Manual Técnico y evidencia de Scrum en Markdown.

### **6. Hector Antonio Cardona Cos (Rol: Base de Datos / Backend)**

- **Historias a cargo (3):** HU-023, HU-025, HU-027 [cite: 1].
- **Responsabilidades Clave:**
  - Diseñar y ejecutar el script DDL del modelo entidad-relación de la base de datos (PostgreSQL/MySQL) .
  - Garantizar la encriptación de contraseñas y consistencia relacional entre usuarios, sesiones y resúmenes.
  - Desarrollo del endpoint para la consulta del historial de tutorías del estudiante.
  - Redacción del esquema de base de datos y diagrama ER para la documentación técnica.

### **7. Yeison Omar Lopez Dueñas (Rol: Scrum Master / Backend)**

- **Historias a cargo (5):** HU-001, HU-002, HU-004, HU-009, HU-011 .
- **Responsabilidades Clave:**
  - Endpoints de registro de estudiantes y tutores (validaciones de duplicados, encriptación y estado inicial "pendiente").
  - Lógica de backend para el segundo factor de autenticación del administrador.
  - Endpoints para generación de datos estadísticos para los reportes del Administrador.
  - Lógica de validación para modificación de horarios del tutor verificando que no existan sesiones activas fuera de rango.

---

## 5. Hoja de Evaluación Individual del Equipo

| Integrante              | Rol              | Asistencia Eventos (1-5) | Cumplimiento HU (1-5) | Calidad Técnica / Git (1-5) | Colaboración (1-5) | Adaptación (1-5) | Nota Final (Promedio) |
| :---------------------- | :--------------- | :----------------------: | :-------------------: | :-------------------------: | :----------------: | :--------------: | :-------------------: |
| **Oliverio Caarl**      | Frontend         |            5             |           4           |              4              |         4          |        5         |          4.4          |
| **Angel Cardenas**      | Backend          |            5             |           5           |              5              |         5          |        5         |           5           |
| **Sebastian Velásquez** | Backend          |            5             |           5           |              5              |         5          |        5         |           5           |
| **Luis Pablo Carlos**   | DevOps / Backend |            5             |           5           |              5              |         5          |        5         |           5           |
| **Diego Españas**       | Frontend         |            5             |           5           |              5              |         5          |        5         |           5           |
| **Hector Cardona**      | BD / Backend     |            5             |           5           |              5              |         5          |        5         |           5           |
| **Yeison Lopez**        | Backend / SM     |            5             |           5           |              5              |         5          |        5         |           5           |
