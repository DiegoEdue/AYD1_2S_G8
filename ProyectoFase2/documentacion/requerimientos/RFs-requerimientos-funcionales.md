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
**Descripción:** El sistema debe permitir cargar una fotografía opcional durante el registro del estudiante.  
**Prioridad:** Media  
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
**Descripción:** El formulario de registro de tutor debe incluir nombre, apellido, carnet o identificación, fecha de nacimiento, género, dirección, teléfono, fotografía obligatoria, número de identificación del tutor, especialidad, dirección de tutoría, correo electrónico, año de inicio de tutorías, universidad de graduación y contraseña.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-1-2-3**  
**Descripción:** La dirección de tutoría debe permitir registrar una modalidad válida, ya sea física o online.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-1-2-4**  
**Descripción:** La cuenta del tutor debe registrarse en estado "Pendiente de aprobación" para revisión del administrador.  
**Prioridad:** Alta  
**Actores involucrados:** Sistema, Administrador

### CU1-3 Autenticación

**RF-1-3-1**  
**Descripción:** El sistema debe validar las credenciales ingresadas por el estudiante o tutor comparando la contraseña almacenada en formato encriptado.  
**Prioridad:** Alta  
**Actores involucrados:** Estudiante, Tutor, Sistema

**RF-1-3-2**  
**Descripción:** El sistema debe manejar correctamente la autenticación del administrador con la validación de usuario y contraseña.  
**Prioridad:** Alta  
**Actores involucrados:** Administrador, Sistema

**RF-1-3-3**  
**Descripción:** La vista de inicio de sesión debe incluir una opción visible para usuarios no registrados que los lleve al formulario de registro.  
**Prioridad:** Media  
**Actores involucrados:** Usuario, Sistema

---

## 2. Módulo: Administrador

### CU2-1 Aprobación o Rechazo de Estudiantes

**RF-2-1-1**  
**Descripción:** El administrador debe poder visualizar la lista de estudiantes pendientes de aprobación con su fotografía, nombre completo, carnet, género, fecha de nacimiento y correo electrónico.  
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
**Descripción:** El administrador debe poder revisar la lista de tutores pendientes con los datos principales del perfil, incluyendo fotografía, nombre completo, identificación, género, especialidad, número de identificación de tutor y correo electrónico.  
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
**Descripción:** El administrador debe poder consultar la lista completa de estudiantes aprobados y darles de baja cuando exista una justificación válida.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-3-2**  
**Descripción:** El administrador debe poder consultar la lista de tutores activos y gestionar su baja o suspensión.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-3-3**  
**Descripción:** Antes de realizar una baja, el sistema debe solicitar confirmación del administrador y notificar al usuario afectado.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema, Usuario

### CU2-4 Reportes Analíticos

**RF-2-4-1**  
**Descripción:** El administrador debe poder acceder a un módulo de reportes con al menos dos visualizaciones analíticas del uso del sistema.  
**Prioridad:** Media  
**Actores involucrados:** Administrador, Sistema

**RF-2-4-2**  
**Descripción:** Los indicadores del sistema deben calcularse con datos en tiempo real relacionados con las sesiones registradas y el comportamiento de usuarios.  
**Prioridad:** Media  
**Actores involucrados:** Sistema, Administrador

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
**Descripción:** El tutor debe poder atender una sesión pendiente e ingresar un resumen estructurado de la tutoría.  
**Prioridad:** Alta  
**Actores involucrados:** Tutor, Sistema

**RF-3-2-3**  
**Descripción:** Al atender la sesión, el sistema debe cambiar su estado a "Atendida" y guardar el resumen para historial posterior.  
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
**Descripción:** Si el tutor actualiza su contraseña, el sistema debe validarla y almacenarla en formato encriptado.  
**Prioridad:** Baja  
**Actores involucrados:** Tutor, Sistema

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
**Descripción:** El estudiante debe poder filtrar y buscar tutores por criterios relevantes como materia, Universidad, experiencia, género y edad.  
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
**Descripción:** El estudiante debe poder consultar el historial de sesiones pasadas para revisar su actividad académica.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

### CU4-4 Perfil del Estudiante

**RF-4-4-1**  
**Descripción:** El estudiante debe poder visualizar y actualizar su perfil personal.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

**RF-4-4-2**  
**Descripción:** Si se actualiza la contraseña, el sistema debe aplicar validación de seguridad y almacenamiento encriptado.  
**Prioridad:** Media  
**Actores involucrados:** Estudiante, Sistema

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
**Descripción:** El sistema debe registrar las acciones relevantes de cambio de estado para permitir trazabilidad operativa.  
**Prioridad:** Media  
**Actores involucrados:** Sistema
