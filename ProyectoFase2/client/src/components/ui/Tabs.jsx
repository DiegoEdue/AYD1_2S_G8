"use client";

export default function Tabs({ tabs, activo, onCambiar }) {
    return (
        <div role="tablist" className="flex gap-1 rounded-full bg-charcoal/5 p-1 w-fit">
        {tabs.map((tab) => (
            <button
            key={tab.valor}
            role="tab"
            aria-selected={activo === tab.valor}
            onClick={() => onCambiar(tab.valor)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activo === tab.valor
                ? "bg-white text-charcoal shadow-soft"
                : "text-charcoal-light hover:text-charcoal"
            }`}
            >
            {tab.etiqueta}
            </button>
        ))}
        </div>
    );
}
