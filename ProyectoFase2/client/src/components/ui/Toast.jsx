"use client";

import { useCallback } from "react";
import { sileo, Toaster } from "sileo";

const ACCION_POR_TIPO = {
    exito: sileo.success,
    error: sileo.error,
    advertencia: sileo.warning,
    info: sileo.info,
    };

    export function ToastProvider({ children }) {
    return (
        <>
        {children}
        <Toaster position="top-center" />
        </>
    );
    }

    export function useToast() {
        const mostrarToast = useCallback((mensaje, tipo = "info") => {
        const disparar = ACCION_POR_TIPO[tipo] || sileo.info;
        disparar({ title: mensaje });
        }, []);
    return { mostrarToast };
}
