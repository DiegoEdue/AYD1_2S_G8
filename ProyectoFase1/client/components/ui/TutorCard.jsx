import Link from "next/link";
import Icon from "./Icon";
import Avatar from "./Avatar";

export default function TutorCard({ tutor }) {
    return (
        <Link
        href={`/estudiante/tutores/${tutor.id}`}
        className="group flex flex-col rounded-card border border-charcoal/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sage"
        >
        <div className="flex items-center gap-3">
            <Avatar nombre={tutor.nombre} foto={tutor.foto} size="h-12 w-12" />
            <div>
            <h3 className="font-display text-base text-charcoal">{tutor.nombre}</h3>
            <p className="text-xs text-charcoal-light">{tutor.universidad}</p>
            </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
            {tutor.especialidad.map((m) => (
            <span
                key={m}
                className="rounded-full bg-cream-light px-2.5 py-1 text-xs font-medium text-charcoal-dark"
            >
                {m}
            </span>
            ))}
        </div>

        <p className="mt-3 flex items-center gap-1 text-sm text-charcoal-light">
            <Icon name="Ubicacion" className="h-4 w-4 shrink-0" /> {tutor.direccion}
        </p>
        <span className="mt-4 text-sm font-semibold text-crimson group-hover:underline">
            Ver horarios y agendar →
        </span>
        </Link>
    );
}
