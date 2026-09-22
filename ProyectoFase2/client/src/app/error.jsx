"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <span className="rounded-full bg-crimson-light/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-crimson-dark">
            Algo salió mal
        </span>
        <h1 className="font-display text-2xl text-charcoal">
            No pudimos completar esta acción
        </h1>
        <p className="max-w-md text-sm text-charcoal-light">
            {error?.message ||
            "Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio."}
        </p>
        <div className="flex gap-3">
            <button
            onClick={() => reset()}
            className="rounded-full bg-crimson px-5 py-2 text-sm font-semibold text-white transition hover:bg-crimson-dark"
            >
            Reintentar
            </button>
            <Link
            href="/"
            className="rounded-full border border-charcoal/20 px-5 py-2 text-sm font-semibold text-charcoal transition hover:bg-charcoal/5"
            >
            Ir al inicio
            </Link>
        </div>
        </div>
    );
}
