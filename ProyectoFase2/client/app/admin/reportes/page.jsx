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
import { obtenerReportes } from "@/lib/api/admin";

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

const normalizarEstado = (estado = "") => estado
  .toString()
  .trim()
  .toLowerCase()
  .replaceAll("-", "_")
  .replaceAll(" ", "_");

export default function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);
  const [tope, setTope] = useState(10);

  useEffect(() => {
    obtenerReportes()
      .then((response) => setReporte(response?.data || null))
      .catch((err) => setError(err?.message || "No pudimos cargar los reportes."));
  }, []);

  const porTutor = useMemo(() => {
    const datos = reporte?.porTutor || [];
    return tope ? datos.slice(0, tope) : datos;
  }, [reporte, tope]);

  const porMateria = useMemo(() => {
    const datos = reporte?.porMateria || [];
    return tope ? datos.slice(0, tope) : datos;
  }, [reporte, tope]);

  const porEstado = (reporte?.porEstado || [])
    .map((item) => ({
      ...item,
      estadoOriginal: item.estado,
      etiqueta: ESTADOS[normalizarEstado(item.estado)]?.etiqueta || item.estado,
      color: ESTADOS[normalizarEstado(item.estado)]?.color || COLORES[0],
    }));

  if (error) {
    return <p className="text-sm text-crimson">{error}</p>;
  }

  if (!reporte) {
    return <p className="text-sm text-charcoal-light">Cargando reportes…</p>;
  }

  const totales = reporte.totales || {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Reportes analíticos</h2>
        <p className="text-sm text-charcoal-light">
          Datos calculados en tiempo real a partir de las sesiones registradas.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-charcoal-light">Mostrar:</span>
        <Tabs tabs={OPCIONES_TOPE} activo={tope} onCambiar={setTope} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(totales).map(([clave, valor]) => (
          <div
            key={clave}
            className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"
          >
            <p className="text-sm capitalize text-charcoal-light">{clave}</p>
            <p className="mt-2 font-display text-3xl text-charcoal">{valor}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg text-charcoal">
            Tutores que más estudiantes han atendido
          </h3>
          <p className="text-sm text-charcoal-light">
            Sesiones en estado “Atendida” por tutor.
          </p>
          {porTutor.length ? (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={porTutor}
                  layout="vertical"
                  margin={{ left: 24, right: 24 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3e4c5214"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "#3e4c52", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="tutor"
                    width={160}
                    tick={{ fill: "#2a363b", fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#e84a5f14" }}
                    formatter={(valor) => [`${valor} sesiones`, "Atendidas"]}
                  />
                  <Bar dataKey="sesiones" barSize={22} radius={[0, 8, 8, 0]}>
                    {porTutor.map((item, indice) => (
                      <Cell
                        key={item.tutor}
                        fill={COLORES[indice % COLORES.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 text-sm text-charcoal-light">
              Aún no hay sesiones atendidas.
            </p>
          )}
        </div>

        <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg text-charcoal">
            Materias con mayor demanda de sesiones
          </h3>
          <p className="text-sm text-charcoal-light">
            Sesiones en estado “Atendida” por materia.
          </p>
          {porMateria.length ? (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porMateria} margin={{ left: 24, right: 24 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3e4c5214"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="materia"
                    tick={{ fill: "#3e4c52", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#3e4c52", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#e84a5f14" }}
                    formatter={(valor) => [`${valor} sesiones`, "Demanda"]}
                  />
                  <Bar dataKey="cantidad" barSize={36} radius={[8, 8, 0, 0]}>
                    {porMateria.map((item, indice) => (
                      <Cell
                        key={item.materia}
                        fill={COLORES[indice % COLORES.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 text-sm text-charcoal-light">
              Aún no hay sesiones atendidas.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
        <h3 className="font-display text-lg text-charcoal">Sesiones por estado</h3>
        <p className="text-sm text-charcoal-light">
          Distribución del total de sesiones registradas.
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
                  {porEstado.map((item, indice) => (
                      <Cell key={item.estadoOriginal} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(valor) => [`${valor} sesiones`, "Cantidad"]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-charcoal-light">
            Aún no hay sesiones registradas.
          </p>
        )}
      </div>

      {/* Tabla ranking de tutores con foto */}
      {porTutor.length > 0 && (
        <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg text-charcoal">Ranking de tutores</h3>
          <p className="text-sm text-charcoal-light mb-4">
            Listado detallado de tutores por sesiones atendidas.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-charcoal-light">#</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-charcoal-light">Tutor</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-charcoal-light">Sesiones atendidas</th>
                </tr>
              </thead>
              <tbody>
                {porTutor.map((item, indice) => (
                  <tr key={item.tutor} className="border-b border-charcoal/5 last:border-0 hover:bg-paper transition">
                    <td className="px-3 py-2.5 text-charcoal-light font-mono text-xs">{indice + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          nombre={item.tutor}
                          foto={item.foto_url || ""}
                          size="h-8 w-8"
                          textSize="text-xs"
                        />
                        <span className="font-medium text-charcoal">{item.tutor}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: COLORES[indice % COLORES.length] + "22", color: COLORES[indice % COLORES.length] }}
                      >
                        {item.sesiones}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}