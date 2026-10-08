"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import PdfViewerModal from "@/components/ui/PdfViewerModal";
import { useToast } from "@/components/ui/Toast";
import {
  aprobarSolicitud,
  listarSolicitudes,
  rechazarSolicitud,
  obtenerDocumentoEstudiante,
  obtenerDocumentoTutor,
} from "@/lib/api/admin";

export default function SolicitudesPage() {
  const { mostrarToast } = useToast();
  const [rol, setRol] = useState("estudiante");
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [confirmacion, setConfirmacion] = useState(null);
  const [documentoVisor, setDocumentoVisor] = useState(null);
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  useEffect(() => {
    async function cargarSolicitudes() {
      setCargando(true);
      try {
        const response = await listarSolicitudes();
        const data = Array.isArray(response?.data) ? response.data : [];
        setSolicitudes(
          data.map((s) => ({
            id: s.id_estudiante ?? s.id_tutor ?? s.id,
            rol: s.tipo_usuario || (s.id_tutor ? "tutor" : "estudiante"),
            nombre: `${s.nombre ?? ""} ${s.apellido ?? ""}`.trim() || "Usuario",
            carnet: s.carnet || s.carnet_id || "-",
            correo: s.correo || s.email || "-",
            genero: s.genero || "-",
            fechaNacimiento: s.fecha_nacimiento || s.fechaNacimiento || "-",
            foto: s.foto_url || s.foto || "",
            identificacionTutor:
              s.numero_identificacion_tutor ||
              s.identificacion_tutor ||
              s.numero_identificacion ||
              "-",
            especialidad: s.especialidad || s.area_especialidad || "-",
            carnetPdfUrl:
              s.carnet_pdf_url ||
              s.pdf_carnet_url ||
              s.carnet_pdf ||
              s.pdf_url ||
              "",
            cvPdfUrl:
              s.cv_pdf_url ||
              s.pdf_cv_url ||
              s.cv_pdf ||
              s.cv_url ||
              s.pdf_url ||
              "",
          }))
        );
      } catch (error) {
        setSolicitudes([]);
      } finally {
        setCargando(false);
      }
    }

    cargarSolicitudes();
  }, []);

  const filtradas = solicitudes.filter((s) => s.rol === rol);

  async function ejecutarAccion(solicitud, accion) {
    setProcesandoAccion(true);
    try {
      if (accion === "aprobar") {
        await aprobarSolicitud(solicitud.id, solicitud.rol);
      } else {
        await rechazarSolicitud(solicitud.id, solicitud.rol);
      }

      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id));

      if (documentoVisor?.solicitud?.id === solicitud.id) {
        setDocumentoVisor(null);
      }

      mostrarToast(
        accion === "aprobar"
          ? `Solicitud de ${solicitud.nombre} aprobada con éxito. Se le notificó por correo.`
          : `Solicitud de ${solicitud.nombre} rechazada. Se le notificó por correo.`,
        accion === "aprobar" ? "exito" : "info"
      );
    } catch (err) {
      mostrarToast(err.message || "No pudimos completar la acción.", "error");
    } finally {
      setProcesandoAccion(false);
      setConfirmacion(null);
    }
  }

  async function abrirVisorDocumento(s, tipo) {
    let urlDoc = tipo === "carnet" ? s.carnetPdfUrl : s.cvPdfUrl;
    try {
      if (tipo === "carnet") {
        const docRes = await obtenerDocumentoEstudiante(s.id);
        if (docRes?.data?.carnet_pdf_url) {
          urlDoc = docRes.data.carnet_pdf_url;
        }
      } else {
        const docRes = await obtenerDocumentoTutor(s.id);
        if (docRes?.data?.cv_pdf_url) {
          urlDoc = docRes.data.cv_pdf_url;
        }
      }
    } catch (err) {
      console.warn("No se pudo obtener URL firmada del documento, usando fallback:", err);
    }

    setDocumentoVisor({
      solicitud: s,
      tipoDocumento: tipo,
      titulo:
        tipo === "carnet"
          ? `Carnet Escaneado: ${s.nombre}`
          : `Curriculum Vitae: ${s.nombre}`,
      subTitulo:
        tipo === "carnet"
          ? `Carnet / ID: ${s.carnet} · Correo: ${s.correo}`
          : `Especialidad: ${s.especialidad} · Correo: ${s.correo}`,
      documentoUrl: urlDoc,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Solicitudes pendientes</h2>
        <p className="text-sm text-charcoal-light">
          Revisa y valida la documentación adjunta antes de aprobar o rechazar nuevos estudiantes y tutores.
        </p>
      </div>

      <Tabs
        tabs={[
          { valor: "estudiante", etiqueta: "Estudiantes" },
          { valor: "tutor", etiqueta: "Tutores" },
        ]}
        activo={rol}
        onCambiar={setRol}
      />

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando solicitudes…</p>
      ) : (
        <Table
          columnas={
            rol === "estudiante"
              ? [
                  "Estudiante",
                  "Carnet",
                  "Género",
                  "Fecha de Nacimiento",
                  "Correo Institucional",
                  "Carnet Escaneado",
                  "Acciones",
                ]
              : [
                  "Tutor",
                  "Carnet / ID",
                  "No. Identificación",
                  "Género",
                  "Especialidad",
                  "Correo",
                  "Curriculum Vitae",
                  "Acciones",
                ]
          }
          filas={filtradas}
          vacio={`No hay solicitudes de ${rol === "estudiante" ? "estudiantes" : "tutores"} pendientes en este momento.`}
          renderFila={(s) => {
            const isEstudiante = s.rol === "estudiante";
            return (
              <>
                {/* Fotografía / Avatar y Nombre */}
                <td className="px-4 py-3 font-medium text-charcoal">
                  <div className="flex items-center gap-3">
                    <Avatar
                      nombre={s.nombre}
                      foto={s.foto || ""}
                      size="h-9 w-9"
                      textSize="text-xs"
                    />
                    <div>
                      <span className="font-semibold">{s.nombre}</span>
                    </div>
                  </div>
                </td>

                {/* Carnet */}
                <td className="px-4 py-3 font-mono text-xs text-charcoal-light">
                  {s.carnet}
                </td>

                {/* Tutor: No. Identificación */}
                {!isEstudiante && (
                  <td className="px-4 py-3 font-mono text-xs text-charcoal-light">
                    {s.identificacionTutor}
                  </td>
                )}

                {/* Género */}
                <td className="px-4 py-3 text-xs text-charcoal-light">
                  {s.genero}
                </td>

                {/* Estudiante: Fecha de Nacimiento */}
                {isEstudiante && (
                  <td className="px-4 py-3 text-xs text-charcoal-light">
                    {s.fechaNacimiento}
                  </td>
                )}

                {/* Tutor: Especialidad */}
                {!isEstudiante && (
                  <td className="px-4 py-3 text-xs text-charcoal-light">
                    {s.especialidad}
                  </td>
                )}

                {/* Correo */}
                <td className="px-4 py-3 text-xs text-charcoal-light">
                  {s.correo}
                </td>

                {/* Visor PDF de Carnet o CV */}
                <td className="px-4 py-3">
                  <Button
                    variante="fantasma"
                    tamanio="sm"
                    className="border border-charcoal/20 hover:border-charcoal/40"
                    onClick={() =>
                      abrirVisorDocumento(s, isEstudiante ? "carnet" : "cv")
                    }
                  >
                    <Icon name="Documento" className="h-4 w-4 text-crimson" />
                    <span>
                      {isEstudiante ? "Ver Carnet PDF" : "Ver CV PDF"}
                    </span>
                  </Button>
                </td>

                {/* Botones de acción */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variante="secundario"
                      tamanio="sm"
                      onClick={() =>
                        setConfirmacion({ solicitud: s, accion: "aprobar" })
                      }
                    >
                      Aceptar
                    </Button>
                    <Button
                      variante="peligro"
                      tamanio="sm"
                      onClick={() =>
                        setConfirmacion({ solicitud: s, accion: "rechazar" })
                      }
                    >
                      Rechazar
                    </Button>
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {/* Visor Embebido de PDF */}
      <PdfViewerModal
        abierto={!!documentoVisor}
        onCerrar={() => setDocumentoVisor(null)}
        titulo={documentoVisor?.titulo}
        subTitulo={documentoVisor?.subTitulo}
        documentoUrl={documentoVisor?.documentoUrl}
        tipoDocumento={documentoVisor?.tipoDocumento}
        datosUsuario={documentoVisor?.solicitud}
        onAprobar={() =>
          setConfirmacion({
            solicitud: documentoVisor.solicitud,
            accion: "aprobar",
          })
        }
        onRechazar={() =>
          setConfirmacion({
            solicitud: documentoVisor.solicitud,
            accion: "rechazar",
          })
        }
      />

      {/* Modal de Confirmación de Aprobación / Rechazo */}
      <Modal
        abierto={!!confirmacion}
        onCerrar={() => !procesandoAccion && setConfirmacion(null)}
        titulo={
          confirmacion?.accion === "aprobar"
            ? "¿Aprobar esta solicitud de registro?"
            : "¿Rechazar esta solicitud de registro?"
        }
        footer={
          <>
            <Button
              variante="fantasma"
              disabled={procesandoAccion}
              onClick={() => setConfirmacion(null)}
            >
              Cancelar
            </Button>
            <Button
              variante={
                confirmacion?.accion === "aprobar" ? "secundario" : "peligro"
              }
              disabled={procesandoAccion}
              onClick={() =>
                ejecutarAccion(confirmacion.solicitud, confirmacion.accion)
              }
            >
              {procesandoAccion
                ? "Procesando…"
                : confirmacion?.accion === "aprobar"
                ? "Sí, aprobar"
                : "Sí, rechazar"}
            </Button>
          </>
        }
      >
        {confirmacion && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-charcoal">
              {confirmacion.accion === "aprobar"
                ? `El usuario ${confirmacion.solicitud.nombre} quedará habilitado para ingresar y utilizar la plataforma.`
                : `La solicitud de ${confirmacion.solicitud.nombre} será declinada y no tendrá acceso al sistema.`}
            </p>
            <p className="text-xs text-charcoal-light">
              Se enviará automáticamente una notificación por correo electrónico a{" "}
              <strong>{confirmacion.solicitud.correo}</strong> con la resolución administrativa.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
