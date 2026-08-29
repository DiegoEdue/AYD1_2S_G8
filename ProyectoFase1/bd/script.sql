
-- 1) Tablas sin dependencias
CREATE TABLE materia (
    id_materia   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE administrador (
    id_administrador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario   VARCHAR(50)  NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    password2_hash   VARCHAR(255) NOT NULL
);

-- 2) Tablas que dependen de administrador
CREATE TABLE estudiante (
    id_estudiante     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    carnet            VARCHAR(20)  NOT NULL UNIQUE,
    genero            VARCHAR(20)  NOT NULL,
    direccion         VARCHAR(255) NOT NULL,
    telefono          VARCHAR(20)  NOT NULL,
    fecha_nacimiento  DATE         NOT NULL,
    foto_url          VARCHAR(255),
    correo            VARCHAR(150) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    estado_aprobacion VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    aprobado_por      INTEGER      REFERENCES administrador(id_administrador)
                       ON DELETE SET NULL ON UPDATE CASCADE,
    fecha_registro    TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_estudiante_estado
        CHECK (estado_aprobacion IN ('pendiente','aprobado','rechazado','baja'))
);

CREATE TABLE tutor (
    id_tutor                    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                      VARCHAR(100) NOT NULL,
    apellido                    VARCHAR(100) NOT NULL,
    carnet_id                   VARCHAR(20)  NOT NULL UNIQUE,
    fecha_nacimiento            DATE         NOT NULL,
    genero                      VARCHAR(20)  NOT NULL,
    direccion                   VARCHAR(255) NOT NULL,
    telefono                    VARCHAR(20)  NOT NULL,
    foto_url                    VARCHAR(255) NOT NULL,
    numero_identificacion_tutor VARCHAR(30)  NOT NULL UNIQUE,
    direccion_tutoria           VARCHAR(255) NOT NULL,
    correo                      VARCHAR(150) NOT NULL UNIQUE,
    password_hash               VARCHAR(255) NOT NULL,
    anio_inicio_tutorias        INTEGER      NOT NULL,
    universidad_graduacion      VARCHAR(150) NOT NULL,
    estado_aprobacion           VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    aprobado_por                INTEGER      REFERENCES administrador(id_administrador)
                                 ON DELETE SET NULL ON UPDATE CASCADE,
    hora_inicio_atencion        TIME,
    hora_fin_atencion           TIME,
    fecha_registro              TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_tutor_estado
        CHECK (estado_aprobacion IN ('pendiente','aprobado','rechazado','baja')),
    CONSTRAINT chk_tutor_anio
        CHECK (anio_inicio_tutorias BETWEEN 1950 AND EXTRACT(YEAR FROM now())::INTEGER),
    CONSTRAINT chk_tutor_horario
        CHECK (hora_fin_atencion IS NULL OR hora_inicio_atencion IS NULL
               OR hora_fin_atencion > hora_inicio_atencion)
);

-- 3) Tablas que dependen de tutor / materia
CREATE TABLE tutor_materia (
    id_tutor   INTEGER NOT NULL REFERENCES tutor(id_tutor)
               ON DELETE CASCADE ON UPDATE CASCADE,
    id_materia INTEGER NOT NULL REFERENCES materia(id_materia)
               ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (id_tutor, id_materia)
);

CREATE TABLE tutor_dia_atencion (
    id_tutor   INTEGER     NOT NULL REFERENCES tutor(id_tutor)
               ON DELETE CASCADE ON UPDATE CASCADE,
    dia_semana VARCHAR(10) NOT NULL,
    PRIMARY KEY (id_tutor, dia_semana),
    CONSTRAINT chk_dia_semana
        CHECK (dia_semana IN ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'))
);

-- 4) Tabla que depende de estudiante, tutor y materia
CREATE TABLE sesion (
    id_sesion           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estudiante       INTEGER      NOT NULL REFERENCES estudiante(id_estudiante)
                        ON DELETE RESTRICT ON UPDATE CASCADE,
    id_tutor            INTEGER      NOT NULL REFERENCES tutor(id_tutor)
                        ON DELETE RESTRICT ON UPDATE CASCADE,
    id_materia          INTEGER      NOT NULL REFERENCES materia(id_materia)
                        ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha_sesion        DATE         NOT NULL,
    hora_sesion         TIME         NOT NULL,
    motivo              VARCHAR(500) NOT NULL,
    resumen             TEXT,
    estado              VARCHAR(25)  NOT NULL DEFAULT 'Activa',
    fecha_creacion      TIMESTAMP    NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMP,
    CONSTRAINT chk_sesion_estado
        CHECK (estado IN ('Activa','Atendida','Cancelada_Estudiante','Cancelada_Tutor')),
    CONSTRAINT chk_sesion_resumen
        CHECK (estado <> 'Atendida' OR resumen IS NOT NULL)
);

-- 5) Restricciones adicionales sobre sesion (evitan duplicados/traslapes)

-- Un estudiante no puede tener dos sesiones activas con el mismo tutor
CREATE UNIQUE INDEX uq_sesion_activa_est_tutor
    ON sesion (id_estudiante, id_tutor)
    WHERE estado = 'Activa';

-- Un estudiante no puede tener dos sesiones el mismo día/hora
CREATE UNIQUE INDEX uq_sesion_activa_est_fecha_hora
    ON sesion (id_estudiante, fecha_sesion, hora_sesion)
    WHERE estado = 'Activa';

-- Un tutor no puede tener dos sesiones activas en el mismo día/hora (evita traslapes)
CREATE UNIQUE INDEX uq_sesion_activa_tutor_fecha_hora
    ON sesion (id_tutor, fecha_sesion, hora_sesion)
    WHERE estado = 'Activa';