const path = require("node:path");
const PDFDocument = require("pdfkit");

const LOGO = path.join(__dirname, "../../assets/logo-educonnect.png");
const MARGIN = 48;
const COLORS = {
    navy: "#17345D",
    blue: "#255C9A",
    ink: "#202D3D",
    muted: "#546579",
    pale: "#EFF4FA",
    stripe: "#F7F9FC",
    border: "#D7E0EB",
    white: "#FFFFFF",
};

function renderStudyPlanPdf(plan) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: MARGIN, bufferPages: true, info: {
            Title: `Constancia de Plan de Estudio - EduConnect - ${plan.id_plan}`,
            Author: "EduConnect",
        } });
        const chunks = [];
        doc.on("data", chunk => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        try {
            const width = doc.page.width - MARGIN * 2;
            const bottom = doc.page.height - 70;
            const columns = [140, 70, width - 210];
            const formatDate = value => new Intl.DateTimeFormat("es-GT", { dateStyle: "long" }).format(value);

            function header(firstPage = false) {
                const height = firstPage ? 112 : 64;
                doc.rect(0, 0, doc.page.width, height).fill(COLORS.navy);
                if (firstPage) {
                    doc.roundedRect(MARGIN, 29, 54, 54, 8).fill(COLORS.white);
                    doc.image(LOGO, MARGIN + 7, 36, { fit: [40, 40] });
                    doc.font("Helvetica-Bold").fontSize(22).fillColor(COLORS.white)
                        .text("EduConnect", MARGIN + 70, 34);
                    doc.font("Helvetica").fontSize(10).fillColor("#D9E8F7")
                        .text("CONSTANCIA ACADÉMICA · PLAN DE ESTUDIO", MARGIN + 70, 66);
                    doc.y = 135;
                } else {
                    doc.font("Helvetica-Bold").fontSize(13).fillColor(COLORS.white)
                        .text("EduConnect", MARGIN, 21);
                    doc.font("Helvetica").fontSize(9).fillColor("#D9E8F7")
                        .text("PLAN DE ESTUDIO · CONTINUACIÓN", MARGIN + 140, 24);
                    doc.y = 85;
                }
            }

            function newPage() {
                doc.addPage();
                header();
            }

            function ensureSpace(height) {
                if (doc.y + height > bottom) newPage();
            }

            function sectionTitle(title, minimum = 38) {
                ensureSpace(minimum);
                const y = doc.y + 5;
                doc.rect(MARGIN, y, 4, 19).fill(COLORS.blue);
                doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.navy)
                    .text(title, MARGIN + 14, y + 2, { width: width - 14 });
                doc.y = y + 32;
            }

            function field(label, value, x, y, fieldWidth) {
                doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.muted)
                    .text(label.toUpperCase(), x, y, { width: fieldWidth });
                doc.font("Helvetica").fontSize(10).fillColor(COLORS.ink)
                    .text(value, x, y + 15, { width: fieldWidth });
                return doc.y - y;
            }

            function tableHeader() {
                ensureSpace(60);
                const y = doc.y;
                doc.rect(MARGIN, y, width, 30).fill(COLORS.navy);
                doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.white);
                ["Nombre", "Tipo", "Descripción de uso"].forEach((label, index) => {
                    const x = MARGIN + columns.slice(0, index).reduce((sum, col) => sum + col, 0);
                    doc.text(label, x + 9, y + 9, { width: columns[index] - 18 });
                });
                doc.y = y + 30;
            }

            header(true);

            // Datos de emisión: el teléfono institucional es configurable; si falta, se usa el del tutor.
            const issueY = doc.y;
            doc.roundedRect(MARGIN, issueY, width, 69, 8).fill(COLORS.pale);
            field("Fecha de emisión", formatDate(new Date()), MARGIN + 16, issueY + 13, 155);
            field("Teléfono de contacto", plan.telefonoContacto, MARGIN + 183, issueY + 13, 165);
            field("N.º de plan", String(plan.id_plan).padStart(5, "0"), MARGIN + 362, issueY + 13, width - 378);
            doc.y = issueY + 86;

            sectionTitle("Datos de la tutoría", 124);
            const detailsY = doc.y;
            doc.font("Helvetica").fontSize(10);
            const row1 = Math.max(
                field("Estudiante", plan.nombreEstudiante, MARGIN, detailsY, 235),
                field("Fecha de la sesión", formatDate(new Date(`${plan.fechaSesion}T12:00:00`)), MARGIN + 255, detailsY, width - 255)
            );
            const row2Y = detailsY + Math.max(row1, 43);
            const row2 = Math.max(
                field("Tutor", plan.nombreTutor, MARGIN, row2Y, 235),
                field("Especialidades", plan.especialidades.join(", ") || "No registradas", MARGIN + 255, row2Y, width - 255)
            );
            doc.y = row2Y + Math.max(row2, 43) + 10;
            doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + width, doc.y)
                .strokeColor(COLORS.border).stroke();
            doc.y += 13;

            sectionTitle("Dificultades identificadas", 65);
            if (plan.dificultades.length === 0) {
                doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted)
                    .text("No se registraron dificultades identificadas.", MARGIN + 14, doc.y);
                doc.y += 12;
            }
            plan.dificultades.forEach((descripcion, index) => {
                doc.font("Helvetica").fontSize(9);
                const height = Math.max(26, doc.heightOfString(descripcion, { width: width - 55 }) + 12);
                ensureSpace(height);
                const y = doc.y;
                doc.circle(MARGIN + 12, y + 10, 10).fill(COLORS.pale);
                doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.blue)
                    .text(String(index + 1), MARGIN + 7, y + 5, { width: 10, align: "center" });
                doc.font("Helvetica").fontSize(9).fillColor(COLORS.ink)
                    .text(descripcion, MARGIN + 31, y + 4, { width: width - 43 });
                doc.y = y + height;
            });

            doc.y += 11;
            sectionTitle("Recursos recomendados", 75);
            tableHeader();
            if (plan.recursos.length === 0) {
                doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted)
                    .text("No se registraron recursos recomendados.", MARGIN + 9, doc.y + 9);
                doc.y += 16;
            }
            plan.recursos.forEach((recurso, index) => {
                const values = [recurso.nombre, recurso.tipo, recurso.descripcionUso];
                doc.font("Helvetica").fontSize(9);
                const height = Math.max(34, ...values.map((value, i) =>
                    doc.heightOfString(value, { width: columns[i] - 18 }) + 18));
                if (doc.y + height > bottom) { newPage(); tableHeader(); }
                const y = doc.y;
                if (index % 2 === 1) doc.rect(MARGIN, y, width, height).fill(COLORS.stripe);
                let x = MARGIN;
                values.forEach((value, i) => {
                    doc.font("Helvetica").fontSize(9).fillColor(COLORS.ink)
                        .text(value, x + 9, y + 9, { width: columns[i] - 18 });
                    x += columns[i];
                });
                doc.moveTo(MARGIN, y + height).lineTo(MARGIN + width, y + height)
                    .strokeColor(COLORS.border).stroke();
                doc.y = y + height;
            });

            ensureSpace(120);
            const signatureY = doc.y + 29;
            doc.font("Helvetica-Oblique").fontSize(14).fillColor(COLORS.navy)
                .text(`/s/ ${plan.nombreTutor}`, MARGIN, signatureY, { width: width });
            doc.moveTo(MARGIN, signatureY + 27).lineTo(MARGIN + 260, signatureY + 27)
                .strokeColor(COLORS.navy).stroke();
            doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.ink)
                .text(plan.nombreTutor, MARGIN, signatureY + 34, { width });
            doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted)
                .text(`Especialidades: ${plan.especialidades.join(", ") || "No registradas"}`, MARGIN, doc.y + 3, { width })
                .text(`Número de identificación: ${plan.numeroIdentificacion}`, MARGIN, doc.y + 3, { width })
                .text("Firma emulada del tutor; no es una firma criptográfica.", MARGIN, doc.y + 6, { width });

            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                // El pie está debajo del margen de contenido; evitar que PDFKit añada páginas vacías.
                const originalBottomMargin = doc.page.margins.bottom;
                doc.page.margins.bottom = 0;
                const footerY = doc.page.height - 47;
                doc.moveTo(MARGIN, footerY).lineTo(MARGIN + width, footerY)
                    .strokeColor(COLORS.border).stroke();
                doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted)
                    .text("EduConnect · Constancia de tutoría académica", MARGIN, footerY + 10,
                        { width: width - 85 });
                doc.text(`Página ${i - range.start + 1} de ${range.count}`,
                    MARGIN + width - 85, footerY + 10, { width: 85, align: "right" });
                doc.page.margins.bottom = originalBottomMargin;
            }
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { renderStudyPlanPdf };
