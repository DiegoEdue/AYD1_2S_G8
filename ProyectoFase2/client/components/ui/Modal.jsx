"use client";

import { useEffect, useRef } from "react";

export default function Modal({ abierto, onCerrar, titulo, children, footer }) {
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
            className="w-full max-w-md rounded-card bg-white shadow-soft"
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
            <div className="px-6 py-4 text-sm text-charcoal">{children}</div>
            {footer && <div className="flex justify-end gap-3 border-t border-charcoal/10 px-6 py-4">{footer}</div>}
        </div>
        </div>
    );
}
