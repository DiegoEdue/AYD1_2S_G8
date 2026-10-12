jest.mock("../../src/config/db", () => jest.fn());

const sql = require("../../src/config/db");
const { rateTutor, reportTutor, getReportCategories } = require("../../src/controllers/student-feedback.controller");

const response = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});

describe("HU-033 — calificación de tutores", () => {
    beforeEach(() => sql.mockReset());
    afterEach(() => jest.restoreAllMocks());

    test("crea la calificación 0 sin comentario usando la sesión del estudiante", async () => {
        const fecha = new Date("2026-10-08T12:00:00Z");
        sql.mockResolvedValue([{ id_rating: 5, id_sesion: 89, estrellas: 0, comentario: "", fecha_calificacion: fecha }]);
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas: 0 } }, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            data: { id: 5, idSesion: 89, estrellas: 0, comentario: "", fechaCalificacion: fecha },
        }));
        const [fragments, ...values] = sql.mock.calls[0];
        expect(values).toEqual([89, 49, 0, ""]);
        expect(fragments.join("?")).toContain("estado = 'Atendida' FOR UPDATE");
        expect(fragments.join("?")).toContain("ON CONFLICT (id_sesion) DO NOTHING");
    });

    test.each([-1, 6, 2.5, "5", null])("rechaza puntuación inválida %s", async estrellas => {
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(sql).not.toHaveBeenCalled();
    });

    test("rechaza comentario mayor de 500 caracteres", async () => {
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas: 5, comentario: "x".repeat(501) } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("rechaza sesión ajena sin revelar su estado", async () => {
        sql.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 50 }, body: { estrellas: 5 } }, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("rechaza sesión activa o cancelada", async () => {
        sql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ estado: "Cancelada_Tutor" }]);
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas: 5 } }, res);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    test("rechaza calificación repetida", async () => {
        sql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ estado: "Atendida" }]);
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas: 5 } }, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("calificación") }));
    });

    test("no expone errores de base de datos", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        sql.mockRejectedValue(new Error("database secret"));
        const res = response();
        await rateTutor({ params: { id: "89" }, user: { id: 49 }, body: { estrellas: 5 } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error interno del servidor" });
    });
});

describe("HU-034 — reportes contra tutores", () => {
    beforeEach(() => sql.mockReset());

    test("publica las categorías permitidas", () => {
        const res = response();
        getReportCategories({}, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.arrayContaining(["Ética y profesionalismo", "Otro"]),
        }));
    });

    test("crea una denuncia pendiente para una sesión atendida propia", async () => {
        sql.mockResolvedValue([{
            id_reporte: 7, id_sesion: 89, categoria: "Negligencia académica",
            descripcion: "Falta de explicación", estado: "Pendiente", fecha_reporte: new Date("2026-10-08T12:00:00Z"),
        }]);
        const res = response();
        await reportTutor({
            params: { id: "89" }, user: { id: 49 },
            body: { categoria: "Negligencia académica", descripcion: " Falta de explicación " },
        }, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ estado: "Pendiente", idSesion: 89 }),
        }));
        const [fragments, ...values] = sql.mock.calls[0];
        expect(values).toEqual([89, 49, "Negligencia académica", "Falta de explicación"]);
        expect(fragments.join("?")).toContain("estado = 'Atendida' FOR UPDATE");
    });

    test.each(["Abuso/Conducta inapropiada", "", null])("rechaza categoría no admitida %s", async categoria => {
        const res = response();
        await reportTutor({ params: { id: "89" }, user: { id: 49 }, body: { categoria, descripcion: "Descripción suficientemente larga" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(sql).not.toHaveBeenCalled();
    });

    test.each(["", "muy corta", "x".repeat(2001)])("rechaza descripción fuera de rango", async descripcion => {
        const res = response();
        await reportTutor({ params: { id: "89" }, user: { id: 49 }, body: { categoria: "Otro", descripcion } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(sql).not.toHaveBeenCalled();
    });

    test("no permite reportar de nuevo una sesión", async () => {
        sql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ estado: "Atendida" }]);
        const res = response();
        await reportTutor({ params: { id: "89" }, user: { id: 49 }, body: { categoria: "Otro", descripcion: "Descripción del incidente" } }, res);
        expect(res.status).toHaveBeenCalledWith(409);
    });
});
