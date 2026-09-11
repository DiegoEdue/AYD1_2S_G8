"use client";

import { useEffect, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import { listarHistorialTutor } from "@/lib/api/sesiones";

export default function HistorialTutorPage() {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  function normalizarEstado(estado = "") {
    return estado.toLowerCase().replaceAll("_", "-");
  }

  useEffect(() => {
    async function cargar() {
      try {
        const response = await listarHistorialTutor();
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
        <p className="text-sm text-charcoal-light">Consulta las sesiones atendidas y canceladas.</p>
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
              sesion={{ ...sesion, direccion: sesion.direccion || "Online", estado: normalizarEstado(sesion.estado) }}
              contraparteLabel="Estudiante"
              contraparteNombre={sesion.estudiante}
            />
          ))}
        </div>
      )}
    </div>
  );
}