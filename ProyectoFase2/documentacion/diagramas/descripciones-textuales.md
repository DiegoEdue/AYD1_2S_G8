## Descripciones textuales

### **CUN-01 GESTIONAR CUENTA Y ACCESO**

#### CU1-1 Registrar Estudiante

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Registrar Estudiante |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir que una persona no registrada cree una cuenta de estudiante para poder solicitar tutorías. |
| **Resumen** | El aspirante completa un formulario con sus datos personales y credenciales, y adjunta su fotografía reciente y su carnet universitario escaneado en PDF. El sistema valida los archivos, la unicidad del correo y del carnet y la complejidad de la contraseña, almacena la cuenta en estado "Pendiente de aprobación" y sin correo verificado, y dispara el envío del token de verificación. |
| **Condiciones previas** | El correo electrónico y el carnet no deben existir previamente en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El aspirante selecciona "Registrarme como Estudiante".</td></tr><tr><td>2</td><td>Se muestra el formulario con: nombre, apellido, carnet, género (valores permitidos por el sistema), dirección, teléfono, fecha de nacimiento, correo, contraseña, fotografía reciente (obligatoria) y carnet universitario escaneado en PDF (obligatorio).</td></tr><tr><td>3</td><td>El aspirante completa los campos y adjunta la fotografía y el archivo PDF del carnet.</td></tr><tr><td>4</td><td>El sistema valida que ambos archivos hayan sido adjuntados, que la fotografía sea una imagen y el carnet un archivo .pdf, y que no superen el tamaño máximo permitido.</td></tr><tr><td>5</td><td>El sistema valida que el correo y el carnet no existan previamente.</td></tr><tr><td>6</td><td>El sistema valida que la contraseña cumpla mínimo 8 caracteres, mayúscula, minúscula y número.</td></tr><tr><td>7</td><td>El sistema almacena la contraseña encriptada y los archivos, y crea la cuenta en estado "Pendiente de aprobación" y sin correo verificado.</td></tr><tr><td>8</td><td>Se invoca "Enviar Token de Verificación por Correo".</td></tr><tr><td>9</td><td>Se confirma al aspirante que su solicitud quedó registrada y que su cuenta debe ser aprobada por el Administrador y su correo verificado antes de poder ingresar.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si falta la fotografía o el carnet en PDF, el sistema impide continuar y señala el campo requerido; si el formato de un archivo no es válido, se rechaza indicando el formato esperado.</td></tr><tr><td>5</td><td>Si el correo o carnet ya existen, se muestra el mensaje correspondiente y no se crea la cuenta.</td></tr><tr><td>6</td><td>Si la contraseña no cumple los requisitos, se listan los criterios faltantes.</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda registrada en estado "Pendiente de aprobación" y sin correo verificado, sin acceso a la plataforma hasta que el Administrador la apruebe y el usuario verifique su correo. |
| **Comentarios** | Incluye siempre a CU1-8, ya que el token de verificación se envía en todo registro exitoso (HU-030). |

<br>

#### CU1-2 Registrar Tutor

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Registrar Tutor |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir que un profesional postule su perfil como tutor de la plataforma. |
| **Resumen** | El aspirante a tutor completa un formulario más extenso que el del estudiante, incluyendo datos profesionales, fotografía obligatoria y CV obligatorio en PDF. El sistema valida los archivos, la unicidad de datos clave y almacena la cuenta como "Pendiente de aprobación" y sin correo verificado, y dispara el envío del token de verificación. |
| **Condiciones previas** | El correo electrónico y el número de identificación de tutor no deben existir previamente en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El aspirante selecciona "Registrarme como Tutor".</td></tr><tr><td>2</td><td>Se muestra el formulario con: nombre, apellido, carnet/ID, fecha de nacimiento, género (valores permitidos por el sistema), dirección, teléfono, fotografía (obligatoria), CV en PDF (obligatorio), número de identificación de tutor, una o más materias de especialidad, dirección de tutoría (Física u Online, según lista restringida), correo, año de inicio de tutorías, universidad de graduación y contraseña.</td></tr><tr><td>3</td><td>El aspirante completa el formulario y adjunta la fotografía y el archivo PDF con su CV.</td></tr><tr><td>4</td><td>El sistema valida que ambos archivos hayan sido adjuntados, que la fotografía sea una imagen y el CV un archivo .pdf, y que no superen el tamaño máximo permitido.</td></tr><tr><td>5</td><td>El sistema valida que el correo y el número de identificación de tutor no existan previamente.</td></tr><tr><td>6</td><td>El sistema valida la complejidad de la contraseña y la almacena encriptada.</td></tr><tr><td>7</td><td>La cuenta se crea en estado "Pendiente de aprobación" y sin correo verificado, junto con los archivos adjuntos.</td></tr><tr><td>8</td><td>Se invoca "Enviar Token de Verificación por Correo".</td></tr><tr><td>9</td><td>Se confirma al aspirante que su solicitud quedó registrada y que su cuenta debe ser aprobada por el Administrador y su correo verificado antes de poder ingresar.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si no se adjunta la fotografía o el CV en PDF, el sistema impide continuar y señala el campo requerido.</td></tr><tr><td>4</td><td>Si el formato de un archivo no es válido o supera el tamaño máximo, se rechaza indicando el motivo.</td></tr><tr><td>5</td><td>Si el correo o el número de identificación de tutor ya existen, se muestra el mensaje correspondiente.</td></tr><tr><td>6</td><td>Si la contraseña no cumple los requisitos mínimos, se listan los criterios faltantes.</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda registrada en estado "Pendiente de aprobación" y sin correo verificado, para revisión del Administrador y verificación del correo. |
| **Comentarios** | Incluye siempre a CU1-8, ya que el token de verificación se envía en todo registro exitoso (HU-030). |

<br>

#### CU1-3 Aprobar/Rechazar Registro

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Aprobar/Rechazar Registro |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador validar las solicitudes de registro de estudiantes y tutores antes de otorgarles acceso a la plataforma. |
| **Resumen** | El Administrador consulta por separado la lista de estudiantes y de tutores pendientes, revisa los datos principales de cada solicitud junto con su documento PDF en un visor embebido y decide aprobarla o rechazarla. Tras la decisión se dispara la notificación por correo al solicitante. |
| **Condiciones previas** | El Administrador debe estar autenticado. Debe existir al menos una solicitud en estado "Pendiente de aprobación". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td colspan="2">**Flujo Estudiantes:**</td></tr><tr><td>1</td><td>El Administrador accede a "Solicitudes de Estudiantes Pendientes".</td></tr><tr><td>2</td><td>Se muestra la lista con fotografía (o imagen por defecto), nombre completo, carnet, género, fecha de nacimiento y correo.</td></tr><tr><td>3</td><td>Se invoca "Visualizar Documentos PDF del Solicitante" para mostrar el carnet escaneado en un visor embebido.</td></tr><tr><td>4</td><td>El Administrador presiona "Aceptar" o "Rechazar" sobre un registro.</td></tr><tr><td>5</td><td>El sistema actualiza el estado de la cuenta a "Aprobado" o "Rechazado".</td></tr><tr><td>6</td><td>Se invoca "Notificar Resultado de Aprobación por Correo".</td></tr><tr><td colspan="2">**Flujo Tutores:**</td></tr><tr><td>7</td><td>El Administrador accede a "Solicitudes de Tutores Pendientes".</td></tr><tr><td>8</td><td>Se muestra la lista con fotografía, nombre completo, carnet/ID, género, especialidad, número de identificación de tutor y correo.</td></tr><tr><td>9</td><td>Se invoca "Visualizar Documentos PDF del Solicitante" para mostrar el CV en un visor embebido.</td></tr><tr><td>10</td><td>El Administrador presiona "Aceptar" o "Rechazar" sobre un registro.</td></tr><tr><td>11</td><td>El sistema actualiza el estado de la cuenta a "Aprobado" o "Rechazado".</td></tr><tr><td>12</td><td>Se invoca "Notificar Resultado de Aprobación por Correo".</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2, 8</td><td>Si no existen solicitudes pendientes, se muestra un mensaje indicándolo.</td></tr><tr><td>6, 12</td><td>Si el envío de correo falla, la decisión ya quedó persistida y no se revierte; el fallo queda registrado para soporte.</td></tr></table> |
| **Condiciones posteriores** | La cuenta queda en estado "Aprobado" (podrá iniciar sesión una vez verifique su correo) o "Rechazado" (permanece sin acceso), y el usuario recibió la notificación correspondiente. |
| **Comentarios** | Incluye siempre a CU1-6, ya que la notificación es obligatoria (RF-2-1-3, RF-2-2-3) tanto para el flujo de estudiante como el de tutor, y a CU1-10, ya que la revisión del documento PDF forma parte de la evaluación de la solicitud. |

<br>

#### CU1-4 Iniciar Sesión

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Iniciar Sesión |
| **Actores** | Estudiante, Tutor, Administrador (iniciadores) |
| **Propósito** | Permitir a un usuario registrado y aprobado acceder a las funcionalidades correspondientes a su rol. |
| **Resumen** | El estudiante o tutor ingresa correo y contraseña; el administrador ingresa nombre de usuario y contraseña. El sistema valida las credenciales contra el valor encriptado almacenado y, según el estado de la cuenta, otorga o deniega el acceso. En el primer acceso de estudiantes y tutores se extiende con la verificación del correo mediante token; si el usuario autenticado es Administrador, se extiende con la validación de segundo factor. |
| **Condiciones previas** | El usuario debe tener una cuenta registrada. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El usuario ingresa sus credenciales en la vista de inicio de sesión: correo y contraseña (estudiante y tutor) o nombre de usuario y contraseña (administrador).</td></tr><tr><td>2</td><td>El sistema valida las credenciales comparando la contraseña encriptada.</td></tr><tr><td>3</td><td>Para estudiantes y tutores, el sistema valida que la cuenta esté "Aprobada".</td></tr><tr><td>4</td><td>Si es el primer acceso de un estudiante o tutor con correo aún no verificado, se invoca "Verificar Correo con Token". Si el usuario es Administrador, se invoca "Validar Segundo Factor de Autenticación".</td></tr><tr><td>5</td><td>Si las credenciales son correctas, la cuenta está aprobada y, según corresponda, el correo fue verificado o el segundo factor fue validado, se otorga acceso a la vista principal según el rol.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si las credenciales son incorrectas, se muestra un mensaje de error genérico sin revelar cuál dato falló.</td></tr><tr><td>3</td><td>Si la cuenta está "Pendiente de aprobación", se deniega el acceso mostrando "Su cuenta está pendiente de aprobación".</td></tr><tr><td>3</td><td>Si la cuenta está "Rechazada", se deniega el acceso con un mensaje claro de la causa.</td></tr></table> |
| **Condiciones posteriores** | El usuario queda autenticado con una sesión activa y acceso restringido a las vistas de su rol, o permanece sin acceso con un mensaje explicativo. |
| **Comentarios** | La vista de inicio de sesión incluye un enlace visible al formulario de registro para usuarios no registrados (RF-1-3-3). Este caso de uso es extendido por CU1-9 únicamente en el primer acceso de estudiantes y tutores, y por CU1-5 para el Administrador. |

<br>

#### CU1-5 Validar Segundo Factor de Autenticación

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Validar Segundo Factor de Autenticación |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Reforzar la seguridad del acceso administrativo exigiendo un segundo factor basado en un código TOTP. |
| **Resumen** | Tras superar la primera validación de credenciales, el sistema exige al Administrador un código TOTP de seis dígitos generado por su aplicación autenticadora antes de emitir la sesión autenticada y otorgar acceso al panel administrativo. En la configuración inicial, el Administrador vincula su aplicación autenticadora mediante un código QR. |
| **Condiciones previas** | El Administrador debe haber superado exitosamente el primer paso de autenticación. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El sistema redirige al Administrador a la vista de segundo factor.</td></tr><tr><td>2</td><td>Si es la configuración inicial, el sistema muestra un código QR para que el Administrador vincule su aplicación autenticadora.</td></tr><tr><td>3</td><td>El Administrador ingresa el código TOTP de seis dígitos.</td></tr><tr><td>4</td><td>El sistema valida el código contra el secreto TOTP almacenado cifrado.</td></tr><tr><td>5</td><td>Si el código es válido, se emite la sesión autenticada y se otorga acceso completo al panel administrativo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3, 4</td><td>Si el código TOTP es inválido, se deniega el acceso y no se emite la sesión administrativa.</td></tr></table> |
| **Condiciones posteriores** | El Administrador obtiene acceso a las vistas principales del módulo Administrador solo si ambas validaciones (credenciales y código TOTP) fueron exitosas. |
| **Comentarios** | Requisito según RF-1-3-5, RR-4, RR-24 y EAC-9. El Administrador no puede acceder a las rutas protegidas solo con usuario y contraseña. |

<br>

#### CU1-6 Notificar Resultado de Aprobación por Correo

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Notificar Resultado de Aprobación por Correo |
| **Actores** | *(funcionalidad interna del sistema, invocada por CU1-3, no requiere actor externo)* |
| **Propósito** | Informar automáticamente al estudiante o tutor si su solicitud de registro fue aprobada o rechazada. |
| **Resumen** | Una vez el Administrador toma una decisión sobre una solicitud, el sistema arma y envía un correo electrónico al usuario correspondiente indicando el resultado. |
| **Condiciones previas** | Debe existir una decisión (aprobación o rechazo) recién registrada sobre una cuenta. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>Se identifica el correo del usuario afectado por la decisión, de modo que la notificación llegue únicamente a quien está involucrado.</td></tr><tr><td>2</td><td>Se compone el mensaje según el resultado (aprobado/rechazado).</td></tr><tr><td>3</td><td>Se envía el correo electrónico.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si el servicio de correo falla, la decisión ya persistida no se revierte y el fallo queda registrado para soporte.</td></tr></table> |
| **Condiciones posteriores** | El usuario recibe la notificación con el resultado de su solicitud. |

<br>

#### CU1-7 Gestionar Perfil Propio

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Gestionar Perfil Propio |
| **Actores** | Estudiante, Tutor (iniciadores) |
| **Propósito** | Permitir a un usuario autenticado consultar y actualizar sus propios datos personales/profesionales. |
| **Resumen** | El usuario accede a su perfil, visualiza sus datos actuales y puede editar los campos permitidos, incluyendo su fotografía y un cambio opcional de contraseña. El correo electrónico permanece bloqueado en todos los casos y, en el caso del tutor, también su número de identificación de tutor. |
| **Condiciones previas** | El usuario debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El usuario accede a "Mi Perfil".</td></tr><tr><td>2</td><td>Se muestran sus datos actuales, con el campo de correo deshabilitado y, para el tutor, el número de identificación de tutor protegido contra edición.</td></tr><tr><td>3</td><td>El usuario edita los campos deseados (dirección, teléfono, especialidad, horarios base, etc. según su rol) y, si lo desea, actualiza su fotografía.</td></tr><tr><td>4</td><td>Si desea cambiar la contraseña, la ingresa (el estudiante debe proporcionar además su contraseña actual) y el sistema valida su complejidad.</td></tr><tr><td>5</td><td>Se guardan los cambios y la nueva contraseña se almacena encriptada.</td></tr><tr><td>6</td><td>Se confirma la actualización exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si la nueva contraseña no cumple los requisitos mínimos, se muestran los criterios faltantes y no se guarda el cambio.</td></tr><tr><td>4</td><td>Si el estudiante no proporciona su contraseña actual o esta es incorrecta, no se guarda el cambio de contraseña.</td></tr></table> |
| **Condiciones posteriores** | Los datos del perfil quedan actualizados; el correo electrónico permanece sin cambios. |

<br>

#### CU1-8 Enviar Token de Verificación por Correo

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Enviar Token de Verificación por Correo |
| **Actores** | *(funcionalidad interna del sistema, invocada por CU1-1 y CU1-2, no requiere actor externo)* |
| **Propósito** | Enviar al nuevo usuario un token para que verifique la autenticidad de su dirección de correo electrónico. |
| **Resumen** | Una vez completado el registro de un estudiante o tutor, el sistema genera un token único asociado al usuario y le envía un correo institucional de "EduConnect" que lo contiene. |
| **Condiciones previas** | Debe haberse completado exitosamente el registro de un estudiante o de un tutor. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El sistema genera un token único (código de seis dígitos) asociado al usuario y registra su fecha de emisión.</td></tr><tr><td>2</td><td>El sistema compone el correo institucional del remitente "EduConnect" con el logo de la plataforma, un mensaje breve de bienvenida, el token de verificación e instrucciones claras sobre cómo proceder.</td></tr><tr><td>3</td><td>El sistema envía el correo a la dirección registrada.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si el servicio de correo falla, la cuenta ya registrada se conserva y el fallo queda registrado para soporte; el usuario podrá solicitar el reenvío del código en su primer inicio de sesión.</td></tr></table> |
| **Condiciones posteriores** | El usuario recibe el token de verificación, que deberá ingresar en su primer inicio de sesión. |
| **Comentarios** | Se modela como <<include>> de CU1-1 y CU1-2 porque ocurre siempre en ambos registros. |

<br>

#### CU1-9 Verificar Correo con Token

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Verificar Correo con Token |
| **Actores** | Estudiante, Tutor (iniciadores) |
| **Propósito** | Garantizar la autenticidad del correo electrónico del usuario exigiendo el token de verificación en su primer inicio de sesión. |
| **Resumen** | En el primer inicio de sesión, además de correo y contraseña, el sistema solicita el token recibido por correo. El acceso solo se concede si la cuenta fue aprobada por el Administrador y el token es válido. Una vez verificado, los inicios de sesión posteriores solo requieren correo y contraseña. |
| **Condiciones previas** | El usuario debe tener una cuenta registrada, con token de verificación emitido y correo aún no verificado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>Durante el primer inicio de sesión, el sistema solicita el correo, la contraseña y el token de verificación.</td></tr><tr><td>2</td><td>El usuario ingresa el token recibido por correo.</td></tr><tr><td>3</td><td>El sistema valida que la cuenta haya sido aprobada por el Administrador y que el token ingresado sea válido y no hayan transcurrido más de 24 horas desde su emisión.</td></tr><tr><td>4</td><td>El sistema marca el correo como verificado y otorga acceso según el rol.</td></tr><tr><td>5</td><td>En los inicios de sesión posteriores solo se solicitan correo y contraseña.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si la cuenta aún no fue aprobada, no se permite el acceso y se muestra un mensaje explicativo.</td></tr><tr><td>3</td><td>Si el token es incorrecto o venció, no se permite el acceso y se muestra un mensaje indicando qué falta; el usuario puede solicitar el reenvío del código.</td></tr></table> |
| **Condiciones posteriores** | El correo del usuario queda verificado y este accede a las vistas de su rol, o permanece sin acceso con un mensaje explicativo. |
| **Comentarios** | Se modela como <<extend>> de CU1-4 porque solo aplica a estudiantes y tutores en su primer acceso. |

<br>

#### CU1-10 Visualizar Documentos PDF del Solicitante

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Visualizar Documentos PDF del Solicitante |
| **Actores** | Administrador (a través de la revisión de solicitudes de registro) |
| **Propósito** | Permitir al Administrador verificar el documento de respaldo de una solicitud sin necesidad de descargar archivos. |
| **Resumen** | Al revisar una solicitud pendiente, el sistema muestra el documento PDF adjunto (carnet escaneado del estudiante o CV del tutor) en un visor embebido en la página web. |
| **Condiciones previas** | El Administrador debe estar autenticado y debe existir una solicitud en estado "Pendiente de aprobación" con su documento PDF adjunto. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El sistema obtiene el documento PDF de la solicitud seleccionada (carnet escaneado en el caso del estudiante, CV en el caso del tutor) mediante una ruta segura.</td></tr><tr><td>2</td><td>El sistema muestra el documento en un visor de PDF embebido, directamente en la página y sin necesidad de descargarlo.</td></tr><tr><td>3</td><td>El Administrador revisa el documento junto con los datos principales de la solicitud.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1-3</td><td>No se identifican cursos alternativos: el documento PDF es obligatorio en el registro.</td></tr></table> |
| **Condiciones posteriores** | El Administrador cuenta con el documento visualizado para decidir si aprueba o rechaza la solicitud. |
| **Comentarios** | Se modela como <<include>> de CU1-3 porque forma parte de la revisión de la solicitud (HU-038, HU-039). |


---

### **CUN-02 CONFIGURAR HORARIOS Y DISPONIBILIDAD**

#### CU2-1 Configurar Horario de Atención

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Configurar Horario de Atención |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor definir o modificar los días y el rango horario en que atenderá tutorías. |
| **Resumen** | El tutor selecciona los días de la semana y una franja horaria uniforme de atención. Si se trata de una modificación sobre un horario existente, el sistema valida primero que no existan sesiones activas en conflicto. |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a "Configurar Horario".</td></tr><tr><td>2</td><td>Selecciona los días de atención y la hora de inicio y fin.</td></tr><tr><td colspan="2">**Si es una modificación:**</td></tr><tr><td>3</td><td>Se invoca "Validar Conflictos con Sesiones Activas".</td></tr><tr><td>4</td><td>Si no hay conflictos, se guarda el nuevo horario y se actualiza la disponibilidad visible para los estudiantes.</td></tr><tr><td>5</td><td>Se confirma la actualización exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si CU2-2 detecta conflictos, se impide la actualización y se muestra un mensaje que identifica las sesiones en conflicto e indica que debe reprogramarlas o cancelarlas primero.</td></tr></table> |
| **Condiciones posteriores** | El horario del tutor queda guardado y visible para la consulta de los estudiantes. |

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
| **Comentarios** | Se modela como <<extend>> de CU2-1, ya que solo se ejecuta cuando se modifica un horario ya existente. |


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
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede al catálogo de tutores.</td></tr><tr><td>2</td><td>Se muestran tarjetas con nombre completo, especialidad (materias), dirección de tutoría y fotografía de cada tutor aprobado, excluyendo a los tutores con los que ya tiene una sesión activa.</td></tr><tr><td>3</td><td>El estudiante aplica filtros (materia, universidad de graduación, experiencia mínima, género, rango de edad).</td></tr><tr><td>4</td><td>El sistema retorna la lista filtrada con el mismo formato.</td></tr></table> |
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
| **Condiciones previas** | El tutor consultado debe tener un horario de atención configurado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante selecciona un tutor.</td></tr><tr><td>2</td><td>Se muestran los días de atención y la franja horaria general del tutor.</td></tr><tr><td>3</td><td>El estudiante ingresa una fecha específica.</td></tr><tr><td>4</td><td>El sistema clasifica los horarios de esa fecha como libres u ocupados.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si la fecha corresponde a un día en que el tutor no atiende, se notifica claramente al estudiante.</td></tr></table> |
| **Condiciones posteriores** | El estudiante conoce los horarios disponibles del tutor para la fecha consultada. |

<br>

#### CU3-3 Programar Sesión de Tutoría

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Programar Sesión de Tutoría |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante agendar formalmente una sesión con un tutor disponible. |
| **Resumen** | El estudiante completa fecha, hora, materia y motivo. El sistema valida la disponibilidad del tutor, que no exista ya una sesión activa con el mismo tutor y que no haya traslapes con otras sesiones del estudiante, antes de confirmar. |
| **Condiciones previas** | El tutor debe estar aprobado y tener horario configurado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante selecciona un tutor y una materia dentro de las que imparte ese tutor.</td></tr><tr><td>2</td><td>Se invoca "Consultar Disponibilidad de Tutor" para la fecha elegida.</td></tr><tr><td>3</td><td>El estudiante selecciona hora e ingresa el motivo de la sesión.</td></tr><tr><td>4</td><td>El sistema valida que la fecha esté dentro de los días de atención del tutor y que el horario esté libre.</td></tr><tr><td>5</td><td>El sistema valida que el estudiante no tenga ya una sesión activa con ese mismo tutor.</td></tr><tr><td>6</td><td>El sistema valida que no exista traslape con otras sesiones del estudiante en esa fecha/hora.</td></tr><tr><td>7</td><td>Se crea la sesión asociada al estudiante, tutor y materia correspondientes.</td></tr><tr><td>8</td><td>Se confirma la programación exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4</td><td>Si la fecha está fuera de los días de atención, la materia no corresponde al tutor o el horario ya no está disponible, se muestra el mensaje de error con el motivo del rechazo.</td></tr><tr><td>5</td><td>Si ya existe una sesión activa con ese tutor, se rechaza con un mensaje específico.</td></tr><tr><td>6</td><td>Si hay traslape con otra sesión, se rechaza con un mensaje específico.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda registrada en estado "Pendiente", asociada a estudiante, tutor, materia, fecha, hora y motivo. |
| **Comentarios** | Incluye a CU3-2 (<<include>>) para la consulta de disponibilidad. |


---

### **CUN-04 GESTIONAR CICLO DE VIDA DE SESIONES**

#### CU4-1 Consultar Sesiones Pendientes

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Sesiones Pendientes |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor organizar su jornada visualizando sus tutorías por atender. |
| **Resumen** | El tutor consulta el listado de sesiones pendientes, ordenadas cronológicamente por fecha más cercana, con los datos principales de cada una. |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a su página principal.</td></tr><tr><td>2</td><td>Se muestra la lista de sesiones en estado "Pendiente" ordenadas por fecha más próxima, indicando fecha, hora, nombre completo del estudiante, materia y motivo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones pendientes, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El tutor visualiza su agenda de sesiones pendientes. |
| **Comentarios** | Desde cada sesión de esta lista, el tutor puede extender el flujo hacia "Atender Sesión y Registrar Plan de Estudio" (CU4-2). |

<br>

#### CU4-2 Atender Sesión y Registrar Plan de Estudio

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Atender Sesión y Registrar Plan de Estudio |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor cerrar formalmente una tutoría, dejando constancia del plan de estudio resultante. |
| **Resumen** | El tutor selecciona "Atender" sobre una sesión pendiente e ingresa un plan de estudio estructurado: las dificultades identificadas (obligatorias) y uno o más recursos recomendados. El sistema cambia el estado de la sesión y guarda el plan para el historial y la consulta del estudiante. |
| **Condiciones previas** | La sesión debe estar en estado "Pendiente". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor presiona "Atender" sobre una sesión pendiente.</td></tr><tr><td>2</td><td>Se despliega el formulario estructurado del plan de estudio.</td></tr><tr><td>3</td><td>El tutor ingresa las dificultades identificadas (obligatorio), describiendo los temas complejos detectados.</td></tr><tr><td>4</td><td>El tutor agrega uno o más recursos recomendados, especificando para cada uno: nombre, tipo (Texto, Video, PDF, Enlace) y descripción de uso.</td></tr><tr><td>5</td><td>El tutor confirma.</td></tr><tr><td>6</td><td>El sistema cambia el estado de la sesión a "Atendida" y guarda el plan de estudio (dificultades y recursos recomendados).</td></tr><tr><td>7</td><td>La sesión se remueve de la lista de pendientes y queda disponible en el historial con su plan completo.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si no se ingresan las dificultades identificadas, el sistema impide confirmar y señala el campo obligatorio.</td></tr><tr><td>4</td><td>Si no se agrega al menos un recurso recomendado, o a algún recurso le falta nombre, tipo o descripción de uso, el sistema impide confirmar y señala el dato faltante.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Atendida", con el plan de estudio accesible en los historiales del tutor y del estudiante y en el plan de estudio del estudiante. Desde ese momento la sesión puede ser calificada y reportada por ambos participantes. |
| **Comentarios** | Se modela como <<extend>> de CU4-1: se ejecuta sobre una sesión de la lista de pendientes. |

<br>

#### CU4-3 Cancelar Sesión (Estudiante)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Cancelar Sesión (Estudiante) |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante liberar el horario de una sesión que ya no podrá o desea asistir. |
| **Resumen** | El estudiante selecciona "Cancelar" sobre una sesión activa; el sistema solicita confirmación y, al aceptar, actualiza el estado de la sesión y libera el horario en la agenda del tutor. |
| **Condiciones previas** | Debe existir una sesión activa (pendiente) del estudiante. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante presiona "Cancelar" sobre una sesión activa.</td></tr><tr><td>2</td><td>El sistema solicita confirmación explícita mediante un modal.</td></tr><tr><td>3</td><td>El estudiante confirma.</td></tr><tr><td>4</td><td>El sistema actualiza el estado de la sesión a "Cancelada por el estudiante".</td></tr><tr><td>5</td><td>El horario correspondiente se libera en la agenda del tutor.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el estudiante no confirma, el sistema retorna sin realizar cambios.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Cancelada por el estudiante" y disponible en el historial. |

<br>

#### CU4-4 Cancelar Sesión (Tutor)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Cancelar Sesión (Tutor) |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor cancelar una sesión programada por imprevistos, notificando al estudiante afectado. |
| **Resumen** | El tutor cancela una sesión pendiente; el sistema pide confirmación, actualiza el estado, libera el horario y envía automáticamente un correo de disculpa al estudiante. |
| **Condiciones previas** | La sesión debe estar en estado "Pendiente". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor presiona "Cancelar" sobre una sesión pendiente.</td></tr><tr><td>2</td><td>El sistema solicita confirmación.</td></tr><tr><td>3</td><td>El tutor confirma.</td></tr><tr><td>4</td><td>El sistema actualiza el estado de la sesión a "Cancelada por el tutor" y la remueve de la lista de pendientes.</td></tr><tr><td>5</td><td>Se libera el horario correspondiente en la agenda del tutor.</td></tr><tr><td>6</td><td>El sistema envía un correo automático al estudiante con fecha, hora, motivo de la sesión, nombre del tutor, materia y un mensaje explícito de disculpa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el tutor no confirma, el sistema retorna sin realizar cambios.</td></tr><tr><td>6</td><td>Si el envío del correo falla, la cancelación ya persistida no se revierte y el fallo queda registrado para soporte.</td></tr></table> |
| **Condiciones posteriores** | La sesión queda en estado "Cancelada por el tutor"; el estudiante fue notificado por correo y la sesión está disponible en el historial. |

<br>

#### CU4-5 Consultar Sesiones Activas

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Sesiones Activas |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante dar seguimiento a sus próximas tutorías agendadas. |
| **Resumen** | El estudiante consulta la lista de sus sesiones aún no atendidas, con acceso directo a la cancelación individual. |
| **Condiciones previas** | El estudiante debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede a "Mis Sesiones Activas".</td></tr><tr><td>2</td><td>Se muestran las sesiones pendientes con fecha, hora, nombre del tutor, materia, dirección de tutoría, motivo y estado actual.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones activas, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza sus compromisos académicos vigentes. |
| **Comentarios** | Desde cada sesión de esta lista el estudiante puede cancelarla (CU4-3). |

<br>

#### CU4-6 Consultar Historial de Sesiones (Estudiante)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Historial de Sesiones (Estudiante) |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante revisar sus tutorías pasadas y los planes de estudio recibidos, y calificar o reportar al tutor cuando corresponda. |
| **Resumen** | El estudiante consulta el historial de sesiones atendidas y canceladas, con distinción visual por estado. En las sesiones atendidas accede a su plan de estudio y a las opciones de calificar o reportar al tutor. |
| **Condiciones previas** | El estudiante debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede a "Historial de Tutorías".</td></tr><tr><td>2</td><td>Se muestran las sesiones atendidas o canceladas, con fecha, tutor, materia, motivo, dirección de tutoría y estado (Atendida, Cancelada por el estudiante o Cancelada por el tutor, identificando quién canceló cuando corresponda).</td></tr><tr><td>3</td><td>En las sesiones "Atendidas" se habilita el acceso al plan de estudio y las opciones "Calificar Tutor" y "Reportar Tutor"; en las sesiones canceladas estas opciones no se habilitan.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones en el historial, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza su actividad académica pasada. |

<br>

#### CU4-7 Consultar Historial de Sesiones (Tutor)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Historial de Sesiones (Tutor) |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor llevar control de su actividad académica pasada y calificar o reportar al estudiante cuando corresponda. |
| **Resumen** | El tutor consulta el historial de sesiones atendidas y canceladas, ordenadas de la más reciente a la más antigua, con diferenciación visual por estado. En las sesiones atendidas accede a las opciones de calificar o reportar al estudiante. |
| **Condiciones previas** | El tutor debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El tutor accede a "Historial de Sesiones".</td></tr><tr><td>2</td><td>Se muestran las sesiones no activas ordenadas de la más reciente a la más antigua, con fecha, hora, nombre del estudiante y estado (Atendida, Cancelada por estudiante, Cancelada por tutor).</td></tr><tr><td>3</td><td>En las sesiones "Atendidas" se habilitan las opciones "Calificar Estudiante" y "Reportar Estudiante"; en las sesiones canceladas estas opciones no se habilitan.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no hay sesiones en el historial, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El tutor visualiza su historial completo de actividad. |

<br>

#### CU4-8 Consultar Plan de Estudio

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Plan de Estudio |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante revisar de forma estructurada las dificultades identificadas y los recursos recomendados por sus tutores. |
| **Resumen** | El estudiante accede a un apartado dedicado a su plan de estudio, donde visualiza, agrupado por tutoría, el detalle del plan registrado por el tutor al atender cada sesión. |
| **Condiciones previas** | El estudiante debe estar autenticado y tener al menos una sesión en estado "Atendida" con plan de estudio registrado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante accede a "Mi Plan de Estudio".</td></tr><tr><td>2</td><td>El sistema muestra su plan de estudio activo agrupado por tutoría, con: fecha de la última sesión, nombre completo del tutor, especialidad del tutor y número de identificación del tutor.</td></tr><tr><td>3</td><td>Se muestra la lista de "Dificultades Identificadas" registradas durante la tutoría.</td></tr><tr><td>4</td><td>Se muestran los "Recursos Recomendados", indicando para cada uno: nombre, tipo (Texto, Video, PDF, Enlace) y descripción de uso.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el estudiante aún no tiene planes de estudio registrados, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El estudiante visualiza el detalle estructurado de sus planes de estudio. |
| **Comentarios** | Puede extenderse con "Descargar Constancia del Plan de Estudio (PDF)" (CU4-9). |

<br>

#### CU4-9 Descargar Constancia del Plan de Estudio (PDF)

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Descargar Constancia del Plan de Estudio (PDF) |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante contar con una constancia en PDF de la tutoría académica recibida. |
| **Resumen** | Desde su plan de estudio, el estudiante descarga un archivo PDF estructurado generado a partir de un plan de estudio propio. |
| **Condiciones previas** | El estudiante debe estar autenticado y estar consultando uno de sus planes de estudio. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El estudiante presiona "Descargar PDF" sobre un plan de estudio.</td></tr><tr><td>2</td><td>El sistema verifica que el plan pertenezca al estudiante autenticado.</td></tr><tr><td>3</td><td>El sistema genera el PDF con: encabezado (nombre de la plataforma EduConnect, fecha de emisión y teléfono de contacto), cuerpo con una tabla de los recursos recomendados (nombre, tipo y descripción de uso) y pie de página con la firma digital emulada del tutor (nombre completo, especialidad y número de identificación).</td></tr><tr><td>4</td><td>El sistema entrega el archivo PDF para su descarga.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si el plan no pertenece al estudiante autenticado, el sistema rechaza la solicitud y no genera la constancia.</td></tr></table> |
| **Condiciones posteriores** | El estudiante obtiene la constancia en PDF del plan de estudio. |
| **Comentarios** | Se modela como <<extend>> de CU4-8: es una acción opcional sobre el plan consultado. |


---

### **CUN-05 GESTIONAR USUARIOS Y REPORTES**

#### CU5-1 Dar de Baja Usuario

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Dar de Baja Usuario |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador retirar del sistema a estudiantes o tutores que incumplan las políticas de la institución. |
| **Resumen** | El Administrador consulta el listado de estudiantes o tutores aprobados, selecciona uno y ejecuta la baja, con un motivo opcional. El sistema pide confirmación, elimina la cuenta junto con sus registros asociados e intenta notificar al usuario afectado por correo. También puede ejecutarse como resolución de una denuncia. |
| **Condiciones previas** | Debe existir al menos un estudiante o tutor en estado "Aprobado". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td colspan="2">**Flujo Estudiante:**</td></tr><tr><td>1</td><td>El Administrador accede a "Estudiantes Aprobados".</td></tr><tr><td>2</td><td>Selecciona "Dar de baja" sobre un estudiante.</td></tr><tr><td>3</td><td>El sistema solicita confirmación y permite ingresar un motivo opcional; si no se ingresa, el servidor utiliza un texto predeterminado.</td></tr><tr><td>4</td><td>El Administrador confirma.</td></tr><tr><td>5</td><td>El sistema elimina la cuenta del estudiante y sus registros asociados (solicitudes, sesiones, calificaciones y denuncias), impidiéndole el acceso.</td></tr><tr><td>6</td><td>El sistema intenta enviar un correo automático notificando la baja.</td></tr><tr><td colspan="2">**Flujo Tutor:**</td></tr><tr><td>7</td><td>El Administrador accede a "Tutores Aprobados".</td></tr><tr><td>8</td><td>Selecciona "Dar de baja" sobre un tutor.</td></tr><tr><td>9</td><td>El sistema solicita confirmación y permite ingresar un motivo opcional; si no se ingresa, el servidor utiliza un texto predeterminado.</td></tr><tr><td>10</td><td>El Administrador confirma.</td></tr><tr><td>11</td><td>El sistema elimina la cuenta del tutor y sus registros asociados (solicitudes, sesiones, calificaciones, denuncias, materias y días de atención), impidiéndole el acceso.</td></tr><tr><td>12</td><td>El sistema intenta enviar un correo automático notificando la baja.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>4, 10</td><td>Si el Administrador cancela, el sistema retorna sin cambios.</td></tr><tr><td>6, 12</td><td>Si el envío del correo falla, la baja ya ejecutada no se revierte y el fallo queda registrado para soporte, dado que el envío depende de un servicio externo.</td></tr></table> |
| **Condiciones posteriores** | El usuario afectado y sus registros asociados son eliminados del sistema, por lo que no tiene acceso a la plataforma, y se intentó notificarlo por correo. |
| **Comentarios** | La acción es destructiva e irreversible para la información vinculada, por lo que siempre requiere confirmación previa (RR-25). Se modela como <<extend>> de CU5-7 y CU5-8: es la acción opcional de "Dar de baja" al resolver una denuncia. |

<br>

#### CU5-2 Editar Datos de Usuario

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Editar Datos de Usuario |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador mantener depurada la información de los estudiantes y tutores aprobados. |
| **Resumen** | El Administrador consulta la lista de estudiantes o tutores aprobados y modifica los datos permitidos de su perfil. El correo electrónico permanece bloqueado. |
| **Condiciones previas** | El Administrador debe estar autenticado y debe existir al menos un estudiante o tutor en estado "Aprobado". |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede a "Estudiantes Aprobados" o "Tutores Aprobados".</td></tr><tr><td>2</td><td>Selecciona "Editar" sobre un usuario.</td></tr><tr><td>3</td><td>Se muestra el formulario con los datos actuales y el campo de correo deshabilitado.</td></tr><tr><td>4</td><td>El Administrador modifica los campos permitidos.</td></tr><tr><td>5</td><td>El sistema valida y guarda los cambios.</td></tr><tr><td>6</td><td>Se confirma la actualización exitosa.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>5</td><td>Si el servidor rechaza datos que no cumplen las validaciones, se informa el motivo y no se guardan los cambios.</td></tr></table> |
| **Condiciones posteriores** | Los datos del usuario quedan actualizados; el correo electrónico permanece sin cambios. |

<br>

#### CU5-3 Calificar Atención del Tutor

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Calificar Atención del Tutor |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante retroalimentar la calidad del servicio académico recibido. |
| **Resumen** | Desde el historial, el estudiante califica al tutor de una sesión atendida con una puntuación de 0 a 5 estrellas y un comentario opcional. |
| **Condiciones previas** | El estudiante debe estar autenticado y la sesión debe estar en estado "Atendida", pertenecer al estudiante y no haber sido calificada previamente. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En "Historial de Tutorías", el estudiante selecciona "Calificar Tutor" sobre una sesión atendida.</td></tr><tr><td>2</td><td>Se muestra el formulario con la puntuación de 0 a 5 estrellas y un comentario opcional.</td></tr><tr><td>3</td><td>El estudiante asigna la puntuación, escribe el comentario si lo desea y confirma.</td></tr><tr><td>4</td><td>El sistema valida que la sesión esté atendida, pertenezca al estudiante y no haya sido calificada.</td></tr><tr><td>5</td><td>El sistema registra la calificación y confirma la operación.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En sesiones canceladas o activas la opción de calificar no se habilita.</td></tr><tr><td>4</td><td>Si la sesión ya fue calificada, el sistema rechaza la solicitud: no se permite calificar dos veces la misma sesión.</td></tr></table> |
| **Condiciones posteriores** | La calificación queda registrada y se considera en el promedio del tutor. |

<br>

#### CU5-4 Calificar Estudiante

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Calificar Estudiante |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor mantener un registro del comportamiento académico del estudiante en la plataforma. |
| **Resumen** | Desde el historial, el tutor califica al estudiante de una sesión atendida con una puntuación de 0 a 5 estrellas y un comentario obligatorio. |
| **Condiciones previas** | El tutor debe estar autenticado y la sesión debe estar en estado "Atendida" y pertenecer al tutor. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En "Historial de Sesiones", el tutor selecciona "Calificar Estudiante" sobre una sesión atendida.</td></tr><tr><td>2</td><td>Se muestra el formulario con la puntuación de 0 a 5 estrellas y un comentario explicativo obligatorio.</td></tr><tr><td>3</td><td>El tutor asigna la puntuación, escribe el comentario y confirma.</td></tr><tr><td>4</td><td>El sistema valida que la sesión esté atendida y pertenezca al tutor.</td></tr><tr><td>5</td><td>El sistema registra la calificación y confirma la operación.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En sesiones canceladas o activas la opción de calificar no se habilita.</td></tr><tr><td>3</td><td>Si no se ingresa el comentario, el sistema impide confirmar y señala el campo obligatorio.</td></tr></table> |
| **Condiciones posteriores** | La calificación queda registrada y se considera en el promedio del estudiante. |

<br>

#### CU5-5 Reportar Tutor

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Reportar Tutor |
| **Actores** | Estudiante (iniciador) |
| **Propósito** | Permitir al estudiante denunciar faltas o conductas inapropiadas de un tutor para que la administración tome medidas. |
| **Resumen** | Desde el historial, el estudiante reporta al tutor de una sesión atendida seleccionando una categoría predefinida y describiendo los hechos. El reporte queda pendiente para revisión del Administrador. |
| **Condiciones previas** | El estudiante debe estar autenticado y la sesión debe estar en estado "Atendida" y pertenecer al estudiante. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En "Historial de Tutorías", el estudiante selecciona "Reportar Tutor" sobre una sesión atendida.</td></tr><tr><td>2</td><td>Se muestra el formulario con un desplegable de categorías predefinidas y un área de texto obligatoria para detallar el motivo.</td></tr><tr><td>3</td><td>El estudiante selecciona la categoría, describe los hechos y confirma.</td></tr><tr><td>4</td><td>El sistema valida que la sesión esté atendida, pertenezca al estudiante y que la categoría pertenezca al conjunto permitido.</td></tr><tr><td>5</td><td>El sistema registra el reporte en estado "Pendiente" y lo pone a disposición del Administrador.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En sesiones canceladas o activas la opción de reportar no se habilita.</td></tr><tr><td>3</td><td>Si no se selecciona la categoría o no se describe el motivo, el sistema impide confirmar y señala el campo requerido.</td></tr></table> |
| **Condiciones posteriores** | El reporte queda registrado, asociado a la sesión y a las personas correspondientes, y pendiente de revisión administrativa. |

<br>

#### CU5-6 Reportar Estudiante

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Reportar Estudiante |
| **Actores** | Tutor (iniciador) |
| **Propósito** | Permitir al tutor denunciar indisciplina o faltas graves de un estudiante para que la administración aplique las sanciones pertinentes. |
| **Resumen** | Desde el historial, el tutor reporta al estudiante de una sesión atendida seleccionando una categoría predefinida y describiendo los hechos. El reporte queda pendiente para revisión del Administrador. |
| **Condiciones previas** | El tutor debe estar autenticado y la sesión debe estar en estado "Atendida" y pertenecer al tutor. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En "Historial de Sesiones", el tutor selecciona "Reportar Estudiante" sobre una sesión atendida.</td></tr><tr><td>2</td><td>Se muestra el formulario con una lista de categorías predefinidas y un área para detallar los hechos.</td></tr><tr><td>3</td><td>El tutor selecciona la categoría, describe los hechos y confirma.</td></tr><tr><td>4</td><td>El sistema valida que la sesión esté atendida, pertenezca al tutor y que la categoría pertenezca al conjunto permitido.</td></tr><tr><td>5</td><td>El sistema registra el reporte en estado "Pendiente" y lo pone a disposición del Administrador.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>En sesiones canceladas o activas la opción de reportar no se habilita.</td></tr><tr><td>3</td><td>Si no se selecciona la categoría o no se describen los hechos, el sistema impide confirmar y señala el campo requerido.</td></tr></table> |
| **Condiciones posteriores** | El reporte queda registrado, asociado a la sesión y a las personas correspondientes, y pendiente de revisión administrativa. |

<br>

#### CU5-7 Gestionar Reportes contra Tutores

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Gestionar Reportes contra Tutores |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador evaluar las denuncias de estudiantes contra tutores para sancionarlas o descartarlas. |
| **Resumen** | El Administrador consulta las denuncias presentadas contra tutores y resuelve cada una pendiente dando de baja al tutor denunciado o rechazando la denuncia. |
| **Condiciones previas** | El Administrador debe estar autenticado. Debe existir al menos una denuncia contra un tutor. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede a "Reportes de Tutores".</td></tr><tr><td>2</td><td>Se muestra la tabla con: categoría, motivo/explicación, sesión relacionada, nombre completo del tutor reportado, nombre completo del estudiante denunciante, fecha y estado.</td></tr><tr><td>3</td><td>El Administrador selecciona "Dar de baja al tutor" o "Rechazar denuncia" sobre una denuncia pendiente.</td></tr><tr><td>4</td><td>Si elige dar de baja, se invoca "Dar de Baja Usuario" sobre el tutor denunciado, con un motivo opcional.</td></tr><tr><td>5</td><td>Si elige rechazar, la denuncia pasa a estado "Descartada".</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen denuncias contra tutores, se muestra un mensaje indicándolo.</td></tr><tr><td>3</td><td>Si la denuncia ya fue resuelta, el sistema no la procesa nuevamente.</td></tr></table> |
| **Condiciones posteriores** | La denuncia queda con un único estado final: el tutor denunciado fue dado de baja o la denuncia fue descartada. |
| **Comentarios** | CU5-1 extiende este caso de uso: la baja es la acción opcional al resolver la denuncia. |

<br>

#### CU5-8 Gestionar Reportes contra Estudiantes

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Gestionar Reportes contra Estudiantes |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador revisar los reportes de tutores contra estudiantes para determinar si ameritan la baja del usuario. |
| **Resumen** | El Administrador consulta las denuncias presentadas contra estudiantes y resuelve cada una pendiente dando de baja al estudiante denunciado o rechazando la denuncia. |
| **Condiciones previas** | El Administrador debe estar autenticado. Debe existir al menos una denuncia contra un estudiante. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede a "Reportes de Estudiantes".</td></tr><tr><td>2</td><td>Se muestra la tabla con: categoría, motivo/explicación, sesión relacionada, nombre completo del estudiante reportado, nombre completo del tutor denunciante, fecha y estado.</td></tr><tr><td>3</td><td>El Administrador selecciona "Dar de baja al estudiante" o "Rechazar denuncia" sobre una denuncia pendiente.</td></tr><tr><td>4</td><td>Si elige dar de baja, se invoca "Dar de Baja Usuario" sobre el estudiante denunciado, con un motivo opcional.</td></tr><tr><td>5</td><td>Si elige rechazar, la denuncia pasa a estado "Descartada".</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen denuncias contra estudiantes, se muestra un mensaje indicándolo.</td></tr><tr><td>3</td><td>Si la denuncia ya fue resuelta, el sistema no la procesa nuevamente.</td></tr></table> |
| **Condiciones posteriores** | La denuncia queda con un único estado final: el estudiante denunciado fue dado de baja o la denuncia fue descartada. |
| **Comentarios** | CU5-1 extiende este caso de uso: la baja es la acción opcional al resolver la denuncia. |

<br>

#### CU5-9 Consultar Calificaciones de Tutores

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Calificaciones de Tutores |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador identificar a los tutores mejor y peor evaluados según la percepción de los estudiantes. |
| **Resumen** | El Administrador consulta el reporte general de calificaciones de los tutores, con el promedio de estrellas calculado a partir de las evaluaciones de los estudiantes. |
| **Condiciones previas** | El Administrador debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al reporte "Calificación de Tutores".</td></tr><tr><td>2</td><td>El sistema calcula al momento de la consulta el promedio de las calificaciones recibidas por cada tutor.</td></tr><tr><td>3</td><td>Se muestra la lista de tutores activos con: nombre completo, especialidad, promedio de calificación (0 a 5 estrellas) y cantidad de evaluaciones.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si no existen calificaciones registradas, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza el desempeño promedio de cada tutor. |

<br>

#### CU5-10 Consultar Calificaciones de Estudiantes

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Consultar Calificaciones de Estudiantes |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Permitir al Administrador monitorear la conducta de los estudiantes en las tutorías, identificando a los problemáticos o ejemplares. |
| **Resumen** | El Administrador consulta el reporte general de calificaciones de los estudiantes, con el promedio de estrellas calculado a partir de las evaluaciones de los tutores. |
| **Condiciones previas** | El Administrador debe estar autenticado. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al reporte "Calificación de Estudiantes".</td></tr><tr><td>2</td><td>El sistema calcula al momento de la consulta el promedio de las calificaciones recibidas por cada estudiante.</td></tr><tr><td>3</td><td>Se muestra la tabla de estudiantes activos con: nombre completo, promedio de calificación (0 a 5 estrellas) y cantidad de evaluaciones.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>3</td><td>Si no existen calificaciones registradas, se muestra un mensaje indicándolo.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza el desempeño promedio de cada estudiante. |


---

### **CUN-06 GENERAR REPORTES**

#### CU6-1 Generar Reporte de Tutores con Más Estudiantes Atendidos

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Generar Reporte de Tutores con Más Estudiantes Atendidos |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Proveer al Administrador indicadores sobre el uso de la plataforma para apoyar decisiones estratégicas. |
| **Resumen** | El Administrador visualiza el reporte de los tutores con más estudiantes atendidos, calculado con los datos al momento de la consulta. |
| **Condiciones previas** | El Administrador debe estar autenticado (incluye segundo factor). Deben existir sesiones registradas en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al módulo de Reportes.</td></tr><tr><td>2</td><td>El sistema consulta las sesiones registradas y calcula al momento de la consulta los tutores con más estudiantes atendidos.</td></tr><tr><td>3</td><td>Se despliega el reporte en forma de tabla o gráfico en el dashboard.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen datos suficientes, se muestra un mensaje indicando que aún no hay información para generar la métrica.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza un indicador actualizado sobre los tutores con mayor actividad. |
| **Comentarios** | Reporte de la fase 1, que se mantiene operativo (HU-046). |

<br>

#### CU6-2 Generar Reporte de Materias con Mayor Demanda

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Generar Reporte de Materias con Mayor Demanda |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Proveer al Administrador indicadores sobre el uso de la plataforma para apoyar decisiones estratégicas. |
| **Resumen** | El Administrador visualiza el reporte de las materias o especialidades con mayor demanda de sesiones, calculado con los datos al momento de la consulta. |
| **Condiciones previas** | El Administrador debe estar autenticado (incluye segundo factor). Deben existir sesiones registradas en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al módulo de Reportes.</td></tr><tr><td>2</td><td>El sistema consulta las sesiones registradas y calcula al momento de la consulta las materias con mayor demanda de sesiones.</td></tr><tr><td>3</td><td>Se despliega el reporte en forma de tabla o gráfico en el dashboard.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen datos suficientes, se muestra un mensaje indicando que aún no hay información para generar la métrica.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza un indicador actualizado sobre las materias con mayor demanda. |
| **Comentarios** | Reporte de la fase 1, que se mantiene operativo (HU-046). |

<br>

#### CU6-3 Generar Reporte de Cancelaciones por Materia

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Generar Reporte de Cancelaciones por Materia |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Proveer al Administrador indicadores sobre el uso de la plataforma para apoyar decisiones estratégicas. |
| **Resumen** | El Administrador visualiza el reporte de las cancelaciones de sesiones por materia, calculado con los datos al momento de la consulta. |
| **Condiciones previas** | El Administrador debe estar autenticado (incluye segundo factor). Deben existir sesiones registradas en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al módulo de Reportes.</td></tr><tr><td>2</td><td>El sistema consulta las sesiones canceladas y calcula al momento de la consulta las cancelaciones por materia.</td></tr><tr><td>3</td><td>Se despliega el reporte en forma de tabla o componente gráfico en el dashboard.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen datos suficientes, se muestra un mensaje indicando que aún no hay información para generar la métrica.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza un indicador actualizado sobre las cancelaciones por materia. |
| **Comentarios** | Reporte incorporado en la fase 2 (HU-046). |

<br>

#### CU6-4 Generar Reporte de Horarios con Mayor Demanda

| Campo | Descripción |
|-------|-------------|
| **Nombre del caso de uso** | Generar Reporte de Horarios con Mayor Demanda |
| **Actores** | Administrador (iniciador) |
| **Propósito** | Proveer al Administrador indicadores sobre el uso de la plataforma para apoyar decisiones estratégicas. |
| **Resumen** | El Administrador visualiza el reporte de las franjas horarias con mayor demanda de sesiones, calculado con los datos al momento de la consulta. |
| **Condiciones previas** | El Administrador debe estar autenticado (incluye segundo factor). Deben existir sesiones registradas en el sistema. |
| **Secuencia normal** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>1</td><td>El Administrador accede al módulo de Reportes.</td></tr><tr><td>2</td><td>El sistema consulta las sesiones registradas y calcula al momento de la consulta las franjas horarias con mayor demanda.</td></tr><tr><td>3</td><td>Se despliega el reporte en forma de tabla o componente gráfico en el dashboard.</td></tr></table> |
| **Excepciones / Cursos alternativos** | <table><tr><th>Pasos</th><th>Acción</th></tr><tr><td>2</td><td>Si no existen datos suficientes, se muestra un mensaje indicando que aún no hay información para generar la métrica.</td></tr></table> |
| **Condiciones posteriores** | El Administrador visualiza un indicador actualizado sobre los horarios con mayor demanda. |
| **Comentarios** | Reporte incorporado en la fase 2 (HU-046). |


---