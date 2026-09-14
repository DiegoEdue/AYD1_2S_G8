-- 1. Materias (catálogo)
INSERT INTO materia (nombre) VALUES ('Matemática Básica'), ('Programación I'), ('Física I');

-- 2. Administrador (usuario predeterminado/semilla)
INSERT INTO administrador (nombre_usuario, password_hash)
VALUES ('admin', '<hash>');

-- 3. Estudiantes (pueden nacer con estado 'pendiente' y aprobado_por en NULL)
INSERT INTO estudiante (nombre, apellido, carnet, genero, direccion, telefono,
                         fecha_nacimiento, correo, password_hash)
VALUES ('Ana', 'Pérez', '202312345', 'F', 'Zona 1, Mixco', '55551111',
        '2002-05-10', 'ana@correo.com', '<hash>');

-- 4. Tutores (la fotografía es opcional)
INSERT INTO tutor (nombre, apellido, carnet_id, fecha_nacimiento, genero,
                    direccion, telefono, foto_url, numero_identificacion_tutor,
                    direccion_tutoria, correo, password_hash,
                    anio_inicio_tutorias, universidad_graduacion)
VALUES ('Carlos', 'López', 'T-001', '1990-03-20', 'M', 'Zona 10',
        '55552222', 'foto1.jpg', 'ID-9001', 'Online', 'carlos@correo.com',
        '<hash>', 2015, 'USAC');

-- (Opcional, en cuanto el admin apruebe) actualizar la aprobación:
UPDATE estudiante SET estado_aprobacion = 'aprobado', aprobado_por = 1 WHERE id_estudiante = 1;
UPDATE tutor       SET estado_aprobacion = 'aprobado', aprobado_por = 1 WHERE id_tutor = 1;

-- 5. Especialidad del tutor (requiere que el tutor y las materias ya existan)
INSERT INTO tutor_materia (id_tutor, id_materia) VALUES (1, 1), (1, 2);

-- 6. Días de atención del tutor
INSERT INTO tutor_dia_atencion (id_tutor, dia_semana) VALUES (1, 'Lunes'), (1, 'Miercoles');
UPDATE tutor SET hora_inicio_atencion = '08:00', hora_fin_atencion = '12:00' WHERE id_tutor = 1;

-- 7. Sesión (requiere estudiante, tutor y materia ya existentes,
--    y que la materia sea una de las que el tutor imparte)
INSERT INTO sesion (id_estudiante, id_tutor, id_materia, fecha_sesion, hora_sesion, motivo)
VALUES (1, 1, 1, '2026-09-01', '08:30', 'Dudas de límites y derivadas');