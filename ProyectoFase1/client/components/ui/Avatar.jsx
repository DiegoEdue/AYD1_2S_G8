// Avatar reutilizable: muestra la foto de perfil si existe, y si no,
// cae de vuelta a un círculo con las iniciales del nombre (mismo patrón
// que ya usaba TutorCard, ahora centralizado para usarlo también en el
// topbar y en la vista de detalle de tutor).

function obtenerIniciales(nombre = "") {
    return nombre
        .trim()
        .split(/\s+/)
        .map((parte) => parte[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }

    export default function Avatar({ nombre, foto, size = "h-10 w-10", textSize = "text-sm", className = "" }) {
    const iniciales = obtenerIniciales(nombre);

    if (foto) {
        return (
        <img
            src={foto}
            alt={nombre}
            className={`${size} shrink-0 rounded-full object-cover ${className}`}
        />
        );
    }

    return (
        <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-sage font-semibold text-white ${textSize} ${className}`}
        aria-hidden="true"
        >
        {iniciales}
        </div>
    );
}
