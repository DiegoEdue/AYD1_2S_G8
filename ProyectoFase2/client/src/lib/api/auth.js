import { apiFetch, setToken, ApiError } from "./client";

export async function login({ email, password, verification_token }) {
  const body = { correo: email, password };
  if (verification_token) {
    body.verification_token = verification_token;
  }

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body,
    });

    if (data.status === "pending_2fa_setup" || data.status === "pending_2fa_verify") {
      return {
        requiereSegundoFactor: true,
        adminId: data.adminId,
        secret: data.secret,
        qr_code: data.qr_code,
        status: data.status,
      };
    }

    if (data.token) {
      setToken(data.token);
      return { usuario: data.user, token: data.token };
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 400 && error.details?.requiresVerification) {
      return {
        requiresVerification: true,
        tokenExpired: error.details.tokenExpired,
        message: error.message,
      };
    }
    throw error;
  }
}

export async function loginAdmin({ nombre_usuario, password }) {
  const data = await apiFetch("/admin/login", {
    method: "POST",
    body: { nombre_usuario, password },
  });

  if (data.status === "pending_2fa_setup" || data.status === "pending_2fa_verify") {
    return {
      requiereSegundoFactor: true,
      adminId: data.adminId,
      secret: data.secret,
      qr_code: data.qr_code,
      status: data.status,
    };
  }

  if (data.token) {
    setToken(data.token);
    return { usuario: data.user, token: data.token };
  }

  return data;
}

export async function verificarSegundoFactorAdmin({ adminId, token }) {
  const data = await apiFetch("/admin/verify-2fa", {
    method: "POST",
    body: { adminId, token },
  });

  if (data.token) {
    setToken(data.token);
    return { usuario: data.user, token: data.token };
  }

  return data;
}

export async function registrarEstudiante(datos) {
  const payload = {
    nombre: datos.nombre,
    apellido: datos.apellido,
    carnet: datos.carnet,
    genero: datos.genero,
    direccion: datos.direccion,
    telefono: datos.telefono,
    fecha_nacimiento: datos.fechaNacimiento || datos.fecha_nacimiento,
    foto_url: datos.foto || null,
    carnet_pdf_url: datos.carnetPdf || datos.carnet_pdf_url || "",
    correo: datos.correo,
    password: datos.password,
  };

  return apiFetch("/student/register", { method: "POST", body: payload });
}

export async function registrarTutor(datos) {
  const payload = {
    nombre: datos.nombre,
    apellido: datos.apellido,
    carnet_id: datos.carnet,
    fecha_nacimiento: datos.fechaNacimiento || datos.fecha_nacimiento,
    genero: datos.genero,
    direccion: datos.direccion,
    telefono: datos.telefono,
    foto_url: datos.foto || null,
    cv_pdf_url: datos.cvPdf || datos.cv_pdf_url || "",
    numero_identificacion_tutor: datos.numeroIdentificacion || datos.numero_identificacion_tutor,
    direccion_tutoria: datos.direccionTutoria || datos.direccion_tutoria,
    correo: datos.correo,
    password: datos.password,
    anio_inicio_tutorias: Number(datos.anioInicio || datos.anio_inicio_tutorias),
    universidad_graduacion: datos.universidad || datos.universidad_graduacion,
    especialidad: datos.especialidad,
  };

  return apiFetch("/tutor/registro", { method: "POST", body: payload });
}

export function cerrarSesion() {
  setToken(null);
}

export async function resendVerificationToken({ email }) {
  const data = await apiFetch("/auth/resend-verification", {
    method: "POST",
    body: { correo: email },
  });
  return data;
}
