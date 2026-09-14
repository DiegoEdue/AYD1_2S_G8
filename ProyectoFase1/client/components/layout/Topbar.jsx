"use client";

import { useAuth } from "@/lib/auth-context";
import Avatar from "@/components/ui/Avatar";

export default function Topbar({ titulo }) {
    const { usuario } = useAuth();
    const nombreUsuario = [usuario?.nombre || usuario?.nombre_usuario, usuario?.apellido]
        .filter(Boolean)
        .join(" ") || "Usuario";
    const fotoUrl = usuario?.foto_url || usuario?.fotoUrl || null;

    return (
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-8 py-4">
            <h1 className="font-display text-xl text-charcoal">{titulo}</h1>
            {usuario && (
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-charcoal-light leading-none">Bienvenido/a</p>
                        <p className="text-sm font-semibold text-charcoal leading-snug">{nombreUsuario}</p>
                    </div>
                    <Avatar
                        nombre={nombreUsuario}
                        foto={fotoUrl}
                        size="h-9 w-9"
                        textSize="text-xs"
                        className="ring-2 ring-charcoal/10"
                    />
                </div>
            )}
        </header>
    );
}
