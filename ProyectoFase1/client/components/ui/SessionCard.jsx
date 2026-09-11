import StatusPill from "./StatusPill";
import Icon from "./Icon";

export default function SessionCard({ sesion, contraparteLabel, contraparteNombre, acciones }) {
    const cancelada = sesion.estado === "cancelada-tutor" || sesion.estado === "cancelada-estudiante";
    return (
        <div className="flex flex-col gap-3 rounded-card border border-charcoal/10 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
            <div className="flex items-center gap-2">
            <span className="font-display text-base text-charcoal">
                {sesion.materia}
            </span>
            {sesion.estado && <StatusPill estado={sesion.estado} />}
            </div>
            <p className="mt-1 text-sm text-charcoal-light">
            {contraparteLabel}: <span className="text-charcoal">{contraparteNombre}</span>
            </p>
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-charcoal-light">
            <span className="inline-flex items-center gap-1">
                <Icon name="Calendario" className="h-4 w-4" /> {sesion.fecha}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
                <Icon name="Horarios" className="h-4 w-4" /> {sesion.hora}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
                <Icon name="Ubicacion" className="h-4 w-4" /> {sesion.direccion}
            </span>
            </p>
            {sesion.motivo && (
            <p className="mt-1 text-sm text-charcoal-light">Motivo: {sesion.motivo}</p>
            )}
            {sesion.resumen && (
            <p className={`mt-1 rounded-lg px-3 py-2 text-sm ${cancelada ? "bg-crimson-light/40 text-crimson-dark" : "bg-cream-light/60 text-charcoal"}`}>
                Resumen: {sesion.resumen}
            </p>
            )}
        </div>
        {acciones && <div className="flex shrink-0 gap-2">{acciones}</div>}
        </div>
    );
}
