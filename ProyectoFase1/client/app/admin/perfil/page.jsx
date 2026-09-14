"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { obtenerPerfilAdmin, actualizarPerfilAdmin } from "@/lib/api/admin";

export default function PerfilAdminPage() {
  const { mostrarToast } = useToast();
  const { usuario, guardarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerPerfilAdmin()
      .then((response) => {
        const datos = response?.data || null;
        setPerfil(datos);
        setFotoUrl(datos?.foto_url || "");
      })
      .catch(() => setPerfil(null));
  }, []);

  function seleccionarFoto(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setFotoUrl(lector.result);
    lector.readAsDataURL(archivo);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    try {
      const response = await actualizarPerfilAdmin({ foto_url: fotoUrl });
      const perfilActualizado = response?.data || perfil;
      setPerfil(perfilActualizado);
      setFotoUrl(perfilActualizado?.foto_url || fotoUrl);
      // Sincronizar foto en el contexto global para actualizar el Topbar
      if (usuario) {
        guardarUsuario({ ...usuario, foto_url: perfilActualizado?.foto_url || fotoUrl });
      }
      mostrarToast("Foto de perfil actualizada correctamente.", "exito");
    } catch (error) {
      mostrarToast(error.message || "No pudimos actualizar tu perfil.", "error");
    } finally {
      setGuardando(false);
    }
  }

  if (!perfil) return <p className="text-sm text-charcoal-light">Cargando tu perfil…</p>;

  const nombreMostrado = perfil.nombre_usuario || usuario?.nombre_usuario || "Admin";

  return (
    <form onSubmit={guardar} className="max-w-md rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Avatar
          nombre={nombreMostrado}
          foto={fotoUrl || perfil.foto_url}
          size="h-14 w-14"
        />
        <div>
          <h2 className="font-display text-xl text-charcoal">{nombreMostrado}</h2>
          <p className="text-sm text-charcoal-light">Administrador</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <FormField label="Nombre de usuario" name="nombre_usuario">
          <input
            id="nombre_usuario"
            value={perfil.nombre_usuario || ""}
            disabled
            className={`${inputClass(false)} bg-paper`}
          />
        </FormField>

        <FormField
          label="Fotografía de perfil"
          name="foto_perfil"
          ayuda="Selecciona una imagen y guarda los cambios para actualizarla en todo el sistema."
        >
          <label
            htmlFor="foto_perfil"
            className="inline-flex cursor-pointer items-center rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-crimson hover:text-crimson"
          >
            {fotoUrl && fotoUrl !== perfil.foto_url
              ? "Cambiar fotografía"
              : perfil.foto_url
              ? "Cambiar fotografía"
              : "Seleccionar fotografía"}
          </label>
          <input
            id="foto_perfil"
            type="file"
            accept="image/*"
            onChange={seleccionarFoto}
            className="sr-only"
          />
        </FormField>
      </div>

      <Button type="submit" cargando={guardando} className="mt-6">
        Guardar cambios
      </Button>
    </form>
  );
}
