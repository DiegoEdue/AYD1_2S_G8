"use client";

import { useEffect, useMemo, useState } from "react";
import TutorCard from "@/components/ui/TutorCard";
import { listarTutores } from "@/lib/api/tutores";

export default function TutoresPage() {
  const [tutores, setTutores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ materia: "", universidad: "", experienciaMin: "" });

  useEffect(() => {
    async function cargar() {
      try {
        const response = await listarTutores();
        const data = Array.isArray(response?.data) ? response.data : [];
        setTutores(
          data.map((t) => ({
            id: String(t.id_tutor ?? t.id),
            nombre: `${t.nombre ?? ""} ${t.apellido ?? ""}`.trim(),
            especialidad: Array.isArray(t.materias)
              ? t.materias
              : typeof t.materias === "string"
                ? [t.materias]
                : [],
            universidad: t.universidad_graduacion || "USAC",
            direccion: t.direccion_tutoria || "Online",
            anios: Number(t.anios ?? 0),
            foto: t.foto_url || "",
            dias: Array.isArray(t.dias_atencion) ? t.dias_atencion : [],
            horaInicio: t.hora_inicio_atencion ? t.hora_inicio_atencion.slice(0, 5) : "08:00",
            horaFin: t.hora_fin_atencion ? t.hora_fin_atencion.slice(0, 5) : "18:00",
          }))
        );
      } catch (error) {
        setTutores([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  const resultados = useMemo(() => {
    return tutores.filter((t) => {
      const coincideMateria =
        !filtros.materia ||
        t.especialidad.some((m) => m.toLowerCase().includes(filtros.materia.toLowerCase()));
      const coincideUniversidad =
        !filtros.universidad ||
        t.universidad.toLowerCase().includes(filtros.universidad.toLowerCase());
      const coincideExperiencia =
        !filtros.experienciaMin || t.anios >= Number(filtros.experienciaMin);
      return coincideMateria && coincideUniversidad && coincideExperiencia;
    });
  }, [tutores, filtros]);

  return (
    <div className="flex flex-col gap-6">
      {cargando ? (
        <p className="text-sm text-charcoal-light">Buscando tutores disponibles…</p>
      ) : resultados.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">
            No encontramos tutores con esos filtros. Prueba ajustando la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      )}
    </div>
  );
}
