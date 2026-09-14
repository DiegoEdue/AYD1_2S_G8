"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { inputClass } from "@/components/ui/FormField";
import { apiFetch } from "@/lib/api/client";

const DIAS = [
  { valor: "Lunes", etiqueta: "Lunes" },
  { valor: "Martes", etiqueta: "Martes" },
  { valor: "Miercoles", etiqueta: "Miércoles" },
  { valor: "Jueves", etiqueta: "Jueves" },
  { valor: "Viernes", etiqueta: "Viernes" },
  { valor: "Sabado", etiqueta: "Sábado" },
  { valor: "Domingo", etiqueta: "Domingo" },
];

const ordenarDias = (valores = []) => DIAS.map((dia) => dia.valor).filter((dia) => valores.includes(dia));

const normalizarHora = (valor, fallback) => {
  if (!valor) return fallback;
  const texto = String(valor).trim();
  const coincidencia = texto.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!coincidencia) return fallback;
  let horas = Number(coincidencia[1]);
  const minutos = coincidencia[2];
  if (coincidencia[3]?.toUpperCase() === "PM" && horas < 12) horas += 12;
  if (coincidencia[3]?.toUpperCase() === "AM" && horas === 12) horas = 0;
  return `${String(horas).padStart(2, "0")}:${minutos}`;
};

export default function HorariosTutorPage() {
  const { mostrarToast } = useToast();
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("12:00");
  const [error, setError] = useState("");
  const [sesionesConflicto, setSesionesConflicto] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarHorario() {
      try {
        const response = await apiFetch("/tutor/schedule");
        const horario = response?.data || response;
        setDias(ordenarDias(Array.isArray(horario?.dias) ? horario.dias : []));
        setHoraInicio(normalizarHora(horario?.hora_inicio, "08:00"));
        setHoraFin(normalizarHora(horario?.hora_fin, "12:00"));
      } catch (err) {
        setDias([]);
      } finally {
        setCargando(false);
      }
    }

    cargarHorario();
  }, []);

  function toggleDia(dia) {
    setDias((prev) => ordenarDias(
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    ));
  }

  async function onGuardar() {
    setError("");
    setSesionesConflicto([]);
    if (dias.length === 0) {
      setError("Selecciona al menos un día de atención.");
      return;
    }
    if (horaInicio >= horaFin) {
      setError("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    setGuardando(true);
    try {
      const params = new URLSearchParams({
        dias: JSON.stringify(dias),
        startTime: horaInicio,
        endTime: horaFin,
      });
      await apiFetch(`/tutor/schedule?${params.toString()}`, { method: "PUT" });
      setSesionesConflicto([]);
      mostrarToast("Horario actualizado correctamente.", "exito");
    } catch (err) {
      setError(err.message || "No pudimos guardar el horario.");
      const conflictos = err.details?.data;
      setSesionesConflicto(Array.isArray(conflictos) ? conflictos : []);
      setModalAbierto(true);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl text-charcoal">Mis horarios de atención</h2>
      <p className="text-sm text-charcoal-light">
        El horario que elijas aplicará por igual a todos los días seleccionados.
      </p>

      {error && !modalAbierto && (
        <div role="alert" className="mt-4 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-charcoal">Días que atiendes</p>
        {cargando ? (
          <p className="mt-2 text-sm text-charcoal-light">Cargando horario…</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {DIAS.map((dia) => {
              const activo = dias.includes(dia.valor);
              return (
                <button
                  key={dia.valor}
                  type="button"
                  onClick={() => toggleDia(dia.valor)}
                  aria-pressed={activo}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    activo
                      ? "border-sage bg-sage text-white"
                      : "border-charcoal/20 text-charcoal-light hover:border-sage"
                  }`}
                >
                  {dia.etiqueta}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="horaInicio" className="text-sm font-medium text-charcoal">
              Hora de inicio
            </label>
            <input
              id="horaInicio"
              type="text"
              inputMode="numeric"
              pattern="(?:[01]\d|2[0-3]):[0-5]\d"
              placeholder="HH:MM"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className={`${inputClass(false)} mt-1.5`}
            />
          </div>
          <div>
            <label htmlFor="horaFin" className="text-sm font-medium text-charcoal">
              Hora de fin
            </label>
            <input
              id="horaFin"
              type="text"
              inputMode="numeric"
              pattern="(?:[01]\d|2[0-3]):[0-5]\d"
              placeholder="HH:MM"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className={`${inputClass(false)} mt-1.5`}
            />
          </div>
        </div>

        <Button className="mt-6" onClick={onGuardar} cargando={guardando}>
          Guardar horario
        </Button>
      </div>

      <Modal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        titulo="No se pudo actualizar el horario"
        footer={
          <Button variante="fantasma" onClick={() => setModalAbierto(false)}>
            Entendido
          </Button>
        }
      >
        <p>{error}</p>
        {sesionesConflicto.length > 0 && (
          <>
            <p className="mt-3 font-medium text-crimson-dark">
              Sesiones que debes cancelar o reprogramar:
            </p>
            <ul className="mt-2 space-y-1.5 border-t border-crimson/10 pt-2">
              {sesionesConflicto.map((s) => (
                <li key={s.id}>
                  <span className="font-medium">{s.fecha}</span> a las{" "}
                  <span className="font-medium">{s.hora}</span> con{" "}
                  <span className="font-medium">{s.estudiante}</span>
                  {s.motivo ? ` — ${s.motivo}` : ""}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
}
