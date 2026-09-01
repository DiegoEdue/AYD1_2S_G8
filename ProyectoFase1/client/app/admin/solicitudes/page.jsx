"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function SolicitudesPage() {
    const { mostrarToast } = useToast();
    const [rol, setRol] = useState("estudiante");
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [confirmacion, setConfirmacion] = useState(null); // { solicitud, accion }

    useEffect(() => {
        const t = setTimeout(() => {
        setCargando(false);
        }, 300);
        return () => clearTimeout(t);
    }, []);

    const filtradas = solicitudes.filter((s) => s.rol === rol);

    async function confirmarAccion() {
        const { solicitud, accion } = confirmacion;
        try {
        setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id));
        mostrarToast(
            accion === "aprobar"
            ? `${solicitud.nombre} fue aprobado. Se le notificó por correo.`
            : `${solicitud.nombre} fue rechazado. Se le notificó por correo.`,
            accion === "aprobar" ? "exito" : "info"
        );
        } catch (err) {
        mostrarToast(err.message, "error");
        } finally {
        setConfirmacion(null);
        }
    }

    return (
        <div className="flex flex-col gap-6">
        <div>
            <h2 className="font-display text-xl text-charcoal">Solicitudes pendientes</h2>
            <p className="text-sm text-charcoal-light">
            Revisa y aprueba o rechaza el registro de nuevos estudiantes y tutores.
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
            columnas={["Nombre", "Carnet/ID", "Correo", "Detalle", "Acciones"]}
            filas={filtradas}
            vacio="No hay solicitudes pendientes en esta categoría."
            renderFila={(s) => (
                <>
                <td className="px-4 py-3 font-medium text-charcoal">{s.nombre}</td>
                <td className="px-4 py-3 text-charcoal-light">{s.carnet}</td>
                <td className="px-4 py-3 text-charcoal-light">{s.correo}</td>
                <td className="px-4 py-3 text-charcoal-light">
                    {s.rol === "tutor" ? s.especialidad : s.genero}
                </td>
                <td className="px-4 py-3">
                    <div className="flex gap-2">
                    <Button
                        variante="secundario"
                        tamanio="sm"
                        onClick={() => setConfirmacion({ solicitud: s, accion: "aprobar" })}
                    >
                        Aceptar
                    </Button>
                    <Button
                        variante="peligro"
                        tamanio="sm"
                        onClick={() => setConfirmacion({ solicitud: s, accion: "rechazar" })}
                    >
                        Rechazar
                    </Button>
                    </div>
                </td>
                </>
            )}
            />
        )}

        <Modal
            abierto={!!confirmacion}
            onCerrar={() => setConfirmacion(null)}
            titulo={
            confirmacion?.accion === "aprobar" ? "¿Aprobar esta solicitud?" : "¿Rechazar esta solicitud?"
            }
            footer={
            <>
                <Button variante="fantasma" onClick={() => setConfirmacion(null)}>
                Volver
                </Button>
                <Button
                variante={confirmacion?.accion === "aprobar" ? "secundario" : "peligro"}
                onClick={confirmarAccion}
                >
                Sí, {confirmacion?.accion === "aprobar" ? "aprobar" : "rechazar"}
                </Button>
            </>
            }
        >
            {confirmacion && (
            <p>
                {confirmacion.accion === "aprobar"
                ? `${confirmacion.solicitud.nombre} podrá iniciar sesión de inmediato.`
                : `${confirmacion.solicitud.nombre} no podrá acceder a la plataforma.`}{" "}
                Se le enviará un correo de notificación con el resultado.
            </p>
            )}
        </Modal>
        </div>
    );
}
