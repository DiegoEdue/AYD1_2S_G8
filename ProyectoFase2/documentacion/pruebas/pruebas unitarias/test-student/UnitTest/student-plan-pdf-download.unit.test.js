jest.mock("../../src/config/db", () => jest.fn());
jest.mock("../../src/utils/studyPlanPdf", () => ({ renderStudyPlanPdf: jest.fn() }));

const sql = require("../../src/config/db");
const { renderStudyPlanPdf } = require("../../src/utils/studyPlanPdf");
const { downloadStudyPlanPdf } = require("../../src/controllers/student-plan.controller");

describe("UT-03 — HU-032: entrega de PDF", () => {
    const originalPhone = process.env.EDUCONNECT_CONTACT_PHONE;
    let res;
    let row;
    let pdf;
    const req = { params: { id: "1" }, user: { id: 49 } };

    beforeEach(() => {
        delete process.env.EDUCONNECT_CONTACT_PHONE;
        sql.mockReset();
        renderStudyPlanPdf.mockReset();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        row = {
            id_plan: 1,
            fecha_sesion: "2026-10-02",
            nombre_estudiante: "V V",
            nombre_tutor: "Ana Ramírez",
            numero_identificacion_tutor: "SEED-ANA-01",
            telefono_tutor: "55550001",
            especialidades: ["Matemática Básica"],
            dificultades: ["Reforzar conceptos básicos"],
            recursos: [{ nombre: "Guía", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
        };
        pdf = Buffer.from("%PDF-1.4");
        sql.mockResolvedValue([row]);
        renderStudyPlanPdf.mockResolvedValue(pdf);
    });

    afterEach(() => {
        if (originalPhone === undefined) delete process.env.EDUCONNECT_CONTACT_PHONE;
        else process.env.EDUCONNECT_CONTACT_PHONE = originalPhone;
        jest.restoreAllMocks();
    });

    test("envía el Buffer generado con encabezados de descarga y teléfono del tutor", async () => {
        await downloadStudyPlanPdf(req, res);
        expect(renderStudyPlanPdf).toHaveBeenCalledTimes(1);
        expect(renderStudyPlanPdf).toHaveBeenCalledWith({
            id_plan: 1,
            fechaSesion: "2026-10-02",
            nombreEstudiante: "V V",
            nombreTutor: "Ana Ramírez",
            especialidades: row.especialidades,
            numeroIdentificacion: "SEED-ANA-01",
            telefonoContacto: "55550001",
            dificultades: row.dificultades,
            recursos: row.recursos,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.set).toHaveBeenCalledWith("Content-Type", "application/pdf");
        expect(res.set).toHaveBeenCalledWith("Content-Disposition", 'attachment; filename="educonnect-plan-1.pdf"');
        expect(res.send).toHaveBeenCalledWith(pdf);
        expect(res.send.mock.calls[0][0]).toBe(pdf);
        expect(res.json).not.toHaveBeenCalled();
    });

    test("prioriza el teléfono institucional configurado", async () => {
        process.env.EDUCONNECT_CONTACT_PHONE = "2222-3333";
        await downloadStudyPlanPdf(req, res);
        expect(renderStudyPlanPdf).toHaveBeenCalledWith(expect.objectContaining({ telefonoContacto: "2222-3333" }));
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("responde 500 sin enviar archivo si falla la generación", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        renderStudyPlanPdf.mockRejectedValue(new Error("Error privado de PDFKit"));
        await downloadStudyPlanPdf(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error interno del servidor" });
        expect(res.set).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
