"use client";

import { useEffect, useState } from "react";
import { obtenerReportes } from "@/lib/api/admin";

export default function ReportesPage() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => { obtenerReportes().then((response) => setReporte(response?.data || null)).catch(() => setReporte(null)); }, []);

  if (!reporte) return <p className="text-sm text-charcoal-light">Cargando reportes…</p>;

  const materias = reporte.porMateria || [];
  const estados = reporte.porEstado || [];
  const maxMaterias = Math.max(...materias.map((item) => Number(item.cantidad) || 0), 1);
  const maxEstados = Math.max(...estados.map((item) => Number(item.cantidad) || 0), 1);

  return <div className="flex flex-col gap-6"><div><h2 className="font-display text-xl text-charcoal">Reportes</h2><p className="text-sm text-charcoal-light">Resumen de la actividad de tutorías.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{Object.entries(reporte.totales || {}).map(([clave, valor]) => <div key={clave} className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"><p className="text-sm capitalize text-charcoal-light">{clave}</p><p className="mt-2 font-display text-3xl text-charcoal">{valor}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"><h3 className="font-display text-lg text-charcoal">Demanda por materia</h3><div className="mt-4 flex flex-col gap-3">{materias.length ? materias.map((item) => <div key={item.materia}><div className="flex justify-between text-sm"><span>{item.materia}</span><strong>{item.cantidad}</strong></div><div className="mt-1 h-3 rounded-full bg-paper"><div className="h-3 rounded-full bg-crimson" style={{ width: `${(Number(item.cantidad) / maxMaterias) * 100}%` }} /></div></div>) : <p className="text-sm text-charcoal-light">No hay datos de materias.</p>}</div></div>
      <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"><h3 className="font-display text-lg text-charcoal">Sesiones por estado</h3><div className="mt-4 flex flex-col gap-3">{estados.length ? estados.map((item) => <div key={item.estado}><div className="flex justify-between text-sm"><span>{item.estado}</span><strong>{item.cantidad}</strong></div><div className="mt-1 h-3 rounded-full bg-paper"><div className="h-3 rounded-full bg-sage" style={{ width: `${(Number(item.cantidad) / maxEstados) * 100}%` }} /></div></div>) : <p className="text-sm text-charcoal-light">No hay datos de estados.</p>}</div></div>
    </div>
  </div>;
}