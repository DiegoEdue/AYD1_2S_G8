# Guía de Pruebas Backend - [HU-005] Aprobación o Rechazo de Estudiantes

Esta guía contiene las instrucciones actualizadas y ejemplos de peticiones HTTP para probar la Historia de Usuario **[HU-005]: Aprobación o Rechazo de Estudiantes** en el servidor de EduConnect tras la integración con la rama `develop`.

---

## 1. Endpoints de la HU-005

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/admin/students/pending` | Obtener el listado de estudiantes pendientes de aprobación |
| `PUT` | `/api/admin/students/:id/approve` | Aprobar la solicitud de un estudiante (cambia estado a `aprobado` y envía correo) |
| `PUT` | `/api/admin/students/:id/reject` | Rechazar la solicitud de un estudiante (cambia estado a `rechazado` y envía correo) |

---

## 2. Configuración del Servicio de Correo (Nodemailer)

Los compañeros han configurado la cuenta oficial del sistema en `src/services/email.js`. El backend ahora envía notificaciones de correo utilizando las credenciales globales del proyecto (`educonnectcompany@gmail.com`).

Si deseas sobreescribir estas credenciales, puedes definirlas en tu archivo `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=educonnectcompany@gmail.com
SMTP_PASS=tiwxlhlioromehdg
```

---

## 3. Escenarios de Prueba en Postman / cURL

### Escenario 1: Consultar Listado de Estudiantes Pendientes
* **Método:** `GET`
* **URL:** `http://localhost:4000/api/admin/students/pending`
* **Respuesta Esperada (HTTP 200 OK):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id_estudiante": 11,
      "nombre": "Diego",
      "apellido": "Castillo",
      "carnet": "202600006",
      "genero": "M",
      "direccion": "Villa Nueva, Guatemala",
      "telefono": "55550006",
      "fecha_nacimiento": "2002-03-12T00:00:00.000Z",
      "foto_url": null,
      "correo": "diego.castillo@test.com",
      "estado_aprobacion": "pendiente",
      "fecha_registro": "2026-08-31T22:13:07.186Z"
    }
  ]
}
```

* **Comando cURL:**
```bash
curl -X GET http://localhost:4000/api/admin/students/pending
```

---

### Escenario 2: Aprobar Solicitud de un Estudiante
* **Método:** `PUT`
* **URL:** `http://localhost:4000/api/admin/students/11/approve`
* **Headers:** `Content-Type: application/json`
* **Respuesta Esperada (HTTP 200 OK):**
```json
{
  "status": "success",
  "message": "Estudiante aprobado exitosamente.",
  "data": {
    "id_estudiante": 11,
    "nombre": "Diego Castillo",
    "correo": "diego.castillo@test.com",
    "estado_aprobacion": "aprobado"
  }
}
```

* **Comando cURL:**
```bash
curl -X PUT http://localhost:4000/api/admin/students/11/approve
```

* **Efectos:**
  1. `estado_aprobacion` pasa a `'aprobado'` en la base de datos de Neon.
  2. La tabla `solicitud` se actualiza a `aceptada`.
  3. El estudiante ya puede iniciar sesión mediante `POST /api/estudiante/login` o `POST /api/auth/login`.
  4. Se ejecuta el envío de correo electrónico mediante el servicio `sendApprovalEmail`.

---

### Escenario 3: Rechazar Solicitud de un Estudiante
* **Método:** `PUT`
* **URL:** `http://localhost:4000/api/admin/students/12/reject`
* **Headers:** `Content-Type: application/json`
* **Body (JSON - Opcional):**
```json
{
  "motivo": "Fotografía no coincide con los documentos adjuntos"
}
```
* **Respuesta Esperada (HTTP 200 OK):**
```json
{
  "status": "success",
  "message": "Estudiante rechazado exitosamente.",
  "data": {
    "id_estudiante": 12,
    "nombre": "Joshua Saens",
    "correo": "example@gmail.com",
    "estado_aprobacion": "rechazado",
    "motivo": "Fotografía no coincide con los documentos adjuntos"
  }
}
```

* **Comando cURL:**
```bash
curl -X PUT http://localhost:4000/api/admin/students/12/reject \
  -H "Content-Type: application/json" \
  -d "{\"motivo\": \"Fotografía no coincide con los documentos adjuntos\"}"
```

* **Efectos:**
  1. `estado_aprobacion` pasa a `'rechazado'` en la base de datos de Neon.
  2. Si el usuario intenta hacer login (`POST /api/estudiante/login`), la API deniega el acceso con `HTTP 403` (*"Su cuenta ha sido rechazada por el administrador"*).
