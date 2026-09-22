# Product Backlog: Historias de Usuario - G8

> [!IMPORTANT]
> En este documento se presentan principalmente las historias de usuario del proyecto EduConnect. Las tareas derivadas de cada historia se gestionan en el tablero Kanban, mientras que la estimación, las dependencias y los criterios de aceptación se consultan en este Product Backlog.
>
> El proyecto se organizó en dos fases. La Fase 1 contiene las funcionalidades iniciales y la Fase 2 amplía historias existentes y agrega nuevas funcionalidades. La nomenclatura `[EXT - HUxxx]` indica que una historia extiende una historia creada anteriormente.

Este documento contiene el Product Backlog inicial para el proyecto **EduConnect**, correspondiente a la Fase 1. Las historias de usuario están priorizadas de mayor a menor valor para el usuario, contemplando dependencias entre módulos y listas para ser estimadas durante el primer y segundo Sprint Planning del equipo. Las prioridades están explicadas con cuadros de colores.

🟥 **Alta 🟥:** Funcionalidades críticas que deben implementarse primero, ya que en base a estas se desarrollaran otras más adelante.  
🟨 **Media 🟨:** Funcionalidades importantes, pero que pueden desarrollarse después de las críticas.  
🟦 **Baja 🟦:** Funcionalidades opcionales que agregan valor, pero no están contempladas como obligatorias.

## Estimación del tamaño (T-Shirt Size)

> [!INFO]
> La estimación representa el tamaño relativo de una historia de usuario, no una cantidad exacta de horas. Las tallas permiten comparar la complejidad y comunicar el nivel de esfuerzo esperado.

Para estimar el tamaño de las historias de usuario, se utilizó el método T-Shirt Size.

- Durante ambas fases, cada miembro del equipo etiquetó las actividades del backlog de cada historia con las categorías XS, S, M, L y XL basándose en la complejidad, siendo la etiqueta "XS" la de menor complejidad y "XL" la de mayor complejidad. El tamaño final de cada historia se asignó basado en la opinión conjunta del equipo, consolidando las estimaciones individuales en una única etiqueta.
- **Estimación de historias de usuario:** [Product Backlog](https://docs.google.com/spreadsheets/d/1hEPqb9qS5CAT-BEgUdgjGx3mxSTdZn1RbNl8HapYifc/edit?usp=sharing)

> [!NOTE]
> **XS:** Historia de baja complejidad y rápida implementación.  
> **S:** Historia sencilla, con pocos criterios de aceptación.  
> **M:** Historia de complejidad media, que puede requerir integración con otras funcionalidades.  
> **L:** Historia compleja, que involucra varios módulos o dependencias.  
> **XL:** Historia muy compleja, que podría dividirse en varias historias más pequeñas.  

---

## 1. Fase 1

### Módulo: Registro y Autenticación

#### [HU-001] Registro de Estudiante

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

#### [HU-002] Registro de Tutor

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

#### [HU-003] Autenticación de Estudiante y Tutor

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

#### [HU-004] Autenticación de Dos Factores para Administrador

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

### Módulo: Administrador

#### [HU-005] Aprobación o Rechazo de Estudiantes

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

#### [HU-006] Aprobación o Rechazo de Tutores

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

#### [HU-007] Gestión y Baja de Estudiantes Aprobados

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** visualizar a todos los estudiantes activos en la plataforma, **para** poder darlos de baja en caso de faltas o motivos válidos.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe desplegar un listado completo de los estudiantes que han sido aprobados en el sistema.
  2. Cada usuario debe tener una opción o botón de "Dar de baja".
  3. El sistema debe pedir confirmación antes de procesar la baja, cambiar el estado del tutor a "Dado de baja" e impidiéndole el acceso a la plataforma, y enviar un correo electrónico informándole sobre la baja de su cuenta.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-005
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista "Ver Estudiantes Aprobados" con tabla de datos y botón de acción "Dar de baja".
  - **Frontend:** Implementar modal de confirmación antes de ejecutar la baja del estudiante.
  - **Backend:** Crear endpoint para listar los estudiantes en estado aprobado.
  - **Backend:** Crear endpoint para actualizar el estado del estudiante a "Dado de baja".
  - **Backend:** Configurar el envío automático de correo electrónico notificando al estudiante sobre la baja de su cuenta.

---

#### [HU-008] Gestión y Baja de Tutores Aprobados

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** consultar la lista de tutores activos, **para** poder suspender o dar de baja a aquellos que no cumplan con las políticas de la institución.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se debe desplegar la lista de tutores aceptados con sus datos principales.
  2. Cada tutor debe tener una opción o botón de "Dar de baja".
  3. El sistema debe pedir confirmación antes de procesar la baja, cambiar el estado del tutor a "Dado de baja" e impidiéndole el acceso a la plataforma, y enviar un correo electrónico informándole sobre la baja de su cuenta.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-006
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista "Ver Tutores Aprobados" con listado detallado y botón de acción "Dar de baja".
  - **Frontend:** Diseñar el modal interactivo de confirmación previa a la baja.
  - **Backend:** Crear endpoint para obtener todos los tutores aceptados en el sistema.
  - **Backend:** Crear endpoint para inhabilitar al tutor.
  - **Backend:** Integrar servicio de mensajería por correo electrónico para notificar la baja al tutor.

---

#### [HU-009] Generación de Reportes Analíticos del Sistema

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** visualizar reportes estadísticos y gráficos sobre el uso del sistema, **para** tomar decisiones estratégicas sobre el servicio de tutorías.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El sistema debe generar al menos 2 reportes analíticos visuales con componentes gráficos.
  2. Reporte 1: Tutores que más estudiantes han atendido en la plataforma.
  3. Reporte 2: Materias o especialidades que registran la mayor demanda de sesiones.
  4. Los datos deben calcularse en tiempo real reflejando la información actualizada de las sesiones registradas.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-004, HU-013, HU-014
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el Dashboard de Reportes.
  - **Frontend:** Implementar la vista del Reporte 1 (Tabla de tutores con más estudiantes atendidos).
  - **Frontend:** Implementar la vista del Reporte 2 (Barras de materias con mayor demanda).
  - **Backend:** Crear endpoint con consultas agregadas en tiempo real.
  - **Backend:** Crear endpoint para obtener las estadísticas por materia.

---

### Módulo: Tutor

#### [HU-010] Configuración de Horarios de Atención del Tutor

- **DESCRIPCIÓN:** **Como** tutor, **quiero** definir los días de la semana y el rango de horas en que atenderé tutorías, **para** que los estudiantes conozcan mi disponibilidad.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz debe permitir seleccionar los días de atención (ej. Lunes a Viernes) y una hora de inicio y fin (ej. 8:00 AM a 5:00 PM).
  2. El rango de horario seleccionado debe aplicarse de manera uniforme y consistente para todos los días de atención elegidos.
  3. Los horarios guardados deben actualizar la disponibilidad del tutor en el sistema para las futuras consultas de los estudiantes.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-003

---

#### [HU-011] Modificación de Horarios y Control de Sesiones Activas

- **DESCRIPCIÓN:** **Como** tutor, **quiero** actualizar mis días y horas de atención, **para** evitar conflictos con compromisos académicos previamente agendados.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor puede cambiar los días y la franja horaria de atención en cualquier momento.
  2. El sistema debe validar que NO existan sesiones activas o programadas con estudiantes fuera del nuevo rango horario propuesto.
  3. Si existen sesiones en conflicto, el sistema no debe permitir la actualización y debe mostrar un mensaje advirtiendo que debe cancelar o reprogramar dichas sesiones primero.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-010, HU-018
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista de edición de horarios de atención para el tutor.
  - **Frontend:** Diseñar componentes de alerta para informar conflictos con sesiones activas fuera del nuevo rango.
  - **Backend:** Crear endpoint para procesar la actualización del horario.
  - **Backend:** Implementar lógica de validación que consulte la BD en busca de sesiones activas que queden fuera del nuevo rango horario.

---

#### [HU-012] Visualización de Sesiones Pendientes del Tutor

- **DESCRIPCIÓN:** **Como** tutor, **quiero** consultar en mi página principal la lista de tutorías que tengo pendientes por atender, ordenadas por la fecha más próxima, **para** organizar mi jornada de trabajo.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al ingresar, el tutor debe ver un listado de sesiones pendientes ordenadas cronológicamente (las más próximas al inicio).
  2. Cada sesión debe mostrar: Fecha, Hora, Nombre completo del estudiante, Materia seleccionada y Motivo de la sesión.
  3. Únicamente deben listarse las sesiones en estado pendiente.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003, HU-018

---

#### [HU-013] Registro de Atención y Resumen de Tutoría

- **DESCRIPCIÓN:** **Como** tutor, **quiero** dar por completada una sesión de tutoría ingresando un resumen estructurado, **para** dejar constancia de los temas impartidos y recomendaciones brindadas.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Cada sesión pendiente debe incluir un botón que diga "Atender".
  2. Al presionar "Atender", se desplegará un formulario donde el ingreso del resumen de la sesión es obligatorio.
  3. Al confirmar, la sesión cambia su estado a "Atendida", se remueve de las pendientes y el resumen queda guardado para ser consultado en los historiales.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-012

---

#### [HU-014] Cancelación de Sesión por Parte del Tutor con Notificación por Correo

- **DESCRIPCIÓN:** **Como** tutor, **quiero** cancelar una sesión programada en caso de imprevistos académicos o personales, enviando un correo automático al estudiante afectado. **Para** cancelar una sesión programada.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor puede presionar el botón de cancelación en una sesión pendiente y el sistema debe solicitar confirmación.
  2. Al confirmar, el estado de la sesión cambia a "Cancelada por el tutor", se remueve de la lista de pendientes y se libera el horario en la agenda.
  3. El sistema debe enviar un correo electrónico automático al estudiante que contenga: Fecha, Hora, Motivo de la sesión cancelada, Nombre del tutor, Materia y un mensaje explícito de disculpa.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-012

---

#### [HU-015] Historial de Sesiones del Tutor

- **DESCRIPCIÓN:** **Como** tutor, **quiero** acceder al registro histórico de todas las sesiones que he atendido o cancelado, **para** llevar un control de mi actividad académica.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe mostrar todas las sesiones pasadas ordenadas de la más reciente a la más antigua.
  2. Para cada registro se mostrará: Fecha, Hora, Nombre del estudiante y Estado de la sesión (Atendido, Cancelado por estudiante o Cancelado por tutor).
  3. Debe existir una diferenciación visual clara según el estado de la sesión.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-013, HU-014, HU-020
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista "Historial de Sesiones" para el módulo Tutor.
  - **Frontend:** Aplicar Etiquetas con colores diferenciados para indicar los distintos estados (Atendido, Cancelado por estudiante, Cancelado por tutor).
  - **Backend:** Crear endpoint para obtener las sesiones no activas del tutor ordenadas cronológicamente.

---

#### [HU-016] Consulta y Actualización de Perfil del Tutor

- **DESCRIPCIÓN:** **Como** tutor, **quiero** ver y modificar mis datos personales y profesionales, **para** mantener mi información actualizada ante la comunidad estudiantil.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El tutor podrá visualizar todos los datos registrados en su perfil.
  2. Se permitirá editar todos los campos a excepción del correo electrónico, el cual permanecerá bloqueado.
  3. Si se modifica la contraseña, debe validarse la seguridad de la misma y almacenarse encriptada en la base de datos.
- **PRIORIDAD:** BAJA 🟦
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el formulario de visualización y edición del perfil del tutor, bloqueando el campo del correo electrónico.
  - **Frontend:** Implementar validaciones del lado del cliente para la edición de campos y cambio opcional de contraseña.
  - **Backend:** Crear endpoint para cargar los datos del tutor.
  - **Backend:** Crear endpoint para procesar las actualizaciones, encriptando la nueva contraseña si aplica.

---

### Módulo: Estudiante

#### [HU-017] Visualización del Catálogo de Tutores Disponibles

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** explorar la página principal para ver los tutores registrados en la plataforma, **para** conocer sus perfiles antes de programar una tutoría.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe presentar tarjetas o listas con la información de los tutores aprobados: Nombre completo, Especialidad (materias), Dirección de tutoría y Fotografía.
  2. Se deben excluir automáticamente del catálogo a los tutores con los cuales el estudiante ya posee una sesión activa en curso.
  3. La interfaz debe presentar una disposición limpia e intuitiva.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003, HU-006

---

#### [HU-018] Búsqueda Avanzada y Filtrado de Tutores

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** aplicar filtros de búsqueda específicos, **para** encontrar rápidamente al tutor que mejor se adapte a mis necesidades de estudio.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz debe contar con un filtro para filtrar tutores por: Materia, Años de experiencia, Sexo, Edad y Universidad.
  2. La búsqueda debe ejecutar un filtrado preciso combinando los criterios seleccionados y presentando el resultado con el mismo formato de la página principal.
  3. En caso de no haber coincidencias, se debe mostrar un mensaje amigable al usuario.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** HU-017
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar la barra y formulario de filtros avanzados en la página principal del estudiante.
  - **Frontend:** Implementar el manejo del estado de los filtros y el despliegue del mensaje en caso de cero coincidencias.
  - **Backend:** Crear endpoint aceptando parámetros query (`materia`, `experiencia`, `sexo`, `edad`, `universidad`).

---

#### [HU-019] Consulta de Horarios y Disponibilidad de un Tutor por Fecha

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** seleccionar a un tutor y consultar sus días de atención y la disponibilidad de horarios en una fecha elegida, **para** identificar momentos libres.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al seleccionar un tutor, el sistema debe desplegar sus días reglamentarios de atención (ej. Lunes a Viernes) y su franja de horario general.
  2. El estudiante debe poder ingresar una fecha específica (ej. 10/04/2026) y el sistema debe clasificar con indicadores visuales cuáles horarios están libres y cuáles ocupados.
  3. Si la fecha seleccionada corresponde a un día que el tutor no atiende, se debe notificar claramente al estudiante.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-010, HU-017

---

#### [HU-020] Programación y Validación de Sesión de Tutoría

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

#### [HU-021] Listado de Sesiones Activas del Estudiante

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** ver la lista de todas mis tutorías agendadas que aún no han sido atendidas, **para** llevar un control de mis próximos compromisos académicos.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista debe incluir únicamente sesiones pendientes con los datos: Fecha, Hora, Nombre del tutor, Materia, Dirección de tutoría y Motivo.
  2. La lista debe ofrecer un acceso directo e individual para realizar la cancelación de la sesión si fuere necesario.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-020
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista "Mis Sesiones Activas" mostrando las tarjetas de las tutorías agendadas sin atender.
  - **Frontend:** Agregar el botón individual "Cancelar Sesión" en cada tarjeta del listado.
  - **Backend:** Crear endpoint para obtener las tutorías pendientes del estudiante autenticado.

---

#### [HU-022] Cancelación de Sesión por Parte del Estudiante

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** cancelar una tutoría agendada previamente desde mi lista de sesiones activas, **para** liberar el horario para otros compañeros.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al presionar "Cancelar" en una sesión activa, el sistema debe solicitar confirmación explícita mediante un modal o mensaje interactivo.
  2. Tras confirmar, la sesión se retira de la lista de activas y su estado se actualiza en la base de datos a "Cancelada por el estudiante".
  3. El horario correspondiente queda inmediatamente liberado en la agenda del tutor.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-021
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el modal de confirmación emergente con la pregunta "¿Está seguro de cancelar la sesión?".
  - **Frontend:** Actualización dinámica del estado del cliente para remover la sesión cancelada de la interfaz.
  - **Backend:** Crear endpoint para actualizar el estado de la tutoría.

---

#### [HU-023] Historial de Tutorías del Estudiante

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** revisar el historial de mis tutorías pasadas (atendidas y canceladas), **para** consultar los resúmenes y recomendaciones de mis tutores.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Debe desplegar todas las sesiones atendidas o canceladas indicando: Fecha, Nombre del tutor, Materia, Motivo, Dirección de tutoría, Estado (Atendido, Cancelado por estudiante, Cancelado por tutor) y el Resumen de la sesión (solo visible si la sesión fue Atendida).
  2. Debe existir distinción de colores para los distintos estados de las sesiones.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-013, HU-020, HU-022
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista "Historial de Tutorías" en el portal del estudiante.
  - **Frontend:** Renderizar el campo del resumen elaborado por el tutor únicamente cuando el estado de la sesión sea "Atendida".
  - **Backend:** Crear endpoint para devolver las tutorías inactivas y finalizadas del estudiante.

---

#### [HU-024] Consulta y Actualización de Perfil del Estudiante

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** actualizar mis datos de contacto y contraseña, **para** mantener mi información personal al día.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La interfaz permite visualizar los datos de la cuenta y editar campos como Nombre, Apellido, Dirección, Teléfono, etc.
  2. El correo electrónico debe permanecer bloqueado sin posibilidad de ser modificado.
  3. Toda actualización de contraseña debe cumplir las reglas de complejidad y guardarse encriptada.
- **PRIORIDAD:** BAJA 🟦
- **TAMAÑO:** XS
- **DEPENDENCIAS:** HU-003
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear el formulario de consulta y actualización de datos personales del estudiante, deshabilitando el input de correo.
  - **Frontend:** Agregar lógica para validación de formato de teléfono, dirección y requisitos de la nueva contraseña.
  - **Backend:** Crear endpoint para cargar la información del usuario.
  - **Backend:** Crear endpoint para persistir los cambios, encriptando la contraseña si se actualizó.

---

### Módulo: Infraestructura, Arquitectura y Documentación

#### [HU-025] Modelado e Implementación de la Base de Datos

- **DESCRIPCIÓN:** **Como** usuario de la aplicación, **quiero** que mi información quede guardada en el sistema, **para** almacenar y consultar de forma consistente toda la información cuando sea necesario.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Diseñar e implementar el modelo relacional normalizado o esquema NoSQL que soporte todos los módulos del sistema.
  2. Garantizar la persisntecia de usuarios, roles, disponibilidades horarias, sesiones, resúmenes y registros de auditoría.
  3. Asegurar que las contraseñas de todos los roles (incluyendo las dos fases del administrador) se almacenen encriptadas.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** Ninguna

---

#### [HU-026] Contenedorización de la Aplicación con Docker y Docker Compose

- **DESCRIPCIÓN:** **Como** Product Owner, **quiero** desplegar el Frontend, Backend y Base de datos en contenedores Docker, **para** asegurar un entorno de ejecución estandarizado y portable.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Se deben crear Dockerfiles independientes y optimizados para el proyecto Frontend y el proyecto Backend.
  2. Se debe configurar un archivo `docker-compose.yml` en la raíz del proyecto que levante los servicios de Frontend, Backend y Base de datos en red local sin errores.
  3. Ejecutar el comando `docker-compose up` debe ser suficiente para poner en marcha toda la solución comunicando correctamente todos sus componentes.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** HU-026 y desarrollos iniciales de Frontend/Backend

---

#### [HU-027] Documentación Técnica, Manuales y Evidencias SCRUM

- **DESCRIPCIÓN:** **Como** Product Owner, **quiero** contar con toda la documentación técnica, manuales y evidencias del proceso ágil en formato Markdown, **para** cumplir los requerimientos de entrega e inspección del proyecto.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Crear en el repositorio los archivos Markdown con: Requerimientos funcionales, diagrama de casos de uso, diagrama ER o esquema NoSQL, documentación de selección de principios y evidencia de aplicación
  2. Elaborar el Manual Técnico y Manual de Usuario con capturas para cada rol.
  3. Incluir el enlace al tablero Kanban, links a grabaciones de reuniones y la evaluación formal redactada por el Scrum Master.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** M
- **DEPENDENCIAS:** Avances progresivos en los Sprints 1 y 2
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Documentación:** Redactar los Requerimientos Funcionales y No Funcionales en formato Markdown.
  - **Documentación:** Elaborar los Diagramas de Casos de Uso (CUN Core, primera descomposición y expandidos) en herramienta UML.
  - **Documentación:** Diseñar y exportar el Diagrama Entidad-Relación normalizado.
  - **Documentación:** Elaborar el documento con los 6 principios de Jakob Nielsen seleccionados y sus evidencias visuales de aplicación.
  - **Documentación:** Redactar el Manual Técnico y Manual de Usuario por rol con capturas de pantalla.
  - **Documentación:** Estructurar el archivo `README.md` principal en la raíz con enlaces hacia todos los documentos.
  - **Documentación:** Elaborar los documentas de scrumban que contengan las historias de usuario, product backlog y los links a las scrum meetings.

---

## 2. Fase 2

La Fase 2 se enfoca en ampliar y complementar el sistema ya construido en la Fase 1. Debido a esto, varias historias de usuario extienden funcionalidades previas adoptando la nomenclatura `[EXT - HU ID_de_la_historia_original]`. Desde su definición inicial, cada historia incluye el desglose de sus tareas técnicas derivadas para facilitar la asignación en el equipo.

---

### Módulo: Registro y Autenticación

#### [HU-028] [EXT - HU001] Registro de Estudiante

- **DESCRIPCIÓN:** **Como** estudiante no registrado, **quiero** adjuntar mi fotografía reciente y mi carnet escaneado en formato PDF al registrarme, **para** que el administrador pueda verificar minuciosamente mi identidad universitaria.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El formulario de registro de estudiante exige la subida obligatoria de una fotografía reciente.
  2. El formulario permite y exige adjuntar un archivo PDF con el carnet universitario escaneado.
  3. Se deben validar los formatos de los archivos subidos (imágenes para foto y `.pdf` para el carnet).
  4. La cuenta se guarda en estado "Pendiente de aprobación" y sin verificación de correo.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-001], [HU-025]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Modificar la vista de registro de estudiante para exigir fotografía y agregar el input de subida del archivo PDF del carnet escaneado.
  - **Frontend:** Implementar validaciones del lado del cliente para formatos permitidos (`image/*` y `.pdf`) y tamaños máximos de archivo.
  - **Backend:** Actualizar el endpoint correspondiente para soportar carga multipart.
  - **Backend:** Configurar el almacenamiento seguro (local/cloud) para los archivos PDF y de imagen recibidos.
  - **BD:** Modificar la tabla de estudiantes agregando las columnas `carnet_pdf_url` y asegurando la obligatoriedad de `foto_url`.

---

#### [HU-029] [EXT - HU002] Registro de Tutor

- **DESCRIPCIÓN:** **Como** tutor postulante, **quiero** subir mi Currículum Vitae en formato PDF durante mi registro, **para** que la administración valide mi trayectoria académica y profesional.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El formulario de registro de tutor exige adjuntar un archivo `.pdf` obligatoria con su CV actualizado.
  2. El sistema valida que el archivo adjunto sea de tipo PDF y no supere el tamaño máximo permitido.
  3. Los datos y el archivo se almacenan de forma segura previo a la verificación y aprobación.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-002], [HU-025]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Agregar el campo para subir el archivo PDF del CV en el formulario de registro de tutor.
  - **Frontend:** Incluir controles de previsualización o indicador de carga exitosa del archivo PDF.
  - **Backend:** Actualizar el endpoint correspondiente para procesar la subida del documento CV en PDF.
  - **Backend:** Almacenar la referencia o URL del archivo cargado.
  - **BD:** Modificar la tabla de tutores para incluir la columna `cv_pdf_url`.

---

#### [HU-030] [EXT - HU003] Autenticación de Estudiante y Tutor

- **DESCRIPCIÓN:** **Como** estudiante o tutor registrado y aprobado, **quiero** validar mi cuenta mediante un token enviado a mi correo en mi primer inicio de sesión, **para** garantizar la autenticidad de mi dirección de correo electrónico.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al completar el registro, el sistema genera un token único asociado al usuario y le envía un correo institucional con el logo de EduConnect, un mensaje de bienvenida y el token.
  2. En el primer inicio de sesión, el sistema solicita: Correo electrónico, Contraseña y Token de verificación.
  3. El sistema valida que la cuenta haya sido aprobada por el administrador Y que el token ingresado sea válido.
  4. Si falta alguna condición, no se permite el acceso y se muestra el mensaje explicativo correspondiente.
  5. Una vez validado con éxito el token en el primer inicio de sesión, los inicios posteriores solo requieren correo y contraseña.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-003], [HU-028], [HU-029]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista de verificación de token para el primer inicio de sesión.
  - **Frontend:** Adaptar el formulario de login para solicitar el campo de token solo si el usuario no ha sido verificado aún.
  - **Backend:** Implementar la generación de tokens al registrar un usuario y la plantilla HTML de correo electrónico con el diseño oficial de EduConnect.
  - **Backend:** Crear endpoint y adaptar la lógica de login para validar token y estado de aprobación del administrador.
  - **BD:** Agregar las columnas `verification_token`, `is_email_verified` y `token_created_at` a las tablas de usuarios.

---

### Módulo: Estudiante

#### [HU-031] Consulta del Plan de Estudio de Tutorías

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** acceder a un apartado dedicado a mi Plan de Estudio, **para** revisar de forma estructurada las dificultades identificadas y los recursos recomendados por mis tutores.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista muestra el plan de estudio activo del estudiante agrupado por tutoría.
  2. Detalla: Fecha de la última sesión, Nombre completo del tutor, Especialidad del tutor y Número de identificación del tutor.
  3. Muestra la lista de "Dificultades Identificadas" registradas durante la tutoría.
  4. Muestra el catálogo de "Recursos Recomendados", indicando para cada uno: Nombre, Tipo (Texto, Video, PDF, Enlace) y Descripción de uso.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-038]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar la vista "Mi Plan de Estudio" estructurada con secciones de dificultades y tarjetas para los recursos recomendados.
  - **Frontend:** Implementar indicadores visuales e íconos diferenciados según el tipo de recurso (Texto, Video, PDF, Enlace).
  - **Backend:** Crear endpoint para retornar el detalle estructurado de los planes de estudio del estudiante.
  - **BD:** Diseñar e implementar las tablas `study_plans`, `identified_difficulties` y `recommended_resources` relacionadas con la sesión.

---

#### [HU-032] Descarga e Impresión de Constancia del Plan de Estudio en PDF

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** descargar mi Plan de Estudio en un archivo PDF estructurado, **para** contar con una constancia física y oficial de la tutoría académica.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La vista ofrece un botón "Descargar PDF".
  2. El PDF incluye Encabezado con: Nombre de la plataforma (EduConnect), Fecha de emisión y Teléfono de contacto.
  3. El Cuerpo del PDF contiene una tabla con los recursos recomendados (Nombre, Tipo, Descripción de uso).
  4. El Pie de página incluye el firma digital emulada del tutor con: Nombre completo del tutor, Especialidad y Número de identificación.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** M
- **DEPENDENCIAS:** [HU-031]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Agregar botón "Descargar Constancia PDF" e integrar librería de generación de PDF o consumo de endpoint backend.
  - **Backend:** Configurar motor de generación de PDF en backend (ej. PDFKit, Puppeteer o Jasper) con la plantilla oficial de EduConnect.
  - **Backend:** Crear endpoint que retorne el flujo de archivos PDF para descarga.
  - **Documentación:** Diseñar el formato visual y layout estandarizado para las constancias en PDF.

---

#### [HU-033] [EXT - HU023] Calificación de Atención de Tutoría por el Estudiante

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** calificar la atención brindada por el tutor tras finalizar la sesión, **para** retroalimentar la calidad del servicio académico.
- **CRITERIOS DE ACEPTACIÓN:**
  1. En la vista "Historial de Sesiones", cada sesión en estado "Atendido" habilita la opción "Calificar Tutor".
  2. El formulario permite asignar una puntuación de 0 a 5 estrellas y escribir un comentario opcional.
  3. Se restringe la calificación: NO se pueden calificar sesiones en estado cancelado o activo.
  4. Una vez calificada, no se permite volver a calificar la misma sesión.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-023], [HU-038]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Integrar componente interactivo de puntuación con estrellas (0 a 5) y área de texto para comentarios en el historial de sesiones.
  - **Frontend:** Implementar controles para deshabilitar el botón de calificación en sesiones no atendidas o ya calificadas.
  - **Backend:** Crear endpoint para registrar la puntuación y opinión.
  - **BD:** Crear la tabla `tutor_ratings` en la base de datos vinculando la sesión, el estudiante, el tutor, las estrellas y el comentario.

---

#### [HU-034] [EXT - HU023] Reportar Conducta de Tutor

- **DESCRIPCIÓN:** **Como** estudiante, **quiero** reportar a un tutor que incurrió en faltas o conductas inapropiadas durante la tutoría, **para** que la administración tome medidas disciplinarias.
- **CRITERIOS DE ACEPTACIÓN:**
  1. En el historial de sesiones atendidas, se muestra el botón "Reportar Tutor".
  2. El formulario incluye un desplegable con Categorías predefinidas (Ética y profesionalismo, Negligencia académica, Abuso/Conducta inapropiada, Falsificación, etc.) y un área de texto obligatoria para detallar el motivo.
  3. Solo se pueden reportar sesiones con estado "Atendido" (no aplica a activas o canceladas).
  4. El reporte se envía al módulo del Administrador para su revisión.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-023], [HU-038]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la interfaz para envío de reportes contra tutores desde el historial.
  - **Frontend:** Validar la selección obligatoria de la categoría y la longitud mínima de la explicación.
  - **Backend:** Crear endpoint para recibir y almacenar el reporte.
  - **BD:** Crear la tabla `tutor_reports` registrando la sesión, el denunciante, el tutor reportado, la categoría, la descripción, la fecha y el estado del reporte.

---

### Módulo: Tutor

#### [HU-035] [EXT - HU013] Atender Estudiante con Registro de Plan de Estudio Estructurado

- **DESCRIPCIÓN:** **Como** tutor, **quiero** registrar el plan de estudio detallado al finalizar una tutoría, **para** dar por atendido al estudiante e ingresar las dificultades y recursos recomendados.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Al hacer clic en "Atender", se despliega un formulario estructurado.
  2. El campo "Dificultades Identificadas" es obligatorio (descripción de los temas complejos detectados).
  3. Permite agregar dinámicamente uno o más "Recursos Recomendados", especificando para cada uno: Nombre, Tipo (Texto, Video, PDF, Enlace) y Descripción de uso.
  4. Al guardar, la sesión pasa a estado "Atendida", desaparece de pendientes y se registra en el historial con su plan completo.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** [HU-013]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el formulario dinámico de atención que permita agregar o remover filas de recursos recomendados.
  - **Frontend:** Validar campos requeridos antes de permitir completar la atención.
  - **Backend:** Crear endpoint que reciba el objeto del plan de estudio estructurado.
  - **BD:** Guardar la sesión como "Atendida" y almacenar en transacciones relacionales las dificultades y los recursos recomendados.

---

#### [HU-036] Calificar Desempeño del Estudiante

- **DESCRIPCIÓN:** **Como** tutor, **quiero** evaluar la actitud y desempeño del estudiante tras la tutoría, **para** mantener un registro de comportamiento académico en la plataforma.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Después de haber atendido la tutoría, el tutor puede calificar al estudiante desde el historial.
  2. Permite seleccionar una puntuación de 0 a 5 estrellas e ingresar un comentario explicativo.
  3. Solo aplica a sesiones con estado "Atendido" (no canceladas ni activas).
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-035]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Agregar interfaz de estrellas y comentario en el panel del tutor para evaluar a los estudiantes atendidos.
  - **Backend:** Crear endpoint para enviar la calificación.
  - **BD:** Crear la tabla `student_ratings` relacionando al estudiante, al tutor, la puntuación y el comentario.

---

#### [HU-037] Reportar Estudiante Problemático

- **DESCRIPCIÓN:** **Como** tutor, **quiero** reportar a un estudiante por indisciplina o faltas graves durante la sesión, **para** que el administrador aplique las sanciones pertinentes.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Habilita un botón "Reportar Estudiante" en el historial de sesiones atendidas.
  2. Incluye un listado de categorías predefinidas (Conducta inapropiada, Falsificación de documentos, Agresión verbal/física, Robo o daño a instalaciones, etc.) y una casilla para detallar los hechos.
  3. Solo se puede reportar si la sesión fue "Atendida".
  4. El reporte se transfiere directamente al panel administrativo.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-035]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Crear la vista de reporte de estudiantes desde el panel del tutor.
  - **Backend:** Crear endpoint para la recepción de denuncias contra estudiantes.
  - **BD:** Crear la tabla `student_reports` registrando los detalles de la infracción, fecha y estado de resolución.

---

### Módulo: Administrador

#### [HU-038] [EXT - HU005] Aprobación de Estudiante con Visor PDF de Carnet Escaneado

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** previsualizar el carnet escaneado en PDF mediante un visor embebido en la web, **para** verificar la validez de la solicitud sin necesidad de descargar archivos.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La lista de estudiantes pendientes muestra: Fotografía (o imagen por defecto), Nombre completo, Carnet, Género, Fecha de nacimiento, Correo y Visor de PDF embebido con el Carnet escaneado.
  2. El archivo PDF debe poder visualizarse directamente en la página web.
  3. Contiene los botones de acción "Aceptar" y "Rechazar".
  4. Envía un correo electrónico automático al estudiante notificando si fue aprobado o rechazado.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-005], [HU-028]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Integrar componente visor de PDF embebido (ej. PDF.js o iframe interactivo) en la interfaz de solicitudes de estudiantes.
  - **Frontend:** Conectar botones de aprobación o rechazo con notificaciones en tiempo real.
  - **Backend:** Actualizar endpoint correpondiente para enviar la URL del archivo PDF del carnet.
  - **Backend:** Configurar el envío del correo electrónico con el resultado de la solicitud (incluyendo el token de verificación si fue aceptado).
  - **BD:** Actualizar el estado del usuario en la base de datos según la decisión del administrador.

---

#### [HU-039] [EXT - HU006] Aprobación de Tutor con Visor PDF de CV

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** revisar el CV del tutor postulante a través de un visor de PDF integrado en la plataforma, **para** certificar su perfil profesional de forma ágil.
- **CRITERIOS DE ACEPTACIÓN:**
  1. La lista de tutores pendientes despliega: Fotografía, Nombre completo, Carnet/ID, Género, Especialidad, Número de identificación, Correo y el CV en un visor PDF incrustado en la web.
  2. Incluye botones para "Aceptar" o "Rechazar" la solicitud.
  3. Notifica automáticamente al tutor por correo electrónico con el veredicto.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-006], [HU-029]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Implementar el visor de PDF incrustado dentro del panel de revisión de tutores.
  - **Backend:** Proporcionar la ruta segura para la lectura streaming del PDF del CV desde el backend.
  - **Backend:** Configurar el servicio de correo electrónico para notificar la resolución al tutor.
  - **BD:** Cambiar el estado del registro del tutor a Aprobado o Rechazado.

---

#### [HU-040] [EXT - HU007] Gestión y Edición de Estudiantes Activos

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** consultar la lista de estudiantes aprobados para modificar sus datos o darlos de baja, **para** mantener la información depurada.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Muestra la lista completa de estudiantes activos.
  2. Permite editar cualquier campo del perfil del estudiante, a excepción del correo electrónico (el cual permanece bloqueado).
  3. Permite dar de baja la cuenta del estudiante previa confirmación.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-007], [HU-038]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Añadir el formulario de edición de datos de estudiante en el panel del Administrador con el input de correo bloqueado.
  - **Backend:** Crear endpoint para procesar la actualización administrativa de datos.
  - **BD:** Actualizar la información del estudiante en la base de datos.

---

#### [HU-041] [EXT - HU008] Gestión y Edición de Tutores Activos

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** editar la información o dar de baja a los tutores aceptados, **para** gestionar activamente el cuerpo docente.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Despliega el listado de todos los tutores aceptados en el sistema.
  2. Permite la modificación de sus datos de perfil (exceptuando el correo electrónico).
  3. Incluye la funcionalidad para dar de baja la cuenta de cualquier tutor.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-008], [HU-039]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Añadir el formulario de edición de datos de estudiante en el panel del Administrador con el input de correo bloqueado.
  - **Backend:** Crear endpoint para actualizar información profesional y personal.
  - **BD:** Modificar registros en la base de datos para la entidad tutor.

---

#### [HU-042] Gestión e Inspección de Reportes contra Tutores

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** evaluar las denuncias enviadas por estudiantes contra tutores, **para** sancionar o descartar las quejas infundadas.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Despliega una tabla con todos los reportes hechos a tutores, mostrando: Categoría, Motivo/Explicación, Nombre del tutor reportado, Nombre del estudiante denunciante y Fecha.
  2. Ofrece las opciones: "Dar de baja al tutor" o "Rechazar denuncia".
  3. Al dar de baja, desactiva la cuenta del tutor; al rechazar, el reporte pasa a estado descartado.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-034]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el módulo de moderación de denuncias contra tutores con botones para "Dar de baja" y "Rechazar".
  - **Backend:** Crear endpoint para listar denuncias y para aplicar sanciones o descartar.
  - **BD:** Actualizar el estado del reporte y, si aplica, cambiar el estado del tutor a "Inactivo".

---

#### [HU-043] Gestión e Inspección de Reportes contra Estudiantes

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** revisar los reportes creados por tutores contra estudiantes, **para** determinar si ameritan la suspensión del usuario.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Muestra la lista de reportes: Categoría, Motivo/Explicación, Nombre del estudiante reportado, Nombre del tutor denunciante y Fecha.
  2. Permite "Dar de baja al estudiante" o "Rechazar denuncia".
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-037]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el módulo de moderación de denuncias contra estudiantes con botones para "Dar de baja" y "Rechazar".
  - **Backend:** Crear endpoints de consulta y resolución de denuncias contra estudiantes.
  - **BD:** Actualizar el estado del reporte y, si aplica, cambiar el estado del estudiante a "Inactivo".

---

#### [HU-044] Reporte General de Calificaciones de Tutores

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** visualizar el promedio de estrellas de cada tutor, **para** identificar a los mejores evaluados y a los de menor rendimiento.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Muestra la lista de todos los tutores activos.
  2. Detalla: Nombre completo, Especialidad y Promedio de calificación (0 a 5 estrellas).
  3. El promedio se calcula automáticamente a partir de las valoraciones de los estudiantes.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-033]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el reporte visual de promedios de satisfacción de tutores con gráficos.
  - **Backend:** Crear endpoint que ejecute la media aritmética de las valoraciones.
  - **BD:** Consulta SQL con `AVG(estrellas)` agrupando por id de tutor.

---

#### [HU-045] Reporte General de Calificaciones de Estudiantes

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** consultar el promedio de puntuación de los estudiantes, **para** monitorear la conducta estudiantil en las tutorías.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Muestra una tabla con todos los estudiantes activos.
  2. Muestra el Nombre completo y el Promedio de calificación (0 a 5 estrellas).
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-036]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Diseñar el reporte visual de promedios de satisfacción de estudiantes con gráficos.
  - **Backend:** Crear endpoint que ejecute la media aritmética de las valoraciones.
  - **BD:** Consulta SQL con `AVG(estrellas)` agrupando por id de estudiante.

---

#### [HU-046] [EXT - HU009] Generación de Nuevos Reportes Analíticos

- **DESCRIPCIÓN:** **Como** Administrador, **quiero** acceder a nuevos reportes estadísticos, **para** analizar tendencias de uso, cancelaciones y demanda horaria.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Incluye al menos dos reportes adicionales (ej. Top 10 tutores con más sesiones atendidas al mes, Materias con mayor tasa de cancelación, Horarios más demandados, etc.).
  2. Se presentan de forma visual con tablas o componentes gráficos interactivos.
  3. Los reportes previos de la Fase 1 se mantienen operativos.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** XS
- **DEPENDENCIAS:** [HU-009]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend:** Agregar las nuevas vistas gráficas al Dashboard analítico del Administrador.
  - **Backend:** Desarrollar las consultas analíticas agregadas para las métricas seleccionadas.
  - **BD:** Optimizar índices en las tablas de sesiones para agilizar las consultas de reportes.

---

### Módulo: Aseguramiento de Calidad, DevOps y Documentación

#### [HU-047] Cobertura de Pruebas Unitarias Automatizadas

- **DESCRIPCIÓN:** **Como** equipo de desarrollo, **queremos** programar pruebas unitarias automatizadas para los componentes del sistema, **para** garantizar la estabilidad y prevenir regresiones en la lógica de negocio.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Desarrollar un mínimo de 5 pruebas unitarias por cada integrante del grupo.
  2. Incluir pruebas para la validación de traslapes de horario, encriptación de contraseñas, validación de tokens y reglas de negocio.
  3. Las pruebas deben ejecutarse y generar reportes automatizados de aprobación.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** S
- **DEPENDENCIAS:** Desarrollo funcional de módulos de Backend y Frontend
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Backend:** Configurar el framework de pruebas y escribir casos para controladores y servicios backend.
  - **Frontend:** Elaborar pruebas unitarias de componentes y validaciones de formularios en el cliente.
  - **Documentación:** Registrar la matriz de cobertura de pruebas y los comandos para su ejecución local.

---

#### [HU-048] Pruebas End-to-End (E2E) con Herramientas de Automatización

- **DESCRIPCIÓN:** **Como** Product Owner, **quiero** contar con pruebas End-to-End automatizadas que simulen el comportamiento real del usuario, **para** verificar la integración entre la interfaz y el servidor.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Implementar un mínimo de 1 prueba E2E por integrante del grupo utilizando herramientas como Cypress, Selenium o Playwright.
  2. Validar flujos completos como: "Atención de estudiante y registro de plan de estudio", "Proceso de registro y verificación de token", "Programación de tutoría sin traslape".
  3. Generar evidencia en video o logs de ejecución exitosa.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** S
- **DEPENDENCIAS:** [HU-030], [HU-035]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend / QA:** Configurar la suite de automatización E2E en Cypress o Playwright.
  - **Backend / QA:** Preparar base de datos de pruebas (seeding) para garantizar un entorno reproducible en la ejecución E2E.
  - **Documentación:** Elaborar la guía de ejecución de pruebas E2E y adjuntar capturas y evidencias de cumplimiento.

---

#### [HU-049] Automatización de Pipeline CI/CD para el Backend

- **DESCRIPCIÓN:** **Como** equipo DevOps, **queremos** configurar un pipeline automatizado de CI/CD para el backend, **para** validar, probar y ejecutar la aplicación automáticamente ante cambios en el repositorio.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El pipeline se ejecuta exclusivamente al realizar `push` o `pull request` hacia la rama `main`.
  2. Etapa 1 (Build): Compila el código y genera los artefactos asegurando la validez del proyecto.
  3. Etapa 2 (Test): Ejecuta las pruebas unitarias automatizadas; si alguna falla, frena el proceso.
  4. Etapa 3 (Deploy): Ejecuta el backend en el runner de GitHub Actions (o servicio Cloud objetivo).
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** [HU-026], [HU-047]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Backend / DevOps:** Crear el archivo de flujo `.github/workflows/backend-ci-cd.yml`.
  - **Backend / DevOps:** Configurar las etapas de `Build`, `Test` y la ejecución en el runner de GitHub utilizando Docker y variables de entorno seguras (Secrets).
  - **Documentación:** Documentar la arquitectura del pipeline de CI/CD en el Manual Técnico.

---

#### [HU-050] [EXT - HU027] Actualización de la Documentación Técnica, Manuales y Arquitectura de Fase 2

- **DESCRIPCIÓN:** **Como** Scrum Master y Product Owner, **queremos** actualizar la documentación integral del proyecto con las nuevas características y la arquitectura desplegada, **para** cumplir con los estándares de entrega de la Fase 2.
- **CRITERIOS DE ACEPTACIÓN:**
  1. Incluir requerimientos funcionales y no funcionales actualizados, diagramas UML (Casos de uso CUN, Secuencia, Clases) y Diagrama ER/NoSQL final.
  2. Documentar detalladamente la arquitectura del sistema y el modelo de despliegue en la nube (Separación de responsabilidades: Frontend en Vercel/S3, Backend en Cloud Run/EC2 y BD en Cloud SQL/RDS o Docker).
  3. Actualizar Manual Técnico y Manual de Usuario agregando las funciones de la Fase 2 con capturas.
  4. Incluir capturas del tablero Kanban (inicio, desarrollo y fin de sprint), links a grabaciones, actas de reuniones y la evaluación del Scrum Master al equipo (1-100).
  5. Incluir el archivo `README.md` consolidado con el índice de enlaces a toda la documentación.
- **PRIORIDAD:** MEDIA 🟨
- **TAMAÑO:** L
- **DEPENDENCIAS:** [HU-027] y todas las historias funcionales de la Fase 2
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Documentación:** Redactar y actualizar los documentos de requerimientos, arquitectura de software y estrategia de despliegue cloud.
  - **Documentación:** Diseñar los diagramas de arquitectura (DevOps, CI/CD, Frontend, Backend, BD) conforme al estándar presentado en la Fase 2.
  - **Documentación:** Actualizar los manuales de usuario y técnico con las nuevas funciones (Verificación por token, Visores PDF, Planes de estudio, Reportes).
  - **Documentación:** Recopilar las métricas de Scrumban, capturas del tablero Kanban, enlaces a videos y publicar la calificación individual/grupal del Scrum Master.

### [HU-051] Despliegue de Frontend y Backend en Servidores Cloud

- **DESCRIPCIÓN:** **Como** usuario del sistema, **quiero** acceder a EduConnect mediante un entorno hospedado en la nube con separación de responsabilidades, **para** garantizar una alta disponibilidad, escalabilidad y respuesta ágil del frontend y backend.
- **CRITERIOS DE ACEPTACIÓN:**
  1. El Frontend debe alojarse de manera independiente en servicios especializados de hosting estático o contenedores (ej. Vercel, Netlify, AWS S3).
  2. El Backend debe ejecutarse en una infraestructura escalable en la nube (ej. Google Cloud Run, AWS EC2 o Azure).
  3. La comunicación entre el Frontend y el Backend debe realizarse de forma segura mediante API REST utilizando HTTPS.
  4. La Base de Datos debe estar operativa en un servicio gestionado (Cloud SQL / RDS) o mediante una instancia contenedorizada en el servidor remoto.
  5. El pipeline CI/CD en GitHub Actions despliega los artefactos generados hacia los proveedores Cloud configurados.
- **PRIORIDAD:** ALTA 🟥
- **TAMAÑO:** M
- **DEPENDENCIAS:** [HU-026], [HU-049]
- **TAREAS TÉCNICAS DERIVADAS:**
  - **Frontend / DevOps:** Configurar el proyecto Frontend para su compilación estática y vinculación con la URL del Backend remoto mediante variables de entorno.
  - **Frontend / DevOps:** Desplegar el Frontend en el proveedor de hosting estático elegible y configurar URL pública accesible.
  - **Backend / DevOps:** Empaquetar e implementar el contenedor Docker del Backend en el servicio Cloud elegido.
  - **Backend / DevOps:** Configurar políticas de CORS, certificados SSL/TLS (HTTPS) y variables de producción para la conexión segura de la API REST.
  - **Documentación:** Elaborar la sección "Estrategia de Despliegue y Persistencia" dentro del Manual Técnico y de Arquitectura explicando la topología Cloud implementada.
