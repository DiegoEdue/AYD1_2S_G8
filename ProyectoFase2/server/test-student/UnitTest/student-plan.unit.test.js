jest.mock("../../src/config/db", () => jest.fn());
jest.mock("../../src/utils/studyPlanPdf", () => ({ renderStudyPlanPdf: jest.fn() }));

const sql = require("../../src/config/db");
const { getStudyPlans } = require("../../src/controllers/student-plan.controller");

describe("UT-01 — HU-031: consulta de planes", () => {
    let res;

    beforeEach(() => {
        sql.mockReset();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => jest.restoreAllMocks());

    test("consulta por estudiante y mapea el detalle del plan", async () => {
        sql.mockResolvedValue([{
            id_plan: 1,
            id_sesion: 89,
            fecha_sesion: "2026-10-02",
            nombre_tutor: "Ana Ramírez",
            numero_identificacion_tutor: "SEED-ANA-01",
            especialidades: ["Matemática Básica"],
            dificultades: [{ id: 1, descripcion: "Reforzar conceptos básicos" }],
            recursos: [{ id: 1, nombre: "Guía", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
        }]);

        await getStudyPlans({ user: { id: 49 }, query: { idEstudiante: 50 } }, res);

        expect(sql).toHaveBeenCalledTimes(1);
        const [fragments, ...values] = sql.mock.calls[0];
        expect(values).toEqual([49]);
        expect(fragments.join("?")).toContain("s.id_estudiante = ?");
        expect(fragments.join("?")).toContain("s.estado = 'Atendida'");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [{
                idPlan: 1,
                idSesion: 89,
                fechaUltimaSesion: "2026-10-02",
                tutor: {
                    nombreCompleto: "Ana Ramírez",
                    especialidades: ["Matemática Básica"],
                    numeroIdentificacion: "SEED-ANA-01",
                },
                dificultadesIdentificadas: [{ id: 1, descripcion: "Reforzar conceptos básicos" }],
                recursosRecomendados: [{ id: 1, nombre: "Guía", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
            }],
        });
    });

    test("responde con lista vacía cuando no hay planes", async () => {
        sql.mockResolvedValue([]);
        await getStudyPlans({ user: { id: 49 } }, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
    });

    test("no revela detalles de errores SQL", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        sql.mockRejectedValue(new Error("Detalles privados de conexión"));
        await getStudyPlans({ user: { id: 49 } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error interno del servidor" });
    });
});
