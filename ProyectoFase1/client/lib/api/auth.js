

export async function registrarEstudiante(datos) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, usuario: { ...datos, rol: "estudiante" } };
}

export async function registrarTutor(datos) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, usuario: { ...datos, rol: "tutor" } };
}
