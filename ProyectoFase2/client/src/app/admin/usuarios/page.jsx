"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusPill from "@/components/ui/StatusPill";
import Avatar from "@/components/ui/Avatar";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import {
  listarEstudiantesAprobados,
  darDeBajaEstudiante,
  listarTutoresAprobados,
  darDeBajaTutor,
  actualizarEstudianteAdmin,
  actualizarTutorAdmin,
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

  // Estado para el modal de edición de perfil (HU-040 y HU-041)
  const [usuarioEdicion, setUsuarioEdicion] = useState(null);
  const [formEdicion, setFormEdicion] = useState({});
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

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

  function abrirModalEdicion(u) {
    setUsuarioEdicion(u);
    if (rol === "estudiante") {
      setFormEdicion({
        nombre: u.nombre || "",
        apellido: u.apellido || "",
        carnet: u.carnet || "",
        genero: u.genero || "M",
        telefono: u.telefono || "",
        direccion: u.direccion || "",
        fecha_nacimiento: u.fecha_nacimiento ? u.fecha_nacimiento.substring(0, 10) : "",
        correo: u.correo || "", // Bloqueado
      });
    } else {
      setFormEdicion({
        nombre: u.nombre || "",
        apellido: u.apellido || "",
        carnet_id: u.carnet_id || "",
        numero_identificacion_tutor: u.numero_identificacion_tutor || "",
        genero: u.genero || "M",
        telefono: u.telefono || "",
        direccion: u.direccion || "",
        fecha_nacimiento: u.fecha_nacimiento ? u.fecha_nacimiento.substring(0, 10) : "",
        universidad_graduacion: u.universidad_graduacion || "",
        especialidad: u.especialidad || "",
        direccion_tutoria: u.direccion_tutoria || "Online",
        anio_inicio_tutorias: u.anio_inicio_tutorias || "",
        correo: u.correo || "", // Bloqueado
      });
    }
  }

  async function guardarCambiosPerfil() {
    if (!usuarioEdicion) return;

    setGuardandoEdicion(true);
    try {
      if (rol === "estudiante") {
        await actualizarEstudianteAdmin(usuarioEdicion.id_estudiante, formEdicion);
        setUsuarios((prev) =>
          prev.map((item) =>
            item.id_estudiante === usuarioEdicion.id_estudiante
              ? { ...item, ...formEdicion }
              : item
          )
        );
      } else {
        await actualizarTutorAdmin(usuarioEdicion.id_tutor, formEdicion);
        setUsuarios((prev) =>
          prev.map((item) =>
            item.id_tutor === usuarioEdicion.id_tutor
              ? { ...item, ...formEdicion }
              : item
          )
        );
      }

      mostrarToast("Datos del usuario actualizados correctamente.", "exito");
      setUsuarioEdicion(null);
    } catch (err) {
      mostrarToast(err.message || "No se pudieron guardar los cambios.", "error");
    } finally {
      setGuardandoEdicion(false);
    }
  }

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
          Consulta, edita perfiles y gestiona las bajas administrativas de estudiantes y tutores activos.
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
            rol === "estudiante" ? "Género / Teléfono" : "Especialidad / Universidad",
            "Estado",
            "Acciones",
          ]}
          filas={usuarios}
          vacio={`No hay ${rol === "estudiante" ? "estudiantes" : "tutores"} aprobados para mostrar.`}
          renderFila={(u) => {
            const isEstudiante = rol === "estudiante";
            const carnet = isEstudiante ? u.carnet : u.carnet_id;
            const detalle = isEstudiante
              ? `${u.genero || "-"} ${u.telefono ? `· Tel: ${u.telefono}` : ""}`
              : u.universidad_graduacion || u.especialidad || "-";
            const estaDadoDeBaja = u.estado_aprobacion === "baja";

            return (
              <>
                <td className="px-4 py-3 font-medium text-charcoal">
                  <div className="flex items-center gap-3">
                    <Avatar
                      nombre={`${u.nombre} ${u.apellido}`}
                      foto={u.foto_url || ""}
                      size="h-9 w-9"
                      textSize="text-xs"
                    />
                    <div>
                      <p className="font-semibold text-charcoal">
                        {u.nombre} {u.apellido}
                      </p>
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
                  <div className="flex items-center gap-2">
                    <Button
                      variante="fantasma"
                      tamanio="sm"
                      className="border border-charcoal/20"
                      disabled={estaDadoDeBaja}
                      onClick={() => abrirModalEdicion(u)}
                    >
                      Editar
                    </Button>
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
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {/* Modal de Edición de Usuario (HU-040 y HU-041) */}
      <Modal
        abierto={!!usuarioEdicion}
        onCerrar={() => !guardandoEdicion && setUsuarioEdicion(null)}
        titulo={`Editar perfil de ${rol === "estudiante" ? "Estudiante" : "Tutor"}`}
        footer={
          <>
            <Button
              variante="fantasma"
              disabled={guardandoEdicion}
              onClick={() => setUsuarioEdicion(null)}
            >
              Cancelar
            </Button>
            <Button
              variante="secundario"
              disabled={guardandoEdicion}
              onClick={guardarCambiosPerfil}
            >
              {guardandoEdicion ? "Guardando…" : "Guardar cambios"}
            </Button>
          </>
        }
      >
        {usuarioEdicion && (
          <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 text-left">
            <FormField label="Nombre" name="nombre" required>
              <input
                value={formEdicion.nombre || ""}
                onChange={(e) =>
                  setFormEdicion({ ...formEdicion, nombre: e.target.value })
                }
                className={inputClass()}
              />
            </FormField>

            <FormField label="Apellido" name="apellido" required>
              <input
                value={formEdicion.apellido || ""}
                onChange={(e) =>
                  setFormEdicion({ ...formEdicion, apellido: e.target.value })
                }
                className={inputClass()}
              />
            </FormField>

            <FormField
              label={rol === "estudiante" ? "Carnet" : "Carnet / ID"}
              name="carnet"
              required
            >
              <input
                value={
                  rol === "estudiante"
                    ? formEdicion.carnet || ""
                    : formEdicion.carnet_id || ""
                }
                onChange={(e) =>
                  setFormEdicion({
                    ...formEdicion,
                    [rol === "estudiante" ? "carnet" : "carnet_id"]: e.target.value,
                  })
                }
                className={inputClass()}
              />
            </FormField>

            {rol === "tutor" && (
              <FormField
                label="No. Identificación (DPI)"
                name="numero_identificacion_tutor"
              >
                <input
                  value={formEdicion.numero_identificacion_tutor || ""}
                  onChange={(e) =>
                    setFormEdicion({
                      ...formEdicion,
                      numero_identificacion_tutor: e.target.value,
                    })
                  }
                  className={inputClass()}
                />
              </FormField>
            )}

            <FormField label="Género" name="genero">
              <select
                value={formEdicion.genero || "M"}
                onChange={(e) =>
                  setFormEdicion({ ...formEdicion, genero: e.target.value })
                }
                className={inputClass()}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </FormField>

            <FormField label="Teléfono" name="telefono">
              <input
                value={formEdicion.telefono || ""}
                onChange={(e) =>
                  setFormEdicion({ ...formEdicion, telefono: e.target.value })
                }
                className={inputClass()}
              />
            </FormField>

            <FormField label="Fecha de nacimiento" name="fecha_nacimiento">
              <input
                type="date"
                value={formEdicion.fecha_nacimiento || ""}
                onChange={(e) =>
                  setFormEdicion({
                    ...formEdicion,
                    fecha_nacimiento: e.target.value,
                  })
                }
                className={inputClass()}
              />
            </FormField>

            {/* Correo Electrónico Bloqueado (Requerimiento Criterio 2) */}
            <FormField
              label="Correo electrónico (Bloqueado)"
              name="correo"
              ayuda="El correo no puede ser modificado por normativa de seguridad."
            >
              <input
                value={formEdicion.correo || ""}
                disabled
                readOnly
                className="w-full rounded-md border border-charcoal/20 bg-charcoal/5 px-3 py-2 text-sm text-charcoal-light cursor-not-allowed"
              />
            </FormField>

            {rol === "tutor" && (
              <>
                <FormField label="Universidad de graduación" name="universidad">
                  <input
                    value={formEdicion.universidad_graduacion || ""}
                    onChange={(e) =>
                      setFormEdicion({
                        ...formEdicion,
                        universidad_graduacion: e.target.value,
                      })
                    }
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="Especialidad / Materias" name="especialidad">
                  <input
                    value={formEdicion.especialidad || ""}
                    onChange={(e) =>
                      setFormEdicion({
                        ...formEdicion,
                        especialidad: e.target.value,
                      })
                    }
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="Dirección de tutoría" name="direccion_tutoria">
                  <select
                    value={formEdicion.direccion_tutoria || "Online"}
                    onChange={(e) =>
                      setFormEdicion({
                        ...formEdicion,
                        direccion_tutoria: e.target.value,
                      })
                    }
                    className={inputClass()}
                  >
                    <option value="Online">Online</option>
                    <option value="Física">Física</option>
                  </select>
                </FormField>

                <FormField label="Año de inicio" name="anio_inicio">
                  <input
                    type="number"
                    value={formEdicion.anio_inicio_tutorias || ""}
                    onChange={(e) =>
                      setFormEdicion({
                        ...formEdicion,
                        anio_inicio_tutorias: e.target.value,
                      })
                    }
                    className={inputClass()}
                  />
                </FormField>
              </>
            )}

            <div className="sm:col-span-2">
              <FormField label="Dirección residencial" name="direccion">
                <input
                  value={formEdicion.direccion || ""}
                  onChange={(e) =>
                    setFormEdicion({ ...formEdicion, direccion: e.target.value })
                  }
                  className={inputClass()}
                />
              </FormField>
            </div>
          </div>
        )}
      </Modal>

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
          <div className="flex flex-col gap-4 text-left">
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