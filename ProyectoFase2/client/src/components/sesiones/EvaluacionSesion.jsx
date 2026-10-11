"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { EstrellasLectura } from "@/components/ui/Estrellas";
import { useToast } from "@/components/ui/Toast";
import FormularioCalificacion, { FORM_CALIFICACION_ID } from "./FormularioCalificacion";
import FormularioReporte, { FORM_REPORTE_ID } from "./FormularioReporte";
import { calificarContraparte, reportarContraparte } from "@/lib/api/evaluaciones";
import { CATEGORIAS_REPORTE_ESTUDIANTE, CATEGORIAS_REPORTE_TUTOR, esSesionAtendida } from "@/lib/evaluaciones";

// Botones y formularios para calificar o reportar a la contraparte de una sesión atendida.
//   rol="estudiante" -> califica/reporta al tutor      (HU-033, HU-034)
//   rol="tutor"      -> califica/reporta al estudiante (HU-036, HU-037)
// En sesiones que no están atendidas (activas, pendientes, canceladas) no muestra nada.
export default function EvaluacionSesion({ rol, sesion, contraparte, onActualizar }) {
  const { mostrarToast } = useToast();
  const [modal, setModal] = useState(null); // "calificar" | "reportar" | null
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  if (!esSesionAtendida(sesion)) return null;

  const esEstudiante = rol === "estudiante";
  const objeto = esEstudiante ? "tutor" : "estudiante";
  const categorias = esEstudiante ? CATEGORIAS_REPORTE_TUTOR : CATEGORIAS_REPORTE_ESTUDIANTE;

  function abrir(cual) {
    setErrorServidor("");
    setModal(cual);
  }

  function cerrar() {
    if (!enviando) setModal(null);
  }

  async function enviar(accion, datos, cambios, mensajeExito, mensajeError) {
    setEnviando(true);
    setErrorServidor("");
    try {
      await accion(rol, sesion.id, datos);
      onActualizar(sesion.id, cambios);
      mostrarToast(mensajeExito, "exito");
      setModal(null);
    } catch (err) {
      setErrorServidor(err.message || mensajeError);
    } finally {
      setEnviando(false);
    }
  }

  const calificar = (datos) =>
    enviar(
      calificarContraparte,
      datos,
      { calificacion: datos },
      "Gracias, tu calificación quedó registrada.",
      "No pudimos registrar tu calificación. Inténtalo de nuevo."
    );

  const reportar = (datos) =>
    enviar(
      reportarContraparte,
      datos,
      { reportada: true },
      "Reporte enviado. La administración lo revisará.",
      "No pudimos enviar tu reporte. Inténtalo de nuevo."
    );

  return (
    <>
      <div className="flex flex-col gap-2 sm:items-end">
        {sesion.calificacion ? (
          <span className="inline-flex items-center gap-2 text-xs text-charcoal-light">
            Tu calificación
            <EstrellasLectura valor={sesion.calificacion.estrellas} />
          </span>
        ) : (
          <Button variante="suave" tamanio="sm" onClick={() => abrir("calificar")}>
            Calificar {objeto}
          </Button>
        )}

        {sesion.reportada ? (
          <span className="inline-block rounded-full bg-charcoal/10 px-3 py-1 text-xs font-semibold text-charcoal-light">
            Reporte enviado
          </span>
        ) : (
          <Button variante="peligro" tamanio="sm" onClick={() => abrir("reportar")}>
            Reportar {objeto}
          </Button>
        )}
      </div>

      <Modal
        abierto={modal === "calificar"}
        onCerrar={cerrar}
        titulo={`Calificar ${objeto}`}
        footer={
          <>
            <Button variante="fantasma" disabled={enviando} onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_CALIFICACION_ID} cargando={enviando}>
              Enviar calificación
            </Button>
          </>
        }
      >
        <p className="mb-5 text-charcoal-light">
          {sesion.materia} con {contraparte}.
        </p>
        <FormularioCalificacion
          onEnviar={calificar}
          errorServidor={errorServidor}
          comentarioObligatorio={!esEstudiante}
          etiquetaComentario={esEstudiante ? "Comentario (opcional)" : "Comentario"}
          ayudaComentario={
            esEstudiante ? undefined : "Explica tu evaluación de la actitud y el desempeño del estudiante."
          }
        />
      </Modal>

      <Modal
        abierto={modal === "reportar"}
        onCerrar={cerrar}
        titulo={`Reportar ${objeto}`}
        footer={
          <>
            <Button variante="fantasma" disabled={enviando} onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_REPORTE_ID} variante="peligro" cargando={enviando}>
              Enviar reporte
            </Button>
          </>
        }
      >
        <p className="mb-5 text-charcoal-light">
          {sesion.materia} con {contraparte}. El reporte llega al administrador para su revisión.
        </p>
        <FormularioReporte
          categorias={categorias}
          etiquetaDescripcion={esEstudiante ? "Describe lo ocurrido" : "Detalla los hechos"}
          onEnviar={reportar}
          errorServidor={errorServidor}
        />
      </Modal>
    </>
  );
}
