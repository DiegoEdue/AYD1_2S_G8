"use client";

import { useEffect, useMemo, useState } from "react";
import TutorCard from "@/components/ui/TutorCard";
import { inputClass } from "@/components/ui/FormField";
import { tutoresMock } from "@/lib/mocks/data";
// import { listarTutores } from "@/lib/api/tutores"; // integrar cuando el backend esté listo

export default function TutoresPage() {
    const [tutores, setTutores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtros, setFiltros] = useState({ materia: "", universidad: "", experienciaMin: "" });

    useEffect(() => {
        const t = setTimeout(() => {
        setTutores(tutoresMock);
        setCargando(false);
        }, 300);
        return () => clearTimeout(t);
    }, []);

    const resultados = useMemo(() => {
        return tutores.filter((t) => {
        const coincideMateria =
            !filtros.materia ||
            t.especialidad.some((m) => m.toLowerCase().includes(filtros.materia.toLowerCase()));
        const coincideUniversidad =
            !filtros.universidad ||
            t.universidad.toLowerCase().includes(filtros.universidad.toLowerCase());
        const coincideExperiencia =
            !filtros.experienciaMin || t.anios >= Number(filtros.experienciaMin);
        return coincideMateria && coincideUniversidad && coincideExperiencia;
        });
    }, [tutores, filtros]);

    return (
        <div className="flex flex-col gap-6">
        {cargando ? (
            <p className="text-sm text-charcoal-light">Buscando tutores disponibles…</p>
        ) : resultados.length === 0 ? (
            <div className="rounded-card border border-dashed border-charcoal/20 py-16 text-center">
            <p className="text-sm text-charcoal-light">
                No encontramos tutores con esos filtros. Prueba ajustando la búsqueda.
            </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((t) => (
                <TutorCard key={t.id} tutor={t} />
            ))}
            </div>
        )}
        </div>
    );
}
