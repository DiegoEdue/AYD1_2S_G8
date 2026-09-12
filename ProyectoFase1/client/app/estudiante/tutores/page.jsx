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

function normalizarGenero(genero = "") {
  const valor = genero.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (valor === "m" || valor === "masculino") return "M";
  if (valor === "f" || valor === "femenino") return "F";
  return valor;
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function normalizarDia(dia = "") {
  const valor = dia.toString().trim();
  return { Miercoles: "Miércoles", Sabado: "Sábado" }[valor] || valor;
}

function normalizarHora(valor, fallback) {
  if (!valor) return fallback;
  const coincidencia = String(valor).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!coincidencia) return fallback;
  let horas = Number(coincidencia[1]);
  const periodo = coincidencia[3]?.toUpperCase();
  if (periodo === "PM" && horas < 12) horas += 12;
  if (periodo === "AM" && horas === 12) horas = 0;
  return `${String(horas).padStart(2, "0")}:${coincidencia[2]}`;
}

const CLAVE_CATALOGO = "educonnect_catalogo_tutores";

export default function TutoresPage() {
  const [tutores, setTutores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ materia: "", universidad: "", experienciaMin: "", genero: "", edadMin: "", edadMax: "" });

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const hayFiltros = Object.values(filtros).some((valor) => valor !== "");
        const response = await listarTutores(filtros);
        const data = Array.isArray(response?.data) ? response.data : [];
        const actuales = data.map((t) => ({
            id: String(t.id_tutor ?? t.id),
            nombre: `${t.nombre ?? ""} ${t.apellido ?? ""}`.trim(),
            especialidad: Array.isArray(t.materias)
              ? t.materias
              : typeof t.materias === "string"
                ? [t.materias]
                : [],
            universidad: t.universidad_graduacion || t.universidad || "No especificada",
            direccion: t.direccion_tutoria || "Online",
            anios: Number(t.anios ?? t.experiencia ?? (
              t.anio_inicio_tutorias ? new Date().getFullYear() - Number(t.anio_inicio_tutorias) : 0
            )),
            genero: normalizarGenero(t.genero),
            edad: Number(t.edad) || calcularEdad(t.fecha_nacimiento),
            fechaNacimiento: t.fecha_nacimiento || t.fechaNacimiento || "",
            foto: t.foto_url || "",
            dias: Array.isArray(t.dias_atencion)
              ? DIAS_SEMANA.filter((dia) => t.dias_atencion.some((item) => normalizarDia(item) === dia))
              : [],
            horaInicio: normalizarHora(t.hora_inicio_atencion, "08:00"),
            horaFin: normalizarHora(t.hora_fin_atencion, "18:00"),
          }));

        let guardados = [];
        try {
          const almacenados = JSON.parse(window.localStorage.getItem(CLAVE_CATALOGO) || "[]");
          guardados = Array.isArray(almacenados) ? almacenados : [];
        } catch {
          guardados = [];
        }

        const porId = new Map((hayFiltros ? [] : guardados).map((tutor) => [tutor.id, tutor]));
        actuales.forEach((tutor) => porId.set(tutor.id, { ...porId.get(tutor.id), ...tutor }));
        const combinados = Array.from(porId.values());
        setTutores(combinados);
        window.localStorage.setItem(CLAVE_CATALOGO, JSON.stringify(combinados));
      } catch (error) {
        setTutores([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [filtros]);

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
      const coincideGenero = !filtros.genero || normalizarGenero(t.genero) === filtros.genero;
      const edadValida = Number.isFinite(Number(t.edad)) && Number(t.edad) > 0;
      const coincideEdadMin = !filtros.edadMin || !edadValida || t.edad >= Number(filtros.edadMin);
      const coincideEdadMax = !filtros.edadMax || !edadValida || t.edad <= Number(filtros.edadMax);
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
