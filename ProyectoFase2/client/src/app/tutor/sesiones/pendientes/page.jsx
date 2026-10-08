"use client";

import { useEffect, useState } from "react";
import SessionCard from "@/components/ui/SessionCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FormularioPlanEstudio, { FORM_PLAN_ID } from "@/components/sesiones/FormularioPlanEstudio";
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
  const [errorGuardado, setErrorGuardado] = useState("");
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
    setErrorGuardado("");
  }

  function cerrarAtender() {
    if (!guardando) setPorAtender(null);
  }

  async function guardarPlan(plan) {
    setGuardando(true);
    setErrorGuardado("");
    try {
      await atenderSesion(porAtender.id, plan);
      setSesiones((prev) => prev.filter((s) => s.id !== porAtender.id));
      mostrarToast("Sesión atendida. El plan de estudio quedó registrado en tu historial.", "exito");
      setPorAtender(null);
    } catch (err) {
      setErrorGuardado(err.message || "No pudimos guardar el plan de estudio. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarCancelar() {
    try {
      const respuesta = await cancelarSesionComoTutor(porCancelar.id);
      setSesiones((prev) => prev.filter((s) => s.id !== porCancelar.id));
      if (respuesta?.emailSent === false) {
        mostrarToast(
          `Sesión cancelada, pero no pudimos enviar el correo a ${porCancelar.estudiante}. Avísale por otro medio.`,
          "advertencia"
        );
      } else {
        mostrarToast(`Sesión cancelada. Se notificó por correo a ${porCancelar.estudiante}.`, "info");
      }
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
          Ordenadas por fecha más próxima. Atiéndelas al finalizar cada tutoría registrando el plan de estudio.
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
        ancho="lg"
        onCerrar={cerrarAtender}
        titulo="Atender sesión"
        footer={
          <>
            <Button variante="fantasma" disabled={guardando} onClick={cerrarAtender}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_PLAN_ID} cargando={guardando}>
              Guardar y atender
            </Button>
          </>
        }
      >
        {porAtender && (
          <p className="mb-5 text-charcoal-light">
            {porAtender.materia} con {porAtender.estudiante}. Al guardar, la sesión pasa a atendida y el
            estudiante verá este plan en su Plan de estudio.
          </p>
        )}
        <FormularioPlanEstudio onGuardar={guardarPlan} errorServidor={errorGuardado} />
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
