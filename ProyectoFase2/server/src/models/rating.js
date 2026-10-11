const db = require('../config/db');

// Creamos un upsert para la calificación de una sesión, si ya existe la actualiza, si no, la crea
const upsertRating = async (id_sesion, id_estudiante, id_tutor, { estrellas, comentario }) => {
    const client = await db.pool.connect();
    try {
        // Insertar o actualizar la calificación
        // el xmax = 0 indica que es un insert, si es mayor a 0 es un update
        const result = await client.query(
            `INSERT INTO student_ratings (id_sesion, id_estudiante, id_tutor, estrellas, comentario)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id_sesion) DO UPDATE
            SET estrellas = EXCLUDED.estrellas,
                comentario = EXCLUDED.comentario,
                fecha_calificacion = NOW()
            RETURNING id_rating, id_sesion, id_estudiante, estrellas, comentario, fecha_calificacion,
            (xmax = 0) AS is_inserted`, 
            [id_sesion, id_estudiante, id_tutor, estrellas, comentario]
        );
        const row = result.rows[0];
        return {
            id: row.id_rating,
            id_sesion: row.id_sesion,
            id_estudiante: row.id_estudiante,
            id_tutor: row.id_tutor,
            estrellas: row.estrellas,
            comentario: row.comentario,
            fecha_calificacion: row.fecha_calificacion,
            created: row.is_inserted // true si es insertado, false si es actualizado
        };
    } catch (error) {
        console.error('Error al crear la calificación:', error);
        throw error;
    }
}

module.exports = {
    upsertRating
};