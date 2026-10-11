"use client";

import { useEffect, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import EvaluacionSesion from "@/components/sesiones/EvaluacionSesion";
import { listarHistorialEstudiante } from "@/lib/api/sesiones";

export default function HistorialEstudiantePage() {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  function normalizarEstado(estado = "") {
    return estado.toLowerCase().replaceAll("_", "-");
  }

  // Refleja en la lista la calificación o el reporte recién enviados.
  function actualizarSesion(id, cambios) {
    setSesiones((actuales) => actuales.map((s) => (s.id === id ? { ...s, ...cambios } : s)));
  }

  useEffect(() => {
    async function cargar() {
      try {
        const response = await listarHistorialEstudiante();
        setSesiones(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setSesiones([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Historial de tutorías</h2>
        <p className="text-sm text-charcoal-light">Revisa tus sesiones atendidas o canceladas. En las atendidas puedes calificar o reportar al tutor.</p>
      </div>

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando historial…</p>
      ) : sesiones.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">Todavía no tienes sesiones en tu historial.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sesiones.map((sesion) => (
            <SessionCard
              key={sesion.id}
              sesion={{
                ...sesion,
                direccion: sesion.direccion || "Online",
                estado: normalizarEstado(sesion.estado),
                resumen: sesion.resumen || (
                  normalizarEstado(sesion.estado) === "cancelada-tutor"
                    ? "Cancelada por tutor"
                    : normalizarEstado(sesion.estado) === "cancelada-estudiante"
                      ? "Cancelada por estudiante"
                      : sesion.resumen
                ),
              }}
              contraparteLabel="Tutor"
              contraparteNombre={sesion.tutor}
              acciones={
                <EvaluacionSesion
                  rol="estudiante"
                  sesion={sesion}
                  contraparte={sesion.tutor}
                  onActualizar={actualizarSesion}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}