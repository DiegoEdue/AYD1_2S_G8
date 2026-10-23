# Índice general de pruebas

Esta carpeta reúne la documentación de las pruebas realizadas para el **Proyecto Fase 2**. El objetivo de este índice es centralizar el acceso a los README de cada conjunto de pruebas y facilitar la consulta de sus casos, herramientas, resultados y evidencias.

Las pruebas se dividen en:

- **Pruebas unitarias:** verifican funciones, reglas de negocio y componentes aislados de forma independiente. Permiten detectar errores específicos en el frontend y el backend sin ejecutar el flujo completo de la aplicación.
- **Pruebas End-to-End (E2E):** ejecutan la aplicación en un navegador y validan flujos completos, desde la interacción del usuario hasta la integración entre las distintas pantallas y módulos.

## Directorio pruebas

### Pruebas unitarias

- [Pruebas unitarias del backend del estudiante](./pruebas%20unitarias/UnitTestStudent/README.md):
    documenta las cinco suites Jest del backend para las historias de usuario HU-031 a HU-034, además de las pruebas adicionales con `node:test`.
- [README de las pruebas unitarias del backend del estudiante](../../server/test-student/UnitTest/README.md):
    contiene la documentación ubicada junto al código de las suites unitarias, incluyendo su configuración, cobertura y resultados de ejecución.
- [Pruebas unitarias de tutor y estudiante](./pruebas%20unitarias/pruebas%20unitarias%20tutor%20y%20estudiante%20frontend/README.md):
    describe las pruebas unitarias del frontend de las historias HU-032 a HU-037, ejecutadas con Vitest.
- [Pruebas unitarias del administrador](./pruebas%20unitarias/pruebas%20unitarias%20admin%20frontend/README.md):
    documenta las pruebas unitarias del frontend del módulo administrador, ejecutadas con Node.js Test Runner.
- [Pruebas unitarias de verificación 2FA y sesiones del tutor](./pruebas%20unitarias/pruebas%20unitarias%202fa%20y%20tutor/README.md):
    documenta la suite de 5 pruebas unitarias de backend ejecutadas con Jest para la verificación de dos pasos (2FA), la planificación de horarios y sesiones del tutor, y la cancelación de tutorías con notificación por correo al estudiante.
- [Pruebas unitarias de gestión administrativa en backend](./pruebas%20unitarias/Pruebas_Backend/README.md):
    documenta las 42 pruebas en Jest para la lógica de controladores del backend en la gestión de estudiantes y tutores activos (HU-040 a HU-046).

### Pruebas End-to-End (E2E)

- [Pruebas E2E de perfil de estudiante y tutor](./pruebas%20e2e/pruebas%20e2e%20perfil%20estudiante%20y%20tutor/README.md):
    documenta la suite de pruebas End-to-End con Cypress que valida la modificación de información personal, de contacto y especialidades para perfiles de estudiante y tutor, verificando la protección de campos inmutables.
- [Pruebas E2E de ver tutores disponibles y planificar sesión](./pruebas%20e2e/pruebas%20e2e%20tutores%20disponibles%20y%20planificar%20sesion/README.md):
    documenta la suite de pruebas End-to-End con Cypress que valida la visualización del catálogo de tutores disponibles, filtrado por materias, consulta de disponibilidad por fecha y la reserva y planificación de sesiones de tutoría por parte del estudiante.
- [Pruebas E2E de atender sesión y mandar plan de estudio con recursos](./pruebas%20e2e/pruebas%20e2e%20sesion%20atendida%20y%20plan%20de%20estudio%20tutor/README.md):
    documenta la suite de pruebas End-to-End con Cypress que valida el flujo del tutor para marcar como atendida una tutoría finalizada, redactar las dificultades académicas observadas y enviar un plan de estudio estructurado con recursos complementarios (videos, textos y enlaces), así como su posterior visualización en el historial de sesiones.
- [Pruebas E2E de moderación de denuncias de estudiantes y tutores](./pruebas%20e2e/pruebas%20e2e%20moderacion%20denuncias%20admin/README.md):
    documenta la suite de pruebas End-to-End con Cypress que valida la inspección de denuncias activas contra estudiantes y tutores, la verificación detallada de la causa de la queja y las resoluciones administrativas para dar de baja o rechazar/descartar la denuncia.
- [Pruebas E2E de aceptar o rechazar estudiantes o tutores](./pruebas%20e2e/pruebas%20e2e%20aceptar%20rechazar%20usuarios%20admin/README.md):
    documenta la suite de pruebas End-to-End con Cypress que valida la gestión de solicitudes pendientes de registro, permitiendo al administrador inspeccionar los datos adjuntos, aprobar nuevos estudiantes o tutores con habilitación de acceso y notificación por correo, o declinar solicitudes no válidas.
- [Pruebas E2E de flujo de navegación del administrador](./pruebas%20e2e/pruebas%20e2e%20flujo%20administrador/README.md):
    documenta el flujo E2E automatizado del módulo administrador con Cypress, validando el visor PDF de documentos, edición con correo inmutable y reportes analíticos.
- [Pruebas E2E de tutor y estudiante](./pruebas%20e2e/pruebas%20e2e%20tutor%20y%20estudiante/README.md):
    describe los flujos E2E de tutorías, evaluación con calificación por estrellas y reportes de incidencias entre tutor y estudiante.