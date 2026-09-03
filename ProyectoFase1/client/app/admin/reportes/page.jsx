"use client";

import { useEffect, useState } from "react";
import { obtenerReportes } from "@/lib/api/admin";

export default function ReportesPage() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => { obtenerReportes().then((response) => setReporte(response?.data || null)).catch(() => setReporte(null)); }, []);

  if (!reporte) return <p className="text-sm text-charcoal-light">Cargando reportes…</p>;

  return <div className="flex flex-col gap-6"><div><h2 className="font-display text-xl text-charcoal">Reportes</h2><p className="text-sm text-charcoal-light">Resumen de la actividad de tutorías.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{Object.entries(reporte.totales || {}).map(([clave, valor]) => <div key={clave} className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"><p className="text-sm capitalize text-charcoal-light">{clave}</p><p className="mt-2 font-display text-3xl text-charcoal">{valor}</p></div>)}</div>
    <div className="rounded-card border border-charcoal/10 bg-white p-5 shadow-soft"><h3 className="font-display text-lg text-charcoal">Sesiones por estado</h3><div className="mt-4 flex flex-col gap-2">{reporte.porEstado?.map((item) => <div key={item.estado} className="flex justify-between text-sm"><span>{item.estado}</span><strong>{item.cantidad}</strong></div>)}</div></div>
  </div>;
}