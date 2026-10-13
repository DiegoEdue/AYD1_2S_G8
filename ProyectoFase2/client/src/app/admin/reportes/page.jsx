"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Tabs from "@/components/ui/Tabs";
import Avatar from "@/components/ui/Avatar";
import Table from "@/components/ui/Table";
import {
  obtenerReportes,
  obtenerCalificacionesTutores,
  obtenerCalificacionesEstudiantes,
} from "@/lib/api/admin";

const OPCIONES_TOPE = [
  { valor: 5, etiqueta: "Top 5" },
  { valor: 10, etiqueta: "Top 10" },
  { valor: 0, etiqueta: "Todos" },
];

const COLORES = [
  "#e84a5f",
  "#f17e8d",
  "#99b898",
  "#c3d9c2",
  "#ff847c",
  "#ffb0aa",
  "#fecea8",
  "#ffe4cb",
  "#748f73",
  "#3e4c52",
];

const ESTADOS = {
  activa: { etiqueta: "Activa", color: "#99b898" },
  atendida: { etiqueta: "Atendida", color: "#3e4c52" },
  cancelada_estudiante: { etiqueta: "Cancelada Estudiante", color: "#e84a5f" },
  cancelada_tutor: { etiqueta: "Cancelada Tutor", color: "#f17e8d" },
  pendiente: { etiqueta: "Pendiente", color: "#fecea8" },
};

const normalizarEstado = (estado = "") =>
  estado
    .toString()
    .trim()
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

function RatingStars({ promedio = 0 }) {
  const num = Number(promedio) || 0;
  const estrellasLlenas = Math.round(num);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-500 text-sm">
        {[1, 2, 3, 4, 5].map((idx) => (
          <span
            key={idx}
            className={idx <= estrellasLlenas ? "text-amber-500" : "text-charcoal/20"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="font-semibold text-charcoal text-xs">
        {num > 0 ? num.toFixed(1) : "0.0"} / 5.0
      </span>
    </div>
  );
}

export default function ReportesPage() {
  const [seccionActiva, setSeccionActiva] = useState("analiticas"); // "analiticas" | "tutores" | "estudiantes"
  const [reporte, setReporte] = useState(null);
  const [calificacionesTutores, setCalificacionesTutores] = useState([]);
  const [calificacionesEstudiantes, setCalificacionesEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tope, setTope] = useState(10);

  useEffect(() => {
    async function cargarTodosLosReportes() {
      setCargando(true);
      try {
        const [repRes, tutRes, estRes] = await Promise.allSettled([
          obtenerReportes(),
          obtenerCalificacionesTutores(),
          obtenerCalificacionesEstudiantes(),
        ]);

        if (repRes.status === "fulfilled") {
          setReporte(repRes.value?.data || null);
        }
        if (tutRes.status === "fulfilled") {
          const dataT = Array.isArray(tutRes.value?.data) ? tutRes.value.data : [];
          setCalificacionesTutores(dataT);
        }
        if (estRes.status === "fulfilled") {
          const dataE = Array.isArray(estRes.value?.data) ? estRes.value.data : [];
          setCalificacionesEstudiantes(dataE);
        }
      } catch (err) {
        setError(err?.message || "No pudimos cargar los reportes.");
      } finally {
        setCargando(false);
      }
    }

    cargarTodosLosReportes();
  }, []);

  const porTutor = useMemo(() => {
    const datos = reporte?.porTutor || [];
    return tope ? datos.slice(0, tope) : datos;
  }, [reporte, tope]);

  const porMateria = useMemo(() => {
    const datos = reporte?.porMateria || [];
    return tope ? datos.slice(0, tope) : datos;
  }, [reporte, tope]);

  const porEstado = (reporte?.porEstado || []).map((item) => ({
    ...item,
    estadoOriginal: item.estado,
    etiqueta: ESTADOS[normalizarEstado(item.estado)]?.etiqueta || item.estado,
    color: ESTADOS[normalizarEstado(item.estado)]?.color || COLORES[0],
  }));

  // Reportes adicionales HU-046: Cancelaciones por materia y demanda horaria
  const porCancelacion = useMemo(() => {
    return (reporte?.porCancelacion || []).slice(0, tope || 10);
  }, [reporte, tope]);

  const porHorario = useMemo(() => {
    return (reporte?.horariosDemandados || [])
      .map((h) => ({ hora: h.franja_horaria, total: h.total_sesiones }))
      .sort((a, b) => String(a.hora).localeCompare(String(b.hora)));
  }, [reporte]);

  if (error) {
    return <p className="text-sm text-crimson">{error}</p>;
  }

  const totales = reporte?.totales || {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Reportes y Evaluaciones</h2>
        <p className="text-sm text-charcoal-light">
          Consulta métricas analíticas, satisfacción de tutorías y calificaciones de usuarios en tiempo real.
        </p>
      </div>

      <Tabs
        tabs={[
          { valor: "analiticas", etiqueta: "Estadísticas de Sesiones" },
          { valor: "tutores", etiqueta: "Calificaciones de Tutores" },
          { valor: "estudiantes", etiqueta: "Calificaciones de Estudiantes" },
        ]}
        activo={seccionActiva}
        onCambiar={setSeccionActiva}
      />

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando datos analíticos…</p>
      ) : seccionActiva === "analiticas" ? (
        <>
          {/* Métricas Generales */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-charcoal-light">Límite de visualización:</span>
            <Tabs tabs={OPCIONES_TOPE} activo={tope} onCambiar={setTope} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(totales).map(([clave, valor]) => (
              <div
                key={clave}
                className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"
              >
                <p className="text-sm capitalize text-charcoal-light">{clave.replace(/_/g, " ")}</p>
                <p className="mt-2 font-display text-3xl text-charcoal">{valor}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Gráfico 1: Tutores con más sesiones */}
            <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">
                Tutores con mayor cantidad de sesiones atendidas
              </h3>
              <p className="text-sm text-charcoal-light">
                Total de sesiones concluidas exitosamente.
              </p>
              {porTutor.length ? (
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={porTutor} layout="vertical" margin={{ left: 24, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3e4c5214" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fill: "#3e4c52", fontSize: 12 }} />
                      <YAxis type="category" dataKey="tutor" width={160} tick={{ fill: "#2a363b", fontSize: 13 }} />
                      <Tooltip cursor={{ fill: "#e84a5f14" }} formatter={(valor) => [`${valor} sesiones`, "Atendidas"]} />
                      <Bar dataKey="sesiones" barSize={22} radius={[0, 8, 8, 0]}>
                        {porTutor.map((item, indice) => (
                          <Cell key={item.tutor} fill={COLORES[indice % COLORES.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-4 text-sm text-charcoal-light">Aún no hay sesiones atendidas.</p>
              )}
            </div>

            {/* Gráfico 2: Materias con mayor demanda */}
            <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">
                Materias con mayor demanda de sesiones
              </h3>
              <p className="text-sm text-charcoal-light">
                Cantidad de solicitudes y sesiones por materia.
              </p>
              {porMateria.length ? (
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={porMateria} margin={{ left: 24, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3e4c5214" vertical={false} />
                      <XAxis dataKey="materia" tick={{ fill: "#3e4c52", fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fill: "#3e4c52", fontSize: 12 }} />
                      <Tooltip cursor={{ fill: "#e84a5f14" }} formatter={(valor) => [`${valor} sesiones`, "Demanda"]} />
                      <Bar dataKey="cantidad" barSize={36} radius={[8, 8, 0, 0]}>
                        {porMateria.map((item, indice) => (
                          <Cell key={item.materia} fill={COLORES[indice % COLORES.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-4 text-sm text-charcoal-light">Aún no hay sesiones registradas.</p>
              )}
            </div>
          </div>

          {/* Gráfico 3: Distribución por Estado */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">Distribución de sesiones por estado</h3>
              <p className="text-sm text-charcoal-light">
                Proporción global de estados de sesiones.
              </p>
              {porEstado.length ? (
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={porEstado}
                        dataKey="cantidad"
                        nameKey="etiqueta"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {porEstado.map((item) => (
                          <Cell key={item.estadoOriginal} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(valor) => [`${valor} sesiones`, "Cantidad"]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-4 text-sm text-charcoal-light">Aún no hay sesiones registradas.</p>
              )}
            </div>

            {/* Gráfico 4: HU-046 Nuevos reportes - Horarios y Franjas de Demanda */}
            <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">Horarios con mayor demanda de tutorías</h3>
              <p className="text-sm text-charcoal-light">
                Concentración de sesiones por franja horaria.
              </p>
              {porHorario.length ? (
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={porHorario} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3e4c5214" vertical={false} />
                      <XAxis dataKey="hora" tick={{ fill: "#3e4c52", fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fill: "#3e4c52", fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v} sesiones`, "Demanda"]} />
                      <Bar dataKey="total" fill="#e84a5f" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-4 text-sm text-charcoal-light">Sin datos de horarios disponibles.</p>
              )}
            </div>
          </div>
        </>
      ) : seccionActiva === "tutores" ? (
        /* HU-044: Reporte General de Calificaciones de Tutores */
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
            <h3 className="font-display text-lg text-charcoal">
              Evaluación y Calificación de Tutores Activos
            </h3>
            <p className="text-sm text-charcoal-light mb-4">
              Promedio de valoración (0 a 5 estrellas) calculado a partir de las opiniones de los estudiantes.
            </p>

            <Table
              columnas={[
                "Tutor",
                "Especialidad / Universidad",
                "Promedio de Calificación",
                "Total Evaluaciones",
              ]}
              filas={calificacionesTutores}
              vacio="No hay calificaciones registradas para tutores."
              renderFila={(t) => (
                <>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    <div className="flex items-center gap-3">
                      <Avatar
                        nombre={t.nombre_completo || t.tutor || "Tutor"}
                        foto={t.foto_url || ""}
                        size="h-9 w-9"
                        textSize="text-xs"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">
                          {t.nombre_completo || t.tutor}
                        </p>
                        <p className="text-xs text-charcoal-light">{t.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-light">
                    {t.especialidad || t.universidad || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <RatingStars promedio={t.promedio_estrellas || t.promedio || 0} />
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal font-mono">
                    {t.total_evaluaciones || t.cantidad_resenas || 0} valoraciones
                  </td>
                </>
              )}
            />
          </div>
        </div>
      ) : (
        /* HU-045: Reporte General de Calificaciones de Estudiantes */
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
            <h3 className="font-display text-lg text-charcoal">
              Evaluación y Calificación de Estudiantes Activos
            </h3>
            <p className="text-sm text-charcoal-light mb-4">
              Puntuación promedio de conducta y desempeño otorgada por los tutores tras finalizar las sesiones.
            </p>

            <Table
              columnas={[
                "Estudiante",
                "Carnet",
                "Promedio de Calificación",
                "Total Evaluaciones",
              ]}
              filas={calificacionesEstudiantes}
              vacio="No hay calificaciones registradas para estudiantes."
              renderFila={(e) => (
                <>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    <div className="flex items-center gap-3">
                      <Avatar
                        nombre={e.nombre_completo || e.estudiante || "Estudiante"}
                        foto={e.foto_url || ""}
                        size="h-9 w-9"
                        textSize="text-xs"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">
                          {e.nombre_completo || e.estudiante}
                        </p>
                        <p className="text-xs text-charcoal-light">{e.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-light font-mono">
                    {e.carnet || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <RatingStars promedio={e.promedio_estrellas || e.promedio || 0} />
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal font-mono">
                    {e.total_evaluaciones || e.cantidad_resenas || 0} valoraciones
                  </td>
                </>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}