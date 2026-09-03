# Tablero Kanban - G8

El tablero Kanban fue utilizado para llevar el control y seguimiento de todas las tareas desarrolladas durante el proyecto EduConnect. Este tablero permitió a los miembros del equipo visualizar el progreso de las actividades y coordinar el flujo de trabajo en cada sprint.

Se utilizó la herramienta Trello para implementar el tablero, organizando las tareas según el modelo Kanban con las siguientes columnas:

- **TO-DO:** Contiene las tareas pendientes por iniciar.
- **BLOCKED:** Contiene las tareas bloqueadas por alguna razón interna o externa.
- **IN PROGRESS:** Reúne las tareas que están actualmente en desarrollo.
- **TEST/QA:** Contiene tareas en proceso de validación o pruebas.
- **DEPLOY:** Contiene tareas listas para desplegarse o ya validadas.

**Backlog:** En el tablero también se encuentra el backlog con el detalle de cada historia de usuario. Las tareas incluidas en el backlog fueron trasladadas a **TO-DO** a medida que se planificaban los sprints. A partir de ahí, se fueron moviendo por las distintas columnas conforme avanzaban en su desarrollo.

> [!IMPORTANT]
> Las tareas derivadas de cada historia de usuario y las personas responsables de realizarlas se encuentran en las tarjetas del tablero. La estimación, las dependencias y los criterios de aceptación de las historias se encuentran en el Product Backlog.

---

## 1. Datos del Tablero

| Información       | Detalle                                                            |
| ----------------- | ------------------------------------------------------------------ |
| Herramienta usada | Trello                                                             |
| Enlace al tablero | [Ver Tablero Trello](https://trello.com/b/eNhb1jB6/ayd1-p1-1s2026) |

### 1.1 Miembros del Equipo

![Miembros del equipo](./img/miembros.png)

### 1.2 Etiquetas utilizadas

![Etiquetas del tablero](./img/etiquetas.png)

---

## 2. Prioridad en Historias de Usuario

> [!NOTE]
> Las etiquetas técnicas, como MYSQL, BACKEND, DOCU, FRONTEND, DOCKER, NUBE y TEST identifican el área o tipo de trabajo de una tarjeta. No representan la prioridad de la historia.

Para facilitar el orden en el desarrollo, las historias de usuario fueron categorizadas por nivel de prioridad, utilizando un código de colores:

- 🟥 **Alta 🟥:** Funcionalidades críticas que deben implementarse primero, ya que en base a estas se desarrollaran otras más adelante.  
- 🟨 **Media 🟨:** Funcionalidades importantes, pero que pueden desarrollarse después de las críticas.  
- 🟦 **Baja 🟦:** Funcionalidades opcionales que agregan valor, pero no están contempladas como obligatorias.

---

## 3. Sprint 1

### 3.1 Descripción del Sprint Backlog

En este sprint se seleccionaron todas las historias de usuario con **prioridad alta (rojas)**. Estas incluían las tareas necesarias para establecer la base del sistema.

> [!IMPORTANT]
>
> En el primer sprint se siguió la metodología Kanban debido a una confusión, por esta razón este sprint contó con 5 columnas. Sin embargo, el trabajo se distribuyó de manera equitativa con cada uno de los desarrolladores.
>
> Las historias de usuario no se descompusieron en tareas más pequeñas, pero se les colocó etiqutas para identificar que se tenía que hacer en cada una de ellas. Además por eso la mayoría de historias tenían más de un desarrollador asignado, para que uno trabaja el frontend y el otro el backend.

### 3.1.1 Historias de Usuario Abordadas

| Prioridad | ID   | Historia de Usuario                                                   |
| --------- | ---- | --------------------------------------------------------------------- |
| 🟥        | [1]  | Registro de Estudiante                                                |
| 🟥        | [2]  | Registro de Tutor                                                     |
| 🟥        | [3]  | Autenticación de Estudiante y Tutor                                   |
| 🟥        | [4]  | Autenticación de Dos Factores para Administrador                      |
| 🟥        | [5]  | Aprobación o Rechazo de Estudiantes                                   |
| 🟥        | [6]  | Aprobación o Rechazo de Tutores                                       |
| 🟥        | [10] | Configuración de Horarios de Atención del Tutor                       |
| 🟥        | [12] | Visualización de Sesiones Pendientes del Tutor                        |
| 🟥        | [13] | Registro de Atención y Resumen de Tutoría                             |
| 🟥        | [14] | Cancelación de Sesión por Parte del Tutor con Notificación por Correo |
| 🟥        | [17] | Visualización del Catálogo de Tutores Disponibles                     |
| 🟥        | [19] | Consulta de Horarios y Disponibilidad de un Tutor por Fecha           |
| 🟥        | [20] | Programación y Validación de Sesión de Tutoría                        |
| 🟥        | [25] | Modelado e Implementación de la Base de Datos                         |
| 🟥        | [26] | Contenedorización de la Aplicación con Docker y Docker Compose        |

### 3.1.2 Estado del Tablero

#### 3.1.2.1 Estado Inicial

![Sprint 1 - Tablero Inicial (Parte 1)](./img/IP1.jpeg)  
![Sprint 1 - Tablero Inicial (Parte 2)](./img/IP2.jpeg)  
![Sprint 1 - Tablero Inicial (Parte 3)](./img/IP3.jpeg)  
![Sprint 1 - Tablero Inicial (Parte 4)](./img/IP4.jpeg)  

#### 3.1.2.2 Estado Intermedio

![Sprint 1 - Mitad de Sprint (Parte 1)](./img/MP1.jpeg)  
![Sprint 1 - Mitad de Sprint (Parte 2)](./img/MP2.jpeg)  
![Sprint 1 - Mitad de Sprint (Parte 3)](./img/MP3.jpeg)  

#### 3.1.2.3 Estado Final

![Sprint 1 - Final de Sprint (Parte 1)](./img/FP1.jpeg)  
![Sprint 1 - Final de Sprint (Parte 2)](./img/FP2.jpeg)  
![Sprint 1 - Final de Sprint (Parte 3)](./img/FP3.jpeg)  

> [!INFO]
>
> En las imágenes se muestra el estado del tablero en tres puntos específicos del sprint. Si desea ver el estado en un día en específico del tablero se puede observar en las grabaciones que se encuentran en el documento de scrum meetings [Scrum Meetings](scrumn_meetings.md).

---

## 4. Sprint 2

### 4.1 Descripción del Sprint Backlog

En este sprint se agregaron nuevas historias de usuario enfocadas en la documentación, pruebas y deslpliegue del sistema. Se abordaron aquellas etiquetadas como **prioridad media (amarillas)** y **prioridad baja (azules)**.

> [!IMPORTANT]
>
> En el segundo sprint se siguió la metodología Scrumban, acá ya se agregó la 6ta. columna correspondiente a las historias de usuario (Product Backlog). Además cada historia de usuario correspondiente a este sprint se descompuso en tareas más pequeñas para ser más especifícos a la hora de realizarlas y así poder llevar un mejor control en el tablero.

### 4.1.1 Historias de Usuario Abordadas

| Prioridad | ID   | Historia de Usuario                                    |
| --------- | ---- | ------------------------------------------------------ |
| 🟨        | [7]  | Gestión y Baja de Estudiante Aprobados                 |
| 🟨        | [8]  | Gestión y Baja de Tutores Aprobados                    |
| 🟨        | [9]  | Generación de Reportes Analíticos del Sistema          |
| 🟨        | [11] | Modificación de Horarios y Control de Sesiones Activas |
| 🟨        | [15] | Historial de Sesiones del Tutor                        |
| 🟦        | [16] | Consulta y Actualización de Perfil del Tutor           |
| 🟨        | [18] | Búsqueda Avanzada y Filtrado de Tutores                |
| 🟨        | [21] | Listado de Sesiones Activas del Estudiante             |
| 🟨        | [22] | Cancelación de Sesión por Parte del Estudiante         |
| 🟨        | [23] | Historial de Tutorías del Estudiante                   |
| 🟦        | [24] | Consulta y Actualización de Perfil del Estudiante      |
| 🟨        | [27] | Documentación Técnica, Manuales y Evidencia SCRUM      |

### 4.1.2 Estado del Tablero

#### 4.1.2.1 Estado Inicial

![Sprint 2 - Tablero Inicial (Parte 1)](./img/IS1.png)  
![Sprint 2 - Tablero Inicial (Parte 2)](./img/IS2.png)  
![Sprint 2 - Tablero Inicial (Parte 3)](./img/IS3.png)  
![Sprint 2 - Tablero Inicial (Parte 4)](./img/IS4.png)  
![Sprint 2 - Tablero Inicial (Parte 5)](./img/IS5.png)  
![Sprint 2 - Tablero Inicial (Parte 6)](./img/IS6.png)  
![Sprint 2 - Tablero Inicial (Parte 7)](./img/IS7.png)  
![Sprint 2 - Tablero Inicial (Parte 8)](./img/IS8.png)  
![Sprint 2 - Tablero Inicial (Parte 9)](./img/IS9.png)  
![Sprint 2 - Tablero Inicial (Parte 10)](./img/IS10.png)  
![Sprint 2 - Tablero Inicial (Parte 11)](./img/IS11.png)  
![Sprint 2 - Tablero Inicial (Parte 12)](./img/IS12.png)  

> [!INFO]
>
> En las imágenes se muestra el estado del tablero en tres puntos específicos del sprint. Si desea ver el estado en un día en específico del tablero se puede observar en las grabaciones que se encuentran en el documento de scrum meetings [Scrum Meetings](scrumn_meetings.md).
