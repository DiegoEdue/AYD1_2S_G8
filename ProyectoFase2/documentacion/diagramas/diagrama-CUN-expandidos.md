# Diagramas de casos de uso expandidos

**Descripción**

Los diagramas de esta sección expanden cada uno de los siete procesos de negocio (CUN) identificados en la primera descomposición, mostrando los casos de uso puntuales que los conforman, los actores que los ejecutan y las relaciones `<<include>>`/`<<extend>>` existentes entre ellos. Este nivel de detalle permite observar las interacciones específicas entre los actores y el sistema dentro de cada módulo funcional.

## Expansión — CUN-01 Gestionar Cuenta y Acceso

**Descripción**

Este diagrama detalla el proceso de gestión de cuenta y acceso, abarcando el registro de estudiantes y tutores con el envío del token de verificación a su correo, la aprobación o rechazo de dichas solicitudes por parte del administrador mediante la revisión de los documentos PDF del solicitante y la notificación del resultado por correo, el inicio de sesión, la verificación del correo con el token en el primer acceso de estudiantes y tutores, la validación del segundo factor de autenticación exclusiva del administrador, y la gestión del perfil propio de cada usuario.

![CUN-01](image/cun01.png)

## Expansión — CUN-02 Configurar Horarios y Disponibilidad

**Descripción**

Este diagrama representa el proceso mediante el cual el tutor define o modifica sus días y franjas horarias de atención. Incluye la validación de conflictos con sesiones activas, la cual se ejecuta únicamente cuando se trata de una modificación sobre un horario ya existente.

![CUN-02](image/cun02.png)

## Expansión — CUN-03 Buscar Tutores y Programar Sesiones

**Descripción**

Este diagrama muestra el flujo mediante el cual el estudiante localiza tutores según distintos criterios de búsqueda, consulta su disponibilidad horaria y, finalmente, programa una sesión de tutoría, validando en el proceso que no existan traslapes ni sesiones activas duplicadas con el mismo tutor.

![CUN-03](image/cun03.png)

## Expansión — CUN-04 Gestionar Ciclo de Vida de Sesiones

**Descripción**

Este diagrama integra el ciclo de vida completo de una sesión de tutoría una vez programada: la consulta de las sesiones pendientes del tutor y de las sesiones activas del estudiante, la atención de la sesión registrando un plan de estudio estructurado (dificultades identificadas y recursos recomendados), la cancelación por parte del estudiante o del tutor (esta última con notificación automática por correo al estudiante afectado), la consulta del historial de sesiones atendidas y canceladas de ambos roles, y la consulta del plan de estudio por parte del estudiante con la opción de descargar su constancia en PDF.

![CUN-04](image/cun04.png)

## Expansión — CUN-05 Cancelar Sesiones y Notificar

**Descripción**

Este diagrama presenta los dos flujos independientes de cancelación de una sesión de tutoría: el que ejecuta el estudiante y el que ejecuta el tutor, este último acompañado de la notificación automática por correo al estudiante afectado.

![CUN-05](image/CUN-05.png)

## Expansión — CUN-06 Consultar Historial y Sesiones

**Descripción**

Este diagrama agrupa las consultas de seguimiento académico disponibles para estudiantes y tutores: las sesiones activas del estudiante y los historiales de sesiones atendidas o canceladas, tanto del estudiante como del tutor.

![CUN-06](image/CUN-06.png)

## Expansión — CUN-07 Gestionar Usuarios y Generar Reportes

**Descripción**

Este diagrama corresponde a las funciones de control administrativo de la plataforma: dar de baja a estudiantes o tutores aprobados que incumplan las políticas institucionales, y generar reportes analíticos en tiempo real sobre el uso del sistema.

![CUN-07](image/CUN-07.png)