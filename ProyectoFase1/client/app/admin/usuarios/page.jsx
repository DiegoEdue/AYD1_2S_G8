"use client";

import { useEffect, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { darDeBaja, listarUsuarios } from "@/lib/api/admin";

export default function UsuariosPage() {
  const { mostrarToast } = useToast();
  const [rol, setRol] = useState("estudiante");
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarUsuarios() {
      setCargando(true);
      try {
        const response = await listarUsuarios(rol);
        setUsuarios(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setUsuarios([]);
      } finally {
        setCargando(false);
      }
    }

    cargarUsuarios();
  }, [rol]);

  async function darDeBajaUsuario(usuario) {
    try {
      await darDeBaja(usuario.id, usuario.rol, "Baja administrativa");
      setUsuarios((actuales) => actuales.map((item) => item.id === usuario.id ? { ...item, estado: "baja" } : item));
      mostrarToast("Usuario dado de baja correctamente.", "exito");
    } catch (error) {
      mostrarToast(error.message || "No pudimos dar de baja al usuario.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="font-display text-xl text-charcoal">Usuarios</h2><p className="text-sm text-charcoal-light">Administra las cuentas aprobadas.</p></div>
      <Tabs tabs={[{ valor: "estudiante", etiqueta: "Estudiantes" }, { valor: "tutor", etiqueta: "Tutores" }]} activo={rol} onCambiar={setRol} />
      {cargando ? <p className="text-sm text-charcoal-light">Cargando usuarios…</p> : <Table columnas={["Nombre", "ID", "Correo", "Estado", "Acción"]} filas={usuarios} vacio="No hay usuarios para mostrar." renderFila={(usuario) => <>
        <td className="px-4 py-3 font-medium text-charcoal">{usuario.nombre} {usuario.apellido}</td>
        <td className="px-4 py-3 text-charcoal-light">{usuario.identificador}</td>
        <td className="px-4 py-3 text-charcoal-light">{usuario.correo}</td>
        <td className="px-4 py-3 text-charcoal-light">{usuario.estado}</td>
        <td className="px-4 py-3"><Button variante="peligro" tamanio="sm" disabled={usuario.estado === "baja"} onClick={() => darDeBajaUsuario(usuario)}>Dar de baja</Button></td>
      </>} />}
    </div>
  );
}