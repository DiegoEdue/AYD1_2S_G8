jest.mock("../../src/config/db", () => jest.fn());
jest.mock("../../src/utils/studyPlanPdf", () => ({ renderStudyPlanPdf: jest.fn() }));

const sql = require("../../src/config/db");
const { renderStudyPlanPdf } = require("../../src/utils/studyPlanPdf");
const { downloadStudyPlanPdf } = require("../../src/controllers/student-plan.controller");

describe("UT-02 — HU-032: validación y restricción de descarga", () => {
    let res;

    beforeEach(() => {
        sql.mockReset();
        renderStudyPlanPdf.mockReset();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    test.each(["0", "abc", "1abc"])("rechaza ID inválido %s antes de consultar SQL", async id => {
        await downloadStudyPlanPdf({ params: { id }, user: { id: 49 } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "ID de plan inválido" });
        expect(sql).not.toHaveBeenCalled();
        expect(renderStudyPlanPdf).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    test("no genera PDF cuando la consulta filtrada no devuelve un plan", async () => {
        sql.mockResolvedValue([]);
        await downloadStudyPlanPdf({ params: { id: "1" }, user: { id: 49 } }, res);
        expect(sql).toHaveBeenCalledTimes(1);
        const [fragments, ...values] = sql.mock.calls[0];
        expect(values).toEqual([1, 49]);
        const query = fragments.join("?");
        expect(query).toContain("p.id_plan = ?");
        expect(query).toContain("s.id_estudiante = ?");
        expect(query).toContain("s.estado = 'Atendida'");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Plan de estudio no encontrado" });
        expect(renderStudyPlanPdf).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
