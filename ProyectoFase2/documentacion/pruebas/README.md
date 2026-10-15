# Índice general de pruebas

Esta carpeta reúne la documentación de las pruebas realizadas para el **Proyecto Fase 2**. El objetivo de este índice es centralizar el acceso a los README de cada conjunto de pruebas y facilitar la consulta de sus casos, herramientas, resultados y evidencias.

Las pruebas se dividen en:

- **Pruebas unitarias:** verifican funciones, reglas de negocio y componentes
    aislados de forma independiente. Permiten detectar errores específicos en el frontend y el backend sin ejecutar el flujo completo de la aplicación.
- **Pruebas End-to-End (E2E):** ejecutan la aplicación en un navegador y
    validan flujos completos, desde la interacción del usuario hasta la integración entre las distintas pantallas y módulos.

## Directorio pruebas

### Pruebas del estudiante

- [Pruebas unitarias del backend del estudiante](./UnitTestStudent/README.md):
    documenta las cinco suites Jest del backend para las historias de usuario HU-031 a HU-034, además de las pruebas adicionales con `node:test`.
- [README de las pruebas unitarias del backend del estudiante](../../server/test-student/UnitTest/README.md):
    contiene la documentación ubicada junto al código de las suites unitarias, incluyendo su configuración, cobertura y resultados de ejecución.

### Pruebas de tutor y estudiante

- [Pruebas unitarias y E2E de tutor y estudiante](./pruebas%20tutor%20y%20estudiante/README.md):
    describe las pruebas unitarias del frontend y los flujos E2E de las historias HU-032 a HU-037, ejecutados con Vitest y Cypress.

### Pruebas del administrador

- [Pruebas E2E y unitarias del administrador](./pruebas%20e2e%20y%20tests%20%28admin%29/README.md):
    documenta las pruebas unitarias del frontend y el flujo E2E del módulo administrador, ejecutados con Node.js Test Runner y Cypress.
