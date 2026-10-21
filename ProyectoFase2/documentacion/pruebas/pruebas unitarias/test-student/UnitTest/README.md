# Pruebas unitarias del backend — HU-031 a HU-034

Este documento reúne la configuración, los casos implementados y los resultados de las **cinco suites Jest del backend de Estudiante** en `server/test-student/UnitTest/`.

## Resumen de resultados

Ejecución verificada el **11 de octubre de 2026**, desde `ProyectoFase2/server/`:

```text
npm run test:unit -- --coverage
Test Suites: 5 passed, 5 total
Tests:       34 passed, 34 total

npm test
Tests:       8 passed, 8 total
```

| Suite Jest | Historia | Casos | Resultado |
|---|---|---:|---|
| `student-plan.unit.test.js` | HU-031 | 3 | Aprobados |
| `student-plan-pdf-security.unit.test.js` | HU-032 | 4 | Aprobados |
| `student-plan-pdf-download.unit.test.js` | HU-032 | 3 | Aprobados |
| `student-feedback.unit.test.js` | HU-033 y HU-034 | 20 | Aprobados |
| `student-session-history.unit.test.js` | HU-023, HU-033 y HU-034 | 4 | Aprobados |
| **Total Jest** | | **34** | **5 suites aprobadas** |

Las 8 pruebas adicionales de `server/test-student/*.test.js` usan `node:test`, **no** forman parte de las 34 pruebas Jest. El resultado documentado es una ejecución puntual; debe repetirse tras modificar código o dependencias.

## Configuración e integración

- **Jest:** dependencia de desarrollo declarada en `server/package.json`.
- **Configuración:** `server/jest.unit.config.cjs` utiliza `testEnvironment: "node"`, `clearMocks: true` y selecciona `test-student/UnitTest/**/*.unit.test.js`.
- **Script Jest:** `npm run test:unit` (`jest --config jest.unit.config.cjs --runInBand`).
- **Script de pruebas previas:** `npm test` ejecuta `node --test test-student/*.test.js`; queda separado para no mezclar Jest y `node:test`.

Comandos desde `ProyectoFase2/server/`:

```bash
npm run test:unit
npm run test:unit -- --coverage
npm test
```

Para ejecutar una suite específica:

```bash
npm run test:unit -- --runTestsByPath test-student/UnitTest/student-feedback.unit.test.js
```

### Aislamiento de dependencias

Las pruebas unitarias llaman directamente a funciones de los controladores. Sustituyen `../../src/config/db` por `jest.fn()` para que el SQL sea simulado y no exista conexión real a PostgreSQL. Las suites de HU-032 también simulan `renderStudyPlanPdf`; comprueban el contrato del controlador sin generar archivos PDF. La petición `req` y la respuesta `res` son objetos de prueba, con `status`, `json`, `set` y `send` encadenables según el caso.

Una consulta hecha con `sql\`...${valor}\`` llega al mock como fragmentos de texto y valores interpolados. Las suites verifican ambos para comprobar, por ejemplo, que se utiliza `req.user.id` y que la consulta exige `estado = 'Atendida'`. Las respuestas y excepciones SQL se preparan con `mockResolvedValue` o `mockRejectedValue`. Los casos de error restauran los spies de `console.error`; la suite PDF restaura `EDUCONNECT_CONTACT_PHONE` al terminar.

**No se necesita `.env`, un servidor en ejecución ni una base de datos** para ejecutar las cinco suites.

## Suite 1 — HU-031: consultar planes de estudio

**Archivo:** `student-plan.unit.test.js` · **Controlador:** `getStudyPlans` · **Ruta asociada:** `GET /api/student/study-plans`.

| Caso | Preparación | Aserciones principales |
|---|---|---|
| Plan existente | SQL simulado devuelve tutor, especialidades, dificultades y recursos; `req.user.id = 49`, `req.query.idEstudiante = 50` | `200`, `success: true`, mapeo de `idPlan`, `idSesion`, fecha, tutor y listas; SQL filtra por estudiante **49** y sesión `Atendida`, ignorando el ID suministrado por query. |
| Sin planes | SQL devuelve `[]` | `200` con `data: []`. |
| Error SQL | SQL rechaza con un mensaje privado | `500` y mensaje público genérico sin detalles internos. |

La suite prueba el contrato JSON y el filtro de propiedad construido por el controlador, no el resultado real de ese SQL en PostgreSQL.

## Suite 2 — HU-032: seguridad de la descarga

**Archivo:** `student-plan-pdf-security.unit.test.js` · **Controlador:** `downloadStudyPlanPdf` · **Ruta asociada:** `GET /api/student/study-plans/:id/pdf`.

| Casos | Preparación | Aserciones principales |
|---|---|---|
| Tres IDs inválidos | `id = "0"`, `"abc"` o `"1abc"` (tres ejecuciones de `test.each`) | Cada uno responde `400`; no llama a SQL, PDFKit ni `res.send`. |
| Plan inexistente o ajeno | SQL devuelve `[]` para `id = 1`, estudiante `49` | SQL recibe `[1, 49]` y filtros por plan, estudiante y estado `Atendida`; responde `404` sin generar ni enviar un PDF. |

**Límite:** el `404` no demuestra por sí solo el aislamiento real de dos usuarios en la base; esa comprobación corresponde a integración con PostgreSQL.

## Suite 3 — HU-032: entregar PDF

**Archivo:** `student-plan-pdf-download.unit.test.js` · **Controlador:** `downloadStudyPlanPdf`.

El generador PDF simulado devuelve `Buffer.from("%PDF-1.4")`. Es un Buffer ficticio para verificar la entrega, **no** una constancia completa.

| Caso | Preparación | Aserciones principales |
|---|---|---|
| Descarga correcta | SQL devuelve un plan propio y atendido; no hay teléfono institucional configurado | Generador recibe estudiante, tutor, fecha, especialidades, dificultades, recursos y teléfono del tutor; respuesta `200`, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="educonnect-plan-1.pdf"` y exactamente el Buffer devuelto. |
| Teléfono institucional | `EDUCONNECT_CONTACT_PHONE` definido temporalmente | Se usa ese teléfono en vez del teléfono del tutor y se restaura la variable tras la prueba. |
| Fallo al generar | Generador rechaza con un error privado | `500` genérico, sin encabezados de descarga ni archivo parcial mediante `res.send`. |

La generación **real** con PDFKit y documentos de varias páginas se prueba por separado en `server/test-student/study-plan-pdf.test.js` con `node:test`.

## Suite 4 — HU-033/HU-034: calificar y reportar tutor

**Archivo:** `student-feedback.unit.test.js` · **Controladores:** `rateTutor`, `reportTutor`, `getReportCategories`.

### HU-033 — `POST /api/student/sessions/:id/rating` (11 casos)

- Éxito con **0 estrellas** y comentario omitido: se almacena una cadena vacía por el `NOT NULL` de `tutor_ratings.comentario`, se responde `201` y se usa el estudiante autenticado.
- Puntuaciones inválidas `-1`, `6`, `2.5`, `"5"` y `null`: cinco casos `400` sin consulta SQL.
- Comentario de más de 500 caracteres: `400`.
- Sesión ajena o no encontrada: `404` sin revelar su estado.
- Sesión cancelada: `409`, pues no es `Atendida`.
- Sesión ya calificada: `409`; la consulta incorpora `ON CONFLICT (id_sesion) DO NOTHING` para evitar duplicados por concurrencia.
- Error SQL: `500` genérico sin revelar detalles de conexión.

### HU-034 — categorías y `POST /api/student/sessions/:id/report` (9 casos)

- Catálogo `GET /api/student/report-categories`: respuesta `200` con las categorías permitidas.
- Reporte válido: `201`, estado inicial `Pendiente`, descripción recortada y SQL filtrado por sesión `Atendida` del estudiante autenticado.
- Categorías no permitidas `"Abuso/Conducta inapropiada"`, cadena vacía y `null`: tres respuestas `400` sin consultar SQL. La categoría válida en la BD es `"Abuso o conducta inapropiada"`.
- Descripción vacía, menor de 10 o mayor de 2000 caracteres: tres respuestas `400` sin consultar SQL.
- Segundo reporte sobre la misma sesión: `409`.

La suite simula resultados SQL: no inserta calificaciones ni reportes reales.

## Suite 5 — HU-023/HU-033/HU-034: historial del estudiante

**Archivo:** `student-session-history.unit.test.js` · **Helper:** `getStudentSessionsByState` · **Ruta asociada:** `GET /api/student/sessions/history`.

| Caso | Preparación | Aserciones principales |
|---|---|---|
| Historial con calificación y reporte | SQL simulado devuelve una sesión atendida con ambos registros | Consulta parametrizada por `studentId` y estados recibidos, uniones con `tutor_ratings` y `tutor_reports`, fechas y horas normalizadas y objetos `calificacion`/`reporte` completos. |
| Sesión sin retroalimentación | `id_rating` e `id_reporte` nulos | Respuesta con `calificacion: null` y `reporte: null`. |
| Solo reporte | Sin calificación y con reporte `Descartado` | Se conserva `calificacion: null` y se mapean categoría, estado y fecha del reporte. |
| Historial vacío | SQL devuelve `[]` | Respuesta `[]`. |

Esto valida que el historial devuelve las señales necesarias para habilitar o deshabilitar acciones de calificación y reporte. Al simular SQL, **no prueba permisos reales en PostgreSQL** ni el montaje del endpoint HTTP.

## Cobertura Jest de la ejecución verificada

| Archivo medido | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| `student-plan.controller.js` | 100 % | 100 % | 100 % | 100 % |
| `student-feedback.controller.js` | 91,83 % | 89,18 % | 100 % | 91,11 % |
| `student-helpers.js` | 58,82 % | 48,57 % | 66,66 % | 61,29 % |
| **Total medido por Jest** | **83,33 %** | **71,79 %** | **85,71 %** | **84,15 %** |

`student-helpers.js` incluye funciones utilizadas por otras historias que estas suites no ejercitan. Por eso el porcentaje global es inferior al de los controladores específicos. La cobertura de líneas no equivale a validación de permisos reales ni de consultas contra una base de datos.

## Qué queda fuera de estas cinco suites

- Verificar JWT, vencimiento, `401`/`403`, montaje de rutas Express y respuestas HTTP reales; requeriría pruebas con Supertest.
- Comprobar FKs, índices únicos y aislamiento entre estudiantes con PostgreSQL real.
- Confirmar visualmente el diseño del PDF, su firma emulada o la totalidad de sus textos.
- Probar la integración visual del frontend o la revisión de denuncias por administradores (fuera del alcance del módulo Estudiante).

Los resultados de pruebas manuales con tokens y datos reales se realizan aparte; no deben confundirse con los 34 casos unitarios automatizados de este documento.
