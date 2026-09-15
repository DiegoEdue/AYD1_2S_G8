## Descripciones textuales

### **CUN-01 GESTIONAR CUENTA Y ACCESO**

#### CU1-1 Registrar Estudiante

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Registrar Estudiante |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir que una persona no registrada cree una cuenta de estudiante para poder solicitar tutorías. |
| **Resumen** | El aspirante completa un formulario con sus datos personales y credenciales. El sistema valida la unicidad del correo y del carnet, la complejidad de la contraseña, y almacena la cuenta en estado "Pendiente de aprobación". |
| **Condiciones previas** | El correo electrónico y el carnet no deben existir previamente en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El aspirante selecciona "Registrarme como Estudiante".</td></tr><tr><td>2</td><td>Se muestra el formulario con: nombre, apellido, carnet, género, dirección, teléfono, fecha de nacimiento, correo, contraseña y fotografía (opcional).</td></tr><tr><td>3</td><td>El aspirante completa los campos obligatorios y adjunta la fotografía si lo desea.</td></tr><tr><td>4</td><td>El sistema valida que el correo y el carnet no existan previamente.</td></tr><tr><td>5</td><td>El sistema valida que la contraseña cumpla mínimo 8 caracteres, mayúscula, minúscula y número (RR-6).</td></tr><tr><td>6</td><td>El sistema almacena la contraseña encriptada y crea la cuenta en estado "Pendiente de aprobación".</td></tr><tr><td>7</td><td>Se confirma al aspirante que su solicitud quedó registrada.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si el correo o carnet ya existen, se muestra el mensaje correspondiente y no se crea la cuenta.</td></tr><tr><td>5</td><td>Si la contraseña no cumple los requisitos, se listan los criterios faltantes.</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda registrada en estado "Pendiente de aprobación", sin acceso a la plataforma hasta que el Administrador la apruebe (ver CU1-3). |

<br>

#### CU1-2 Registrar Tutor

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Registrar Tutor |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir que un profesional postule su perfil como tutor de la plataforma. |
| **Resumen** | El aspirante a tutor completa un formulario más extenso que el del estudiante, incluyendo datos profesionales y fotografía obligatoria. El sistema valida unicidad de datos clave y almacena la cuenta como "Pendiente de aprobación". |
| **Condiciones previas** | El correo electrónico y el número de identificación de tutor no deben existir previamente en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El aspirante selecciona "Registrarme como Tutor".</td></tr><tr><td>2</td><td>Se muestra el formulario con: nombre, apellido, carnet/ID, fecha de nacimiento, género, dirección, teléfono, fotografía (obligatoria), número de identificación de tutor, especialidad, dirección de tutoría (física u online, según lista restringida — RR-14), correo, año de inicio de tutorías, universidad de graduación y contraseña.</td></tr><tr><td>3</td><td>El aspirante completa el formulario y adjunta la fotografía.</td></tr><tr><td>4</td><td>El sistema valida que el correo y el número de identificación de tutor no existan previamente.</td></tr><tr><td>5</td><td>El sistema valida la complejidad de la contraseña y la almacena encriptada.</td></tr><tr><td>6</td><td>La cuenta se crea en estado "Pendiente de aprobación".</td></tr><tr><td>7</td><td>Se confirma al aspirante que su solicitud quedó registrada.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si no se adjunta la fotografía obligatoria, el sistema impide continuar y señala el campo requerido.</td></tr><tr><td>4</td><td>Si el correo o el número de identificación de tutor ya existen, se muestra el mensaje correspondiente.</td></tr><tr><td>5</td><td>Si la contraseña no cumple los requisitos mínimos, se listan los criterios faltantes.</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda registrada en estado "Pendiente de aprobación" para revisión del Administrador (ver CU1-3). |

<br>

#### CU1-3 Aprobar/Rechazar Registro

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Aprobar/Rechazar Registro |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador validar las solicitudes de registro de estudiantes y tutores antes de otorgarles acceso a la plataforma. |
| **Resumen** | El Administrador consulta por separado la lista de estudiantes y de tutores pendientes, revisa los datos principales de cada solicitud y decide aprobarla o rechazarla. Tras la decisión se dispara la notificación por correo al solicitante. |
| **Condiciones previas** | El Administrador debe estar autenticado (ver CU1-4/CU1-5). Debe existir al menos una solicitud en estado "Pendiente de aprobación". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td colspan="2">**Flujo Estudiantes:**</td></tr><tr><td>1</td><td>El Administrador accede a "Solicitudes de Estudiantes Pendientes".</td></tr><tr><td>2</td><td>Se muestra la lista con fotografía, nombre completo, carnet, género, fecha de nacimiento y correo (RF-2-1-1).</td></tr><tr><td>3</td><td>El Administrador presiona "Aprobar" o "Rechazar" sobre un registro.</td></tr><tr><td>4</td><td>El sistema actualiza el estado de la cuenta a "Aprobado" o "Rechazado".</td></tr><tr><td>5</td><td>Se invoca "Notificar Resultado de Aprobación por Correo" (CU1-6).</td></tr><tr><td colspan="2">**Flujo Tutores:**</td></tr><tr><td>6</td><td>El Administrador accede a "Solicitudes de Tutores Pendientes".</td></tr><tr><td>7</td><td>Se muestra la lista con fotografía, nombre completo, identificación, género, especialidad, número de identificación de tutor y correo (RF-2-2-1).</td></tr><tr><td>8</td><td>El Administrador presiona "Aprobar" o "Rechazar" sobre un registro.</td></tr><tr><td>9</td><td>El sistema actualiza el estado de la cuenta a "Aprobado" o "Rechazado".</td></tr><tr><td>10</td><td>Se invoca "Notificar Resultado de Aprobación por Correo" (CU1-6).</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2, 7</td><td>Si no existen solicitudes pendientes, se muestra un mensaje indicándolo.</td></tr><tr><td>5, 10</td><td>Si el envío de correo falla, la decisión ya quedó registrada; el sistema reintenta el envío y deja evidencia en el registro de trazabilidad (RF-5-3).</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda en estado "Aprobado" (puede iniciar sesión) o "Rechazado" (permanece sin acceso), y el usuario recibió la notificación correspondiente. |
| **Comentarios** | Incluye siempre a CU1-6, ya que la notificación es obligatoria (RF-2-1-3, RF-2-2-3) tanto para el flujo de estudiante como el de tutor. |

<br>

#### CU1-4 Iniciar Sesión

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Iniciar Sesión |
| **Actores** | Estudiante, Tutor, Administrador (iniciadores) |
| **Propósito** | Permitir a un usuario registrado y aprobado acceder a las funcionalidades correspondientes a su rol. |
| **Resumen** | El usuario ingresa correo y contraseña. El sistema valida las credenciales contra el valor encriptado almacenado y, según el estado de la cuenta, otorga o deniega el acceso. Si el usuario autenticado es Administrador, se extiende con la validación de segundo factor (CU1-5). |
| **Condiciones previas** | El usuario debe tener una cuenta registrada. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El usuario ingresa correo y contraseña en la vista de inicio de sesión.</td></tr><tr><td>2</td><td>El sistema valida las credenciales comparando la contraseña encriptada.</td></tr><tr><td>3</td><td>Si las credenciales son correctas y la cuenta está "Aprobada", se otorga acceso a la vista principal según el rol.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si las credenciales son incorrectas, se muestra un mensaje de error genérico sin revelar cuál dato falló.</td></tr><tr><td>3</td><td>Si la cuenta está "Pendiente de aprobación", se deniega el acceso mostrando "Su cuenta está pendiente de aprobación".</td></tr><tr><td>3</td><td>Si la cuenta está "Dado de baja" o "Rechazada", se deniega el acceso con un mensaje claro de la causa.</td></tr></table> |
| **Condiciones posteriores** | El usuario queda autenticado con una sesión activa y acceso restringido a las vistas de su rol (RF-5-1), o permanece sin acceso con un mensaje explicativo. |
| **Comentarios** | La vista de inicio de sesión incluye un enlace visible al formulario de registro para usuarios no registrados (RF-1-3-3). Para el Administrador, este caso de uso es extendido obligatoriamente por CU1-5. |

<br>

#### CU1-5 Validar Segundo Factor de Autenticación

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Validar Segundo Factor de Autenticación |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Reforzar la seguridad del acceso administrativo exigiendo un segundo factor basado en un archivo de clave. |
| **Resumen** | Tras superar la primera validación de credenciales, el sistema exige al Administrador subir un archivo con una segunda contraseña, distinta de la primera, antes de otorgar acceso al panel administrativo. |
| **Condiciones previas** | El Administrador debe haber superado exitosamente el primer paso de autenticación (CU1-4). |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El sistema redirige al Administrador a la vista de segundo factor.</td></tr><tr><td>2</td><td>El Administrador sube el archivo `auth2-ayd1.txt`.</td></tr><tr><td>3</td><td>El sistema valida el nombre del archivo y lee la contraseña contenida en él.</td></tr><tr><td>4</td><td>El sistema compara la contraseña leída (encriptada) contra la almacenada como segundo factor.</td></tr><tr><td>5</td><td>Si coincide, se otorga acceso completo al panel administrativo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el nombre del archivo no coincide con el esperado, se rechaza y se solicita nuevamente.</td></tr><tr><td>4</td><td>Si la contraseña del segundo factor no coincide, se deniega el acceso y no se completa la sesión administrativa.</td></tr></table> |
| **Condiciones posteriores** | El Administrador obtiene acceso a las vistas principales del módulo Administrador solo si ambas validaciones fueron exitosas. |
| **Comentarios** | Requisito proveniente de HU-004. No está mencionado explícitamente en `RF-1-3-2`; se recomienda actualizar ese RF para reflejarlo (ver sección 11). |

<br>

#### CU1-6 Notificar Resultado de Aprobación por Correo

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Notificar Resultado de Aprobación por Correo |
| **Actores** | *(funcionalidad interna del sistema, invocada por CU1-3, no requiere actor externo)* |
| **Propósito** | Informar automáticamente al estudiante o tutor si su solicitud de registro fue aprobada o rechazada. |
| **Resumen** | Una vez el Administrador toma una decisión sobre una solicitud, el sistema arma y envía un correo electrónico al usuario correspondiente indicando el resultado. |
| **Condiciones previas** | Debe existir una decisión (aprobación o rechazo) recién registrada sobre una cuenta. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>Se identifica el correo del usuario afectado por la decisión (RR-8: solo al usuario legítimamente involucrado).</td></tr><tr><td>2</td><td>Se compone el mensaje según el resultado (aprobado/rechazado).</td></tr><tr><td>3</td><td>Se envía el correo electrónico.</td></tr><tr><td>4</td><td>Se registra el evento en la bitácora de trazabilidad (RF-5-3, RR-19).</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si el servicio de correo falla, se reintenta el envío y se deja constancia del intento fallido en el registro.</td></tr></table> |
| **Condiciones posteriores** | El usuario recibe la notificación con el resultado de su solicitud. |

<br>

#### CU1-7 Gestionar Perfil Propio

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Gestionar Perfil Propio |
| **Actores** | Estudiante, Tutor (iniciadores) |
| **Propósito** | Permitir a un usuario autenticado consultar y actualizar sus propios datos personales/profesionales. |
| **Resumen** | El usuario accede a su perfil, visualiza sus datos actuales y puede editar los campos permitidos, incluyendo un cambio opcional de contraseña. El correo electrónico permanece bloqueado en todos los casos. |
| **Condiciones previas** | El usuario debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El usuario accede a "Mi Perfil".</td></tr><tr><td>2</td><td>Se muestran sus datos actuales, con el campo de correo deshabilitado (RR-17).</td></tr><tr><td>3</td><td>El usuario edita los campos deseados (dirección, teléfono, especialidad, horarios base, etc. según su rol).</td></tr><tr><td>4</td><td>Si desea cambiar la contraseña, la ingresa y el sistema valida su complejidad (RR-6).</td></tr><tr><td>5</td><td>Se guardan los cambios y la nueva contraseña se almacena encriptada.</td></tr><tr><td>6</td><td>Se confirma la actualización exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si la nueva contraseña no cumple los requisitos mínimos, se muestran los criterios faltantes y no se guarda el cambio.</td></tr></table> |
| **Condiciones posteriores** | Los datos del perfil quedan actualizados; el correo electrónico permanece sin cambios. |

---

### **CUN-02 CONFIGURAR HORARIOS Y DISPONIBILIDAD**

#### CU2-1 Configurar Horario de Atención

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Configurar Horario de Atención |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor definir o modificar los días y el rango horario en que atenderá tutorías. |
| **Resumen** | El tutor selecciona los días de la semana y una franja horaria uniforme de atención. Si se trata de una modificación sobre un horario existente, el sistema valida primero que no existan sesiones activas en conflicto (CU2-2). |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a "Configurar Horario".</td></tr><tr><td>2</td><td>Selecciona los días de atención y la hora de inicio y fin.</td></tr><tr><td colspan="2">**Si es una modificación:**</td></tr><tr><td>3</td><td>Se invoca "Validar Conflictos con Sesiones Activas" (CU2-2).</td></tr><tr><td>4</td><td>Si no hay conflictos, se guarda el nuevo horario y se actualiza la disponibilidad visible para los estudiantes.</td></tr><tr><td>5</td><td>Se confirma la actualización exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si CU2-2 detecta conflictos, se impide la actualización y se muestra un mensaje indicando que debe reprogramar o cancelar las sesiones en conflicto primero (RR-11).</td></tr></table> |
| **Condiciones posteriores** | El horario del tutor queda guardado y visible para la consulta de los estudiantes (RF-3-1-2). |

<br>

#### CU2-2 Validar Conflictos con Sesiones Activas

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Validar Conflictos con Sesiones Activas |
| **Actores** | *(funcionalidad interna, invocada por CU2-1 al modificar un horario)* |
| **Propósito** | Evitar que un tutor modifique su disponibilidad dejando fuera de rango a sesiones ya programadas. |
| **Resumen** | Se consultan las sesiones activas del tutor y se contrasta cada una contra el nuevo rango horario propuesto. |
| **Condiciones previas** | Debe existir un horario nuevo propuesto por el tutor. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>Se obtienen todas las sesiones activas/programadas del tutor.</td></tr><tr><td>2</td><td>Se compara la fecha/hora de cada sesión contra el nuevo rango horario propuesto.</td></tr><tr><td>3</td><td>Si ninguna sesión queda fuera de rango, se retorna validación exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si al menos una sesión queda fuera del nuevo rango, se retorna la lista de sesiones en conflicto.</td></tr></table> |
| **Condiciones posteriores** | Se informa a CU2-1 si la actualización puede proceder o debe bloquearse. |

---

### **CUN-03 BUSCAR TUTORES Y PROGRAMAR SESIONES**

#### CU3-1 Buscar y Filtrar Tutores

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Buscar y Filtrar Tutores |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante explorar el catálogo de tutores aprobados y localizar rápidamente al que mejor se ajuste a sus necesidades. |
| **Resumen** | El estudiante consulta el catálogo de tutores con su información principal, y puede aplicar filtros por materia, universidad, experiencia, género y edad. |
| **Condiciones previas** | El estudiante debe estar autenticado y aprobado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede al catálogo de tutores.</td></tr><tr><td>2</td><td>Se muestran tarjetas con nombre, especialidad, dirección de tutoría y fotografía de cada tutor aprobado, excluyendo a los tutores con los que ya tiene una sesión activa (RF-4-1, HU-017).</td></tr><tr><td>3</td><td>El estudiante aplica filtros (materia, universidad, experiencia, género, edad).</td></tr><tr><td>4</td><td>El sistema retorna la lista filtrada con el mismo formato.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si no hay coincidencias, se muestra un mensaje amigable indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza el catálogo (completo o filtrado) de tutores disponibles. |
| **Comentarios** | Puede extenderse con "Consultar Disponibilidad de Tutor" (CU3-2) al seleccionar un tutor específico. |

<br>

#### CU3-2 Consultar Disponibilidad de Tutor

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Disponibilidad de Tutor |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Mostrar al estudiante los horarios libres y ocupados de un tutor específico en una fecha determinada. |
| **Resumen** | El estudiante selecciona un tutor y una fecha; el sistema muestra los días de atención del tutor y clasifica visualmente los horarios como libres u ocupados. |
| **Condiciones previas** | El tutor consultado debe tener un horario de atención configurado (CU2-1). |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante selecciona un tutor (desde CU3-1 o desde CU3-3).</td></tr><tr><td>2</td><td>Se muestran los días de atención y la franja horaria general del tutor.</td></tr><tr><td>3</td><td>El estudiante ingresa una fecha específica.</td></tr><tr><td>4</td><td>El sistema clasifica los horarios de esa fecha como libres u ocupados.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si la fecha corresponde a un día en que el tutor no atiende, se notifica claramente al estudiante.</td></tr></table> |
| **Condiciones posteriores** | El estudiante conoce los horarios disponibles del tutor para la fecha consultada. |

<br>

#### CU3-3 Programar Sesión de Tutoría

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Programar Sesión de Tutoría |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante agendar formalmente una sesión con un tutor disponible. |
| **Resumen** | El estudiante completa fecha, hora, materia y motivo. El sistema valida disponibilidad (incluyendo CU3-2), que no exista ya una sesión activa con el mismo tutor y que no haya traslapes con otras sesiones del estudiante, antes de confirmar. |
| **Condiciones previas** | El tutor debe estar aprobado y tener horario configurado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante selecciona un tutor y una materia dentro de sus especialidades.</td></tr><tr><td>2</td><td>Se invoca "Consultar Disponibilidad de Tutor" (CU3-2) para la fecha elegida.</td></tr><tr><td>3</td><td>El estudiante selecciona hora e ingresa el motivo de la sesión.</td></tr><tr><td>4</td><td>El sistema valida que el horario esté libre.</td></tr><tr><td>5</td><td>El sistema valida que el estudiante no tenga ya una sesión activa con ese mismo tutor.</td></tr><tr><td>6</td><td>El sistema valida que no exista traslape con otras sesiones del estudiante en esa fecha/hora.</td></tr><tr><td>7</td><td>Se crea la sesión asociada al estudiante, tutor y materia correspondientes (RF-4-2-3).</td></tr><tr><td>8</td><td>Se confirma la programación exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si el horario ya no está disponible, se muestra el mensaje de error correspondiente.</td></tr><tr><td>5</td><td>Si ya existe una sesión activa con ese tutor, se rechaza con un mensaje específico.</td></tr><tr><td>6</td><td>Si hay traslape con otra sesión, se rechaza con un mensaje específico.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda registrada en estado "Pendiente", asociada a estudiante, tutor, materia, fecha y hora. |

---

### **CUN-04 ATENDER Y REGISTRAR RETROALIMENTACIÓN**

#### CU4-1 Consultar Sesiones Pendientes

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Sesiones Pendientes |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor organizar su jornada visualizando sus tutorías por atender. |
| **Resumen** | El tutor consulta el listado de sesiones pendientes, ordenadas cronológicamente por fecha más cercana, con los datos principales de cada una. |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a su página principal.</td></tr><tr><td>2</td><td>Se muestra la lista de sesiones en estado "Pendiente" ordenadas por fecha más próxima, indicando fecha, hora, nombre del estudiante, materia y motivo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones pendientes, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El tutor visualiza su agenda de sesiones pendientes. |
| **Comentarios** | Desde cada sesión de esta lista, el tutor puede extender el flujo hacia "Atender Sesión y Registrar Resumen" (CU4-2). |

<br>

#### CU4-2 Atender Sesión y Registrar Resumen

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Atender Sesión y Registrar Resumen |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor cerrar formalmente una tutoría, dejando constancia de lo impartido. |
| **Resumen** | El tutor selecciona "Atender" sobre una sesión pendiente e ingresa obligatoriamente un resumen estructurado. El sistema cambia el estado de la sesión y guarda el resumen para el historial. |
| **Condiciones previas** | La sesión debe estar en estado "Pendiente". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor presiona "Atender" sobre una sesión pendiente.</td></tr><tr><td>2</td><td>Se despliega el formulario de resumen.</td></tr><tr><td>3</td><td>El tutor ingresa el resumen de la sesión (obligatorio).</td></tr><tr><td>4</td><td>El tutor confirma.</td></tr><tr><td>5</td><td>El sistema cambia el estado de la sesión a "Atendida" y guarda el resumen.</td></tr><tr><td>6</td><td>La sesión se remueve de la lista de pendientes y queda disponible en el historial.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si el resumen no se ingresa, el sistema impide confirmar y señala el campo obligatorio.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Atendida", con el resumen accesible en el historial del tutor (CU6-3) y del estudiante (CU6-2). |

---

### **CUN-05 CANCELAR SESIONES Y NOTIFICAR**

#### CU5-1 Cancelar Sesión (Estudiante)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Cancelar Sesión (Estudiante) |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante liberar el horario de una sesión que ya no podrá o desea asistir. |
| **Resumen** | El estudiante selecciona "Cancelar" sobre una sesión activa; el sistema solicita confirmación y, al aceptar, actualiza el estado de la sesión y libera el horario en la agenda del tutor. |
| **Condiciones previas** | Debe existir una sesión activa (pendiente) del estudiante (ver CU6-1). |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante presiona "Cancelar" sobre una sesión activa.</td></tr><tr><td>2</td><td>El sistema solicita confirmación explícita mediante un modal.</td></tr><tr><td>3</td><td>El estudiante confirma.</td></tr><tr><td>4</td><td>El sistema actualiza el estado de la sesión a "Cancelada por el estudiante".</td></tr><tr><td>5</td><td>El horario correspondiente se libera en la agenda del tutor.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el estudiante no confirma, el sistema retorna sin realizar cambios.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Cancelada por el estudiante" y disponible en el historial (CU6-2). |

<br>

#### CU5-2 Cancelar Sesión (Tutor)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Cancelar Sesión (Tutor) |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor cancelar una sesión programada por imprevistos, notificando al estudiante afectado. |
| **Resumen** | El tutor cancela una sesión pendiente; el sistema pide confirmación, actualiza el estado, libera el horario y envía automáticamente un correo de disculpa al estudiante. |
| **Condiciones previas** | La sesión debe estar en estado "Pendiente". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor presiona "Cancelar" sobre una sesión pendiente.</td></tr><tr><td>2</td><td>El sistema solicita confirmación.</td></tr><tr><td>3</td><td>El tutor confirma.</td></tr><tr><td>4</td><td>El sistema actualiza el estado de la sesión a "Cancelada por el tutor" y la remueve de la lista de pendientes.</td></tr><tr><td>5</td><td>Se libera el horario correspondiente en la agenda del tutor.</td></tr><tr><td>6</td><td>El sistema envía un correo automático al estudiante con fecha, hora, motivo de la sesión, nombre del tutor, materia y un mensaje explícito de disculpa (RF-3-2-5).</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el tutor no confirma, el sistema retorna sin realizar cambios.</td></tr><tr><td>6</td><td>Si el envío del correo falla, se reintenta y se deja constancia en el registro de trazabilidad.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Cancelada por el tutor"; el estudiante fue notificado por correo. |

---

### **CUN-06 CONSULTAR HISTORIAL Y SESIONES**

#### CU6-1 Consultar Sesiones Activas

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Sesiones Activas |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante dar seguimiento a sus próximas tutorías agendadas. |
| **Resumen** | El estudiante consulta la lista de sus sesiones aún no atendidas, con acceso directo a la cancelación individual. |
| **Condiciones previas** | El estudiante debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede a "Mis Sesiones Activas".</td></tr><tr><td>2</td><td>Se muestran las sesiones pendientes con fecha, hora, nombre del tutor, materia, dirección de tutoría y motivo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones activas, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza sus compromisos académicos vigentes. |

<br>

#### CU6-2 Consultar Historial de Sesiones (Estudiante)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Historial de Sesiones (Estudiante) |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante revisar sus tutorías pasadas y los resúmenes recibidos. |
| **Resumen** | El estudiante consulta el historial de sesiones atendidas y canceladas, con distinción visual por estado. |
| **Condiciones previas** | El estudiante debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede a "Historial de Tutorías".</td></tr><tr><td>2</td><td>Se muestran las sesiones atendidas o canceladas, con fecha, tutor, materia, motivo, dirección de tutoría, estado y el resumen (visible solo si fue "Atendida").</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones en el historial, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza su actividad académica pasada. |

<br>

#### CU6-3 Consultar Historial de Sesiones (Tutor)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Historial de Sesiones (Tutor) |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor llevar control de su actividad académica pasada. |
| **Resumen** | El tutor consulta el historial de sesiones atendidas y canceladas, ordenadas de la más reciente a la más antigua, con diferenciación visual por estado. |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a "Historial de Sesiones".</td></tr><tr><td>2</td><td>Se muestran las sesiones no activas ordenadas de la más reciente a la más antigua, con fecha, hora, nombre del estudiante y estado (Atendida, Cancelada por estudiante, Cancelada por tutor).</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones en el historial, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El tutor visualiza su historial completo de actividad. |

---

### **CUN-07 GESTIONAR USUARIOS Y GENERAR REPORTES**

#### CU7-1 Dar de Baja Usuario

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Dar de Baja Usuario |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador retirar del sistema a estudiantes o tutores que incumplan las políticas de la institución. |
| **Resumen** | El Administrador consulta el listado de estudiantes o tutores aprobados, selecciona uno y ejecuta la baja ingresando una justificación obligatoria. El sistema pide confirmación, actualiza el estado y notifica al usuario afectado. |
| **Condiciones previas** | Debe existir al menos un estudiante o tutor en estado "Aprobado". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td colspan="2">**Flujo Estudiante:**</td></tr><tr><td>1</td><td>El Administrador accede a "Estudiantes Aprobados" (RF-2-3-1).</td></tr><tr><td>2</td><td>Selecciona "Dar de baja" sobre un estudiante.</td></tr><tr><td>3</td><td>El sistema solicita confirmación y una justificación obligatoria (RR-9).</td></tr><tr><td>4</td><td>El Administrador confirma e ingresa la justificación.</td></tr><tr><td>5</td><td>El sistema cambia el estado del estudiante a "Dado de baja", impidiéndole el acceso.</td></tr><tr><td>6</td><td>Se envía un correo automático notificando la baja.</td></tr><tr><td colspan="2">**Flujo Tutor:**</td></tr><tr><td>7</td><td>El Administrador accede a "Tutores Aprobados" (RF-2-3-2).</td></tr><tr><td>8</td><td>Selecciona "Dar de baja" sobre un tutor.</td></tr><tr><td>9</td><td>El sistema solicita confirmación y una justificación obligatoria (RR-9).</td></tr><tr><td>10</td><td>El Administrador confirma e ingresa la justificación.</td></tr><tr><td>11</td><td>El sistema cambia el estado del tutor a "Dado de baja", impidiéndole el acceso.</td></tr><tr><td>12</td><td>Se envía un correo automático notificando la baja.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3, 9</td><td>Si el Administrador no ingresa justificación, el sistema impide continuar.</td></tr><tr><td>4, 10</td><td>Si el Administrador cancela, el sistema retorna sin cambios.</td></tr></table> |
| **Condiciones posteriores** | El usuario afectado queda en estado "Dado de baja", sin acceso a la plataforma, y fue notificado por correo. La acción queda registrada con trazabilidad (RR-19). |

<br>

#### CU7-2 Generar Reportes Analíticos

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Generar Reportes Analíticos |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Proveer al Administrador indicadores en tiempo real sobre el uso de la plataforma para apoyar decisiones estratégicas. |
| **Resumen** | El Administrador accede al módulo de reportes y visualiza al menos dos reportes: tutores con más sesiones atendidas, y materias con mayor demanda, calculados con datos en tiempo real. |
| **Condiciones previas** | El Administrador debe estar autenticado (incluye 2FA). Deben existir sesiones registradas en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al módulo de Reportes.</td></tr><tr><td>2</td><td>El sistema consulta en tiempo real las sesiones registradas (RF-2-4-2).</td></tr><tr><td>3</td><td>Se genera el Reporte 1: tutores con más estudiantes atendidos.</td></tr><tr><td>4</td><td>Se genera el Reporte 2: materias/especialidades con mayor demanda de sesiones.</td></tr><tr><td>5</td><td>Se despliegan ambas visualizaciones en el dashboard.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen datos suficientes, se muestra un mensaje indicando que aún no hay información para generar métricas.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza indicadores actualizados sobre tutores y materias con mayor actividad. |

---