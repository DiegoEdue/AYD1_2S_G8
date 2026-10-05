"use client";

import { useEffect, useRef } from "react";

const ANCHOS = { md: "max-w-md", lg: "max-w-2xl" };

export default function Modal({ abierto, onCerrar, titulo, children, footer, ancho = "md" }) {
    const dialogRef = useRef(null);
    const onCerrarRef = useRef(onCerrar);

    useEffect(() => {
        onCerrarRef.current = onCerrar;
    }, [onCerrar]);

    useEffect(() => {
        if (!abierto) return;
        const onKeyDown = (e) => {
        if (e.key === "Escape") onCerrarRef.current();
        };
        document.addEventListener("keydown", onKeyDown);
        dialogRef.current?.focus();
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [abierto]);

    if (!abierto) return null;

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
        onClick={onCerrar}
        >
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className={`flex max-h-[90vh] w-full flex-col rounded-card bg-white shadow-soft ${ANCHOS[ancho]}`}
        >
            <div className="flex items-start justify-between px-6 pt-5">
            <h2 id="modal-titulo" className="font-display text-lg text-charcoal">
                {titulo}
            </h2>
            <button
                onClick={onCerrar}
                aria-label="Cerrar"
                className="rounded-full p-1 text-charcoal-light hover:bg-charcoal/5"
            >
                ✕
            </button>
            </div>
            <div className="overflow-y-auto px-6 py-4 text-sm text-charcoal">{children}</div>
            {footer && <div className="flex justify-end gap-3 border-t border-charcoal/10 px-6 py-4">{footer}</div>}
        </div>
        </div>
    );
}
