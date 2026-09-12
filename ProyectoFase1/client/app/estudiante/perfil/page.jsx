"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import { actualizarPerfil, obtenerPerfil } from "@/lib/api/sesiones";

const PERFIL_VACIO = {
  nombre: "",
  apellido: "",
  genero: "",
  direccion: "",
  telefono: "",
  fecha_nacimiento: "",
  foto_url: "",
  password_actual: "",
  password_nueva: "",
};

export default function PerfilEstudiantePage() {
  const { mostrarToast } = useToast();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(PERFIL_VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerPerfil("estudiante").then((response) => {
      const datos = response?.data || null;
      setPerfil(datos);
      if (datos) setForm({ ...PERFIL_VACIO, ...datos, password_actual: "", password_nueva: "" });
    }).catch(() => setPerfil(null));
  }, []);

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function seleccionarFoto(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => cambiar("foto_url", lector.result);
    lector.readAsDataURL(archivo);
  }

  async function guardar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (!form.apellido.trim()) nuevosErrores.apellido = "Ingresa tu apellido.";
    if (!form.genero) nuevosErrores.genero = "Selecciona un género.";
    if (!form.direccion.trim()) nuevosErrores.direccion = "Ingresa tu dirección.";
    if (!form.telefono.trim()) nuevosErrores.telefono = "Ingresa tu teléfono.";
    if (form.password_nueva && !form.password_actual) {
      nuevosErrores.password_actual = "Ingresa tu contraseña actual.";
    }
    if (form.password_nueva && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password_nueva)) {
      nuevosErrores.password_nueva = "Usa mínimo 8 caracteres, con mayúscula, minúscula y número, sin símbolos.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) return;

    setGuardando(true);
    try {
      const datos = { ...form };
      if (!datos.password_nueva) {
        delete datos.password_actual;
        delete datos.password_nueva;
      }
      const response = await actualizarPerfil("estudiante", datos);
      setPerfil(response?.data || { ...perfil, ...datos });
      setForm((actual) => ({ ...actual, password_actual: "", password_nueva: "" }));
      mostrarToast("Perfil actualizado correctamente.", "exito");
    } catch (error) {
      mostrarToast(error.message || "No pudimos actualizar tu perfil.", "error");
    } finally {
      setGuardando(false);
    }
  }

  if (!perfil) return <p className="text-sm text-charcoal-light">Cargando tu perfil…</p>;

  return (
    <form onSubmit={guardar} className="max-w-2xl rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Avatar nombre={`${perfil.nombre} ${perfil.apellido}`} foto={form.foto_url || perfil.foto_url} size="h-14 w-14" />
        <div>
          <h2 className="font-display text-xl text-charcoal">{perfil.nombre} {perfil.apellido}</h2>
          <p className="text-sm text-charcoal-light">Perfil de estudiante</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre" name="nombre" required error={errores.nombre}>
          <input id="nombre" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} className={inputClass(!!errores.nombre)} />
        </FormField>
        <FormField label="Apellido" name="apellido" required error={errores.apellido}>
          <input id="apellido" value={form.apellido} onChange={(e) => cambiar("apellido", e.target.value)} className={inputClass(!!errores.apellido)} />
        </FormField>
        <FormField label="Correo electrónico" name="correo">
          <input id="correo" value={perfil.correo || ""} disabled className={`${inputClass(false)} bg-paper`} />
        </FormField>
        <FormField label="Carnet" name="carnet">
          <input id="carnet" value={perfil.carnet || ""} disabled className={`${inputClass(false)} bg-paper`} />
        </FormField>
        <FormField label="Género" name="genero" required error={errores.genero}>
          <select id="genero" value={form.genero} onChange={(e) => cambiar("genero", e.target.value)} className={inputClass(!!errores.genero)}>
            <option value="">Selecciona una opción</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </FormField>
        <FormField label="Fecha de nacimiento" name="fecha_nacimiento">
          <input id="fecha_nacimiento" type="date" value={form.fecha_nacimiento?.slice(0, 10) || ""} onChange={(e) => cambiar("fecha_nacimiento", e.target.value)} className={inputClass(false)} />
        </FormField>
        <FormField label="Teléfono" name="telefono" required error={errores.telefono}>
          <input id="telefono" value={form.telefono} onChange={(e) => cambiar("telefono", e.target.value)} className={inputClass(!!errores.telefono)} />
        </FormField>
        <FormField label="Dirección" name="direccion" required error={errores.direccion}>
          <input id="direccion" value={form.direccion} onChange={(e) => cambiar("direccion", e.target.value)} className={inputClass(!!errores.direccion)} />
        </FormField>
        <FormField label="Fotografía de perfil" name="foto_url" ayuda="Selecciona una imagen y luego guarda los cambios.">
          <label htmlFor="foto_url" className="inline-flex cursor-pointer items-center rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-crimson hover:text-crimson">
            {form.foto_url && form.foto_url !== perfil.foto_url ? "Cambiar fotografía" : "Seleccionar fotografía"}
          </label>
          <input id="foto_url" type="file" accept="image/*" onChange={seleccionarFoto} className="sr-only" />
        </FormField>
        <div className="sm:col-span-2 border-t border-charcoal/10 pt-4">
          <p className="text-sm font-semibold text-charcoal">Cambiar contraseña (opcional)</p>
        </div>
        <FormField label="Contraseña actual" name="password_actual" error={errores.password_actual}>
          <input id="password_actual" type="password" value={form.password_actual} onChange={(e) => cambiar("password_actual", e.target.value)} className={inputClass(!!errores.password_actual)} />
        </FormField>
        <FormField label="Nueva contraseña" name="password_nueva" error={errores.password_nueva}>
          <input id="password_nueva" type="password" value={form.password_nueva} onChange={(e) => cambiar("password_nueva", e.target.value)} className={inputClass(!!errores.password_nueva)} />
        </FormField>
      </div>
      <Button type="submit" cargando={guardando} className="mt-6">Guardar cambios</Button>
    </form>
  );
}