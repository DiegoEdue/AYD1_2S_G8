"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { inputClass } from "@/components/ui/FormField";
import { apiFetch } from "@/lib/api/client";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function HorariosTutorPage() {
  const { mostrarToast } = useToast();
  const [dias, setDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("12:00");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarHorario() {
      try {
        const response = await apiFetch("/tutor/schedule");
        const horario = response?.data || response;
        setDias(Array.isArray(horario?.dias) ? horario.dias : []);
        setHoraInicio(horario?.hora_inicio || "08:00");
        setHoraFin(horario?.hora_fin || "12:00");
      } catch (err) {
        setDias([]);
      } finally {
        setCargando(false);
      }
    }

    cargarHorario();
  }, []);

  function toggleDia(dia) {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  }

  async function onGuardar() {
    setError("");
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
      mostrarToast("Horario actualizado correctamente.", "exito");
    } catch (err) {
      setError(err.message || "No pudimos guardar el horario.");
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

      {error && (
        <div role="alert" className="mt-4 rounded-lg bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark">
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
              const activo = dias.includes(dia);
              return (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDia(dia)}
                  aria-pressed={activo}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    activo
                      ? "border-sage bg-sage text-white"
                      : "border-charcoal/20 text-charcoal-light hover:border-sage"
                  }`}
                >
                  {dia}
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
              type="time"
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
              type="time"
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
    </div>
  );
}
