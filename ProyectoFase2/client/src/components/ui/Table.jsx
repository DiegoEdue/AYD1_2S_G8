export default function Table({ columnas, filas, renderFila, vacio }) {
    if (!filas?.length) {
        return (
        <div className="rounded-card border border-dashed border-charcoal/20 py-12 text-center text-sm text-charcoal-light">
            {vacio || "No hay registros para mostrar todavía."}
        </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-card border border-charcoal/10">
        <table className="w-full text-left text-sm">
            <thead className="bg-charcoal text-white">
            <tr>
                {columnas.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                    {c}
                </th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
            {filas.map((fila, i) => (
                <tr key={fila.id || i} className="bg-white hover:bg-cream-light/40">
                {renderFila(fila)}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}
