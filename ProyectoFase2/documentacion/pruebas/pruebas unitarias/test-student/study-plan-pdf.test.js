const test = require("node:test");
const assert = require("node:assert/strict");
const { renderStudyPlanPdf } = require("../src/utils/studyPlanPdf");

test("genera un PDF válido con recursos y firma emulada", async () => {
    const pdf = await renderStudyPlanPdf({
        id_plan: 1,
        fechaSesion: "2026-10-02",
        nombreEstudiante: "V V",
        nombreTutor: "Ana Ramírez",
        especialidades: ["Matemática Básica", "Cálculo II"],
        numeroIdentificacion: "SEED-ANA-01",
        telefonoContacto: "55550001",
        dificultades: ["Reforzar los fundamentos matemáticos"],
        recursos: [{ nombre: "Guía de ejercicios", tipo: "PDF", descripcionUso: "Resolver ejercicios" }],
    });

    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(pdf.length > 1000);
    assert.equal((pdf.toString("latin1").match(/\/Type \/Page\b/g) || []).length, 1);
});

test("genera un PDF con múltiples páginas cuando hay muchos recursos", async () => {
    const pdf = await renderStudyPlanPdf({
        id_plan: 2,
        fechaSesion: "2026-10-02",
        nombreEstudiante: "V V",
        nombreTutor: "Ana Ramírez",
        especialidades: ["Matemática Básica"],
        numeroIdentificacion: "SEED-ANA-01",
        telefonoContacto: "55550001",
        dificultades: ["Reforzar los fundamentos matemáticos"],
        recursos: Array.from({ length: 35 }, (_, index) => ({
            nombre: `Recurso ${index + 1}`,
            tipo: "Texto",
            descripcionUso: "Leer y resolver ejercicios complementarios antes de la próxima tutoría.",
        })),
    });

    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(pdf.length > 3000);
    assert.ok((pdf.toString("latin1").match(/\/Type \/Page\b/g) || []).length > 1);
});
