"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusPill from "@/components/ui/StatusPill";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { listarDenuncias, resolverDenuncia } from "@/lib/api/admin";

export default function DenunciasPage() {
  const { mostrarToast } = useToast();
  const [tipo, setTipo] = useState("tutores"); // "tutores" | "estudiantes"
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para modal de resolución (Dar de baja o Rechazar denuncia)
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState(null);
  const [accionResolucion, setAccionResolucion] = useState(null); // "dar_de_baja" | "rechazar_denuncia"
  const [motivoResolucion, setMotivoResolucion] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    async function cargarDenuncias() {
      setCargando(true);
      try {
        const response = await listarDenuncias(tipo);
        const data = Array.isArray(response?.data) ? response.data : [];
        setDenuncias(data);
      } catch (error) {
        setDenuncias([]);
      } finally {
        setCargando(false);
      }
    }

    cargarDenuncias();
  }, [tipo]);

  async function confirmarResolucion() {
    if (!denunciaSeleccionada || !accionResolucion) return;

    setProcesando(true);
    try {
      await resolverDenuncia(denunciaSeleccionada.id, accionResolucion, motivoResolucion);

      setDenuncias((prev) =>
        prev.map((d) =>
          d.id === denunciaSeleccionada.id
            ? {
                ...d,
                estado: accionResolucion === "dar_de_baja" ? "sancionado" : "descartado",
              }
            : d
        )
      );

      mostrarToast(
        accionResolucion === "dar_de_baja"
          ? `Se aplicó la baja al usuario ${denunciaSeleccionada.denunciado_nombre} y se notificó por correo.`
          : `La denuncia contra ${denunciaSeleccionada.denunciado_nombre} fue rechazada y descartada.`,
        accionResolucion === "dar_de_baja" ? "exito" : "info"
      );
    } catch (err) {
      mostrarToast(err.message || "No se pudo procesar la resolución.", "error");
    } finally {
      setProcesando(false);
      setDenunciaSeleccionada(null);
      setAccionResolucion(null);
      setMotivoResolucion("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">
          Inspección y Moderación de Denuncias
        </h2>
        <p className="text-sm text-charcoal-light">
          Evalúa los reportes presentados entre estudiantes y tutores para sancionar faltas o descartar quejas infundadas.
        </p>
      </div>

      <Tabs
        tabs={[
          { valor: "tutores", etiqueta: "Denuncias contra Tutores" },
          { valor: "estudiantes", etiqueta: "Denuncias contra Estudiantes" },
        ]}
        activo={tipo}
        onCambiar={setTipo}
      />

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando denuncias…</p>
      ) : (
        <Table
          columnas={[
            "Categoría",
            "Motivo / Explicación",
            tipo === "tutores" ? "Tutor Denunciado" : "Estudiante Denunciado",
            tipo === "tutores" ? "Estudiante Denunciante" : "Tutor Denunciante",
            "Fecha",
            "Estado",
            "Acciones",
          ]}
          filas={denuncias}
          vacio={`No hay denuncias activas contra ${tipo === "tutores" ? "tutores" : "estudiantes"} en este momento.`}
          renderFila={(d) => {
            const yaResuelto = d.estado === "sancionado" || d.estado === "descartado";

            return (
              <>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-md bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson">
                    {d.categoria || "Conducta"}
                  </span>
                </td>
                <td className="max-w-xs px-4 py-3 text-xs text-charcoal">
                  <p className="line-clamp-2">{d.motivo || d.descripcion || "-"}</p>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal">
                  <div className="flex items-center gap-2">
                    <Avatar
                      nombre={d.denunciado_nombre || "Usuario"}
                      foto={d.denunciado_foto || ""}
                      size="h-8 w-8"
                      textSize="text-xs"
                    />
                    <span className="text-xs font-semibold">
                      {d.denunciado_nombre || "Usuario"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-charcoal-light">
                  {d.denunciante_nombre || "Anónimo"}
                </td>
                <td className="px-4 py-3 text-xs text-charcoal-light font-mono">
                  {d.fecha ? d.fecha.substring(0, 10) : "-"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill estado={d.estado || "pendiente"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variante="peligro"
                      tamanio="sm"
                      disabled={yaResuelto}
                      onClick={() => {
                        setDenunciaSeleccionada(d);
                        setAccionResolucion("dar_de_baja");
                        setMotivoResolucion("");
                      }}
                    >
                      Dar de baja
                    </Button>
                    <Button
                      variante="fantasma"
                      tamanio="sm"
                      className="border border-charcoal/20"
                      disabled={yaResuelto}
                      onClick={() => {
                        setDenunciaSeleccionada(d);
                        setAccionResolucion("rechazar_denuncia");
                        setMotivoResolucion("");
                      }}
                    >
                      Rechazar denuncia
                    </Button>
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {/* Modal de Resolución de Denuncia */}
      <Modal
        abierto={!!denunciaSeleccionada}
        onCerrar={() => !procesando && setDenunciaSeleccionada(null)}
        titulo={
          accionResolucion === "dar_de_baja"
            ? `¿Dar de baja a ${denunciaSeleccionada?.denunciado_nombre}?`
            : "¿Rechazar y descartar esta denuncia?"
        }
        footer={
          <>
            <Button
              variante="fantasma"
              disabled={procesando}
              onClick={() => setDenunciaSeleccionada(null)}
            >
              Cancelar
            </Button>
            <Button
              variante={accionResolucion === "dar_de_baja" ? "peligro" : "secundario"}
              disabled={procesando}
              onClick={confirmarResolucion}
            >
              {procesando
                ? "Procesando…"
                : accionResolucion === "dar_de_baja"
                ? "Sí, dar de baja"
                : "Sí, rechazar denuncia"}
            </Button>
          </>
        }
      >
        {denunciaSeleccionada && (
          <div className="flex flex-col gap-4 text-left">
            <p className="text-sm text-charcoal">
              {accionResolucion === "dar_de_baja"
                ? `Al confirmar, la cuenta de ${denunciaSeleccionada.denunciado_nombre} quedará suspendida y se aplicará la sanción administrativa por la denuncia recibida.`
                : `La denuncia será marcada como infundada y descartada sin afectar la cuenta de ${denunciaSeleccionada.denunciado_nombre}.`}
            </p>

            <div className="rounded-lg border border-charcoal/10 bg-paper/40 p-3 text-xs">
              <p className="font-semibold text-charcoal">Detalle del reporte:</p>
              <p className="mt-1 text-charcoal-light">
                {denunciaSeleccionada.motivo || denunciaSeleccionada.descripcion || "Sin detalle adicional."}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="motivoResolucion" className="text-xs font-medium text-charcoal-light">
                Comentarios / Justificación administrativa (opcional):
              </label>
              <textarea
                id="motivoResolucion"
                rows={2}
                value={motivoResolucion}
                onChange={(e) => setMotivoResolucion(e.target.value)}
                placeholder="Observaciones de la resolución..."
                className="w-full rounded-md border border-charcoal/20 p-2 text-xs text-charcoal focus:border-crimson focus:outline-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
