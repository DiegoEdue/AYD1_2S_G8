"use client";

import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import PlanEstudioDetalle from "@/components/ui/PlanEstudioDetalle";
import { useToast } from "@/components/ui/Toast";
import { descargarPlanPdf, listarPlanesEstudio } from "@/lib/api/plan-estudio";

function formatearFecha(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "No disponible";
  return new Date(y, m - 1, d).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-xs text-charcoal-light">{etiqueta}</dt>
      <dd className="font-medium text-charcoal">{valor || "No disponible"}</dd>
    </div>
  );
}

export default function PlanEstudioPage() {
  const { mostrarToast } = useToast();
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setPlanes(await listarPlanesEstudio());
    } catch (err) {
      setError(
        err.status === 404
          ? "El plan de estudio todavía no está disponible. Inténtalo de nuevo más tarde."
          : err.message || "No pudimos cargar tu plan de estudio."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function descargar(idPlan) {
    setDescargando(idPlan);
    try {
      await descargarPlanPdf(idPlan);
    } catch (err) {
      mostrarToast(err.message || "No pudimos descargar la constancia.", "error");
    } finally {
      setDescargando(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 pb-12">
      <div>
        <h2 className="font-display text-xl text-charcoal">Mi plan de estudio</h2>
        <p className="text-sm text-charcoal-light">
          Las dificultades y los recursos que tus tutores registraron al terminar cada tutoría.
        </p>
      </div>

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando tu plan de estudio…</p>
      ) : error ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
        >
          {error}
          <Button variante="peligro" tamanio="sm" onClick={cargar}>
            Reintentar
          </Button>
        </div>
      ) : planes.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">
            Todavía no tienes un plan de estudio. Aparecerá aquí cuando un tutor atienda una de tus
            sesiones.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {planes.map((plan) => (
            <article
              key={plan.id}
              className="rounded-card border border-charcoal/10 bg-white p-6 shadow-soft"
            >
              <header className="flex flex-col gap-4 border-b border-charcoal/10 pb-5 sm:flex-row sm:items-start">
                <Avatar nombre={plan.tutorNombre || "Tutor"} foto={null} size="h-12 w-12" textSize="text-sm" />
                <div className="flex-1">
                  <h3 className="font-display text-lg text-charcoal">{plan.tutorNombre || "Tutor"}</h3>
                  <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                    <Dato etiqueta="Especialidad" valor={plan.especialidad} />
                    <Dato etiqueta="No. de identificación del tutor" valor={plan.identificacion} />
                    <Dato etiqueta="Fecha de la última sesión" valor={formatearFecha(plan.fecha)} />
                    {plan.materia && <Dato etiqueta="Materia" valor={plan.materia} />}
                  </dl>
                </div>
                <Button
                  variante="suave"
                  tamanio="sm"
                  className="sm:self-start"
                  cargando={descargando === plan.id}
                  onClick={() => descargar(plan.id)}
                >
                  <Icon name="Descargar" className="h-4 w-4" />
                  Descargar constancia (PDF)
                </Button>
              </header>
              <div className="pt-5">
                <PlanEstudioDetalle dificultades={plan.dificultades} recursos={plan.recursos} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
