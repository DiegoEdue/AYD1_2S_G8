# Evaluación del Desempeño del Equipo de Desarrollo - Proyecto EduConnect Fase 2 (Scrum)

Este documento contiene la evaluación formal del Scrum Master sobre el desempeño de cada integrante del equipo de desarrollo durante la **Fase 2** del proyecto **EduConnect**, en **escala de 1 a 100 y con su respectiva justificación**. La evaluación abarca los **Sprint 3 y Sprint 4**, correspondientes a las historias de usuario HU-028 a HU-051.

---

## 1. Información General del Proyecto

- **Nombre del Proyecto:** EduConnect
- **Metodología:** Scrum Académico / Scrumban
- **Fase evaluada:** Fase 2
- **Duración:** 2 Sprints (Sprint 3 y Sprint 4)
- **Alcance:** HU-028 a HU-051 (ampliación de historias existentes, nuevas funcionalidades, aseguramiento de calidad, DevOps y documentación)
- **Scrum Master:** Yeison Omar López Dueñas
- **Fecha de emisión:** 23 de octubre de 2026

---

## 2. Resumen de Integrantes y Roles

| Integrante                         | Rol Principal                      | Cantidad de HU Asignadas (Fase 2) |
| :--------------------------------- | :--------------------------------- | :-------------------------------: |
| **Oliverio Abraham Caarl Artola**  | Frontend / Backend Developer       |                 7                 |
| **Angel Jose Cardenas Pocon**      | Backend / Frontend Developer       |                11                 |
| **Sebastian Levi Velásquez Valle** | Backend Developer                  |                11                 |
| **Luis Pablo Carlos Tapia**        | DevOps / Backend Developer         |                10                 |
| **Diego Eduardo Españas Vasquez**  | Product Owner / Frontend Developer |                15                 |
| **Hector Antonio Cardona Cos**     | Database Administrator / Backend   |                20                 |
| **Yeison Omar Lopez Dueñas**       | Scrum Master / Backend Developer   |                 6                 |

> [!NOTE]
> La cantidad de HU de Hector Antonio Cardona Cos es alta porque, en su rol de administrador de base de datos, brindó soporte transversal a todas las historias funcionales de la Fase 2 (evolución del esquema, nuevas tablas y consultas).

---

## 3. Alcance de la Fase 2 y Matriz de Asignación

### **Sprint 3: Registro con Documentos, Verificación por Token, Plan de Estudio, Visores PDF, Pruebas, CI/CD y Despliegue**

| Código HU  | Título de la Historia de Usuario                     | Responsable Frontend                      | Responsable Backend / DB / DevOps                                             |
| :--------: | :--------------------------------------------------- | :---------------------------------------- | :---------------------------------------------------------------------------- |
| **HU-028** | Registro de Estudiante (fotografía y carnet PDF)     | Diego Eduardo Españas Vasquez             | Yeison Omar Lopez Dueñas / Sebastian Velásquez (Backend), Hector Cardona (BD) |
| **HU-029** | Registro de Tutor (CV en PDF)                        | Diego Eduardo Españas Vasquez             | Yeison Omar Lopez Dueñas / Sebastian Velásquez (Backend), Hector Cardona (BD) |
| **HU-030** | Autenticación con Token de Verificación por Correo   | Diego Eduardo Españas Vasquez             | Yeison Omar Lopez Dueñas / Sebastian Velásquez (Backend), Hector Cardona (BD) |
| **HU-031** | Consulta del Plan de Estudio de Tutorías             | Diego Eduardo Españas Vasquez             | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-035** | Atender Estudiante con Plan de Estudio Estructurado  | Diego Eduardo Españas Vasquez             | Luis Pablo Carlos Tapia / Sebastian Velásquez (Backend), Hector Cardona (BD)  |
| **HU-038** | Aprobación de Estudiante con Visor PDF de Carnet     | Angel Jose Cardenas Pocon                 | Oliverio Abraham Caarl Artola / Angel Cardenas (Backend), Hector Cardona (BD) |
| **HU-039** | Aprobación de Tutor con Visor PDF de CV              | Angel Jose Cardenas Pocon                 | Oliverio Abraham Caarl Artola / Angel Cardenas (Backend), Hector Cardona (BD) |
| **HU-047** | Cobertura de Pruebas Unitarias Automatizadas         | Angel Cardenas / Diego Españas (Frontend) | Yeison Lopez / Luis Tapia / Oliverio Artola / Sebastian Velásquez (Backend)   |
| **HU-049** | Automatización de Pipeline CI/CD para el Backend     | N/A                                       | Yeison Omar Lopez Dueñas(DevOps)                                              |
| **HU-051** | Despliegue de Frontend y Backend en Servidores Cloud | N/A                                       | Yeison Omar Lopez Dueñas (DevOps)                                             |

---

### **Sprint 4: Calificaciones, Reportes de Conducta, Gestión Administrativa, Pruebas E2E y Documentación**

| Código HU  | Título de la Historia de Usuario                                | Responsable Frontend                                  | Responsable Backend / DB / DevOps                                             |
| :--------: | :-------------------------------------------------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------- |
| **HU-032** | Descarga e Impresión de Constancia del Plan de Estudio en PDF   | Diego Eduardo Españas Vasquez                         | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-033** | Calificación de Atención de Tutoría por el Estudiante           | Diego Eduardo Españas Vasquez                         | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-034** | Reportar Conducta de Tutor                                      | Diego Eduardo Españas Vasquez                         | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-036** | Calificar Desempeño del Estudiante                              | Diego Eduardo Españas Vasquez                         | Sebastian Velásquez (Backend), Hector Cardona (BD)                            |
| **HU-037** | Reportar Estudiante Problemático                                | Diego Eduardo Españas Vasquez                         | Sebastian Velásquez (Backend), Hector Cardona (BD)                            |
| **HU-040** | Gestión y Edición de Estudiantes Activos                        | Angel Jose Cardenas Pocon                             | Oliverio Abraham Caarl Artola / Angel Cardenas (Backend), Hector Cardona (BD) |
| **HU-041** | Gestión y Edición de Tutores Activos                            | Angel Jose Cardenas Pocon                             | Oliverio Abraham Caarl Artola / Angel Cardenas (Backend), Hector Cardona (BD) |
| **HU-042** | Gestión e Inspección de Reportes contra Tutores                 | Angel Jose Cardenas Pocon                             | Angel Jose Cardenas Pocon (Backend), Hector Cardona (BD)                      |
| **HU-043** | Gestión e Inspección de Reportes contra Estudiantes             | Angel Jose Cardenas Pocon                             | Angel Jose Cardenas Pocon (Backend), Hector Cardona (BD)                      |
| **HU-044** | Reporte General de Calificaciones de Tutores                    | Angel Cardenas / Diego Españas                        | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-045** | Reporte General de Calificaciones de Estudiantes                | Diego Eduardo Españas Vasquez                         | Luis Pablo Carlos Tapia (Backend), Hector Cardona (BD)                        |
| **HU-046** | Generación de Nuevos Reportes Analíticos                        | Angel Cardenas / Diego Españas                        | Luis Tapia / Sebastian Velásquez (Backend), Hector Cardona (BD)               |
| **HU-048** | Pruebas End-to-End (E2E) con Herramientas de Automatización     | Angel Cardenas / Diego Españas / Oliverio Artola (QA) | N/A                                                                           |
| **HU-050** | Actualización de Documentación Técnica, Manuales y Arquitectura | Diego Españas / Angel Cardenas                        | Sebastian Velásquez / Hector Cardona / Oliverio Artola (por áreas)            |

---

## 4. Criterios y Rúbrica de Evaluación (Escala 1 a 100)

La nota final de cada integrante se compone de cinco dimensiones con ponderación definida por el Scrum Master:

| Criterio                                           | Puntaje Máximo | Descripción                                                                             |
| :------------------------------------------------- | :------------: | :-------------------------------------------------------------------------------------- |
| Cumplimiento de Historias de Usuario y compromisos |       30       | HU completadas dentro del sprint según los criterios de aceptación del Product Backlog. |
| Calidad técnica y disciplina en Git                |       25       | Calidad del código, pruebas, commits descriptivos, uso de ramas y Pull Requests.        |
| Colaboración y comunicación                        |       20       | Apoyo a compañeros, resolución de bloqueos, integración entre módulos.                  |
| Participación en eventos Scrum y asistencia        |       15       | Asistencia y aporte en Sprint Planning, Daily, Review y Retrospective.                  |
| Proactividad, adaptación y entrega de valor        |       10       | Iniciativa propia, adaptación a cambios de alcance y nuevas tecnologías.                |
| **Total**                                          |    **100**     |                                                                                         |

**Escala de valoración:** 90-100 Excelente | 80-89 Muy bueno | 70-79 Bueno | 60-69 Suficiente | Menos de 60 Insuficiente.

---

## 5. Evaluación Individual del Desempeño

### **1. Oliverio Abraham Caarl Artola (Rol: Frontend / Backend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (7):** HU-038, HU-039, HU-040, HU-041, HU-047, HU-048, HU-050.
- **Justificación:**
  - Amplió el módulo administrativo del backend implementando los endpoints y rutas para la gestión de solicitudes con visor de documentos PDF (carnet de estudiante y CV de tutor), base de las HU-038 y HU-039.
  - Colaboró en los endpoints de edición administrativa de estudiantes y tutores activos (HU-040 y HU-041).
  - Aportó pruebas unitarias del módulo de administrador y la configuración del entorno de ejecución de pruebas (Jest), contribuyendo directamente al criterio de HU-047.
  - Participó activamente en el aseguramiento de calidad de la fase: revisó e integró los Pull Requests de pruebas del equipo y apoyó la documentación de requerimientos y evidencias de pruebas (HU-048 y HU-050).

### **2. Angel Jose Cardenas Pocon (Rol: Backend / Frontend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (11):** HU-038, HU-039, HU-040, HU-041, HU-042, HU-043, HU-044, HU-046, HU-047, HU-048, HU-050.
- **Justificación:**
  - Desarrolló la totalidad del panel administrativo de la Fase 2 en el frontend: solicitudes con visor PDF embebido, módulo de moderación de denuncias, edición de usuarios y reportes gráficos.
  - Implementó el componente de visor PDF (HU-038 y HU-039) y la integración de la carga de archivos con el servicio de almacenamiento en la nube.
  - Construyó y ejecutó la suite más amplia de pruebas End-to-End en Cypress (aceptación/rechazo de usuarios, moderación de denuncias, atención con plan de estudio, verificación 2FA, edición de perfil), con evidencias en video (HU-048).
  - Elaboró la matriz y documentación de pruebas del sistema, además de apoyar en los endpoints administrativos del backend y en la documentación de manuales (HU-050).

### **3. Sebastian Levi Velásquez Valle (Rol: Backend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (11):** HU-028, HU-029, HU-030, HU-035, HU-036, HU-037, HU-046, HU-047, HU-049, HU-050, HU-051.
- **Justificación:**
  - Sostuvo el núcleo del módulo de tutorías en el backend: controladores y modelos de sesiones, calificaciones (ratings), reportes de conducta y horarios, sustentando las HU-035, HU-036 y HU-037.
  - Implementó la carga segura de documentos en el registro de estudiantes y tutores (fotografía, carnet y CV en PDF), con integración al servicio de almacenamiento en la nube (HU-028 y HU-029).
  - Fortaleció la seguridad del sistema manteniendo la lógica de autenticación, el segundo factor del administrador y el cifrado de contraseñas (HU-030).
  - Asumió responsabilidades DevOps clave: Dockerfile, docker-compose y soporte al despliegue en servidores cloud (HU-049 y HU-051), además de pruebas unitarias del módulo de calificaciones y aportes sustanciales a manuales y diagramas (HU-050).

### **4. Luis Pablo Carlos Tapia (Rol: DevOps / Backend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (10):** HU-031, HU-032, HU-033, HU-034, HU-035, HU-044, HU-045, HU-046, HU-047, HU-049.
- **Justificación:**
  - Desarrolló el subsistema de Plan de Estudio y retroalimentación del estudiante en el backend: consulta estructurada del plan, registro de dificultades y recursos recomendados, calificaciones y reportes de conducta (HU-031, HU-033, HU-034 y HU-035).
  - Implementó el motor de generación del PDF de la constancia del plan de estudio en el backend, con el formato oficial de EduConnect (HU-032).
  - Construyó los endpoints de los reportes de promedio de calificaciones de tutores y estudiantes, y colaboró en los nuevos reportes analíticos (HU-044, HU-045 y HU-046).
  - Cumplió con su cuota de pruebas unitarias del módulo de estudiante (plan, PDF, feedback e historial de sesiones) y configuró la infraestructura de pruebas (HU-047), apoyando además la configuración del pipeline de CI/CD (HU-049).

### **5. Diego Eduardo Españas Vasquez (Rol: Product Owner / Frontend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (15):** HU-028, HU-029, HU-030, HU-031, HU-032, HU-033, HU-034, HU-035, HU-036, HU-037, HU-045, HU-046, HU-047, HU-048, HU-050.
- **Justificación:**
  - Fue el desarrollador frontend con mayor carga de la fase: módulos completos de estudiante y tutor, incluyendo la vista del Plan de Estudio con sus recursos recomendados, la verificación de cuenta por token con ingreso OTP, el formulario dinámico de atención con plan estructurado y la generación de la constancia en PDF.
  - Implementó los componentes interactivos de calificación por estrellas y de reportes de conducta en ambos extremos (estudiante y tutor), cubriendo HU-033, HU-034, HU-036 y HU-037.
  - Construyó la suite principal de pruebas E2E con evidencias y las pruebas unitarias del frontend con Vitest (HU-047 y HU-048).
  - Como Product Owner mantuvo el Product Backlog priorizado y trazable, y aportó de forma significativa a los manuales de usuario y a la documentación Scrumban (HU-050).

### **6. Hector Antonio Cardona Cos (Rol: Database Administrator / Backend)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (20):** Soporte transversal de base de datos en HU-028 a HU-046, además de HU-050.
- **Justificación:**
  - Lideró la evolución completa del esquema de base de datos de la Fase 2: nuevas tablas para planes de estudio, dificultades identificadas, recursos recomendados, calificaciones cruzadas (tutor_ratings y student_reports / student_ratings), denuncias, tokens de verificación y referencias a documentos PDF.
  - Mantuvo el script DDL, las consultas agregadas para los reportes (promedios de calificaciones) y los datos de prueba necesarios para el resto del equipo, con una participación sostenida y verificable a lo largo de toda la fase.
  - Garantizó la consistencia relacional y la integridad de los datos entre los módulos nuevos y los existentes de la Fase 1, evitando regresiones en los reportes previos.
  - Actualizó los diagramas de base de datos y su documentación técnica dentro de la HU-050.

### **7. Yeison Omar Lopez Dueñas (Rol: Scrum Master / Backend Developer)**

| Criterio                            |   Puntaje   |
| :---------------------------------- | :---------: |
| Cumplimiento de HU y compromisos    |    30/30    |
| Calidad técnica y disciplina en Git |    25/25    |
| Colaboración y comunicación         |    20/20    |
| Participación en eventos Scrum      |    15/15    |
| Proactividad, adaptación y valor    |    10/10    |
| **Nota Final**                      | **100/100** |

- **Historias a cargo (6):** HU-028, HU-029, HU-030, HU-047, HU-049, HU-051.
- **Justificación:**
  - Implementó el backend del registro y la autenticación con verificación de correo: generación de tokens, validación en el primer inicio de sesión y plantillas de correo institucional, núcleo de las HU-028, HU-029 y HU-030.
  - Construyó el pipeline de CI/CD del backend en GitHub Actions con las etapas de Build, Test y Deploy sobre Docker y secretos seguros (HU-049), base del despliegue en la nube (HU-051).
  - Aportó pruebas unitarias del flujo de registro y colaboró en las del módulo de retroalimentación (HU-047).
  - Como Scrum Master facilitó todas las ceremonias del equipo (planning, daily, review y retrospectiva), mantuvo operativo el tablero Kanban con sus evidencias por sprint, gestionó las métricas Scrumban y elaboró la presente evaluación formal del equipo.

---

## 6. Resumen Final de Calificaciones

| Integrante              | Rol                | Cumplimiento HU (30) | Calidad Técnica / Git (25) | Colaboración (20) | Eventos Scrum (15) | Proactividad (10) | **Nota Final (1-100)** |
| :---------------------- | :----------------- | :------------------: | :------------------------: | :---------------: | :----------------: | :---------------: | :--------------------: |
| **Oliverio Caarl**      | Frontend / Backend |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Angel Cardenas**      | Backend / Frontend |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Sebastian Velásquez** | Backend            |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Luis Pablo Carlos**   | DevOps / Backend   |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Diego Españas**       | PO / Frontend      |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Hector Cardona**      | BD / Backend       |          30          |             25             |        20         |         15         |        10         |        **100**         |
| **Yeison Lopez**        | SM / Backend       |          30          |             25             |        20         |         15         |        10         |        **100**         |

**Promedio general del equipo: 100/100.**

---

## 7. Cierre y Validación del Scrum Master

El equipo completó la totalidad de las historias de usuario comprometidas para la Fase 2 (HU-028 a HU-051) dentro de los dos sprints planificados, cumpliendo los criterios de aceptación definidos en el Product Backlog. Destaca la madurez del equipo respecto a la Fase 1: se incorporaron prácticas de aseguramiento de calidad (pruebas unitarias y End-to-End automatizadas), integración y despliegue continuo con GitHub Actions, despliegue en la nube con separación de responsabilidades, y una documentación técnica consistente y actualizada.

El ambiente de colaboración fue excelente: los bloqueos se resolvieron de forma conjunta en las dailies, la integración entre frontend, backend y base de datos se mantuvo fluida durante todo el sprint, y el uso de ramas por integrante junto con Pull Requests permitió una incorporación ordenada del código.

Con base en lo anterior, el Scrum Master emite una calificación de **100/100 para cada integrante del equipo de desarrollo**, respaldada por la evidencia de trabajo registrada en el repositorio, el tablero Kanban y las actas de las reuniones Scrumban.

**Scrum Master:** Yeison Omar López Dueñas
