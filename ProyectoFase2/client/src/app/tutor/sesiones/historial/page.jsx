"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import Button from "@/components/ui/Button";
import PlanEstudioDetalle from "@/components/ui/PlanEstudioDetalle";
import EvaluacionSesion from "@/components/sesiones/EvaluacionSesion";
import { listarHistorialTutor, obtenerDetalleSesionTutor } from "@/lib/api/sesiones";

const TAMANIO_PAGINA = 20;

function normalizarEstado(estado = "") {
  return estado.toLowerCase().replaceAll("_", "-");
}

function resumenCancelacion(estado) {
  const normalizado = normalizarEstado(estado);
  if (normalizado === "cancelada-tutor") return "Cancelada por tutor";
  if (normalizado === "cancelada-estudiante") return "Cancelada por estudiante";
  return undefined;
}

const ESPERA_MAX_MS = 15000;

function conTiempoLimite(promesa, ms) {
  let temporizador;
  const limite = new Promise((_, rechazar) => {
    temporizador = setTimeout(() => rechazar(new Error("El servidor tardó demasiado en responder.")), ms);
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(temporizador));
}

// El historial solo trae la fila de la sesión; el plan se pide al abrir cada tarjeta.
function DetallePlan({ detalle, onCargar, onReintentar }) {
  const raiz = useRef(null);
  const cargarRef = useRef(onCargar);

  useEffect(() => {
    cargarRef.current = onCargar;
  });

  useEffect(() => {
    const contenedor = raiz.current?.closest("details");
    if (!contenedor) {
      cargarRef.current();
      return undefined;
    }
    if (contenedor.open) cargarRef.current();
    const alCambiar = () => {
      if (contenedor.open) cargarRef.current();
    };
    contenedor.addEventListener("toggle", alCambiar);
    return () => contenedor.removeEventListener("toggle", alCambiar);
  }, []);

  let contenido;
  if (!detalle || detalle.estado === "cargando") {
    contenido = <p className="text-sm text-charcoal-light">Cargando plan de estudio…</p>;
  } else if (detalle.estado === "error") {
    contenido = (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
      >
        {detalle.mensaje}
        <Button variante="peligro" tamanio="sm" onClick={onReintentar}>
          Reintentar
        </Button>
      </div>
    );
  } else if (!detalle.plan) {
    contenido = <p className="text-sm text-charcoal-light">Esta sesión no tiene un plan de estudio registrado.</p>;
  } else {
    contenido = <PlanEstudioDetalle dificultades={detalle.plan.dificultades} recursos={detalle.plan.recursos} />;
  }

  return <div ref={raiz}>{contenido}</div>;
}

export default function HistorialTutorPage() {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [hayMas, setHayMas] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState("");
  const [detalles, setDetalles] = useState({});
  const iniciados = useRef(new Set());

  const cargarPagina = useCallback(async (numero) => {
    const response = await listarHistorialTutor({ page: numero, pageSize: TAMANIO_PAGINA });
    const data = Array.isArray(response?.data) ? response.data : [];
    setSesiones((prev) => (numero === 1 ? data : [...prev, ...data]));
    setPagina(numero);
    setHayMas(data.length === TAMANIO_PAGINA);
  }, []);

  const cargarInicial = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      await cargarPagina(1);
    } catch (err) {
      setError(err.message || "No pudimos cargar tu historial.");
    } finally {
      setCargando(false);
    }
  }, [cargarPagina]);

  useEffect(() => {
    cargarInicial();
  }, [cargarInicial]);

  async function cargarMas() {
    setCargandoMas(true);
    try {
      await cargarPagina(pagina + 1);
    } catch (err) {
      setError(err.message || "No pudimos cargar más sesiones.");
    } finally {
      setCargandoMas(false);
    }
  }

  // Refleja en la lista la calificación o el reporte recién enviados.
  function actualizarSesion(id, cambios) {
    setSesiones((actuales) => actuales.map((s) => (s.id === id ? { ...s, ...cambios } : s)));
  }

  async function cargarDetalle(id, { forzar = false } = {}) {
    if (!forzar && iniciados.current.has(id)) return;
    iniciados.current.add(id);

    setDetalles((prev) => ({ ...prev, [id]: { estado: "cargando" } }));
    try {
      const detalle = await conTiempoLimite(obtenerDetalleSesionTutor(id), ESPERA_MAX_MS);
      setDetalles((prev) => ({
        ...prev,
        [id]: { estado: "listo", plan: detalle.plan, materia: detalle.materia },
      }));
    } catch (err) {
      iniciados.current.delete(id);
      setDetalles((prev) => ({
        ...prev,
        [id]: { estado: "error", mensaje: err.message || "No pudimos cargar el plan de estudio." },
      }));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Historial de tutorías</h2>
        <p className="text-sm text-charcoal-light">Consulta tus sesiones atendidas y canceladas. En las atendidas puedes calificar o reportar al estudiante.</p>
      </div>

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando historial…</p>
      ) : error && sesiones.length === 0 ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
        >
          {error}
          <Button variante="peligro" tamanio="sm" onClick={cargarInicial}>
            Reintentar
          </Button>
        </div>
      ) : sesiones.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">Todavía no tienes sesiones en tu historial.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sesiones.map((sesion) => {
            const estado = normalizarEstado(sesion.estado);
            const atendida = estado === "atendida";
            const detalle = detalles[sesion.id];
            return (
              <SessionCard
                key={sesion.id}
                sesion={{
                  ...sesion,
                  materia: sesion.materia || detalle?.materia || "Tutoría",
                  direccion: sesion.direccion || "Online",
                  estado,
                  resumen: sesion.resumen || sesion.estadoDescripcion || resumenCancelacion(sesion.estado),
                }}
                contraparteLabel="Estudiante"
                contraparteNombre={sesion.estudiante}
                acciones={
                  atendida ? (
                    <EvaluacionSesion
                      rol="tutor"
                      sesion={{ ...sesion, estado }}
                      contraparte={sesion.estudiante}
                      onActualizar={actualizarSesion}
                    />
                  ) : undefined
                }
                detalleEtiqueta="Ver plan de estudio"
                detalle={
                  atendida ? (
                    <DetallePlan
                      detalle={detalle}
                      onCargar={() => cargarDetalle(sesion.id)}
                      onReintentar={() => cargarDetalle(sesion.id, { forzar: true })}
                    />
                  ) : undefined
                }
              />
            );
          })}

          {error && (
            <p role="alert" className="text-sm font-medium text-crimson">
              {error}
            </p>
          )}
          {hayMas && (
            <div className="flex justify-center">
              <Button variante="fantasma" cargando={cargandoMas} onClick={cargarMas}>
                Cargar más sesiones
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}