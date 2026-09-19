"use client";

import { useEffect, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import {
  atenderSesion,
  cancelarSesionComoTutor,
  listarSesionesPendientesTutor,
} from "@/lib/api/sesiones";

export default function SesionesPendientesTutorPage() {
  const { mostrarToast } = useToast();
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [porAtender, setPorAtender] = useState(null);
  const [resumen, setResumen] = useState("");
  const [errorResumen, setErrorResumen] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [porCancelar, setPorCancelar] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const response = await listarSesionesPendientesTutor();
        const data = Array.isArray(response?.data) ? response.data : [];
        const ordenadas = [...data].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));
        setSesiones(
          ordenadas.map((s) => ({
            ...s,
            id: s.id ?? s.id_sesion,
            direccion: s.direccion || s.direccion_tutoria || "Online",
            estado: "pendiente",
          }))
        );
      } catch (error) {
        setSesiones([]);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  function abrirAtender(sesion) {
    setPorAtender(sesion);
    setResumen("");
    setErrorResumen("");
  }

  async function confirmarAtender() {
    if (!resumen.trim()) {
      setErrorResumen("Debes escribir un resumen de la sesión antes de continuar.");
      return;
    }

    setGuardando(true);
    try {
      await atenderSesion(porAtender.id, { resumen: resumen.trim() });
      setSesiones((prev) => prev.filter((s) => s.id !== porAtender.id));
      mostrarToast("Sesión marcada como atendida.", "exito");
      setPorAtender(null);
    } catch (err) {
      setErrorResumen(err.message || "No pudimos guardar el resumen.");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarCancelar() {
    try {
      await cancelarSesionComoTutor(porCancelar.id);
      setSesiones((prev) => prev.filter((s) => s.id !== porCancelar.id));
      mostrarToast(`Sesión cancelada. Se notificó por correo a ${porCancelar.estudiante}.`, "info");
      setPorCancelar(null);
    } catch (error) {
      mostrarToast(error.message || "No pudimos cancelar la sesión.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">Sesiones pendientes</h2>
        <p className="text-sm text-charcoal-light">
          Ordenadas por fecha más próxima. Márcalas como atendidas al finalizar cada tutoría.
        </p>
      </div>

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando tus sesiones…</p>
      ) : sesiones.length === 0 ? (
        <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-sm text-charcoal-light">No tienes sesiones pendientes por ahora.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sesiones.map((s) => (
            <SessionCard
              key={s.id}
              sesion={s}
              contraparteLabel="Estudiante"
              contraparteNombre={s.estudiante}
              acciones={
                <>
                  <Button variante="secundario" tamanio="sm" onClick={() => abrirAtender(s)}>
                    Marcar atendida
                  </Button>
                  <Button variante="peligro" tamanio="sm" onClick={() => setPorCancelar(s)}>
                    Cancelar
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <Modal
        abierto={!!porAtender}
        onCerrar={() => setPorAtender(null)}
        titulo="Resumen de la sesión"
        footer={
          <>
            <Button variante="fantasma" onClick={() => setPorAtender(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmarAtender} cargando={guardando}>
              Guardar y marcar atendida
            </Button>
          </>
        }
      >
        <FormField
          label="¿Qué se trabajó en la sesión?"
          name="resumen"
          required
          error={errorResumen}
          ayuda="Este resumen quedará visible para el estudiante en su historial."
        >
          <textarea
            id="resumen"
            rows={4}
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            className={inputClass(!!errorResumen)}
          />
        </FormField>
      </Modal>

      <Modal
        abierto={!!porCancelar}
        onCerrar={() => setPorCancelar(null)}
        titulo="¿Cancelar esta sesión?"
        footer={
          <>
            <Button variante="fantasma" onClick={() => setPorCancelar(null)}>
              No, mantener
            </Button>
            <Button variante="peligro" onClick={confirmarCancelar}>
              Sí, cancelar sesión
            </Button>
          </>
        }
      >
        Se enviará un correo automático a {porCancelar?.estudiante} explicando la cancelación.
      </Modal>
    </div>
  );
}
