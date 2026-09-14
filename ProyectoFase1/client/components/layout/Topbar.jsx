"use client";

import { useAuth } from "@/lib/auth-context";

export default function Topbar({ titulo }) {
    const { usuario } = useAuth();
    const nombreUsuario = [usuario?.nombre || usuario?.nombre_usuario, usuario?.apellido]
        .filter(Boolean)
        .join(" ") || "Usuario";

    return (
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-8 py-4">
        <h1 className="font-display text-xl text-charcoal">{titulo}</h1>
        <div />
        {usuario && (
            <div className="fixed bottom-4 right-6 z-30 flex items-center gap-2.5 rounded-full border border-charcoal/10 bg-white px-3 py-2 shadow-soft">
                <span className="text-sm text-charcoal-light">
                    Hola, <span className="font-semibold text-charcoal">{nombreUsuario}</span>
                </span>
            </div>
        )}
        </header>
    );
}
