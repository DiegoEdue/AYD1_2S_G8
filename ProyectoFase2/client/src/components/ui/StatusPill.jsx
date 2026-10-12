const CONFIG = {
    activa: { texto: "Activa", clase: "bg-sage-light text-charcoal-dark" },
    pendiente: { texto: "Pendiente", clase: "bg-cream-dark text-charcoal-dark" },
    atendida: { texto: "Atendida", clase: "bg-sage text-white" },
    "cancelada-estudiante": { texto: "Cancelada", clase: "bg-crimson-light text-crimson-dark" },
    "cancelada-tutor": { texto: "Cancelada", clase: "bg-crimson-light text-crimson-dark" },
    aprobado: { texto: "Aprobado", clase: "bg-sage text-white" },
    rechazado: { texto: "Rechazado", clase: "bg-crimson text-white" },
    inactivo: { texto: "Dado de baja", clase: "bg-charcoal/10 text-charcoal-light" },
    sancionado: { texto: "Sancionado", clase: "bg-crimson text-white" },
    descartado: { texto: "Descartado", clase: "bg-charcoal/10 text-charcoal-light" },
    };

    export default function StatusPill({ estado }) {
    const cfg = CONFIG[estado] || { texto: estado, clase: "bg-charcoal/10 text-charcoal" };
    return (
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cfg.clase}`}>
        {cfg.texto}
        </span>
    );
}
