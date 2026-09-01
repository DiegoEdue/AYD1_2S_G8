"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import { tutoresMock } from "@/lib/mocks/data";
// import { obtenerTutor, obtenerHorarioTutor } from "@/lib/api/tutores";
// import { programarSesion } from "@/lib/api/sesiones";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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

    useEffect(() => {
        setTutor(tutoresMock.find((t) => t.id === id) || null);
    }, [id]);

    if (!tutor) {
        return <p className="text-sm text-charcoal-light">Cargando información del tutor…</p>;
    }

    const diaSeleccionado = fechaConsulta
        ? DIAS_SEMANA[(new Date(fechaConsulta).getDay() + 6) % 7]
        : null;
    const tutorAtiendeEseDia = diaSeleccionado ? tutor.dias.includes(diaSeleccionado) : null;

    function abrirModal() {
        setForm({ fecha: fechaConsulta || "", hora: "", materia: tutor.especialidad[0], motivo: "" });
        setError("");
        setModalAbierto(true);
    }

    async function confirmarSesion() {
        setError("");
        if (!form.fecha || !form.hora || !form.materia) {
        setError("Completa fecha, hora y materia para continuar.");
        return;
        }
        const dia = DIAS_SEMANA[(new Date(form.fecha).getDay() + 6) % 7];
        if (!tutor.dias.includes(dia)) {
        setError(`${tutor.nombre} no atiende los días ${dia}. Elige otra fecha.`);
        return;
        }
        if (form.hora < tutor.horaInicio || form.hora > tutor.horaFin) {
        setError(`El horario del tutor ese día es de ${tutor.horaInicio} a ${tutor.horaFin}.`);
        return;
        }

        setEnviando(true);
        try {
        // await programarSesion({ tutorId: tutor.id, ...form });
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
            <Icon name="Horarios" className="h-4 w-4 shrink-0" /> Atiende: {tutor.dias.join(", ")} de{" "}
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
                {tutorAtiendeEseDia
                ? `Disponible el ${diaSeleccionado} de ${tutor.horaInicio} a ${tutor.horaFin}.`
                : `El tutor no atiende los días ${diaSeleccionado}. Elige otra fecha.`}
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
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                className={inputClass(false)}
                />
            </FormField>
            <FormField label="Hora" name="hora" required ayuda={`Entre ${tutor.horaInicio} y ${tutor.horaFin}`}>
                <input
                id="hora"
                type="time"
                value={form.hora}
                onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                className={inputClass(false)}
                />
            </FormField>
            <FormField label="Materia" name="materia" required>
                <select
                id="materia"
                value={form.materia}
                onChange={(e) => setForm((f) => ({ ...f, materia: e.target.value }))}
                className={inputClass(false)}
                >
                {tutor.especialidad.map((m) => (
                    <option key={m} value={m}>
                    {m}
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