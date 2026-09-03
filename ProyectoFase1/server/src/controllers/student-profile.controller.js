const sql = require("../config/db");
const { comparePassword, hashPassword } = require("../utils/bcrypt");

const validatePasswordComplexity = password => {
    if (!password || password.length < 8) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "La contraseña debe tener al menos una mayúscula" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "La contraseña debe tener al menos una minúscula" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "La contraseña debe tener al menos un número" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: "La contraseña debe tener al menos un símbolo especial" };
    }
    return { valid: true };
};

// HU-024: Consulta y Actualización de Perfil del Estudiante
const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        const result = await sql`
            SELECT id_estudiante, nombre, apellido, carnet, genero, direccion, telefono,
                   fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro
            FROM estudiante
            WHERE id_estudiante = ${studentId}
        `;

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Estudiante no encontrado" });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...result[0],
                rol: "estudiante",
            },
        });
    } catch (error) {
        console.error("Error en getStudentProfile:", error);
        return res.status(500).json({ success: false, message: "Error interno al obtener perfil del estudiante." });
    }
};

// HU-024: Consulta y Actualización de Perfil del Estudiante
const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            nombre,
            apellido,
            genero,
            direccion,
            telefono,
            fecha_nacimiento,
            foto_url,
            password_actual,
            password_nueva,
        } = req.body || {};

        if (
            !nombre &&
            !apellido &&
            !genero &&
            !direccion &&
            !telefono &&
            !fecha_nacimiento &&
            !foto_url &&
            !password_nueva
        ) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos para actualizar",
            });
        }

        if (nombre !== undefined && (!nombre || typeof nombre !== "string" || nombre.trim().length === 0)) {
            return res.status(400).json({ success: false, message: "El nombre no puede estar vacío" });
        }
        if (apellido !== undefined && (!apellido || typeof apellido !== "string" || apellido.trim().length === 0)) {
            return res.status(400).json({ success: false, message: "El apellido no puede estar vacío" });
        }
        if (genero !== undefined && !["M", "F"].includes(genero)) {
            return res.status(400).json({ success: false, message: "El género debe ser M o F" });
        }
        if (direccion !== undefined && (!direccion || typeof direccion !== "string" || direccion.trim().length === 0)) {
            return res.status(400).json({ success: false, message: "La dirección no puede estar vacía" });
        }
        if (telefono !== undefined && (!telefono || typeof telefono !== "string" || telefono.trim().length === 0)) {
            return res.status(400).json({ success: false, message: "El teléfono no puede estar vacío" });
        }

        const updateData = {};

        if (nombre !== undefined) updateData.nombre = nombre.trim();
        if (apellido !== undefined) updateData.apellido = apellido.trim();
        if (genero !== undefined) updateData.genero = genero;
        if (direccion !== undefined) updateData.direccion = direccion.trim();
        if (telefono !== undefined) updateData.telefono = telefono.trim();
        if (fecha_nacimiento !== undefined) updateData.fecha_nacimiento = fecha_nacimiento;
        if (foto_url !== undefined) updateData.foto_url = foto_url;

        if (password_nueva !== undefined) {
            if (!password_actual) {
                return res.status(400).json({
                    success: false,
                    message: "Debes proporcionar la contraseña actual para cambiar la contraseña",
                });
            }

            const currentResult = await sql`
                SELECT password_hash FROM estudiante WHERE id_estudiante = ${studentId}
            `;

            if (currentResult.length === 0) {
                return res.status(404).json({ success: false, message: "Estudiante no encontrado" });
            }

            const isValid = await comparePassword(password_actual, currentResult[0].password_hash);
            if (!isValid) {
                return res.status(400).json({ success: false, message: "La contraseña actual es incorrecta" });
            }

            const passwordCheck = validatePasswordComplexity(password_nueva);
            if (!passwordCheck.valid) {
                return res.status(400).json({ success: false, message: passwordCheck.message });
            }

            updateData.password_hash = await hashPassword(password_nueva);
        }

        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No se proporcionaron datos válidos para actualizar" });
        }

        const result = await sql`
            UPDATE estudiante
            SET ${sql(updateData)}
            WHERE id_estudiante = ${studentId}
            RETURNING id_estudiante, nombre, apellido, carnet, genero, direccion, telefono,
                      fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro
        `;

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Estudiante no encontrado" });
        }

        return res.status(200).json({
            success: true,
            message: "Perfil actualizado correctamente",
            data: { ...result[0], rol: "estudiante" },
        });
    } catch (error) {
        console.error("Error al actualizar perfil de estudiante:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = {
    getStudentProfile,
    updateStudentProfile,
};
