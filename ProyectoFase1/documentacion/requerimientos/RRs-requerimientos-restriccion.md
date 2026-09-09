# Requerimientos de Restricción - RR

> Documento basado en los requisitos del proyecto EduConnect y en la estructura sugerida para restricciones del sistema.

## 1. Restricciones tecnológicas

**RR-1**  
**Descripción:** El sistema debe funcionar como una aplicación web basada en arquitectura cliente-servidor, con front-end en Next.js y back-end orientado a servicios REST.  
**Justificación:** El proyecto requiere una solución moderna, modular y accesible desde distintos navegadores y dispositivos.  
**Categoría:** Tecnológica  
**Impacto:** Limita la implementación a tecnologías compatibles con la infraestructura actual del proyecto.

**RR-2**  
**Descripción:** Las APIs del sistema deben exponerse en formato JSON y responder mediante protocolos HTTP/HTTPS.  
**Justificación:** Facilita la integración entre frontend, backend y servicios de correo y autenticación.  
**Categoría:** Tecnológica  
**Impacto:** Se excluyen otros protocolos o estándares de intercambio no compatibles con la solución web.

**RR-3**  
**Descripción:** La plataforma debe mantener una separación clara entre cliente y servidor, evitando cambios directos en el backend cuando se requieran ajustes de interfaz.  
**Justificación:** El cliente y el servidor se desarrollan por separado y el alcance solicitado indica cambios solo en frontend para ciertos escenarios.  
**Categoría:** Organizacional / Tecnológica  
**Impacto:** Fija un lineamiento de responsabilidad en cada capa del sistema.

**RR-4**  
**Descripción:** El sistema debe soportar autenticación mediante correo y contraseña para estudiantes y tutores, así como un flujo de validación para administradores.  
**Justificación:** Es parte del flujo principal de acceso del producto según las historias de usuario.  
**Categoría:** Tecnológica  
**Impacto:** Requiere implementar mecanismos de seguridad y control de sesión por perfil.

**RR-5**  
**Descripción:** El sistema debe permitir la gestión de archivos de perfil, incluyendo fotografías obligatorias para tutores y opcionales para estudiantes.  
**Justificación:** La historia de usuario exige asociar identidad visual y validación del tutor.  
**Categoría:** Tecnológica  
**Impacto:** El sistema debe manejar almacenamiento y presentación de archivos multimedia en la aplicación.

## 2. Restricciones de seguridad y cumplimiento

**RR-6**  
**Descripción:** Las contraseñas deben cumplir requisitos mínimos de seguridad: longitud mínima, uso de mayúsculas, minúsculas y números.  
**Justificación:** Se requiere protección básica frente a accesos no autorizados y cumplimiento de estándares de seguridad.  
**Categoría:** Legal / Seguridad  
**Impacto:** Los usuarios deben crear credenciales más complejas y la validación debe implementarse en las pantallas y en la lógica del sistema.

**RR-7**  
**Descripción:** El acceso a funcionalidades del sistema debe depender del rol autenticado (estudiante, tutor o administrador).  
**Justificación:** La plataforma maneja datos sensibles y procesos distintos por tipo de usuario.  
**Categoría:** Organizacional / Seguridad  
**Impacto:** Se limita la visibilidad de módulos y acciones según el perfil del usuario.

**RR-8**  
**Descripción:** Las notificaciones de aprobación, rechazo, baja o cancelación deben enviarse únicamente a usuarios legítimamente involucrados en la acción.  
**Justificación:** Evita revelar información interna o incorrecta a personas no relacionadas con la sesión o registro.  
**Categoría:** Seguridad  
**Impacto:** El sistema debe validar contexto antes de disparar cada correo.

**RR-9**  
**Descripción:** El administrador debe proporcionar justificación obligatoria para la baja o retiro de una cuenta o sesión cuando aplique.  
**Justificación:** Se exige trazabilidad y responsabilidad en decisiones críticas del sistema.  
**Categoría:** Organizacional  
**Impacto:** El proceso administrativo requiere un paso adicional de validación y registro.

## 3. Restricciones operativas

**RR-10**  
**Descripción:** El sistema debe mostrar la información de sesiones y usuarios con un orden cronológico claro, especialmente en listas de pendientes y historial.  
**Justificación:** La organización del tiempo es esencial para la gestión académica de tutorías.  
**Categoría:** Interfaz / Organizacional  
**Impacto:** Require diseñar vistas y filtros con ordenamiento consistente y una representación clara del estado.

**RR-11**  
**Descripción:** El sistema debe permitir la modificación de horarios del tutor solo si no existen sesiones activas en conflicto con la nueva disponibilidad.  
**Justificación:** Se evita la generación de conflictos y pérdida de confianza en la agenda del tutor.  
**Categoría:** Operacional  
**Impacto:** El proceso de edición de horarios requiere validación previa y mensajes de advertencia explícitos.

**RR-12**  
**Descripción:** Las sesiones programadas deben quedar asociadas con fecha, hora, materia, motivo y participantes involucrados.  
**Justificación:** La sesión es la unidad principal del servicio de tutorías y requiere trazabilidad completa.  
**Categoría:** Operacional  
**Impacto:** Restricción de diseño del modelo de datos y presentación de la información.

**RR-13**  
**Descripción:** La plataforma debe mantener registros de estado para cada estudiante, tutor y sesión para permitir historial y trazabilidad.  
**Justificación:** Las historias de usuario requieren aprobación, rechazo, baja, cancelación, atención y finalización con seguimiento claro.  
**Categoría:** Organizacional / Operacional  
**Impacto:** Se requiere un modelo de estados definido y consistente para todo el sistema.

## 4. Restricciones de negocio e interfaz

**RR-14**  
**Descripción:** La dirección de tutoría del tutor debe restringirse a opciones válidas definidas por el sistema, evitando entradas libres no controladas.  
**Justificación:** Se busca consistencia en la modalidad y evitar errores de captura.  
**Categoría:** Interfaz / Organizacional  
**Impacto:** El campo debe operar como lista desplegable u opción limitada, no como texto libre.

**RR-15**  
**Descripción:** El género del estudiante y del tutor debe registrarse solo mediante valores permitidos por el sistema.  
**Justificación:** Garantiza consistencia de datos, reportabilidad y alineación con los requisitos del formulario de registro.  
**Categoría:** Interfaz / Datos  
**Impacto:** Se debe limitar la entrada a valores predefinidos como masculino y femenino.

**RR-16**  
**Descripción:** El número de identificación del tutor debe ser obligatorio y debe presentarse en el flujo de registro y aprobación.  
**Justificación:** Es un dato requerido para validación y trazabilidad dentro del proceso administrativo.  
**Categoría:** Organizacional / Datos  
**Impacto:** El sistema debe incorporar este campo en formularios, validaciones y paneles de revisión.

**RR-17**  
**Descripción:** El sistema debe permitir la consulta y edición del perfil del usuario sin permitir cambios no autorizados sobre el correo electrónico principal.  
**Justificación:** El correo es un identificador clave de acceso y la plataforma debe evitar inconsistencias de cuenta.  
**Categoría:** Seguridad / Interfaz  
**Impacto:** Se restringe la edición del campo de correo para evitar conflictos de autenticación.

## 5. Restricciones de datos y auditoría

**RR-18**  
**Descripción:** El sistema debe conservar la información de la sesión en el historial aunque la misma haya sido atendida o cancelada.  
**Justificación:** El proyecto exige evidencia y seguimiento académico para cada tutoría.  
**Categoría:** Datos / Operacional  
**Impacto:** Se requiere almacenamiento permanente de registros históricos y estados asociados.

**RR-19**  
**Descripción:** La plataforma debe registrar las decisiones administrativas sobre aprobación, rechazo y baja de usuarios con la trazabilidad suficiente para auditoría.  
**Justificación:** El flujo de validación del sistema requiere evidencia de decisiones con responsable y resultado.  
**Categoría:** Organizacional  
**Impacto:** Se deben conservar logs o bitácoras de cambios en procesos críticos.

**RR-20**  
**Descripción:** La información de sesiones y perfiles debe mantenerse consistente con el rol del usuario, evitando accesos cruzados entre estudiantes, tutores y administradores.  
**Justificación:** Se protege la confidencialidad y la integridad del servicio de tutorías.  
**Categoría:** Seguridad / Datos  
**Impacto:** El diseño de consultas, permisos y vistas debe estar alineado con el nivel de acceso autorizado.
