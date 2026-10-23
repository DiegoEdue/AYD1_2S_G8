const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const controllerSource = fs.readFileSync(
    path.join(__dirname, "../src/controllers/student-plan.controller.js"),
    "utf8"
);

function createController(query, renderPdf = async () => Buffer.from("%PDF-1.4")) {
    const module = { exports: {} };
    vm.runInNewContext(controllerSource, {
        module,
        process: { env: {} },
        console: { error() {} },
        require(name) {
            if (name === "../config/db") return query;
            if (name === "./student-helpers") {
                return { normalizeDate: value => value.toISOString().slice(0, 10) };
            }
            if (name === "../utils/studyPlanPdf") return { renderStudyPlanPdf: renderPdf };
            throw new Error(`Dependencia inesperada: ${name}`);
        },
    });
    return module.exports;
}

function response() {
    return {
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
        set(name, value) { this.headers ||= {}; this.headers[name] = value; return this; },
        send(body) { this.body = body; return this; },
    };
}

test("lista los planes del estudiante autenticado con dificultades y recursos", async () => {
    let queryText;
    let queryStudentId;
    const { getStudyPlans } = createController(async (parts, studentId) => {
        queryText = parts.join("?");
        queryStudentId = studentId;
        return [{
            id_plan: 7,
            id_sesion: 21,
            fecha_sesion: new Date("2026-09-20T12:00:00Z"),
            nombre_tutor: "Ana López",
            numero_identificacion_tutor: "T-123",
            especialidades: ["Matemática"],
            dificultades: [{ id: 1, descripcion: "Álgebra" }],
            recursos: [{ id: 2, nombre: "Guía", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
        }];
    });
    const res = response();

    await getStudyPlans({ user: { id: 42 } }, res);

    assert.equal(queryStudentId, 42);
    assert.match(queryText, /s\.id_estudiante = \?/);
    assert.match(queryText, /s\.estado = 'Atendida'/);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.deepEqual(JSON.parse(JSON.stringify(res.body.data)), [{
        idPlan: 7,
        idSesion: 21,
        fechaUltimaSesion: "2026-09-20",
        tutor: {
            nombreCompleto: "Ana López",
            especialidades: ["Matemática"],
            numeroIdentificacion: "T-123",
        },
        dificultadesIdentificadas: [{ id: 1, descripcion: "Álgebra" }],
        recursosRecomendados: [{ id: 2, nombre: "Guía", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
    }]);
});

test("devuelve una lista vacía si no hay planes", async () => {
    const { getStudyPlans } = createController(async () => []);
    const res = response();

    await getStudyPlans({ user: { id: 42 } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 0);
});

test("responde 500 sin revelar el error de base de datos", async () => {
    const { getStudyPlans } = createController(async () => { throw new Error("database failure"); });
    const res = response();

    await getStudyPlans({ user: { id: 42 } }, res);

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Error interno del servidor");
});

test("rechaza identificadores de plan inválidos", async () => {
    const { downloadStudyPlanPdf } = createController(() => { throw new Error("No consultar"); });
    const res = response();
    await downloadStudyPlanPdf({ params: { id: "1abc" }, user: { id: 49 } }, res);
    assert.equal(res.statusCode, 400);
});

test("no expone planes ajenos o inexistentes", async () => {
    let queryText;
    let parameters;
    const { downloadStudyPlanPdf } = createController(async (parts, ...values) => {
        queryText = parts.join("?");
        parameters = values;
        return [];
    });
    const res = response();
    await downloadStudyPlanPdf({ params: { id: "1" }, user: { id: 49 } }, res);
    assert.deepEqual(parameters, [1, 49]);
    assert.match(queryText, /s\.id_estudiante = \?/);
    assert.match(queryText, /s\.estado = 'Atendida'/);
    assert.equal(res.statusCode, 404);
});

test("envía el PDF con nombre de archivo y teléfono de contacto", async () => {
    let pdfData;
    const { downloadStudyPlanPdf } = createController(async () => [{
        id_plan: 1,
        fecha_sesion: new Date("2026-10-02T12:00:00Z"),
        nombre_estudiante: "V V",
        nombre_tutor: "Ana Ramírez",
        numero_identificacion_tutor: "T-123",
        telefono_tutor: "5555-1234",
        especialidades: ["Matemática Básica"],
        dificultades: ["Reforzar conceptos básicos"],
        recursos: [{ nombre: "Guía", tipo: "PDF", descripcionUso: "Estudiar" }],
    }], async data => { pdfData = data; return Buffer.from("%PDF-1.4"); });
    const res = response();
    await downloadStudyPlanPdf({ params: { id: "1" }, user: { id: 49 } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["Content-Type"], "application/pdf");
    assert.match(res.headers["Content-Disposition"], /educonnect-plan-1\.pdf/);
    assert.equal(pdfData.telefonoContacto, "5555-1234");
    assert.equal(pdfData.dificultades[0], "Reforzar conceptos básicos");
    assert.equal(pdfData.recursos[0].descripcionUso, "Estudiar");
    assert.equal(res.body.toString(), "%PDF-1.4");
});
