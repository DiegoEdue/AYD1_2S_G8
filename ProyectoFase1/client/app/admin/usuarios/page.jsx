"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import StatusPill from "@/components/ui/StatusPill";
import { useToast } from "@/components/ui/Toast";
import {
  listarEstudiantesAprobados,
  darDeBajaEstudiante,
  listarTutoresAprobados,
  darDeBajaTutor,
} from "@/lib/api/admin";

export default function UsuariosPage() {
  const { mostrarToast } = useToast();
  const [rol, setRol] = useState("estudiante");
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de confirmación de baja
  const [usuarioBaja, setUsuarioBaja] = useState(null);
  const [motivoBaja, setMotivoBaja] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    async function cargarUsuarios() {
      setCargando(true);
      try {
        let response;
        if (rol === "estudiante") {
          response = await listarEstudiantesAprobados();
        } else {
          response = await listarTutoresAprobados();
        }

        const data = Array.isArray(response?.data) ? response.data : [];
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsuarios([]);
        mostrarToast("No pudimos cargar el listado de usuarios.", "error");
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, [rol, mostrarToast]);

  async function confirmarDarDeBaja() {
    if (!usuarioBaja) return;

    setProcesando(true);
    try {
      if (rol === "estudiante") {
        await darDeBajaEstudiante(usuarioBaja.id_estudiante, motivoBaja);
      } else {
        await darDeBajaTutor(usuarioBaja.id_tutor, motivoBaja);
      }

      const idClave = rol === "estudiante" ? "id_estudiante" : "id_tutor";
      setUsuarios((actuales) =>
        actuales.map((item) =>
          item[idClave] === usuarioBaja[idClave]
            ? { ...item, estado_aprobacion: "baja" }
            : item
        )
      );

      const nombreCompleto = `${usuarioBaja.nombre} ${usuarioBaja.apellido}`;
      mostrarToast(
        `${rol === "estudiante" ? "Estudiante" : "Tutor"} ${nombreCompleto} dado de baja correctamente.`,
        "exito"
      );
    } catch (error) {
      console.error("Error al dar de baja:", error);
      mostrarToast(
        error.message || "No pudimos procesar la baja del usuario.",
        "error"
      );
    } finally {
      setProcesando(false);
      setUsuarioBaja(null);
      setMotivoBaja("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-charcoal">
          Gestión de Usuarios Aprobados
        </h2>
        <p className="text-sm text-charcoal-light">
          Consulta los estudiantes y tutores activos en la plataforma y gestiona sus bajas administrativas.
        </p>
      </div>

      <Tabs
        tabs={[
          { valor: "estudiante", etiqueta: "Estudiantes Aprobados" },
          { valor: "tutor", etiqueta: "Tutores Aprobados" },
        ]}
        activo={rol}
        onCambiar={setRol}
      />

      {cargando ? (
        <p className="text-sm text-charcoal-light">Cargando usuarios aprobados…</p>
      ) : (
        <Table
          columnas={[
            "Usuario",
            "Carnet / ID",
            "Correo Electrónico",
            rol === "estudiante" ? "Género" : "Especialidad / Universidad",
            "Estado",
            "Acciones",
          ]}
          filas={usuarios}
          vacio={`No hay ${rol === "estudiante" ? "estudiantes" : "tutores"} aprobados para mostrar.`}
          renderFila={(u) => {
            const isEstudiante = rol === "estudiante";
            const id = isEstudiante ? u.id_estudiante : u.id_tutor;
            const carnet = isEstudiante ? u.carnet : u.carnet_id;
            const detalle = isEstudiante
              ? u.genero
              : u.universidad_graduacion || u.direccion_tutoria || "-";
            const estaDadoDeBaja = u.estado_aprobacion === "baja";

            return (
              <>
                <td className="px-4 py-3 font-medium text-charcoal">
                  <div className="flex items-center gap-3">
                    <Avatar
                      nombre={`${u.nombre} ${u.apellido}`}
                      foto={u.foto_url}
                      size="h-9 w-9"
                    />
                    <div>
                      <p className="font-semibold text-charcoal">
                        {u.nombre} {u.apellido}
                      </p>
                      {isEstudiante && u.telefono && (
                        <p className="text-xs text-charcoal-light">Tel: {u.telefono}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-light font-mono text-xs">
                  {carnet || "-"}
                </td>
                <td className="px-4 py-3 text-charcoal-light">{u.correo}</td>
                <td className="px-4 py-3 text-charcoal-light">{detalle}</td>
                <td className="px-4 py-3">
                  <StatusPill estado={u.estado_aprobacion || "aprobado"} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    variante="peligro"
                    tamanio="sm"
                    disabled={estaDadoDeBaja}
                    onClick={() => {
                      setUsuarioBaja(u);
                      setMotivoBaja("");
                    }}
                  >
                    {estaDadoDeBaja ? "Dado de baja" : "Dar de baja"}
                  </Button>
                </td>
              </>
            );
          }}
        />
      )}

      {/* Modal de confirmación para dar de baja */}
      <Modal
        abierto={!!usuarioBaja}
        onCerrar={() => !procesando && setUsuarioBaja(null)}
        titulo={`¿Dar de baja a ${rol === "estudiante" ? "este estudiante" : "este tutor"}?`}
        footer={
          <>
            <Button
              variante="fantasma"
              disabled={procesando}
              onClick={() => setUsuarioBaja(null)}
            >
              Cancelar
            </Button>
            <Button
              variante="peligro"
              disabled={procesando}
              onClick={confirmarDarDeBaja}
            >
              {procesando ? "Procesando…" : "Sí, dar de baja"}
            </Button>
          </>
        }
      >
        {usuarioBaja && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-charcoal">
              Estás a punto de dar de baja a{" "}
              <strong className="font-semibold">
                {usuarioBaja.nombre} {usuarioBaja.apellido}
              </strong>. Su acceso a la plataforma quedará suspendido y se le notificará vía correo electrónico.
            </p>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="motivo" className="text-xs font-medium text-charcoal-light">
                Motivo de la baja (opcional):
              </label>
              <textarea
                id="motivo"
                rows={3}
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                placeholder="Ejemplo: Incumplimiento de las normas institucionales..."
                className="w-full rounded-md border border-charcoal/20 p-2 text-sm text-charcoal focus:border-crimson focus:outline-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}