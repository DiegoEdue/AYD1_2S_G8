# Product Backlog: Historias de Usuario - G8

> En este documento se presentan principalmente las historias de usuario del proyecto EduConnect. Las tareas derivadas de cada historia se gestionan en el tablero Kanban, mientras que la estimación, las dependencias y los criterios de aceptación se consultan en este Product Backlog.

Este documento contiene el Product Backlog inicial para el proyecto **EduConnect**, correspondiente a la Fase 1. Las historias de usuario están priorizadas de mayor a menor valor para el usuario, contemplando dependencias entre módulos y listas para ser estimadas durante el primer y segundo Sprint Planning del equipo. Las prioridades están explicadas con cuadros de colores.

🟥 **Alta 🟥:** Funcionalidades críticas que deben implementarse primero, ya que en base a estas se desarrollaran otras más adelante.  
🟨 **Media 🟨:** Funcionalidades importantes, pero que pueden desarrollarse después de las críticas.  
🟦 **Baja 🟦:** Funcionalidades opcionales que agregan valor, pero no están contempladas como obligatorias.

## Estimación del tamaño (T-Shirt Size)

> La estimación representa el tamaño relativo de una historia de usuario, no una cantidad exacta de horas. Las tallas permiten comparar la complejidad y comunicar el nivel de esfuerzo esperado.

Para estimar el tamaño de las historias de usuario, se utilizó el método T-Shirt Size.

- Durante la Fase 1, cada miembro del equipo etiquetó las actividades del backlog de cada historia con las categorías XS, S, M, L y XL basándose en la complijidad, siendo la etiqueta "XS" la de menor complejidad y "XL" la de mayor complejidad. El tamaño final de cada historia se asignó basado en la opinión conjunta del equipo, consolidando las estimaciones individuales en una única etiqueta.
- **Estimación de historias de usuario:** [Product Backlog](https://docs.google.com/spreadsheets/d/1hEPqb9qS5CAT-BEgUdgjGx3mxSTdZn1RbNl8HapYifc/edit?usp=sharing)

> **XS:** Historia de baja complejidad y rápida implementación.  
> **S:** Historia sencilla, con pocos criterios de aceptación.  
> **M:** Historia de complejidad media, que puede requerir integración con otras funcionalidades.  
> **L:** Historia compleja, que involucra varios módulos o dependencias.  
> **XL:** Historia muy compleja, que podría dividirse en varias historias más pequeñas.  

---

## Módulo: Registro y Autenticación

### [HU-001]

- **TÍTULO:** Registro de Estudiante
- **DESCRIPCIÓN:** **Como** estudiante no registrado, **quiero** registrarme en la plataforma ingresando mis datos personales y credenciales, **para** poder crear una cuenta y solicitar acceso a las tutorías académicas.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El formulario debe permitir el ingreso de: Nombre, Apellido, Carnet (ID universitario), Género, Dirección, Teléfono, Fecha de nacimiento, Fotografía (opcional), Correo electrónico y Contraseña.
  2. La contraseña debe validarse obligatoriamente con mínimo 8 caracteres, al menos una letra minúscula, una letra mayúscula y un número. Debe almacenarse encriptada en la base de datos.
  3. El sistema debe validar que el correo electrónico y el Carnet no existan previamente en la base de datos.
  4. Al completar el registro con éxito, la cuenta debe quedar en estado "Pendiente de aprobación" sin permitir el acceso directo hasta ser validada por un Administrador.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** Ninguna

---

### [HU-002]

- **TÍTULO:** Registro de Tutor
- **DESCRIPCIÓN:** **Como** tutor profesional, **quiero** registrar mis datos personales, profesionales y credenciales en el sistema, **para** postular mi perfil y ofrecer sesiones de tutoría a los estudiantes.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El formulario debe permitir el ingreso obligatorio de: Nombre, Apellido, Carnet o ID, Fecha de nacimiento, Género, Dirección, Teléfono, Fotografía (obligatoria), Número de identificación de tutor, Especialidad (materias que imparte), Dirección de tutoría (física o indicación de Online), Correo electrónico, Año de inicio de tutorías, Universidad de graduación y Contraseña.
  2. El sistema debe exigir la fotografía de forma obligatoria y validar que la contraseña cumpla con mínimo 8 caracteres, una minúscula, una mayúscula y un número, almacenándola encriptada.
  3. El sistema debe validar que no existan duplicados de correo electrónico ni de Número de identificación de tutor.
  4. La cuenta debe registrarse en estado "Pendiente de aprobación" para revisión del Administrador.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** Ninguna

---

### [HU-003]

- **TÍTULO:** Autenticación de Estudiante y Tutor
- **DESCRIPCIÓN:** **Como** estudiante o tutor registrado, **quiero** iniciar sesión con mi correo y contraseña, **para** acceder a las funcionalidades correspondientes a mi rol dentro de la plataforma.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El sistema debe validar las credenciales ingresadas comparando la contraseña encriptada.
  2. Si la cuenta aún no ha sido aprobada por el Administrador, el sistema debe denegar el acceso y mostrar el mensaje explicativo: "Su cuenta está pendiente de aprobación".
  3. En caso de credenciales incorrectas o cuenta dada de baja, se debe mostrar un mensaje claro informando la causa del error.
  4. La vista de inicio de sesión debe incluir un enlace visible hacia el formulario de registro para usuarios no registrados.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-001, HU-002, HU-016

---

### [HU-004]

- **TÍTULO:** Autenticación de Dos Factores para Administrador
- **DESCRIPCIÓN:** **Como** Administrador del sistema, **quiero** autenticarme mediante dos pasos (credenciales estándar y subida de archivo de clave), **para** garantizar el máximo nivel de seguridad en el panel administrativo.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La primera fase debe validar el usuario y contraseña predeterminados del Administrador contra contraseñas encriptadas en la base de datos.
  2. Tras validar el primer paso, el sistema debe redirigir obligatoriamente a una vista de segunda autenticación exigiendo la subida del archivo `auth2-ayd1.txt`.
  3. El sistema debe leer el archivo subido, validar su nombre y comparar la contraseña encriptada en su interior con la contraseña del segundo factor almacenada en la base de datos (la cual debe ser diferente a la del primer inicio de sesión).
  4. Solo al superar ambas validaciones se otorgará acceso a las vistas principales del módulo Administrador.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** L
- **DEPENDENCIAS:** Ninguna

---

## Módulo: Administrador

### [HU-005]

- **TÍTULO:** Aprobación o Rechazo de Estudiantes
- **DESCRIPCIÓN:** **Como** Administrador, **quiero** revisar el listado de estudiantes pendientes de aprobación **para** dar de alta o rechazar sus solicitudes de registro.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe desplegar una lista con los estudiantes pendientes que incluya: Fotografía (o imagen por defecto si no adjuntó), Nombre completo, Carnet, Género, Fecha de nacimiento y Correo electrónico.
  2. Cada registro debe contar con botones visibles para "Aceptar" y "Rechazar".
  3. Al presionar "Aceptar", el estado del estudiante pasa a "Aprobado", permitiéndole iniciar sesión en la plataforma. Al presionar "Rechazar", el estado pasa a "Rechazado".
  4. El sistema debe enviar un correo electrónico automático de notificación al estudiante informándole si su cuenta fue aprobada o rechazada.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-001, HU-004

---

### [HU-006]

- **TÍTULO:** Aprobación o Rechazo de Tutores
- **DESCRIPCIÓN:** **Como** Administrador, **quiero** examinar la lista de tutores pendientes de validación **para** autorizar o denegar su incorporación al cuerpo docente del sistema.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe mostrar una lista con los tutores pendientes detallando: Fotografía obligatoria, Nombre completo, Carnet/ID, Género, Especialidad, Número de identificación de tutor y Correo electrónico.
  2. Cada tutor debe tener las opciones claras de "Aceptar" y "Rechazar".
  3. Al aprobar la solicitud, la cuenta se activa para iniciar sesión; al rechazarla, la cuenta queda inhabilitada.
  4. El sistema debe enviar automáticamente un correo electrónico de notificación al tutor con información si su cuenta fue aprobada o rechazada.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-002, HU-004

---

### [HU-007]

- **TÍTULO:** Gestión y Baja de Estudiantes Aprobados
- **DESCRIPCIÓN:** **Como** Administrador, **quiero** visualizar a todos los estudiantes activos en la plataforma, **para** poder darlos de baja en caso de faltas o motivos válidos.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe desplegar un listado completo de los estudiantes que han sido aprobados en el sistema.
  2. Cada usuario debe tener una opción o botón de "Dar de baja".
  3. El sistema debe pedir confirmación antes de procesar la baja, cambiar el estado del tutor a "Dado de baja" e impidiéndole el acceso a la plataforma, y enviar un correo electrónico informándole sobre la baja de su cuenta.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-005

---

### [HU-008]

- **TÍTULO:** Gestión y Baja de Tutores Aprobados
- **DESCRIPCIÓN:** **Como** Administrador, **quiero** consultar la lista de tutores activos, **para** poder suspender o dar de baja a aquellos que no cumplan con las políticas de la institución.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe desplegar la lista de tutores aceptados con sus datos principales.
  2. Cada tutor debe tener una opción o botón de "Dar de baja".
  3. El sistema debe pedir confirmación antes de procesar la baja, cambiar el estado del tutor a "Dado de baja" e impidiéndole el acceso a la plataforma, y enviar un correo electrónico informándole sobre la baja de su cuenta.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-006

---

### [HU-009]

- **TÍTULO:** Generación de Reportes Analíticos del Sistema
- **DESCRIPCIÓN:** **Como** Administrador, **quiero** visualizar reportes estadísticos y gráficos sobre el uso del sistema, **para** tomar decisiones estratégicas sobre el servicio de tutorías.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El sistema debe generar al menos 2 reportes analíticos visuales con componentes gráficos.
  2. Reporte 1: Tutores que más estudiantes han atendido en la plataforma.
  3. Reporte 2: Materias o especialidades que registran la mayor demanda de sesiones.
  4. Los datos deben calcularse en tiempo real reflejando la información actualizada de las sesiones registradas.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-004, HU-013, HU-014

---

## Módulo: Tutor

### [HU-010]

- **TÍTULO:** Configuración de Horarios de Atención del Tutor
- **DESCRIPCIÓN:** **Como** tutor, **quiero** definir los días de la semana y el rango de horas en que atenderé tutorías, **para** que los estudiantes conozcan mi disponibilidad.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz debe permitir seleccionar los días de atención (ej. Lunes a Viernes) y una hora de inicio y fin (ej. 8:00 AM a 5:00 PM).
  2. El rango de horario seleccionado debe aplicarse de manera uniforme y consistente para todos los días de atención elegidos.
  3. Los horarios guardados deben actualizar la disponibilidad del tutor en el sistema para las futuras consultas de los estudiantes.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-003

---

### [HU-011]

- **TÍTULO:** Modificación de Horarios y Control de Sesiones Activas
- **DESCRIPCIÓN:** **Como** tutor, **quiero** actualizar mis días y horas de atención, **para** evitar conflictos con compromisos académicos previamente agendados.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor puede cambiar los días y la franja horaria de atención en cualquier momento.
  2. El sistema debe validar que NO existan sesiones activas o programadas con estudiantes fuera del nuevo rango horario propuesto.
  3. Si existen sesiones en conflicto, el sistema no debe permitir la actualización y debe mostrar un mensaje advirtiendo que debe cancelar o reprogramar dichas sesiones primero.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-010, HU-018

---

### [HU-012]

- **TÍTULO:** Visualización de Sesiones Pendientes del Tutor
- **DESCRIPCIÓN:** **Como** tutor, **quiero** consultar en mi página principal la lista de tutorías que tengo pendientes por atender, ordenadas por la fecha más próxima, **para** organizar mi jornada de trabajo.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al ingresar, el tutor debe ver un listado de sesiones pendientes ordenadas cronológicamente (las más próximas al inicio).
  2. Cada sesión debe mostrar: Fecha, Hora, Nombre completo del estudiante, Materia seleccionada y Motivo de la sesión.
  3. Únicamente deben listarse las sesiones en estado pendiente.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003, HU-018

---

### [HU-013]

- **TÍTULO:** Registro de Atención y Resumen de Tutoría
- **DESCRIPCIÓN:** **Como** tutor, **quiero** dar por completada una sesión de tutoría ingresando un resumen estructurado, **para** dejar constancia de los temas impartidos y recomendaciones brindadas.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Cada sesión pendiente debe incluir un botón que diga "Atender".
  2. Al presionar "Atender", se desplegará un formulario donde el ingreso del resumen de la sesión es obligatorio.
  3. Al confirmar, la sesión cambia su estado a "Atendida", se remueve de las pendientes y el resumen queda guardado para ser consultado en los historiales.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-012

---

### [HU-014]

- **TÍTULO:** Cancelación de Sesión por Parte del Tutor con Notificación por Correo
- **DESCRIPCIÓN:** **Como** tutor, **quiero** cancelar una sesión programada en caso de imprevistos académicos o personales, enviando un correo automático al estudiante afectado. **Para** cancelar una sesión programada.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor puede presionar el botón de cancelación en una sesión pendiente y el sistema debe solicitar confirmación.
  2. Al confirmar, el estado de la sesión cambia a "Cancelada por el tutor", se remueve de la lista de pendientes y se libera el horario en la agenda.
  3. El sistema debe enviar un correo electrónico automático al estudiante que contenga: Fecha, Hora, Motivo de la sesión cancelada, Nombre del tutor, Materia y un mensaje explícito de disculpa.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-012

---

### [HU-015]

- **TÍTULO:** Historial de Sesiones del Tutor
- **DESCRIPCIÓN:** **Como** tutor, **quiero** acceder al registro histórico de todas las sesiones que he atendido o cancelado, **para** llevar un control de mi actividad académica.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe mostrar todas las sesiones pasadas ordenadas de la más reciente a la más antigua.
  2. Para cada registro se mostrará: Fecha, Hora, Nombre del estudiante y Estado de la sesión (Atendido, Cancelado por estudiante o Cancelado por tutor).
  3. Debe existir una diferenciación visual clara según el estado de la sesión.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-013, HU-014, HU-020

---

### [HU-016]

- **TÍTULO:** Consulta y Actualización de Perfil del Tutor
- **DESCRIPCIÓN:** **Como** tutor, **quiero** ver y modificar mis datos personales y profesionales, **para** mantener mi información actualizada ante la comunidad estudiantil.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor podrá visualizar todos los datos registrados en su perfil.
  2. Se permitirá editar todos los campos a excepción del correo electrónico, el cual permanecerá bloqueado.
  3. Si se modifica la contraseña, debe validarse la seguridad de la misma y almacenarse encriptada en la base de datos.
- **PRIORIDAD:** BAJA 🟦
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003

---

## Módulo: Estudiante

### [HU-017]

- **TÍTULO:** Visualización del Catálogo de Tutores Disponibles
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** explorar la página principal para ver los tutores registrados en la plataforma, **para** conocer sus perfiles antes de programar una tutoría.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe presentar tarjetas o listas con la información de los tutores aprobados: Nombre completo, Especialidad (materias), Dirección de tutoría y Fotografía.
  2. Se deben excluir automáticamente del catálogo a los tutores con los cuales el estudiante ya posee una sesión activa en curso.
  3. La interfaz debe presentar una disposición limpia e intuitiva.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003, HU-006

---

### [HU-018]

- **TÍTULO:** Búsqueda Avanzada y Filtrado de Tutores
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** aplicar filtros de búsqueda específicos, **para** encontrar rápidamente al tutor que mejor se adapte a mis necesidades de estudio.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz debe contar con un filtro para filtrar tutores por: Materia, Años de experiencia, Sexo, Edad y Universidad.
  2. La búsqueda debe ejecutar un filtrado preciso combinando los criterios seleccionados y presentando el resultado con el mismo formato de la página principal.
  3. En caso de no haber coincidencias, se debe mostrar un mensaje amigable al usuario.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-017

---

### [HU-019]

- **TÍTULO:** Consulta de Horarios y Disponibilidad de un Tutor por Fecha
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** seleccionar a un tutor y consultar sus días de atención y la disponibilidad de horarios en una fecha elegida, **para** identificar momentos libres.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al seleccionar un tutor, el sistema debe desplegar sus días reglamentarios de atención (ej. Lunes a Viernes) y su franja de horario general.
  2. El estudiante debe poder ingresar una fecha específica (ej. 10/04/2026) y el sistema debe clasificar con indicadores visuales cuáles horarios están libres y cuáles ocupados.
  3. Si la fecha seleccionada corresponde a un día que el tutor no atiende, se debe notificar claramente al estudiante.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-010, HU-017

---

### [HU-020]

- **TÍTULO:** Programación y Validación de Sesión de Tutoría
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** agendar una sesión de tutoría completando los datos requeridos, **para** asegurar que no existan traslapes ni incumplimientos de horarios.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El formulario requiere ingresar: Fecha, Hora, Materia (debe pertenecer a las especialidades del tutor seleccionado) y Motivo de la sesión.
  2. Validación 1: La fecha debe estar en los días que atiende el tutor y el horario debe estar libre.
  3. Validación 2: El estudiante NO puede programar más de una sesión activa con el mismo tutor.
  4. Validación 3: El estudiante NO puede agendar dos o más sesiones la misma fecha y hora (no se permiten traslapes con otros tutores).
  5. Se deben emitir mensajes de error específicos al fallar alguna regla.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-019

---

### [HU-021]

- **TÍTULO:** Listado de Sesiones Activas del Estudiante
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** ver la lista de todas mis tutorías agendadas que aún no han sido atendidas, **para** llevar un control de mis próximos compromisos académicos.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe incluir únicamente sesiones pendientes con los datos: Fecha, Hora, Nombre del tutor, Materia, Dirección de tutoría y Motivo.
  2. La lista debe ofrecer un acceso directo e individual para realizar la cancelación de la sesión si fuere necesario.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-020

---

### [HU-022]

- **TÍTULO:** Cancelación de Sesión por Parte del Estudiante
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** cancelar una tutoría agendada previamente desde mi lista de sesiones activas, **para** liberar el horario para otros compañeros.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al presionar "Cancelar" en una sesión activa, el sistema debe solicitar confirmación explícita mediante un modal o mensaje interactivo.
  2. Tras confirmar, la sesión se retira de la lista de activas y su estado se actualiza en la base de datos a "Cancelada por el estudiante".
  3. El horario correspondiente queda inmediatamente liberado en la agenda del tutor.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-021

---

### [HU-023]

- **TÍTULO:** Historial de Tutorías del Estudiante
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** revisar el historial de mis tutorías pasadas (atendidas y canceladas), **para** consultar los resúmenes y recomendaciones de mis tutores.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Debe desplegar todas las sesiones atendidas o canceladas indicando: Fecha, Nombre del tutor, Materia, Motivo, Dirección de tutoría, Estado (Atendido, Cancelado por estudiante, Cancelado por tutor) y el Resumen de la sesión (solo visible si la sesión fue Atendida).
  2. Debe existir distinción de colores para los distintos estados de las sesiones.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-013, HU-020, HU-022

---

### [HU-024]

- **TÍTULO:** Consulta y Actualización de Perfil del Estudiante
- **DESCRIPCIÓN:** **Como** estudiante, **quiero** actualizar mis datos de contacto y contraseña, **para** mantener mi información personal al día.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz permite visualizar los datos de la cuenta y editar campos como Nombre, Apellido, Dirección, Teléfono, etc.
  2. El correo electrónico debe permanecer bloqueado sin posibilidad de ser modificado.
  3. Toda actualización de contraseña debe cumplir las reglas de complejidad y guardarse encriptada.
- **PRIORIDAD:** BAJA 🟦
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003

---

## Módulo: Infraestructura, Arquitectura y Documentación

### [HU-025]

- **TÍTULO:** Modelado e Implementación de la Base de Datos
- **DESCRIPCIÓN:** **Como** usuario de la aplicación, **quiero** que mi información quede guardada en el sistema, **para** almacenar y consultar de forma consistente toda la información cuando sea necesario.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Diseñar e implementar el modelo relacional normalizado o esquema NoSQL que soporte todos los módulos del sistema.
  2. Garantizar la persisntecia de usuarios, roles, disponibilidades horarias, sesiones, resúmenes y registros de auditoría.
  3. Asegurar que las contraseñas de todos los roles (incluyendo las dos fases del administrador) se almacenen encriptadas.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** Ninguna

---

### [HU-026]

- **TÍTULO:** Contenedorización de la Aplicación con Docker y Docker Compose
- **DESCRIPCIÓN:** **Como** Product Owner, **quiero** desplegar el Frontend, Backend y Base de datos en contenedores Docker, **para** asegurar un entorno de ejecución estandarizado y portable.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se deben crear Dockerfiles independientes y optimizados para el proyecto Frontend y el proyecto Backend.
  2. Se debe configurar un archivo `docker-compose.yml` en la raíz del proyecto que levante los servicios de Frontend, Backend y Base de datos en red local sin errores.
  3. Ejecutar el comando `docker-compose up` debe ser suficiente para poner en marcha toda la solución comunicando correctamente todos sus componentes.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** HU-026 y desarrollos iniciales de Frontend/Backend

---

### [HU-027]

- **TÍTULO:** Documentación Técnica, Manuales y Evidencias SCRUM
- **DESCRIPCIÓN:** **Como** Product Owner, **quiero** contar con toda la documentación técnica, manuales y evidencias del proceso ágil en formato Markdown, **para** cumplir los requerimientos de entrega e inspección del proyecto.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Crear en el repositorio los archivos Markdown con: Requerimientos funcionales, diagrama de casos de uso, diagrama ER o esquema NoSQL, documentación de selección de principios y evidencia de aplicación
  2. Elaborar el Manual Técnico y Manual de Usuario con capturas para cada rol.
  3. Incluir el enlace al tablero Kanban, links a grabaciones de reuniones y la evaluación formal redactada por el Scrum Master.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** M
- **DEPENDENCIAS:** Avances progresivos en los Sprints 1 y 2
