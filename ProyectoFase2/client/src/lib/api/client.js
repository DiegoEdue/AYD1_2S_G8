const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("educonnect_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("educonnect_token", token);
  else window.localStorage.removeItem("educonnect_token");
}

// Rutas donde un 401 significa "credenciales incorrectas", no "sesión vencida".
const RUTAS_SIN_REDIRECCION = ["/auth/", "/admin/login", "/admin/verify-2fa", "/student/register", "/tutor/registro"];

function manejarSesionVencida(path, token) {
  if (!token || typeof window === "undefined") return;
  if (RUTAS_SIN_REDIRECCION.some((ruta) => path.startsWith(ruta))) return;
  // El JWT del backend dura 8 h: pasado ese tiempo hay que volver a iniciar sesión.
  setToken(null);
  window.localStorage.removeItem("educonnect_user");
  if (!window.location.pathname.startsWith("/login")) window.location.assign("/login");
}

async function enviar(path, { method = "GET", body, headers, ...rest } = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (networkError) {
    throw new ApiError(
      "No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      0,
      networkError
    );
  }

  if (!response.ok) {
    if (response.status === 401) manejarSesionVencida(path, token);

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
    const message =
      data?.message ||
      data?.error ||
      MENSAJES_POR_ESTADO[response.status] ||
      "Ocurrió un error inesperado. Inténtalo de nuevo.";
    throw new ApiError(message, response.status, data);
  }

  return response;
}

export async function apiFetch(path, opciones) {
  const response = await enviar(path, opciones);

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  return data;
}

// Para respuestas binarias que requieren el token (p. ej. la constancia PDF del plan de estudio).
export async function apiFetchBlob(path, opciones) {
  const response = await enviar(path, opciones);
  return response.blob();
}

const MENSAJES_POR_ESTADO = {
  400: "Revisa los datos ingresados: algo no cumple con el formato esperado.",
  401: "Tu sesión no es válida o expiró. Inicia sesión de nuevo.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No encontramos lo que buscabas.",
  409: "Este horario ya no está disponible. Elige otro.",
  422: "Algunos campos no son válidos. Revísalos e inténtalo de nuevo.",
  500: "Tuvimos un problema en el servidor. Inténtalo de nuevo en unos minutos.",
};

export { ApiError };
