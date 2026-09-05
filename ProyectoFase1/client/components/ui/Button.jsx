"use client";

const VARIANTES = {
    primario: "bg-crimson text-white hover:bg-crimson-dark disabled:bg-crimson-light",
    secundario: "bg-sage text-charcoal-dark hover:bg-sage-dark hover:text-white disabled:bg-sage-light",
    suave: "bg-cream text-charcoal hover:bg-cream-dark disabled:bg-cream-light",
    fantasma:
        "bg-transparent border border-charcoal/20 text-charcoal hover:bg-charcoal/5 disabled:opacity-50",
    peligro: "bg-white border border-crimson text-crimson hover:bg-crimson hover:text-white",
    };

    const TAMANIOS = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    };

    export default function Button({
    children,
    variante = "primario",
    tamanio = "md",
    cargando = false,
    className = "",
    type = "button",
    ...props
    }) {
    return (
        <button
        type={type}
        disabled={cargando || props.disabled}
        aria-busy={cargando}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTES[variante]} ${TAMANIOS[tamanio]} ${className}`}
        {...props}
        >
        {cargando && (
            <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
            />
        )}
        {children}
        </button>
    );
}
