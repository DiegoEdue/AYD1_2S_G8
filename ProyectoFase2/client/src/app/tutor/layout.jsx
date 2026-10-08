"use client";

import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function TutorLayout({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;

  if (usuario && usuario.rol !== "tutor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <p className="text-sm text-charcoal-light">
          Esta sección es solo para tutores. Ve al menú de tu rol actual.
        </p>
      </div>
    );
  }

  return (
    <div data-app-shell className="fixed inset-0 flex overflow-clip bg-paper">
      <Sidebar rol="tutor" />
      <div className="flex flex-1 flex-col">
        <Topbar titulo="Panel de tutor" />
        <main className="flex-1 min-h-0 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
