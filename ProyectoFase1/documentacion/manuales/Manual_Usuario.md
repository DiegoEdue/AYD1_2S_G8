# Manual de usuario - EduConnect

---

## 1. Introducción

EduConnect es una aplicación web para la gestión de tutorías académicas, la cual facilita la comunicación entre tutores y estudiantes. Ya que permite la reserva, gestión y seguimiento de sesiones de tutorías de fomra eficiente.

La interfaz está pensada para dos perfiles principales:

- Estudiante: Busca tutores y gestiona sus sesiones.
- Tutor: Administra sus horarios y atiende estudiantes.
- Administrador: Revisa solicitudes, da de baja a estudiantes o tutores y gestiona reportes.

---

## 2. Requisitos y acceso

### Requisitos mínimos

- Navegador web moderno: Chrome, Edge, Brave.
- Conexión a Internet para cargar la aplicación.
- Dirección de correo válida.

### Acceso como tutor o estudiante

1. En el navegador ponga la dirección **http://localhost:3000**.
2. En la pantalla de rediccionará al login para acceder al dashboard.
3. Ingrese su correo electrónico y contraseña.
4. El sistema dirigirá automáticamente al usuario según su rol:
   - Estudiante: a la sección de buscar tutores.
   - Tutor: a la sección de horarios.

![Login](./img/login.png)

## Acceso como administrador

1. En el navegador ponga la dirección **http://localhost:3000**.
2. En la pantalla de rediccionará al login para acceder al dashboard.
3. Ingrese su correo electrónico y contraseña.
4. El sistema dirigirá automáticamente a la verificación de dos pasos, en dicha sección la primera vez se debe de escanear un código qr o copiar y pegar el código que aparece resaltado en amarillo.
5. Si se vuelve a iniciar sesión, para la verificación de dos pasos será necesario introducir el código que aparece en tu aplicación de autenticación de confianza.

![Login](./img/login2.png)

![2FA](./img/segundo-factor.png)

![2FA2](./img/segundo-factor2.png)

---

## 3. Registro y autenticación

### Solicitar acceso

1. En la pantalla de login, haga clic en "Solicita tu registro".

2. Para una cuenta de estudiante llene el siguiente formulario:
   - Foto de perfil
   - Nombre
   - Apellido
   - Género
   - Dirección
   - Teléfono
   - Fecha de nacimiento
   - Correo electrónico
   - Contraseña (mínimo 8 caracteres)
   - Confirmación de la contraseña

3. Para una cuenta de estudiante llene el siguiente formulario:
   - Foto de perfil
   - Nombre
   - Apellido
   - Carnet o ID
   - Género
   - Dirección
   - Teléfono
   - Fecha de nacimiento
   - Correo electrónico
   - Especialidad(materias)
   - Número de identificación (DPI/ID)
   - Dirección de tutoría
   - Año de inicio de tutorías
   - Universidad de graduación
   - Contraseña (mínimo 8 caracteres)
   - Confirmación de la contraseña

4. Envíe la solicitud.

![Registro](./img/registro-estudiante.png)

![Registro2](./img/registro-tutor.png)
5. El sistema mostrará un mensaje confirmando que la solicitud fue enviada y quedará pendiente de revisión.

![Confirmacion](./img/visibilidad2.png)

### Inicio de sesión

- El usuario debe usar el correo asociado a la cuenta autorizada. De lo contrario dará error, para ver la solución a dicho error dirijase a la [Sección de errores](#8-solución-de-errores-cómunes)

![CredencialesIncorrectas](./img/error3.png)

- Si desea iniciar sesión como admin debe seleccionar la pestaña de admin para iniciar sesión como admin.

![Admin](./img/login2.png)

- Si las credenciales no coinciden, la aplicación muestra un mensaje de error y no permite continuar, para ver la solución a dicho error dirijase a la [Sección de errores](#8-solución-de-errores-cómunes)

---

## 4. Panel de estudiante

Una vez iniciada la sesión, el estudiante accede a un panel con navegación lateral y cabecera superior.

![Dashboard](./img/filtros-estudiante.png)

### Sidebar estudiante

- Búsqueda de tutores: vista principal con todas las tutores disponibles, con distintos filtros para hacer una búsqueda más específica. Y luego es necesario escoger un tutor, un día que tenga disponible, un horario libre y motivo de la tutoría.

![Busqueda](./img/filtros-estudiante.png)

![Busqueda](./img/tutor-estudiante.png)

- Mis sesiones: vista para ver las tutorías activas y poder cancelarlas si así lo requiere.

![Sesiones](./img/sesiones-estudiante.png)

- Historial: se ven las tutorías que ya fueron recibidas y las que fueron canceladas por mí o por el tutor.

![Historial](./img/historial-estudiante3.png)

- Perfil: actualización de datos correspondiente al perfil actual. Al actualizar datos es necesario seleccionar el botón de "Guardar cambios" para que no haya problema.

![Sesiones](./img/perfil-estudiante.png)

---

## 5. Panel de tutor

### Sidebar tutor

- Mis sesiones: vista para ver las tutorías activas, marcar como atendidas y poder cancelarlas si así lo requiere.

![Sesiones](./img/sesiones-tutor.png)

- Mis horarios: vista para asignar un horario predeterminado o también poder moficiar el ya existente.

![Horario](./img/horarios-tutor.png)

![Horario2](./img/horarios-tutor2.png)

- Historial: se ven las tutorías que ya fueron atendidas y las que fueron canceladas por mí o por el estudiante.

![Historial](./img/historial-tutor2.png)

- Perfil: actualización de datos correspondiente al perfil actual. Al actualizar datos es necesario seleccionar el botón de "Guardar cambios" para que no haya problema.

![Sesiones](./img/perfil-tutor.png)

---

## 6. Panel de Administrador

### Solicitudes de estudiantes y tutores

En esta sección es posible aceptar o rechazar a los estudiantes y tutores. Antes de rechazar es necesario escribir el motivo por el cual se rechaza.

![Solicitud1](./img/solicitudes-admin.png)
![Solicitud2](./img/solicitudes-admin2.png)
![Solicitud3](./img/solicitudes-admin3.png)

### Usuarios

En esta sección es posible dar de baja a los estudiantes y a los tutores. Antes de darlos de baja es necesario confirmar dicha acción, ya que no se puede revertir.

![Usuarios](./img/tutores-admin.png)

![Usuarios2](./img/usuarios-admin.png)

### Reportes

En esta sección se visualizan los reportes del sistema. Relacionados a las sesiones por estado (atendida, cancelada por el estudiante o cancelada por el tutor) y la demanda por materia (cantidad de estudiantes en cada materia).

![Reportes](./img/reportes-admin.png)

---

## 7. Recomendaciones de uso

- Complete correctamente sus datos de registro y espere la aprobación del administrador antes de intentar iniciar sesión como estudiante o tutor.
- Use un correo electrónico válido y accesible, ya que será el medio principal de comunicación, recuperación de acceso y notificaciones del sistema.
- Para administradores, mantenga segura la autenticación de dos factores: escanee el código QR en una app confiable y no comparta la clave de verificación.
- Antes de reservar una tutoría, confirme la disponibilidad del tutor, la fecha, el horario y el motivo de la sesión para evitar cancelaciones innecesarias.
- Revise su perfil y sus datos de contacto regularmente para asegurar que la información del estudiante o tutor esté actualizada.
- Revise periódicamente la bandeja de solicitudes pendientes en el panel administrativo para aprobar o rechazar registros sin demoras.
- Si detecta inconsistencias en horarios, solicitudes o perfil, repórtelas al administrador para mantener la plataforma ordenada y confiable.

---

## 8. Solución de errores cómunes

### No puedo iniciar sesión

- Verifique que el correo y la contraseña sean correctos.
- Confirme que la cuenta haya sido aprobada por un administrador.7
- Confirme que la cuenta de administrador existe.

![Error3](./img/error3.png)

![Error4](./img/error4.png)

![Error5](./img/error5.png)

### No me puedo registrar

- Confirme que todos los campos estén llenos.
- Compruebe que cumple con los requisitos de cada campo.

![Error](./img/error.png)

![Error2](./img/error2.png)

### No puedo seleccionar un horario

- Verifique que dicho horario no esté ocupado.
- Compruebe si ese día el tutor da tutorías.

![Error6](./img/error6.png)

![Error8](./img/error8.png)

### No puedo editar mi perfil

- Asegurarse de llenar los campos.

![Error9](./img/error9.png)

### No puedo programar sesión

- Asegurese de llenar los campos.

![Error7](./img/error7.png)
