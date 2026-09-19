const db = require('../config/db')

const findhorarioByTutorId = async (id_Tutor) => {
    const result = await db.query(
        `SELECT id_tutor, hora_inicio_atencion, hora_fin_atencion
        FROM tutor
        WHERE id_tutor = $1`, 
        [id_Tutor]
    );

    if (result.rowCount === 0) return null;

    const { hora_inicio_atencion, hora_fin_atencion } = result.rows[0];
    if (!hora_inicio_atencion || !hora_fin_atencion) return null;

    const diasResult = await db.query(`
        SELECT dia_semana
        FROM tutor_dia_atencion
        WHERE id_tutor = $1`, 
        [id_Tutor]
    );
    
    const dias = diasResult.rows.map(row => row.dia_semana);

    return {
        id_Tutor,
        dias: dias,
        hora_inicio: hora_inicio_atencion.slice(0, 5), // Formatear a "HH:MM"
        hora_fin: hora_fin_atencion.slice(0, 5),
    };
}

// Devuelve las sesiones activas/programadas del tutor que quedarían FUERA
// del nuevo rango horario propuesto (días de la semana o franja [inicio, fin)).
// Considera TODAS las sesiones con estado 'Activa' (agendadas), sin importar
// si su fecha ya pasó: hasta que la sesión se atienda o se cancele, bloquea
// el cambio de horario si queda fuera del nuevo rango.
const findConflictingSessions = async (id_Tutor, { dias, startTime, endTime }) => {
    const dayCase = `
        CASE EXTRACT(DOW FROM s.fecha_sesion)
            WHEN 0 THEN 'Domingo'
            WHEN 1 THEN 'Lunes'
            WHEN 2 THEN 'Martes'
            WHEN 3 THEN 'Miercoles'
            WHEN 4 THEN 'Jueves'
            WHEN 5 THEN 'Viernes'
            WHEN 6 THEN 'Sabado'
        END`;

    const result = await db.query(
        `SELECT s.id_sesion, s.fecha_sesion, s.hora_sesion, s.motivo,
                CONCAT(e.nombre, ' ', e.apellido) AS estudiante
        FROM sesion s
        JOIN estudiante e ON s.id_estudiante = e.id_estudiante
        WHERE s.id_tutor = $1
          AND s.estado = 'Activa'
          AND (
              s.hora_sesion < $2::time
              OR s.hora_sesion >= $3::time
              OR ${dayCase} NOT IN (${dias.map((_, i) => `$${i + 4}`).join(', ')})
          )
        ORDER BY s.fecha_sesion ASC, s.hora_sesion ASC`,
        [id_Tutor, startTime, endTime, ...dias]
    );

    return result.rows.map((row) => ({
        id: row.id_sesion,
        fecha: row.fecha_sesion.toISOString().slice(0, 10),
        hora: row.hora_sesion.slice(0, 5),
        estudiante: row.estudiante,
        motivo: row.motivo,
    }));
}

const upsert = async (id_Tutor, { dias, startTime, endTime }) => {
    const client = await db.pool.connect(); // debemos de especificar que es de pool, ya que sql no tiene el

    try {
        await client.query('BEGIN');
        // Actualizar/insertar las horas de atención del tutor
        await client.query(
            `UPDATE tutor
            SET hora_inicio_atencion = $1, hora_fin_atencion = $2
            WHERE id_tutor = $3`, 
            [startTime, endTime, id_Tutor]
        );

        // Limpiamos los días anteriores en tutor_dia_atencion
        await client.query(
            `DELETE FROM tutor_dia_atencion WHERE id_tutor = $1`,
            [id_Tutor]
        ); 

        // insertar los nuevos días en tutor_dia_atencion
        for (const dia of dias) {
            await client.query(
                `INSERT INTO tutor_dia_atencion (id_tutor, dia_semana) VALUES ($1, $2)`,
                [id_Tutor, dia]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }

    return findhorarioByTutorId(id_Tutor);
}

module.exports = {
    findhorarioByTutorId,
    findConflictingSessions,
    upsert
};