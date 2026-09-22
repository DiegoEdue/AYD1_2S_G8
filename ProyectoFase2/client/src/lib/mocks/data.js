export const tutoresMock = [
    {
        id: "t1",
        nombre: "Ana Ramírez",
        especialidad: ["Cálculo 1", "Cálculo 2"],
        universidad: "USAC",
        direccion: "Edificio T-5, Online",
        anios: 4,
        foto: "https://i.pravatar.cc/150?img=47",
        dias: ["Lunes", "Miércoles", "Viernes"],
        horaInicio: "08:00",
        horaFin: "12:00",
    },
    {
        id: "t2",
        nombre: "Luis Pérez",
        especialidad: ["Programación de Lenguajes", "Compiladores"],
        universidad: "USAC",
        direccion: "Online",
        anios: 2,
        foto: "https://i.pravatar.cc/150?img=12",
        dias: ["Martes", "Jueves"],
        horaInicio: "14:00",
        horaFin: "18:00",
    },
];

export const sesionesActivasMock = [
    {
        id: "s1",
        tutor: "Ana Ramírez",
        fecha: "2026-09-02",
        hora: "09:00",
        materia: "Cálculo 1",
        direccion: "Online",
        motivo: "Dudas sobre límites",
        estado: "pendiente",
    },
];

export const historialMock = [
    {
        id: "s0",
        tutor: "Ana Ramírez",
        fecha: "2026-08-15",
        materia: "Cálculo 1",
        direccion: "Online",
        motivo: "Repaso de derivadas",
        resumen: "Se reforzó regla de la cadena. Tarea: 10 ejercicios.",
        estado: "atendida",
    },
];

export const solicitudesMock = [
    {
        id: "u1",
        rol: "estudiante",
        nombre: "Carlos Gómez",
        carnet: "202112345",
        genero: "Masculino",
        fechaNacimiento: "2002-05-10",
        correo: "carlos@usac.edu.gt",
        foto: null,
    },
];
