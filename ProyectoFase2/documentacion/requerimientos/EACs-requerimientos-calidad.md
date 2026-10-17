# Requerimientos de Calidad - EAC

> Escenarios de calidad para los flujos disponibles en EduConnect. Las cifras indicadas son objetivos de aceptación; no representan mediciones de rendimiento o disponibilidad ya realizadas.

## 1. Eficiencia

### EAC-1: Tiempo de respuesta del catálogo de tutores

**ID:** EAC-1  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** Un estudiante autenticado consulta el catálogo de tutores aprobados y aplica filtros por materia, universidad, experiencia, género o edad.  
**Estímulo:** Solicitud de consulta del catálogo o cambio de filtros.  
**Fuente del estímulo:** Estudiante  
**Entorno:** Hora pico de uso con varios usuarios concurrentes.  
**Artefacto:** API del catálogo, consultas a PostgreSQL e interfaz web con filtros.  
**Respuesta esperada:** El sistema muestra tutores aprobados y sus materias y disponibilidad; la interfaz aplica los filtros solicitados.  
**Medida de la respuesta:** Objetivo: 95% de consultas resueltas en menos de 2 segundos con 50 usuarios concurrentes.  
**Objetivo de negocio:** Mantener una experiencia fluida y evitar abandono durante la elección de tutor.

### EAC-2: Respuesta del sistema al programar una sesión

**ID:** EAC-2  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** Un estudiante autenticado selecciona tutor, materia, fecha y hora y solicita una sesión.  
**Estímulo:** Envío de la solicitud de programación.  
**Fuente del estímulo:** Estudiante  
**Entorno:** Uso normal y solicitudes concurrentes para un mismo tutor y horario.  
**Artefacto:** Validación de disponibilidad, API de sesiones y base de datos.  
**Respuesta esperada:** El sistema valida día, rango horario, materia y ocupación; crea la sesión o informa el motivo del rechazo.  
**Medida de la respuesta:** Objetivo: 99% de solicitudes respondidas en menos de 1.5 segundos; ninguna reserva debe confirmarse fuera del horario o en una franja ya ocupada.  
**Objetivo de negocio:** Garantizar reservas confiables sin frustración por retrasos o duplicaciones.

### EAC-3: Carga de reportes administrativos

**ID:** EAC-3  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** El administrador consulta las estadísticas de sesiones, las calificaciones o las solicitudes pendientes.  
**Estímulo:** Apertura de un reporte o listado administrativo.  
**Fuente del estímulo:** Administrador  
**Entorno:** Uso normal con un volumen representativo de sesiones, usuarios y evaluaciones.  
**Artefacto:** Módulo administrativo y consultas agregadas a la base de datos.  
**Respuesta esperada:** La interfaz muestra totales, estados, sesiones por materia y tutor, cancelaciones, demanda horaria y calificaciones disponibles.  
**Medida de la respuesta:** Objetivo: 95% de consultas completas en menos de 4 segundos. Los reportes se calculan al consultarlos; no son una transmisión en tiempo real.  
**Objetivo de negocio:** permitir decisiones ágiles y soporte operativo eficiente.

---

## 2. Confiabilidad

### EAC-4: Disponibilidad de la plataforma

**ID:** EAC-4  
**Atributo de calidad:** Disponibilidad  
**Escenario crudo:** Un estudiante o tutor intenta acceder con sus credenciales y, cuando corresponde, verifica su correo electrónico.  
**Estímulo:** Inicio de sesión o envío del código de verificación.  
**Fuente del estímulo:** Estudiante, Tutor, Administrador  
**Entorno:** Operación normal con picos de uso.  
**Artefacto:** API de autenticación, correo de verificación y frontend principal.  
**Respuesta esperada:** El sistema valida credenciales, estado de aprobación y verificación del correo, y comunica claramente el resultado.  
**Medida de la respuesta:** Objetivo de disponibilidad del 99.5% mensual, medido sobre los servicios desplegados.  
**Objetivo de negocio:** asegurar acceso constante a la plataforma y continuidad del servicio educativo.

### EAC-5: Integridad de sesiones y horarios

**ID:** EAC-5  
**Atributo de calidad:** Confiabilidad  
**Escenario crudo:** El tutor modifica los días u horas de atención mientras tiene sesiones activas fuera del nuevo horario.  
**Estímulo:** Cambio de disponibilidad del tutor.  
**Fuente del estímulo:** Tutor  
**Entorno:** Actualización de horarios en cualquier momento.  
**Artefacto:** Lógica de validación de horarios y base de datos.  
**Respuesta esperada:** El sistema impide la actualización y advierte al usuario que debe reprogramar o cancelar sesiones conflictivas.  
**Medida de la respuesta:** 100% de actualizaciones conflictivas rechazadas; la respuesta debe identificar las sesiones que impiden el cambio.  
**Objetivo de negocio:** prevenir inconsistencias operativas y mantener la confianza del estudiante.

### EAC-6: Consistencia de cambios de estado y bajas

**ID:** EAC-6  
**Atributo de calidad:** Confiabilidad  
**Escenario crudo:** El administrador aprueba o rechaza una solicitud, da de baja una cuenta, o un participante cancela o atiende una sesión.  
**Estímulo:** Cambio de estado o eliminación de una entidad del flujo.  
**Fuente del estímulo:** Administrador, Estudiante o Tutor  
**Entorno:** Operación normal del flujo de aprobación.  
**Artefacto:** Servicios de administración y sesiones, base de datos y servicio de correo cuando aplique.  
**Respuesta esperada:** El sistema persiste el nuevo estado y lo muestra de forma consistente. El envío de correo es una operación externa; un fallo de correo no debe revertir una transición ya persistida y debe quedar registrado para soporte.  
**Medida de la respuesta:** 100% de transiciones válidas persistidas una sola vez y de bajas reflejadas consistentemente en los listados correspondientes.  
**Objetivo de negocio:** mantener la integridad de las solicitudes y de la agenda de tutorías.

---

## 3. Seguridad

### EAC-7: Protección de autenticación

**ID:** EAC-7  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un usuario intenta acceder con credenciales incorrectas, una cuenta pendiente/rechazada o sin verificar el correo requerido.  
**Estímulo:** Intento de inicio de sesión.  
**Fuente del estímulo:** Usuario no autorizado o atacante  
**Entorno:** Operación normal y acceso remoto.  
**Artefacto:** Sistema de autenticación, verificación de correo y gestión de estados de cuenta.  
**Respuesta esperada:** El sistema compara la contraseña con su hash, bloquea cuentas no autorizadas y solicita el código de correo en el primer acceso que lo requiera.  
**Medida de la respuesta:** 100% de intentos inválidos o no autorizados rechazados; las respuestas no incluyen hashes ni contraseñas.  
**Objetivo de negocio:** proteger la información académica y la identidad de usuarios.

### EAC-8: Control de acceso por rol

**ID:** EAC-8  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un usuario intenta acceder a una operación protegida que corresponde a otro rol o a datos de otra cuenta.  
**Estímulo:** Navegación o solicitud de operación protegida.  
**Fuente del estímulo:** Usuario autenticado  
**Entorno:** Uso normal del sistema.  
**Artefacto:** Middleware de autenticación y control de permisos.  
**Respuesta esperada:** El sistema restringe el acceso a funciones fuera de su rol y no permite visualizar información ajena.  
**Medida de la respuesta:** 100% de solicitudes sin JWT válido o con rol incorrecto rechazadas por la API.  
**Objetivo de negocio:** mantener la confidencialidad de la información del sistema.

### EAC-9: Protección de credenciales y segundo factor

**ID:** EAC-9  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un usuario registra o cambia su contraseña, o un administrador intenta completar el inicio de sesión sin un código TOTP válido.  
**Estímulo:** Alta/cambio de credenciales o verificación del segundo factor.  
**Fuente del estímulo:** Estudiante, Tutor, Administrador  
**Entorno:** Registro, edición del perfil e inicio de sesión administrativo.  
**Artefacto:** Validaciones de contraseña, almacenamiento de hashes y autenticación TOTP.  
**Respuesta esperada:** Las contraseñas se almacenan como hash; el cambio de contraseña del estudiante requiere su contraseña actual y la sesión administrativa solo se emite tras validar el código TOTP, cuyo secreto se almacena cifrado.  
**Medida de la respuesta:** 100% de contraseñas almacenadas como hash; 100% de códigos TOTP inválidos rechazados. La interfaz de registro requiere al menos ocho caracteres con mayúscula, minúscula y número.  
**Objetivo de negocio:** proteger las cuentas y reducir el riesgo de acceso indebido.

---

## 4. Usabilidad

### EAC-10: Claridad del flujo de registro

**ID:** EAC-10  
**Atributo de calidad:** Usabilidad  
**Escenario crudo:** Un estudiante o tutor completa el registro, adjunta la documentación solicitada y selecciona las opciones disponibles para género y modalidad de tutoría.  
**Estímulo:** Completar formulario de registro.  
**Fuente del estímulo:** Estudiante o Tutor  
**Entorno:** Primer uso de la plataforma.  
**Artefacto:** Formularios de registro, validaciones frontend y API de registro.  
**Respuesta esperada:** El usuario identifica datos y documentos requeridos, recibe errores comprensibles y entiende que su cuenta debe ser aprobada y su correo verificado antes de ingresar.  
**Medida de la respuesta:** Objetivo: 90% de usuarios completa el registro sin asistencia; ningún formulario debe marcar como opcional un dato o archivo que la API rechaza si falta.  
**Objetivo de negocio:** reducir errores de entrada y aumentar la tasa de registro exitoso.

### EAC-11: Claridad del historial y sesiones

**ID:** EAC-11  
**Atributo de calidad:** Usabilidad  
**Escenario crudo:** Un estudiante o tutor consulta sesiones activas, pendientes o históricas; el estudiante consulta además las evaluaciones disponibles y sus planes de estudio.  
**Estímulo:** Acceso a los listados, historial o plan de estudio.  
**Fuente del estímulo:** Estudiante o Tutor  
**Entorno:** Uso cotidiano de la plataforma.  
**Artefacto:** Vistas de sesiones, historial, evaluaciones y planes de estudio.  
**Respuesta esperada:** La interfaz presenta participantes, materia, fecha, hora y estado de manera legible; diferencia sesiones atendidas y canceladas y permite evaluar o reportar solo cuando corresponde.  
**Medida de la respuesta:** Objetivo: 90% de usuarios identifica el estado y la acción disponible para una sesión sin ayuda adicional.  
**Objetivo de negocio:** facilitar la gestión del tiempo y la atención académica.

---

## 5. Mantenibilidad

### EAC-12: Estructura modular del frontend

**ID:** EAC-12  
**Atributo de calidad:** Mantenibilidad  
**Escenario crudo:** El equipo necesita ajustar formularios, filtros o vistas de perfil de estudiantes y tutores durante nuevas iteraciones del proyecto.  
**Estímulo:** Cambio de requisitos de interfaz.  
**Fuente del estímulo:** Equipo de desarrollo  
**Entorno:** Desarrollo continuo del proyecto.  
**Artefacto:** Componentes reutilizables, páginas y servicios del frontend.  
**Respuesta esperada:** El sistema permite modificar y reutilizar componentes con bajo impacto en otras pantallas.  
**Medida de la respuesta:** 80% de los cambios de UI realizables sin afectar módulos no relacionados.  
**Objetivo de negocio:** mantener la evolución del producto con menor esfuerzo y menor riesgo técnico.

### EAC-13: Mantenibilidad de los flujos del sistema

**ID:** EAC-13  
**Atributo de calidad:** Mantenibilidad  
**Escenario crudo:** El equipo necesita mantener o ampliar los flujos de registro, horarios, sesiones, planes de estudio, evaluaciones y moderación.  
**Estímulo:** Cambio localizado en una regla o pantalla del producto.  
**Fuente del estímulo:** Equipo de desarrollo  
**Entorno:** Desarrollo y mantenimiento evolutivo.  
**Artefacto:** Módulos de rutas, controladores, modelos, servicios y componentes reutilizables.  
**Respuesta esperada:** El cambio puede implementarse en la capa responsable y validarse mediante pruebas focalizadas sin afectar flujos no relacionados.  
**Medida de la respuesta:** Objetivo: al menos 80% de cambios localizados de UI o lógica pueden probarse sin regresiones en módulos ajenos.  
**Objetivo de negocio:** facilitar la evolución del producto con menor esfuerzo y riesgo técnico.

### EAC-14: Consistencia de reportes y moderación

**ID:** EAC-14  
**Atributo de calidad:** Integridad de datos  
**Escenario crudo:** Un estudiante o tutor reporta a la contraparte de una sesión atendida y el administrador resuelve o descarta el reporte.  
**Estímulo:** Creación o resolución de una denuncia.  
**Fuente del estímulo:** Estudiante, Tutor o Administrador  
**Entorno:** Operación autenticada de la plataforma.  
**Artefacto:** API de evaluaciones, tablas de reportes y módulo de moderación administrativa.  
**Respuesta esperada:** El reporte queda asociado a la sesión y a las personas correctas, solo puede enviarse para una sesión atendida y no puede resolverse dos veces.  
**Medida de la respuesta:** 100% de reportes rechazados si la sesión no pertenece al usuario o no está atendida; 100% de denuncias resueltas con un solo estado final.  
**Objetivo de negocio:** preservar la integridad del proceso de evaluación y moderación.

> Las metas de tiempo, disponibilidad y facilidad de uso deben confirmarse con pruebas sobre un despliegue representativo. El repositorio no incluye mediciones que demuestren que ya se alcanzaron.
