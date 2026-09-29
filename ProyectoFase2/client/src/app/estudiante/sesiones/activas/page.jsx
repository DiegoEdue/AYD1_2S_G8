"use client";

import { useEffect, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cancelarSesionComoEstudiante, listarSesionesActivasEstudiante } from "@/lib/api/sesiones";

export default function SesionesActivasPage() {
  const { mostrarToast } = useToast();
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [porCancelar, setPorCancelar] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const response = await listarSesionesActivasEstudiante();
        setSesiones(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setSesiones([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  async function cancelar(id) {
    setCancelando(id);
    try {
      await cancelarSesionComoEstudiante(id);
      setSesiones((actuales) => actuales.filter((sesion) => sesion.id !== id));
      mostrarToast("Sesión cancelada correctamente.", "exito");
    } catch (error) {
      mostrarToast(error.message || "No pudimos cancelar la sesión.", "error");
    } finally {
      setCancelando(null);
    }
  }

  async function confirmarCancelacion() {
    if (!porCancelar) return;
    await cancelar(porCancelar.id);
    setPorCancelar(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Mis sesiones</h2>
        <p className="text-sm text-charcoal-light">Consulta tus tutorías programadas y cancela las que ya no necesites.</p>
      </div>

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando tus sesiones…</p>
      ) : sesiones.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">No tienes sesiones activas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sesiones.map((sesion) => (
            <SessionCard
              key={sesion.id}
              sesion={{ ...sesion, direccion: sesion.direccion || "Online", estado: "activa" }}
              contraparteLabel="Tutor"
              contraparteNombre={sesion.tutor}
              acciones={
                <Button
                  variante="peligro"
                  tamanio="sm"
                  onClick={() => setPorCancelar(sesion)}
                  cargando={cancelando === sesion.id}
                >
                  Cancelar
                </Button>
              }
            />
          ))}
        </div>
      )}

      <Modal
        abierto={!!porCancelar}
        onCerrar={() => !cancelando && setPorCancelar(null)}
        titulo="¿Cancelar esta sesión?"
        footer={
          <>
            <Button variante="fantasma" disabled={!!cancelando} onClick={() => setPorCancelar(null)}>
              No, mantener
            </Button>
            <Button variante="peligro" cargando={!!cancelando} onClick={confirmarCancelacion}>
              Sí, cancelar sesión
            </Button>
          </>
        }
      >
        {porCancelar && `Se cancelará la sesión con ${porCancelar.tutor} del ${porCancelar.fecha} a las ${porCancelar.hora}.`}
      </Modal>
    </div>
  );
}