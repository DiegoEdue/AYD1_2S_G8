jest.mock("../../src/config/db", () => jest.fn());

const sql = require("../../src/config/db");
const { getStudentSessionsByState } = require("../../src/controllers/student-helpers");

describe("HU-023, HU-033 y HU-034 — historial de sesiones del estudiante", () => {
    beforeEach(() => sql.mockReset());

    const session = {
        id_sesion: 89,
        fecha: "2026-10-02",
        hora: "09:30:00",
        motivo: "Repaso de cálculo",
        estado: "Atendida",
        materia: "Matemática Básica",
        tutor: "Ana Ramírez",
        correo_tutor: "tutor@ejemplo.com",
    };

    test("consulta solo al estudiante y estados solicitados, y mapea calificación y reporte", async () => {
        const fechaCalificacion = new Date("2026-10-11T22:50:46Z");
        const fechaReporte = new Date("2026-10-11T22:51:29Z");
        sql.mockResolvedValue([{
            ...session,
            id_rating: 1,
            estrellas: 5,
            comentario: "Buena explicación",
            fecha_calificacion: fechaCalificacion,
            id_reporte: 2,
            categoria_reporte: "Otro",
            estado_reporte: "Pendiente",
            fecha_reporte: fechaReporte,
        }]);
        const estados = ["Atendida", "Cancelada_Tutor", "Cancelada_Estudiante"];

        const result = await getStudentSessionsByState(49, estados);

        expect(sql).toHaveBeenCalledTimes(1);
        const [fragments, ...values] = sql.mock.calls[0];
        expect(values).toEqual([49, estados]);
        const query = fragments.join("?");
        expect(query).toContain("s.id_estudiante = ?");
        expect(query).toContain("s.estado = ANY(?)");
        expect(query).toContain("LEFT JOIN tutor_ratings tr ON tr.id_sesion = s.id_sesion");
        expect(query).toContain("LEFT JOIN tutor_reports rp ON rp.id_sesion = s.id_sesion");
        expect(result).toEqual([{
            id: 89,
            fecha: "2026-10-02",
            hora: "09:30",
            motivo: "Repaso de cálculo",
            estado: "Atendida",
            materia: "Matemática Básica",
            tutor: "Ana Ramírez",
            correoTutor: "tutor@ejemplo.com",
            calificacion: { id: 1, estrellas: 5, comentario: "Buena explicación", fechaCalificacion },
            reporte: { id: 2, categoria: "Otro", estado: "Pendiente", fechaReporte },
        }]);
    });

    test("expone calificacion y reporte como null si no existen", async () => {
        sql.mockResolvedValue([{ ...session, id_rating: null, id_reporte: null }]);

        const [result] = await getStudentSessionsByState(49, ["Atendida"]);

        expect(result.calificacion).toBeNull();
        expect(result.reporte).toBeNull();
    });

    test("mapea una denuncia sin calificación sin perder su estado", async () => {
        sql.mockResolvedValue([{
            ...session,
            id_rating: null,
            id_reporte: 2,
            categoria_reporte: "Negligencia académica",
            estado_reporte: "Descartado",
            fecha_reporte: new Date("2026-10-11T22:51:29Z"),
        }]);

        const [result] = await getStudentSessionsByState(49, ["Atendida"]);

        expect(result.calificacion).toBeNull();
        expect(result.reporte).toEqual({
            id: 2,
            categoria: "Negligencia académica",
            estado: "Descartado",
            fechaReporte: new Date("2026-10-11T22:51:29Z"),
        });
    });

    test("devuelve una lista vacía cuando no hay sesiones en los estados solicitados", async () => {
        sql.mockResolvedValue([]);

        expect(await getStudentSessionsByState(49, ["Atendida"])).toEqual([]);
    });
});
