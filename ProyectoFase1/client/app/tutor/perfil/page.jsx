"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import { obtenerPerfil } from "@/lib/api/sesiones";

export default function PerfilTutorPage() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    obtenerPerfil("tutor").then((response) => setPerfil(response?.data || null)).catch(() => setPerfil(null));
  }, []);

  if (!perfil) return <p className="text-sm text-charcoal-light">Cargando tu perfil…</p>;

  return (
    <div className="max-w-xl rounded-card border border-charcoal/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Avatar nombre={`${perfil.nombre} ${perfil.apellido}`} foto={perfil.foto_url} size="h-14 w-14" />
        <div>
          <h2 className="font-display text-xl text-charcoal">{perfil.nombre} {perfil.apellido}</h2>
          <p className="text-sm text-charcoal-light">Perfil de tutor</p>
        </div>
      </div>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-charcoal-light">Correo</dt><dd className="text-charcoal">{perfil.correo}</dd></div>
        <div><dt className="text-charcoal-light">Carnet</dt><dd className="text-charcoal">{perfil.carnet_id}</dd></div>
        <div><dt className="text-charcoal-light">Universidad</dt><dd className="text-charcoal">{perfil.universidad_graduacion}</dd></div>
        <div><dt className="text-charcoal-light">Dirección de tutoría</dt><dd className="text-charcoal">{perfil.direccion_tutoria}</dd></div>
      </dl>
    </div>
  );
}