"use client";

import { useEffect, useMemo, useState } from "react";
import TutorCard from "@/components/ui/TutorCard";
import FormField, { inputClass } from "@/components/ui/FormField";
import { listarTutores } from "@/lib/api/tutores";

function calcularEdad(fecha) {
  if (!fecha) return 0;
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aniversario = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (aniversario > hoy) edad -= 1;
  return edad;
}

export default function TutoresPage() {
  const [tutores, setTutores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ materia: "", universidad: "", experienciaMin: "", genero: "", edadMin: "", edadMax: "" });

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
            genero: t.genero || "",
            edad: calcularEdad(t.fecha_nacimiento),
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
      const coincideGenero = !filtros.genero || t.genero === filtros.genero;
      const coincideEdadMin = !filtros.edadMin || t.edad >= Number(filtros.edadMin);
      const coincideEdadMax = !filtros.edadMax || t.edad <= Number(filtros.edadMax);
      return coincideMateria && coincideUniversidad && coincideExperiencia && coincideGenero && coincideEdadMin && coincideEdadMax;
    });
  }, [tutores, filtros]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
        <h2 className="font-display text-lg text-charcoal">Buscar tutores</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Materia" name="materia">
            <input id="materia" value={filtros.materia} onChange={(e) => setFiltros((f) => ({ ...f, materia: e.target.value }))} className={inputClass(false)} placeholder="Ej. Cálculo" />
          </FormField>
          <FormField label="Universidad" name="universidad">
            <input id="universidad" value={filtros.universidad} onChange={(e) => setFiltros((f) => ({ ...f, universidad: e.target.value }))} className={inputClass(false)} />
          </FormField>
          <FormField label="Experiencia mínima (años)" name="experienciaMin">
            <input id="experienciaMin" type="number" min="0" value={filtros.experienciaMin} onChange={(e) => setFiltros((f) => ({ ...f, experienciaMin: e.target.value }))} className={inputClass(false)} />
          </FormField>
          <FormField label="Género" name="genero">
            <select id="genero" value={filtros.genero} onChange={(e) => setFiltros((f) => ({ ...f, genero: e.target.value }))} className={inputClass(false)}>
              <option value="">Cualquiera</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </FormField>
          <FormField label="Edad mínima" name="edadMin">
            <input id="edadMin" type="number" min="0" value={filtros.edadMin} onChange={(e) => setFiltros((f) => ({ ...f, edadMin: e.target.value }))} className={inputClass(false)} />
          </FormField>
          <FormField label="Edad máxima" name="edadMax">
            <input id="edadMax" type="number" min="0" value={filtros.edadMax} onChange={(e) => setFiltros((f) => ({ ...f, edadMax: e.target.value }))} className={inputClass(false)} />
          </FormField>
        </div>
      </div>
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
