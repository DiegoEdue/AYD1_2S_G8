const db = require('../config/db');

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
        // Estos 2 datos solo se puede modificar en schedule, por lo que solo son lectura en el perfil del tutor (preguntar si lo dejo o no)
        horaInicioAtencion: row.hora_inicio_atencion ? row.hora_inicio_atencion.slice(0, 5): null,
        horaFinAtencion: row.hora_fin_atencion ? row.hora_fin_atencion.slice(0, 5): null,
        subjects: subjects.map((s) => ({ id: s.id_materia, nombre: s.nombre })),
    };
}

//obtiene el perfil (esta ya esta pero la movere)
const findProfileById = async (tutorId) => {
    const result = await db.query(
        `SELECT id_tutor, nombre, apellido, carnet_id, numero_identificacion_tutor, 
            fecha_nacimiento, genero, direccion, telefono, foto_url, direccion_tutoria, 
            correo, anio_inicio_tutorias, universidad_graduacion, estado_aprobacion, 
            hora_inicio_atencion, hora_fin_atencion, fecha_registro 
        FROM tutor 
        WHERE id_tutor = $1`,
        [tutorId]
    );
    if (result.rowCount === 0) return null;
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

    for (const [key, value] of Object.entries(EDITABLE_FIELDS)) {
        if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
            setClauses.push(`${value} = $${paramIndex}`);
            values.push(updatedFields[key]);
            paramIndex += 1;
        }
    }

    if (Object.prototype.hasOwnProperty.call(updatedFields, 'passwordHash')) {
        setClauses.push(`password_hash = $${paramIndex}`);
        values.push(updatedFields.passwordHash);
        paramIndex +=1;
    }

    if (setClauses.length === 0) {
        return findProfileById(tutorId);
    }

    values.push(tutorId);
    await db.query(
        `UPDATE tutor SET ${setClauses.join(', ')} WHERE id_tutor = $${paramIndex}`,
        values
    );

    return findProfileById(tutorId);
}

const findPasswordHashById = async (tutorId) => {
    const result = await db.query(
        `SELECT password_hash FROM tutor WHERE id_tutor = $1`, 
        [tutorId]
    );
    if (result.rowCount === 0) return null;
    return result.rows[0].password_hash;
}

module.exports = {
    EDITABLE_FIELDS,
    findProfileById,
    updateProfile,
    findPasswordHashById,
}