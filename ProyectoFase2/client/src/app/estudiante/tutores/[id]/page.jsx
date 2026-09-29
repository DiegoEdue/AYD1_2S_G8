"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import { listarTutores, obtenerHorarioTutor } from "@/lib/api/tutores";
import { listarSesionesActivasEstudiante, programarSesion } from "@/lib/api/sesiones";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const normalizarDia = (dia = "") => {
    const map = {
        Miercoles: "Miércoles",
        Sabado: "Sábado",
        "Miércoles": "Miércoles",
        "Sábado": "Sábado",
    };

    return map[dia] || dia;
};

const ordenarDias = (dias = []) => DIAS_SEMANA.filter((dia) => dias.some((item) => normalizarDia(item) === dia));

const obtenerDiaSemana = (fecha) => {
    const valor = new Date(`${fecha}T12:00:00`);
    return DIAS_SEMANA[(valor.getDay() + 6) % 7];
};

const fechaLocalISO = () => {
    const hoy = new Date();
    const zona = hoy.getTimezoneOffset() * 60000;
    return new Date(hoy.getTime() - zona).toISOString().slice(0, 10);
};

const normalizarHora = (valor, fallback) => {
    if (!valor) return fallback;
    const texto = String(valor).trim();
    const coincidencia = texto.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!coincidencia) return fallback;
    let horas = Number(coincidencia[1]);
    if (coincidencia[3]?.toUpperCase() === "PM" && horas < 12) horas += 12;
    if (coincidencia[3]?.toUpperCase() === "AM" && horas === 12) horas = 0;
    return `${String(horas).padStart(2, "0")}:${coincidencia[2]}`;
};

const sumarHora = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    const total = horas * 60 + minutos + 60;
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export default function DetalleTutorPage() {
    const { id } = useParams();
    const router = useRouter();
    const { mostrarToast } = useToast();

    const [tutor, setTutor] = useState(null);
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [form, setForm] = useState({ fecha: "", hora: "", materia: "", motivo: "" });
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
    const [sesionesActivas, setSesionesActivas] = useState([]);

    useEffect(() => {
        async function cargarTutor() {
            try {
                const response = await listarTutores();
                const encontrado = (response?.data || []).find(
                    (item) => String(item.id_tutor ?? item.id) === String(id)
                );
                if (!encontrado) return;

                const materiasFuente = Array.isArray(encontrado.materias_detalle)
                    ? encontrado.materias_detalle
                    : encontrado.materias || encontrado.especialidad || [];
                const materias = Array.isArray(materiasFuente)
                    ? materiasFuente.map((materia) => typeof materia === "string" ? { id: null, nombre: materia } : materia)
                    : String(materiasFuente).split(",").map((nombre) => ({ id: null, nombre: nombre.trim() })).filter((materia) => materia.nombre);
                setTutor({
                    id: String(encontrado.id_tutor ?? encontrado.id),
                    nombre: `${encontrado.nombre || ""} ${encontrado.apellido || ""}`.trim(),
                    especialidad: materias.map((materia) => materia.nombre),
                    materias,
                    universidad: encontrado.universidad_graduacion || encontrado.universidad || "No especificada",
                    direccion: encontrado.direccion_tutoria || "Online",
                    foto: encontrado.foto_url || "",
                    dias: Array.isArray(encontrado.dias_atencion)
                        ? ordenarDias(encontrado.dias_atencion)
                        : [],
                    horaInicio: normalizarHora(encontrado.hora_inicio_atencion, "08:00"),
                    horaFin: normalizarHora(encontrado.hora_fin_atencion, "18:00"),
                    franjas: [],
                });
            } catch {
                setTutor(null);
            }
        }

        cargarTutor();
    }, [id]);

    useEffect(() => {
        listarSesionesActivasEstudiante()
            .then((response) => setSesionesActivas(Array.isArray(response?.data) ? response.data : []))
            .catch(() => setSesionesActivas([]));
    }, []);

    useEffect(() => {
        if (!id || !fechaConsulta) return;

        async function cargarDisponibilidad() {
            setCargandoDisponibilidad(true);
            try {
                const response = await obtenerHorarioTutor(id, fechaConsulta);
                const disponibilidad = response?.data;
                setTutor((actual) => actual && {
                    ...actual,
                    dias: disponibilidad?.dias_atencion ? ordenarDias(disponibilidad.dias_atencion) : actual.dias,
                    horaInicio: normalizarHora(disponibilidad?.horario_general?.inicio, actual.horaInicio),
                    horaFin: normalizarHora(disponibilidad?.horario_general?.fin, actual.horaFin),
                    disponible: disponibilidad?.disponible,
                    franjas: disponibilidad?.franjas || [],
                });
            } catch {
                setTutor((actual) => actual && { ...actual, disponible: false, franjas: [] });
            } finally {
                setCargandoDisponibilidad(false);
            }
        }

        cargarDisponibilidad();
    }, [id, fechaConsulta]);

    if (!tutor) {
        return <p className="text-sm text-charcoal-light">Cargando información del tutor…</p>;
    }

    const diaSeleccionado = fechaConsulta ? obtenerDiaSemana(fechaConsulta) : null;
    const tutorAtiendeEseDia = diaSeleccionado ? tutor.disponible : null;

    function abrirModal() {
        setForm({ fecha: fechaConsulta || "", hora: "", materia: tutor.materias[0]?.id || "", motivo: "" });
        setError("");
        setModalAbierto(true);
    }

    async function confirmarSesion() {
        setError("");
        if (form.fecha < fechaLocalISO()) {
        setError("No puedes programar una sesión en una fecha pasada.");
        return;
        }
        if (!form.fecha || !form.hora || !form.materia) {
        setError("Completa fecha, hora y materia para continuar.");
        return;
        }
        const dia = obtenerDiaSemana(form.fecha);
        if (!tutor.dias.some((item) => normalizarDia(item) === normalizarDia(dia))) {
        setError(`${tutor.nombre} no atiende los días ${dia}. Elige otra fecha.`);
        return;
        }
        if (form.hora < tutor.horaInicio || form.hora >= tutor.horaFin) {
        setError(`Las sesiones de una hora deben iniciar entre ${tutor.horaInicio} y ${sumarHora(tutor.horaFin)}; la última termina a las ${tutor.horaFin}.`);
        return;
        }
        const franja = tutor.franjas.find((item) => item.hora === form.hora);
        if (franja?.estado === "ocupada") {
        setError("Ese horario ya está ocupado. Selecciona una franja libre.");
        return;
        }
        if (sesionesActivas.some((sesion) => sesion.fecha === form.fecha && sesion.hora?.slice(0, 5) === form.hora)) {
        setError("Ya tienes otra sesión activa en esa fecha y hora.");
        return;
        }
        if (sesionesActivas.some((sesion) => String(sesion.id_tutor ?? sesion.tutor_id ?? sesion.tutorId) === String(tutor.id))) {
        setError("Ya tienes una sesión activa con este tutor.");
        return;
        }

        setEnviando(true);
        try {
        if (!form.materia) {
            setError("No se pudo identificar la materia seleccionada.");
            return;
        }
        await programarSesion({
            idTutor: Number(tutor.id),
            idMateria: Number(form.materia),
            fecha: form.fecha,
            hora: form.hora,
            motivo: form.motivo || "Tutoría académica",
        });
        mostrarToast("Sesión programada correctamente.", "exito");
        setModalAbierto(false);
        router.push("/estudiante/sesiones/activas");
        } catch (err) {
        setError(err.message || "No pudimos programar la sesión. Intenta de nuevo.");
        } finally {
        setEnviando(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
        <button
            onClick={() => router.back()}
            className="w-fit text-sm text-charcoal-light hover:text-charcoal hover:underline"
        >
            ← Volver a la búsqueda
        </button>

        <div className="rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-4">
            <Avatar nombre={tutor.nombre} foto={tutor.foto} size="h-14 w-14" textSize="text-base" />
            <div>
                <h2 className="font-display text-2xl text-charcoal">{tutor.nombre}</h2>
                <p className="text-sm text-charcoal-light">{tutor.universidad}</p>
            </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
            {tutor.especialidad.map((m) => (
                <span key={m} className="rounded-full bg-cream-light px-2.5 py-1 text-xs font-medium text-charcoal-dark">
                {m}
                </span>
            ))}
            </div>
            <p className="mt-3 flex items-center gap-1 text-sm text-charcoal-light">
            <Icon name="Ubicacion" className="h-4 w-4 shrink-0" /> {tutor.direccion}
            </p>
            <p className="flex items-center gap-1 text-sm text-charcoal-light">
            <Icon name="Horarios" className="h-4 w-4 shrink-0" /> Atiende: {tutor.dias.join(", ") || "consulta una fecha"} de{" "}
            {tutor.horaInicio} a {tutor.horaFin}
            </p>
        </div>

        <div className="rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
            <h3 className="font-display text-lg text-charcoal">Consultar disponibilidad</h3>
            <p className="text-sm text-charcoal-light">
            Elige una fecha para ver si el tutor atiende ese día.
            </p>
            <input
            type="date"
            min={fechaLocalISO()}
            value={fechaConsulta}
            onChange={(e) => setFechaConsulta(e.target.value)}
            className={`${inputClass(false)} mt-3 max-w-[220px]`}
            aria-label="Fecha a consultar"
            />

            {fechaConsulta && (
            <div
                className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                tutorAtiendeEseDia
                    ? "bg-sage-light/60 text-charcoal-dark"
                    : "bg-crimson-light/40 text-crimson-dark"
                }`}
            >
                {cargandoDisponibilidad
                ? "Consultando disponibilidad…"
                : tutorAtiendeEseDia
                ? `Disponible el ${diaSeleccionado} de ${tutor.horaInicio} a ${tutor.horaFin}.`
                : `El tutor no atiende los días ${diaSeleccionado}. Elige otra fecha.`}
            </div>
            )}

            {fechaConsulta && tutorAtiendeEseDia && tutor.franjas?.length > 0 && (
            <div className="mt-4">
                <p className="text-sm font-medium text-charcoal">Franjas del día</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {tutor.franjas.map((franja) => (
                    <span
                    key={franja.hora}
                    className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold ${
                        franja.estado === "ocupada"
                        ? "border-crimson/20 bg-crimson-light/30 text-crimson-dark"
                        : "border-sage/30 bg-sage-light/60 text-charcoal-dark"
                    }`}
                    >
                    {franja.hora}-{sumarHora(franja.hora)} · {franja.estado === "ocupada" ? "Ocupada" : "Libre"}
                    </span>
                ))}
                </div>
            </div>
            )}

            <Button className="mt-5" onClick={abrirModal}>
            Programar sesión
            </Button>
        </div>

        <Modal
            abierto={modalAbierto}
            onCerrar={() => setModalAbierto(false)}
            titulo={`Programar sesión con ${tutor.nombre}`}
            footer={
            <>
                <Button variante="fantasma" onClick={() => setModalAbierto(false)}>
                Cancelar
                </Button>
                <Button onClick={confirmarSesion} cargando={enviando}>
                Confirmar sesión
                </Button>
            </>
            }
        >
            {error && (
            <div role="alert" className="mb-4 rounded-lg bg-crimson-light/30 px-3 py-2 text-xs text-crimson-dark">
                {error}
            </div>
            )}
            <div className="flex flex-col gap-4">
            <FormField label="Fecha" name="fecha" required>
                <input
                id="fecha"
                type="date"
                value={form.fecha}
                onChange={(e) => {
                    setForm((f) => ({ ...f, fecha: e.target.value, hora: "" }));
                    setFechaConsulta(e.target.value);
                }}
                className={inputClass(false)}
                />
            </FormField>
            <FormField label="Hora" name="hora" required ayuda={`Entre ${tutor.horaInicio} y ${tutor.horaFin}`}>
                {tutor.franjas?.length > 0 ? (
                <select
                    id="hora"
                    value={form.hora}
                    onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                    className={inputClass(false)}
                >
                    <option value="">Selecciona una franja libre</option>
                    {tutor.franjas.map((franja) => (
                    <option key={franja.hora} value={franja.hora} disabled={franja.estado === "ocupada"}>
                        {franja.hora} - {franja.estado === "ocupada" ? "Ocupada" : "Disponible"}
                    </option>
                    ))}
                </select>
                ) : (
                <input
                    id="hora"
                    type="time"
                    value={form.hora}
                    onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                    className={inputClass(false)}
                />
                )}
            </FormField>
            <FormField label="Materia" name="materia" required>
                <select
                id="materia"
                value={form.materia}
                onChange={(e) => setForm((f) => ({ ...f, materia: e.target.value }))}
                className={inputClass(false)}
                >
                {tutor.materias.map((materia) => (
                    <option key={materia.id || materia.nombre} value={materia.id || ""}>
                    {materia.nombre}
                    </option>
                ))}
                </select>
            </FormField>
            <FormField label="Motivo de la sesión" name="motivo" ayuda="Describe brevemente tus dudas.">
                <textarea
                id="motivo"
                rows={3}
                value={form.motivo}
                onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
                className={inputClass(false)}
                />
            </FormField>
            </div>
        </Modal>
        </div>
    );
}