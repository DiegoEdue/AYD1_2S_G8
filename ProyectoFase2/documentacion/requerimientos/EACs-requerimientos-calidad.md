# Requerimientos de Calidad - EAC

> Documento basado en las historias de usuario de EduConnect y estructurado con el formato sugerido para escenarios de atributos de calidad.

## 1. Eficiencia

### EAC-1: Tiempo de carga del catálogo de tutores

**ID:** EAC-1  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** Un estudiante consulta el catálogo de tutores al mismo tiempo que varios compañeros buscan por materia, universidad o experiencia.  
**Estímulo:** Solicitud de visualización del catálogo con filtros activos.  
**Fuente del estímulo:** Estudiante  
**Entorno:** Hora pico de uso con varios usuarios concurrentes.  
**Artefacto:** API de tutores, base de datos y interfaz web.  
**Respuesta esperada:** El sistema devuelve la lista de tutores con filtros aplicados sin atrasos perceptibles.  
**Medida de la respuesta:** 95% de consultas resueltas en menos de 2 segundos.  
**Objetivo de negocio:** Mantener una experiencia fluida y evitar abandono durante la elección de tutor.

### EAC-2: Respuesta del sistema al agendar sesión

**ID:** EAC-2  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** Varios estudiantes intentan agendar tutorías simultáneamente para el mismo tutor.  
**Estímulo:** Confirmación de sesión.  
**Fuente del estímulo:** Estudiante  
**Entorno:** Alta concurrencia en el proceso de reserva.  
**Artefacto:** Motor de horarios, validación de disponibilidad y API de sesiones.  
**Respuesta esperada:** El sistema valida la disponibilidad y confirma o rechaza la sesión con un mensaje claro.  
**Medida de la respuesta:** 99% de las validaciones ejecutadas en menos de 1.5 segundos.  
**Objetivo de negocio:** Garantizar reservas confiables sin frustración por retrasos o duplicaciones.

### EAC-3: Carga del panel administrativo

**ID:** EAC-3  
**Atributo de calidad:** Rendimiento  
**Escenario crudo:** El administrador consulta el dashboard de reportes y los listados de aprobación cuando existe alta actividad en la plataforma.  
**Estímulo:** Solicitud de reportes y listas administrativas.  
**Fuente del estímulo:** Administrador  
**Entorno:** Uso normal con volumen alto de registros y sesiones.  
**Artefacto:** Módulo administrativo y servicios de consultas.  
**Respuesta esperada:** La interfaz muestra la información sin bloqueos ni tiempos muertos.  
**Medida de la respuesta:** Carga completa del panel en menos de 4 segundos en 95% de las consultas.  
**Objetivo de negocio:** permitir decisiones ágiles y soporte operativo eficiente.

---

## 2. Confiabilidad

### EAC-4: Disponibilidad de la plataforma

**ID:** EAC-4  
**Atributo de calidad:** Disponibilidad  
**Escenario crudo:** Un estudiante o tutor intenta iniciar sesión durante una hora de alta demanda.  
**Estímulo:** Login y navegación básica en la plataforma.  
**Fuente del estímulo:** Estudiante, Tutor, Administrador  
**Entorno:** Operación normal con picos de uso.  
**Artefacto:** Servicios de autenticación y frontend principal.  
**Respuesta esperada:** El sistema permanece disponible y responde al usuario con mensajes claros si hay demora o error.  
**Medida de la respuesta:** Disponibilidad del 99.5% mensual.  
**Objetivo de negocio:** asegurar acceso constante a la plataforma y continuidad del servicio educativo.

### EAC-5: Integridad de sesiones y horarios

**ID:** EAC-5  
**Atributo de calidad:** Confiabilidad  
**Escenario crudo:** El tutor modifica su horario mientras existen sesiones programadas en conflicto.  
**Estímulo:** Cambio de disponibilidad del tutor.  
**Fuente del estímulo:** Tutor  
**Entorno:** Actualización de horarios en cualquier momento.  
**Artefacto:** Lógica de validación de horarios y base de datos.  
**Respuesta esperada:** El sistema impide la actualización y advierte al usuario que debe reprogramar o cancelar sesiones conflictivas.  
**Medida de la respuesta:** 100% de las actualizaciones conflictivas bloqueadas y notificadas.  
**Objetivo de negocio:** prevenir inconsistencias operativas y mantener la confianza del estudiante.

### EAC-6: Persistencia de aprobaciones y cambios de estado

**ID:** EAC-6  
**Atributo de calidad:** Confiabilidad  
**Escenario crudo:** El administrador aprueba o rechaza un registro y la plataforma debe reflejar ese cambio de forma consistente.  
**Estímulo:** Cambio de estado del usuario.  
**Fuente del estímulo:** Administrador  
**Entorno:** Operación normal del flujo de aprobación.  
**Artefacto:** Servicios de administración y base de datos.  
**Respuesta esperada:** El estado del usuario cambia de manera consistente y la notificación se envía correctamente.  
**Medida de la respuesta:** 100% de cambios registrados con trazabilidad y sin inconsistencias de estado.  
**Objetivo de negocio:** mantener la integridad del proceso de validación académica.

---

## 3. Seguridad

### EAC-7: Protección de autenticación

**ID:** EAC-7  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un usuario intenta acceder a la plataforma con credenciales incorrectas o con intención de forzar acceso.  
**Estímulo:** Intento de login.  
**Fuente del estímulo:** Usuario no autorizado o atacante  
**Entorno:** Operación normal y acceso remoto.  
**Artefacto:** Sistema de autenticación y validación de credenciales.  
**Respuesta esperada:** El sistema valida credenciales y rechaza accesos no autorizados.  
**Medida de la respuesta:** 100% de intentos inválidos bloqueados por validación; ninguna credencial se expone en la interfaz.  
**Objetivo de negocio:** proteger la información académica y la identidad de usuarios.

### EAC-8: Control de acceso por rol

**ID:** EAC-8  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un estudiante intenta acceder a funciones administrativas o un tutor intenta visualizar datos de otros perfiles.  
**Estímulo:** Navegación o solicitud de operación protegida.  
**Fuente del estímulo:** Usuario autenticado  
**Entorno:** Uso normal del sistema.  
**Artefacto:** Middleware de autenticación y control de permisos.  
**Respuesta esperada:** El sistema restringe el acceso a funciones fuera de su rol y no permite visualizar información ajena.  
**Medida de la respuesta:** 100% de accesos no autorizados bloqueados.  
**Objetivo de negocio:** mantener la confidencialidad de la información del sistema.

### EAC-9: Seguridad de la contraseña

**ID:** EAC-9  
**Atributo de calidad:** Seguridad  
**Escenario crudo:** Un usuario registra una contraseña débil o intenta reutilizar una insegura.  
**Estímulo:** Registro o actualización de contraseña.  
**Fuente del estímulo:** Estudiante, Tutor, Administrador  
**Entorno:** Proceso de registro y edición de perfil.  
**Artefacto:** Validación de contraseña y almacenamiento seguro.  
**Respuesta esperada:** El sistema exige criterios mínimos de complejidad y almacena la contraseña en forma encriptada.  
**Medida de la respuesta:** 100% de contraseñas rechazadas si no cumplen requisitos mínimos; 100% de almacenamientos con cifrado.  
**Objetivo de negocio:** reducir riesgos de acceso indebido y cumplimiento de políticas de seguridad.

---

## 4. Usabilidad

### EAC-10: Claridad del flujo de registro

**ID:** EAC-10  
**Atributo de calidad:** Usabilidad  
**Escenario crudo:** Un nuevo usuario intenta completar el formulario de registro y necesita validar qué campos son obligatorios y cómo elegir su modalidad de tutoría o género.  
**Estímulo:** Completar formulario de registro.  
**Fuente del estímulo:** Estudiante o Tutor  
**Entorno:** Primer uso de la plataforma.  
**Artefacto:** Formularios de registro y validación en frontend.  
**Respuesta esperada:** El usuario identifica claramente los campos obligatorios y recibe mensajes específicos si algún dato es incorrecto.  
**Medida de la respuesta:** 90% de usuarios capaces de completar el registro sin asistencia en primera instancia.  
**Objetivo de negocio:** reducir errores de entrada y aumentar la tasa de registro exitoso.

### EAC-11: Claridad del historial y sesiones

**ID:** EAC-11  
**Atributo de calidad:** Usabilidad  
**Escenario crudo:** Un tutor consulta sesiones pendientes y pasadas para organizar su semana.  
**Estímulo:** Acceso al historial y listado de mentorías.  
**Fuente del estímulo:** Tutor  
**Entorno:** Uso cotidiano de la plataforma.  
**Artefacto:** Vistas de sesiones y filtros de historial.  
**Respuesta esperada:** La interfaz presenta la información de manera legible y diferenciada por estados.  
**Medida de la respuesta:** 90% de usuarios identifica el estado correcto de cada sesión sin ayuda adicional.  
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

### EAC-13: Registro de cambios de estado

**ID:** EAC-13  
**Atributo de calidad:** Mantenibilidad  
**Escenario crudo:** El equipo necesita revisar el historial de aprobaciones, rechazos y cancelaciones.  
**Estímulo:** Auditoría de eventos relevantes.  
**Fuente del estímulo:** Administrador o equipo técnico  
**Entorno:** Operación y soporte del sistema.  
**Artefacto:** Registro de cambios y logs.  
**Respuesta esperada:** El sistema conserva información suficiente para identificar quién realizó cada acción, cuándo y qué cambio ocurrió.  
**Medida de la respuesta:** 100% de eventos críticos registrados con identificador, fecha y resultado.  
**Objetivo de negocio:** facilitar auditoría, soporte y resolución de incidencias.
