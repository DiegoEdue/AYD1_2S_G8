const pool = require('../config/db')

const findhorarioByTutorId = async (id_Tutor) => {
    const query = `
        SELECT id_tutor, hora_inicio_atencion, hora_fin_atencion
        FROM tutor
        WHERE id_tutor = $1
    `;

    const result = await pool.query(query, [id_Tutor]);

    if (result.rows.length === 0) return null;

    const { hora_inicio_atencion, hora_fin_atencion } = result.rows[0];
    if (!hora_inicio_atencion || !hora_fin_atencion) return null;

    const diasResult = await pool.query(`
        SELECT dia_semana
        FROM tutor_dia_atencion
        WHERE id_tutor = $1
    `, [id_Tutor]);
    
    const dias = diasResult.rows.map(row => row.dia_semana);

    return {
        id_Tutor,
        dias: dias,
        hora_inicio: hora_inicio_atencion.slice(0, 5), // Formatear a "HH:MM"
        hora_fin: hora_fin_atencion.slice(0, 5),
    };
}

const upsert = async (id_Tutor, { dias, startTime, endTime }) => {
    const client = await pool.connect(); 

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
    upsert
};