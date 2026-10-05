"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Icon from "@/components/ui/Icon";

const NAV_POR_ROL = {
    estudiante: [
        { href: "/estudiante/tutores", etiqueta: "Buscar tutores", icono: "Buscar" },
        { href: "/estudiante/sesiones/activas", etiqueta: "Mis sesiones", icono: "Calendario" },
        { href: "/estudiante/plan-estudio", etiqueta: "Plan de estudio", icono: "Plan" },
        { href: "/estudiante/sesiones/historial", etiqueta: "Historial", icono: "Historial" },
        { href: "/estudiante/perfil", etiqueta: "Mi perfil", icono: "Perfil" },
    ],
    tutor: [
        { href: "/tutor/sesiones/pendientes", etiqueta: "Sesiones pendientes", icono: "Sesiones" },
        { href: "/tutor/horarios", etiqueta: "Mis horarios", icono: "Horarios" },
        { href: "/tutor/sesiones/historial", etiqueta: "Historial", icono: "Historial" },
        { href: "/tutor/perfil", etiqueta: "Mi perfil", icono: "Perfil" },
    ],
    administrador: [
        { href: "/admin/solicitudes", etiqueta: "Solicitudes", icono: "Solicitudes" },
        { href: "/admin/usuarios", etiqueta: "Usuarios", icono: "Usuarios" },
        { href: "/admin/reportes", etiqueta: "Reportes", icono: "Reportes" },
    ],
    };

    export default function Sidebar({ rol }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const items = NAV_POR_ROL[rol] || [];

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col bg-charcoal text-white">
        <div className="flex items-center gap-2.5 px-6 py-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-educonnect.png" alt="EduConnect" className="h-full w-full object-contain" />
            </span>
            <div>
            <span className="font-display text-xl">EduConnect</span>
            <p className="text-xs text-white/60 capitalize">{rol}</p>
            </div>
        </div>
        <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-1 px-3">
            {items.map((item) => {
            const activo = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
                <Link
                key={item.href}
                href={item.href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    activo ? "bg-crimson text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                >
                <Icon name={item.icono} className="h-5 w-5 shrink-0" />
                {item.etiqueta}
                </Link>
            );
            })}
        </nav>
        <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-5 text-sm font-medium text-white/60 transition hover:text-white"
        >
            <Icon name="Sign_out" className="h-5 w-5 shrink-0" />
            Cerrar sesión
        </button>
        </aside>
    );
}
