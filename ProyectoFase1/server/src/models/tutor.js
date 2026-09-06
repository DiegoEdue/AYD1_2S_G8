const db = require('../config/db');
const { comparePassword } = require('../utils/bcrypt')

// Campos editables del perfil del tutor
const EDITABLE_FIELDS = { 
    nombre: 'nombre',
    apellido: 'apellido',
    fechaNacimiento: 'fecha_nacimiento',
    genero: 'genero',
    direccion: 'direccion',
    telefono: 'telefono',
    fotoUrl: 'foto_url',
    direccionTutoria: 'direccion_tutoria',
    anioInicioTutorias: 'anio_inicio_tutorias',
    universidadGraduacion: 'universidad_graduacion',
};

function mapProfileRow(row, subjects) {
    return {
        id: row.id_tutor,
        nombre: row.nombre,
        apellido: row.apellido,
        carnetId: row.carnet_id,
        numeroIdentificacionTutor: row.numero_identificacion_tutor,
        fechaNacimiento: row.fecha_nacimiento.toISOString().slice(0, 10),
        genero: row.genero,
        direccion: row.direccion,
        telefono: row.telefono,
        fotoUrl: row.foto_url,
        direccionTutoria: row.direccion_tutoria,
        correo: row.correo,
        anioInicioTutorias: row.anio_inicio_tutorias,
        universidadGraduacion: row.universidad_graduacion,
        estadoAprobacion: row.estado_aprobacion,
        fechaRegistro: row.fecha_registro,
        horaInicioAtencion: row.hora_inicio_atencion,
        horaFinAtencion: row.hora_fin_atencion,
        subjects: subjects.map((s) => ({ id: s.id_materia, nombre: s.nombre })),
    };
}

//para el get utilzar el que esta en controller (esta ya esta pero la movere)
const findTutorById = async (tutorId) => {
    const result = await db.query(
        `SELECT id_tutor, nombre, apellido, carnet_id, fecha_nacimiento, genero, direccion, telefono, foto_url, numero_identificacion_tutor, direccion_tutoria, correo, anio_inicio_tutorias, universidad_graduacion, estado_aprobacion, hora_inicio_atencion, hora_fin_atencion, fecha_registro 
        FROM tutor WHERE id_tutor = $1`,
        [tutorId]
    );
    if (result.rows.length === 0) return null;
    const subjects = await db.query(
        `SELECT m.id_materia, m.nombre 
        FROM tutor_materia tm 
        JOIN materia m ON tm.id_materia = m.id_materia 
        WHERE tm.id_tutor = $1
        ORDER BY m.nombre ASC`,
        [tutorId]
    );
    return mapProfileRow(result.rows[0], subjects.rows);
}

// debemos de comapra que la contraseña no sea la misma
const updateProfile = async (tutorId, updatedFields) => {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Este for recorre los campos editables y verifica si están presentes en updatedFields. Si lo están, se agregan a la consulta SQL.
    for (const [key, value] of Object.entries(EDITABLE_FIELDS)) {
        if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
            setClauses.push(`${value} = $${paramIndex}`);
            values.push(updatedFields[key]);
            paramIndex += 1;
        }
    }

    if (Object.prototype.hasOwnProperty.call(updatedFields, 'passwordHash')) {
        const currentPasswordResult = await db.query(`
            SELECT password_hash FROM tutor 
            WHERE id_tutor = $1`, 
            [tutorId]
        );
        if (currentPasswordResult.rowCount === 0) return null;
        const isMatch = await comparePassword(updatedFields.passwordHash, currentPasswordResult[0].password_hash);
        if (isMatch) {
            console.log('ERROR La nueva contraseña del Tutor es la misma que la actual.');
            return {
                error: true,
                message: 'La nueva contraseña no puede ser la misma que la actual',
            };
        }
        // Si la contraseña es diferente, la hasheamos y la agregamos a la consulta SQL.
        setClauses.push(`password_hash = $${paramIndex}`);
        values.push(updatedFields.passwordHash);
        paramIndex++;
    }

    if (setClauses.length === 0) {
        return findTutorById(tutorId);
    }

    values.push(tutorId);
    await db.query(
        `UPDATE tutor SET ${setClauses.join(', ')} WHERE id_tutor = $${paramIndex}`,
        values
    );

    return findTutorById(tutorId);
}

module.exports = {
    EDITABLE_FIELDS,
    findTutorById,
    updateProfile,
}