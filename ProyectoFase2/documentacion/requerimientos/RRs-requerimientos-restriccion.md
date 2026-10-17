# Requerimientos de Restricción - RR

> Documento basado en los requisitos del proyecto EduConnect y en la estructura sugerida para restricciones del sistema.

## 1. Restricciones tecnológicas

**RR-1**  
**Descripción:** El sistema debe funcionar como una aplicación web cliente-servidor, con front-end en Next.js, back-end en Node.js/Express y servicios HTTP tipo REST.  
**Justificación:** El proyecto requiere una solución moderna, modular y accesible desde distintos navegadores y dispositivos.  
**Categoría:** Tecnológica  
**Impacto:** Limita la implementación a tecnologías compatibles con la infraestructura actual del proyecto.

**RR-2**  
**Descripción:** Las APIs del sistema deben intercambiar datos en JSON mediante HTTP/HTTPS, excepto las operaciones que entregan archivos, como constancias y documentos PDF.  
**Justificación:** Facilita la integración entre frontend, backend y servicios de correo y autenticación.  
**Categoría:** Tecnológica  
**Impacto:** Se excluyen otros protocolos o estándares de intercambio no compatibles con la solución web.

**RR-3**  
**Descripción:** La plataforma debe mantener separadas las responsabilidades del cliente web y del servidor/API; las reglas de negocio y validaciones críticas deben aplicarse en el servidor además de las validaciones de interfaz.  
**Justificación:** El cliente y el servidor se desarrollan como componentes independientes y el servidor es responsable de proteger la integridad de los datos.  
**Categoría:** Organizacional / Tecnológica  
**Impacto:** Fija un lineamiento de responsabilidad en cada capa del sistema.

**RR-4**  
**Descripción:** El sistema debe autenticar a estudiantes y tutores con correo y contraseña, exigir verificación de correo en el primer acceso y autenticar a administradores con nombre de usuario, contraseña y segundo factor TOTP.  
**Justificación:** Es parte del flujo principal de acceso del producto según las historias de usuario.  
**Categoría:** Tecnológica  
**Impacto:** Requiere implementar mecanismos de seguridad y control de sesión por perfil.

**RR-5**  
**Descripción:** El registro requiere fotografía y documento PDF de respaldo para estudiantes y tutores (carnet estudiantil para estudiantes y CV para tutores); las fotografías también pueden actualizarse desde el perfil.  
**Justificación:** Los documentos adjuntos se utilizan en la revisión administrativa y el perfil permite asociar una imagen al usuario.  
**Categoría:** Tecnológica  
**Impacto:** El sistema debe manejar almacenamiento y presentación de archivos multimedia en la aplicación.

## 2. Restricciones de seguridad y cumplimiento

**RR-6**  
**Descripción:** La interfaz de registro y cambio de contraseña exige un mínimo de ocho caracteres con mayúscula, minúscula y número; las rutas de registro del servidor actualmente validan como mínimo ocho caracteres con al menos una letra y un número. Las contraseñas se almacenan como hash.  
**Justificación:** Se requiere protección básica frente a accesos no autorizados; las reglas del cliente y del servidor deben mantenerse alineadas.  
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
**Descripción:** El administrador puede proporcionar un motivo al dar de baja una cuenta o resolver una denuncia; el motivo es opcional en la interfaz y el servidor utiliza un texto predeterminado cuando no se proporciona.  
**Justificación:** El motivo aporta contexto para la notificación al usuario, sin bloquear la operación si no se ingresa.  
**Categoría:** Organizacional  
**Impacto:** El proceso administrativo requiere un paso adicional de validación y registro.

## 3. Restricciones operativas

**RR-10**  
**Descripción:** El sistema debe mostrar la información de sesiones y usuarios con un orden cronológico claro, especialmente en listas de pendientes y historial.  
**Justificación:** La organización del tiempo es esencial para la gestión académica de tutorías.  
**Categoría:** Interfaz / Organizacional  
**Impacto:** Requiere diseñar vistas y filtros con ordenamiento consistente y una representación clara del estado.

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
**Descripción:** La plataforma debe manejar estados de aprobación para solicitudes y cuentas, y estados de sesión para sesiones activas, atendidas y canceladas por estudiante o tutor. Las denuncias también deben distinguirse como pendientes, resueltas o descartadas.  
**Justificación:** Los flujos de aprobación, atención, cancelación, evaluación y moderación dependen de transiciones de estado coherentes.  
**Categoría:** Organizacional / Operacional  
**Impacto:** Las operaciones permitidas dependen del estado actual; por ejemplo, solo sesiones atendidas pueden calificarse o reportarse.

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
**Descripción:** El sistema debe conservar en el historial las sesiones atendidas y canceladas mientras permanezcan las cuentas y los registros asociados; actualmente, la baja administrativa elimina la cuenta y también sus sesiones, calificaciones y denuncias relacionadas.  
**Justificación:** El historial permite el seguimiento académico, pero la operación actual de baja realiza eliminación permanente de los datos vinculados.  
**Categoría:** Datos / Operacional  
**Impacto:** La baja de un usuario afecta la disponibilidad de datos históricos asociados y debe considerarse al gestionar respaldos o auditoría.

**RR-19**  
**Descripción:** La plataforma conserva el estado de solicitudes, usuarios, sesiones y denuncias, pero el código revisado no mantiene una bitácora completa con el actor y cada transición administrativa.  
**Justificación:** Conocer el estado actual permite operar los flujos; la auditoría de quién realizó cada cambio requiere una bitácora adicional.  
**Categoría:** Organizacional  
**Impacto:** Los estados actuales no bastan para reconstruir todas las acciones administrativas ni su responsable.

**RR-20**  
**Descripción:** La información de sesiones y perfiles debe mantenerse consistente con el rol del usuario, evitando accesos cruzados entre estudiantes, tutores y administradores.  
**Justificación:** Se protege la confidencialidad y la integridad del servicio de tutorías.  
**Categoría:** Seguridad / Datos  
**Impacto:** El diseño de consultas, permisos y vistas debe estar alineado con el nivel de acceso autorizado.

**RR-21**  
**Descripción:** Las solicitudes de tutoría deben asociar un estudiante, un tutor aprobado, una materia impartida por ese tutor, una fecha, una hora y un motivo; solo se permiten días y horas configurados y franjas disponibles.  
**Justificación:** La programación depende del calendario y de las materias declaradas por el tutor.  
**Categoría:** Operacional / Datos  
**Impacto:** La API debe rechazar reservas fuera de disponibilidad, con materia ajena al tutor o en una franja ocupada.

**RR-22**  
**Descripción:** Los planes de estudio solo pueden registrarse al atender una sesión e incluyen dificultades identificadas y al menos un recurso recomendado con nombre, tipo y descripción de uso.  
**Justificación:** El plan se genera como resultado académico de una tutoría atendida y se consulta desde el historial del estudiante.  
**Categoría:** Operacional / Datos  
**Impacto:** No se debe asociar un plan a sesiones activas o canceladas; la constancia PDF solo debe descargarse para un plan del estudiante autenticado.

**RR-23**  
**Descripción:** Las evaluaciones y denuncias solo pueden asociarse a sesiones atendidas y a la contraparte de esa sesión; las categorías de denuncia deben pertenecer al conjunto permitido por el sistema.  
**Justificación:** La evaluación y moderación dependen de una interacción académica concluida y verificable.  
**Categoría:** Seguridad / Datos  
**Impacto:** La API debe validar la pertenencia y el estado de la sesión antes de aceptar una calificación o denuncia.

**RR-24**  
**Descripción:** Las cuentas administrativas requieren segundo factor TOTP para emitir una sesión autenticada; en la configuración inicial el administrador debe registrar su aplicación autenticadora mediante un código QR.  
**Justificación:** El panel administrativo permite aprobar, editar, eliminar cuentas y resolver denuncias.  
**Categoría:** Seguridad  
**Impacto:** El administrador no puede acceder a las rutas protegidas solo con usuario y contraseña.

**RR-25**  
**Descripción:** La baja administrativa de estudiantes o tutores elimina de la base de datos la cuenta y los registros asociados que maneja la operación (solicitudes, sesiones, calificaciones, denuncias y, para tutores, materias y días de atención); el sistema intenta notificar la baja por correo.  
**Justificación:** El comportamiento actual de baja es una eliminación física, no una suspensión reversible con conservación íntegra del historial.  
**Categoría:** Datos / Operacional  
**Impacto:** La acción es destructiva para la información vinculada y debe confirmarse antes de ejecutarse; el envío de correo depende del servicio externo.
