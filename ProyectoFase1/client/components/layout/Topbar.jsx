"use client";

import { useAuth } from "@/lib/auth-context";
import Avatar from "@/components/ui/Avatar";

export default function Topbar({ titulo }) {
    const { usuario } = useAuth();

    return (
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-8 py-4">
        <h1 className="font-display text-xl text-charcoal">{titulo}</h1>
        <div className="flex items-center gap-4">
            {usuario && (
            <div className="flex items-center gap-2.5">
                <span className="text-sm text-charcoal-light">
                Hola, <span className="font-semibold text-charcoal">{usuario.nombre}</span>
                </span>
                <Avatar nombre={usuario.nombre} foto={usuario.foto} size="h-9 w-9" textSize="text-xs" />
            </div>
            )}
        </div>
        </header>
    );
}
