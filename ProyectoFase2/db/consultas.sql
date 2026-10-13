
-- Consulta para obtener el promedio de calificion de tutores

SELECT t.id_tutor,
       t.nombre || ' ' || t.apellido AS nombre_completo,
       (SELECT string_agg(m.nombre, ', ' ORDER BY m.nombre)
          FROM tutor_materia tm
          JOIN materia m ON m.id_materia = tm.id_materia
         WHERE tm.id_tutor = t.id_tutor) AS especialidad,
       ROUND(AVG(r.estrellas), 2)        AS promedio,
       COUNT(r.id_rating)                AS total_calificaciones
FROM tutor t
LEFT JOIN tutor_ratings r ON r.id_tutor = t.id_tutor
WHERE t.estado_aprobacion = 'aprobado'
GROUP BY t.id_tutor
ORDER BY promedio DESC NULLS LAST, total_calificaciones DESC, nombre_completo;
