# Requerimientos Funcionales - RF

> Documento basado en las historias de usuario del proyecto EduConnect y en la estructura sugerida por el ejemplo de requerimientos funcionales.

## 1. Módulo: Registro y Autenticación

### CU1-1 Registro de Estudiante

**RF-1-1-1**  
**Descripción:** El sistema debe permitir a un estudiante no registrado completar un formulario con sus datos personales y credenciales para crear una cuenta.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-1-1-2**  
**Descripción:** El formulario de registro de estudiante debe solicitar nombre, apellido, carnet universitario, género, dirección, teléfono, fecha de nacimiento, correo electrónico y contraseña.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-1-1-3**  
**Descripción:** El sistema debe requerir una fotografía de perfil y el carnet estudiantil escaneado en PDF durante el registro del estudiante; la interfaz debe indicarlos como obligatorios, en concordancia con la validación del servidor.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-1-1-4**  
**Descripción:** Al completar el registro con éxito, la cuenta del estudiante debe quedar en estado "Pendiente de aprobación" y no debe permitir acceso inmediato hasta validación del administrador.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Administrador

### CU1-2 Registro de Tutor

**RF-1-2-1**  
**Descripción:** El sistema debe permitir a un tutor profesional registrar sus datos personales, profesionales y credenciales para postularse a la plataforma.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-1-2-2**  
**Descripción:** El formulario de registro de tutor debe incluir nombre, apellido, carnet o identificación, fecha de nacimiento, género, dirección, teléfono, fotografía obligatoria, CV obligatorio en PDF, número de identificación del tutor, una o más materias de especialidad, dirección de tutoría, correo electrónico, año de inicio de tutorías, universidad de graduación y contraseña.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-1-2-3**  
**Descripción:** La dirección de tutoría debe permitir seleccionar una modalidad válida: Física u Online.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-1-2-4**  
**Descripción:** La cuenta del tutor debe registrarse en estado "Pendiente de aprobación" para revisión del administrador.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Administrador

### CU1-3 Autenticación

**RF-1-3-1**  
**Descripción:** El sistema debe validar las credenciales ingresadas por el estudiante o tutor comparando la contraseña con el hash almacenado.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

**RF-1-3-2**  
**Descripción:** El sistema debe validar el nombre de usuario y la contraseña del administrador como primer paso de autenticación, antes de solicitar el segundo factor.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-1-3-3**  
**Descripción:** La vista de inicio de sesión debe incluir una opción visible para usuarios no registrados que los lleve al formulario de registro.  
**Prioridad:** Media  
**Actores involucrados:** Usuario, Sistema

**RF-1-3-4**  
**Descripción:** El sistema debe solicitar la verificación del correo mediante un código de seis dígitos en el primer inicio de sesión de estudiantes y tutores, validar que no hayan transcurrido más de 24 horas desde su emisión y permitir solicitar el reenvío del código.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

**RF-1-3-5**  
**Descripción:** El sistema debe autenticar al administrador mediante nombre de usuario y contraseña y requerir un código TOTP de seis dígitos; en la primera configuración debe permitir vincular una aplicación autenticadora mediante un código QR.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-1-3-6**  
**Descripción:** El sistema debe impedir el inicio de sesión de estudiantes y tutores cuyas cuentas estén pendientes, rechazadas o dadas de baja, y comunicar el estado correspondiente.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

---

## 2. Módulo: Administrador

### CU2-1 Aprobación o Rechazo de Estudiantes

**RF-2-1-1**  
**Descripción:** El administrador debe poder visualizar las solicitudes pendientes de estudiantes y revisar sus datos principales, fotografía, carnet y documento PDF escaneado.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-2-1-2**  
**Descripción:** El administrador debe poder aprobar o rechazar la solicitud de un estudiante pendiente.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-2-1-3**  
**Descripción:** El sistema debe enviar una notificación automática por correo al estudiante con el resultado de la aprobación o rechazo.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Estudiante

### CU2-2 Aprobación o Rechazo de Tutores

**RF-2-2-1**  
**Descripción:** El administrador debe poder revisar las solicitudes pendientes de tutores y consultar sus datos principales, fotografía, carnet o identificación, materias de especialidad, número de identificación del tutor, correo electrónico y CV en PDF.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-2-2-2**  
**Descripción:** El administrador debe poder autorizar o denegar el registro de un tutor.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-2-2-3**  
**Descripción:** El sistema debe enviar un correo automático al tutor notificándole la aprobación o rechazo de su cuenta.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Tutor

### CU2-3 Gestión y Baja de Usuarios

**RF-2-3-1**  
**Descripción:** El administrador debe poder consultar la lista de estudiantes aprobados y ejecutar la baja confirmada de una cuenta.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-3-2**  
**Descripción:** El administrador debe poder consultar la lista de tutores aprobados y ejecutar la baja confirmada de una cuenta.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-3-3**  
**Descripción:** Antes de realizar una baja, el sistema debe solicitar confirmación; puede registrar un motivo y debe intentar notificar al usuario afectado por correo. La operación de baja elimina físicamente la cuenta y sus registros asociados.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema, Usuario

### CU2-4 Reportes Analíticos

**RF-2-4-1**  
**Descripción:** El administrador debe poder consultar reportes de sesiones por estado, materia y tutor, totales de sesiones, estudiantes y tutores, cancelaciones por materia y franjas horarias con mayor demanda.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-4-2**  
**Descripción:** El administrador debe poder consultar reportes de calificaciones promedio y cantidad de evaluaciones de tutores y estudiantes aprobados. Los datos deben calcularse al momento de la consulta; no se requiere actualización por transmisión en tiempo real.  
**Prioridad:** Media  
**Actores involucrados:** Sistema, Administrador

### CU2-5 Gestión de perfiles aprobados

**RF-2-5-1**  
**Descripción:** El administrador debe poder listar y editar los datos permitidos de estudiantes y tutores aprobados, y ejecutar la baja confirmada de una cuenta; actualmente la baja elimina físicamente la cuenta y sus registros asociados. El correo electrónico principal debe permanecer sin cambios desde esta operación.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-5-2**  
**Descripción:** Antes de dar de baja una cuenta, el sistema debe solicitar confirmación y permitir que el administrador agregue un motivo opcional; el servidor debe intentar notificar al usuario por correo.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema, Usuario

### CU2-6 Revisión de denuncias

**RF-2-6-1**  
**Descripción:** El administrador debe poder consultar denuncias contra tutores o estudiantes, incluyendo categoría, descripción, sesión relacionada, denunciante, denunciado, fecha y estado.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-2-6-2**  
**Descripción:** El administrador debe poder resolver una denuncia pendiente aplicando la baja del usuario denunciado o descartando la denuncia; una denuncia ya resuelta no debe procesarse nuevamente.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

---

## 3. Módulo: Tutor

### CU3-1 Configuración de Horarios

**RF-3-1-1**  
**Descripción:** El tutor debe poder definir los días de atención y el rango horario en el que estará disponible para tutorías.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-1-2**  
**Descripción:** El sistema debe guardar los horarios configurados y hacerlos visibles para la consulta de estudiantes.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema, Estudiante

**RF-3-1-3**  
**Descripción:** Cuando el tutor modifique un horario, el sistema debe validar que no existan sesiones activas en conflicto con la nueva disponibilidad.  
**Prioridad:** Media  
**Actores involucrados:** Tutor, Sistema

### CU3-2 Sesiones Pendientes y Gestión

**RF-3-2-1**  
**Descripción:** El tutor debe poder consultar la lista de sesiones pendientes, ordenadas cronológicamente por fecha más cercana.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-2-2**  
**Descripción:** El tutor debe poder atender una sesión pendiente registrando las dificultades académicas identificadas y al menos un recurso recomendado, con nombre, tipo y descripción de uso.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-2-3**  
**Descripción:** Al guardar la atención, el sistema debe cambiar el estado de la sesión a "Atendida" y asociar el plan de estudio estructurado para su consulta posterior por el estudiante.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-2-4**  
**Descripción:** El tutor debe poder cancelar una sesión programada y confirmar la acción antes de ejecutarla.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-2-5**  
**Descripción:** Al cancelar una sesión, el sistema debe enviar un correo automático al estudiante con la información relevante de la cancelación.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Estudiante

### CU3-3 Historial de Sesiones

**RF-3-3-1**  
**Descripción:** El tutor debe poder consultar el historial de sesiones atendidas y canceladas, mostrando la información más reciente primero.  
**Prioridad:** Media  
**Actores involucrados:** Tutor, Sistema

**RF-3-3-2**  
**Descripción:** La vista de historial debe diferenciar visualmente cada sesión según su estado.  
**Prioridad:** Media  
**Actores involucrados:** Tutor, Sistema

### CU3-4 Perfil del Tutor

**RF-3-4-1**  
**Descripción:** El tutor debe poder visualizar y actualizar sus datos personales y profesionales desde su perfil.  
**Prioridad:** Baja  
**Actores involucrados:** Tutor, Sistema

**RF-3-4-2**  
**Descripción:** Si el tutor actualiza su contraseña, el sistema debe validarla, almacenarla como hash y proteger los campos identificadores no editables, como el correo y el número de identificación del tutor.  
**Prioridad:** Baja  
**Actores involucrados:** Tutor, Sistema

### CU3-5 Evaluación y reporte de estudiantes

**RF-3-5-1**  
**Descripción:** El tutor debe poder calificar al estudiante de una sesión atendida mediante una puntuación de cero a cinco estrellas y un comentario obligatorio.  
**Prioridad:** Media  
**Actores involucrados:** Tutor, Sistema

**RF-3-5-2**  
**Descripción:** El tutor debe poder reportar al estudiante de una sesión atendida seleccionando una categoría válida y describiendo los hechos para revisión administrativa.  
**Prioridad:** Media  
**Actores involucrados:** Tutor, Sistema, Administrador

---

## 4. Módulo: Estudiante

### CU4-1 Catálogo de Tutores

**RF-4-1-1**  
**Descripción:** El estudiante debe poder explorar un catálogo de tutores registrados en la plataforma.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-4-1-2**  
**Descripción:** La plataforma debe mostrar la información principal de cada tutor para que el estudiante pueda evaluar su perfil antes de agendar una tutoría.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Estudiante

**RF-4-1-3**  
**Descripción:** El estudiante debe poder filtrar tutores por materia, universidad de graduación, experiencia mínima, género y rango de edad.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

### CU4-2 Programación de Sesiones

**RF-4-2-1**  
**Descripción:** El estudiante debe poder seleccionar un tutor disponible y agendar una sesión con fecha, hora, materia y motivo.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

**RF-4-2-2**  
**Descripción:** El sistema debe validar que el horario seleccionado esté disponible para el tutor antes de confirmar la sesión.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-4-2-3**  
**Descripción:** La sesión creada debe quedar asociada a la información del estudiante, del tutor y de la materia correspondiente.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

### CU4-3 Sesiones Activas e Historial

**RF-4-3-1**  
**Descripción:** El estudiante debe poder visualizar las sesiones activas y su estado actual.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-4-3-2**  
**Descripción:** El estudiante debe poder cancelar una sesión activa previa confirmación del sistema.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Sistema

**RF-4-3-3**  
**Descripción:** El estudiante debe poder consultar el historial de sesiones atendidas y canceladas, identificar quién canceló cuando corresponda y acceder a la evaluación o reporte de la contraparte en sesiones atendidas.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

### CU4-4 Perfil del Estudiante

**RF-4-4-1**  
**Descripción:** El estudiante debe poder visualizar y actualizar su perfil personal.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

**RF-4-4-2**  
**Descripción:** Si se actualiza la contraseña, el estudiante debe proporcionar su contraseña actual; el sistema debe validar la nueva contraseña y almacenarla como hash.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

### CU4-5 Plan de estudio y constancia

**RF-4-5-1**  
**Descripción:** El estudiante debe poder consultar los planes de estudio asociados a sus sesiones atendidas, incluyendo tutor, fecha, dificultades identificadas y recursos recomendados.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

**RF-4-5-2**  
**Descripción:** El estudiante debe poder descargar en PDF una constancia generada a partir de un plan de estudio propio.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

### CU4-6 Evaluación y reporte de tutores

**RF-4-6-1**  
**Descripción:** El estudiante debe poder calificar al tutor de una sesión atendida con una puntuación de cero a cinco estrellas y un comentario opcional.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

**RF-4-6-2**  
**Descripción:** El estudiante debe poder reportar al tutor de una sesión atendida seleccionando una categoría válida y describiendo los hechos para revisión administrativa.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema, Administrador

---

## 5. Requisitos transversales

**RF-5-1**  
**Descripción:** El sistema debe mantener una separación clara por roles (estudiante, tutor, administrador) para restringir accesos y vistas según el perfil autenticado.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Estudiante, Tutor, Administrador

**RF-5-2**  
**Descripción:** El sistema debe mantener la información de cada sesión vinculada a su tutor, estudiante, materia y fecha/hora correspondientes.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema

**RF-5-3**  
**Descripción:** El sistema debe conservar el estado vigente de las solicitudes, cuentas, sesiones y denuncias, así como el historial de sesiones atendidas y canceladas.  
**Prioridad:** Media  
**Actores involucrados:** Sistema

**RF-5-4**  
**Descripción:** Toda ruta protegida debe requerir un token de autenticación válido y verificar que el rol corresponda a la operación solicitada.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Estudiante, Tutor, Administrador
