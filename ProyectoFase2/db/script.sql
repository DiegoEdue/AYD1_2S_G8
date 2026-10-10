
-- 1) Tablas sin dependencias
CREATE TABLE materia (
    id_materia   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE administrador (
    id_administrador  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario    VARCHAR(50)  NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255) UNIQUE,
    two_factor_enable BOOLEAN      NOT NULL DEFAULT FALSE
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
    foto_url          VARCHAR(255) NOT NULL,
    correo            VARCHAR(150) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    estado_aprobacion VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    aprobado_por      INTEGER      REFERENCES administrador(id_administrador)
                       ON DELETE SET NULL ON UPDATE CASCADE,
    fecha_registro    TIMESTAMP    NOT NULL DEFAULT now(),
    carnet_pdf_url    VARCHAR(500) NOT NULL DEFAULT '',
    verification_token          VARCHAR(255) ,
    is_email_verified           BOOLEAN NOT NULL DEFAULT FALSE,
    token_created_at            TIMESTAMP DEFAULT now(),
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
    cv_pdf_url                  VARCHAR(500) NOT NULL DEFAULT '',
    verification_token          VARCHAR(255) ,
    is_email_verified           BOOLEAN NOT NULL DEFAULT FALSE,
    token_created_at            TIMESTAMP DEFAULT now(),
    CONSTRAINT chk_tutor_estado
        CHECK (estado_aprobacion IN ('pendiente','aprobado','rechazado','baja')),
    CONSTRAINT chk_tutor_anio
        CHECK (anio_inicio_tutorias BETWEEN 1950 AND EXTRACT(YEAR FROM now())::INTEGER),
    CONSTRAINT chk_tutor_horario
        CHECK (hora_fin_atencion IS NULL OR hora_inicio_atencion IS NULL
               OR hora_fin_atencion > hora_inicio_atencion)
);

-- 3) Tabla que depende de estudiante, tutor y administrador
--    (registra las solicitudes de registro pendientes de aprobación)
CREATE TABLE solicitud (
    id                  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estudiante       INTEGER REFERENCES estudiante(id_estudiante)
                        ON DELETE CASCADE ON UPDATE CASCADE,
    id_tutor            INTEGER REFERENCES tutor(id_tutor)
                        ON DELETE CASCADE ON UPDATE CASCADE,
    admin_id            INTEGER REFERENCES administrador(id_administrador)
                        ON DELETE SET NULL ON UPDATE CASCADE,
    estado              VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                        CHECK (estado IN ('pendiente', 'aceptada', 'rechazada')),
    tipo_usuario        VARCHAR(20) NOT NULL
                        CHECK (tipo_usuario IN ('estudiante', 'tutor')),
    fecha_solicitud     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_procesado     TIMESTAMP,
    motivo_rechazo      VARCHAR(255),
    CONSTRAINT chk_solicitud_relacion CHECK (
        (tipo_usuario = 'estudiante' AND id_estudiante IS NOT NULL AND id_tutor IS NULL) OR
        (tipo_usuario = 'tutor' AND id_tutor IS NOT NULL AND id_estudiante IS NULL)
    )
);

-- 4) Tablas que dependen de tutor / materia
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

-- 5) Tabla que depende de estudiante, tutor y materia
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
    estado              VARCHAR(25)  NOT NULL DEFAULT 'Activa',
    fecha_creacion      TIMESTAMP    NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMP,
    CONSTRAINT chk_sesion_estado
        CHECK (estado IN ('Activa','Atendida','Cancelada_Estudiante','Cancelada_Tutor')),
    CONSTRAINT uq_sesion_id_est_tutor UNIQUE (id_sesion, id_estudiante, id_tutor)
);

CREATE TABLE study_plans (
    id_plan int4 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion int4 NOT NULL UNIQUE,  -- 1 plan por sesión atendida
    fecha_creacion timestamp DEFAULT now() NOT NULL,
    CONSTRAINT study_plans_id_sesion_fkey
        FOREIGN KEY (id_sesion) REFERENCES public.sesion(id_sesion)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE identified_difficulties (
    id_dificultad int4 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_plan int4 NOT NULL,
    descripcion text NOT NULL,
    CONSTRAINT identified_difficulties_id_plan_fkey
        FOREIGN KEY (id_plan) REFERENCES public.study_plans(id_plan)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE recommended_resources (
    id_recurso int4 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_plan int4 NOT NULL,
    nombre varchar(150) NOT NULL,
    tipo varchar(20) NOT NULL,  -- 'Texto','Video','PDF','Enlace','Imagen'
    descripcion_uso varchar(500) NOT NULL,
    url_recurso varchar(500) NOT NULL DEFAULT '',
    CONSTRAINT recommended_resources_id_plan_fkey
        FOREIGN KEY (id_plan) REFERENCES public.study_plans(id_plan)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_recurso_tipo
        CHECK (tipo IN ('Texto','Video','PDF','Enlace','Imagen'))
);

-- Tabla de calificaciones de tutores
CREATE TABLE tutor_ratings (
    id_rating          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion          INTEGER      NOT NULL UNIQUE,   -- una sola calificación por sesión
    id_estudiante      INTEGER      NOT NULL,
    id_tutor           INTEGER      NOT NULL,
    estrellas          SMALLINT     NOT NULL,
    comentario         VARCHAR(500) NOT NULL,
    fecha_calificacion TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_tutor_rating_estrellas CHECK (estrellas BETWEEN 0 AND 5),
    CONSTRAINT tutor_ratings_sesion_fkey
        FOREIGN KEY (id_sesion, id_estudiante, id_tutor)
        REFERENCES sesion (id_sesion, id_estudiante, id_tutor)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Tabla de reportes de tutores
CREATE TABLE tutor_reports (
    id_reporte         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion          INTEGER      NOT NULL UNIQUE,   -- un solo reporte por sesión
    id_estudiante      INTEGER      NOT NULL,          -- denunciante
    id_tutor           INTEGER      NOT NULL,          -- tutor reportado
    categoria          VARCHAR(50)  NOT NULL,
    descripcion        TEXT         NOT NULL,
    estado             VARCHAR(20)  NOT NULL DEFAULT 'Pendiente',
    fecha_reporte      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_tutor_report_categoria CHECK (categoria IN (
        'Ética y profesionalismo',
        'Negligencia académica',
        'Abuso o conducta inapropiada',
        'Falsificación de información',
        'Otro'
    )),
    CONSTRAINT chk_tutor_report_estado CHECK (estado IN ('Pendiente','Resuelto','Descartado')),
    CONSTRAINT tutor_reports_sesion_fkey
        FOREIGN KEY (id_sesion, id_estudiante, id_tutor)
        REFERENCES sesion (id_sesion, id_estudiante, id_tutor)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Tabla de calificaciones de estudiantes
CREATE TABLE student_ratings (
    id_rating          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion          INTEGER      NOT NULL UNIQUE,   -- una sola calificación por sesión
    id_estudiante      INTEGER      NOT NULL,          -- estudiante calificado
    id_tutor           INTEGER      NOT NULL,          -- tutor que califica
    estrellas          SMALLINT     NOT NULL,
    comentario         VARCHAR(500) NOT NULL,
    fecha_calificacion TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_student_rating_estrellas CHECK (estrellas BETWEEN 0 AND 5),
    CONSTRAINT student_ratings_sesion_fkey
        FOREIGN KEY (id_sesion, id_estudiante, id_tutor)
        REFERENCES sesion (id_sesion, id_estudiante, id_tutor)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de reportes de estudiantes
CREATE TABLE student_reports (
    id_reporte         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion          INTEGER      NOT NULL UNIQUE,   -- un solo reporte por sesión
    id_estudiante      INTEGER      NOT NULL,          -- estudiante reportado
    id_tutor           INTEGER      NOT NULL,          -- denunciante
    categoria          VARCHAR(50)  NOT NULL,
    descripcion        TEXT         NOT NULL,
    estado             VARCHAR(20)  NOT NULL DEFAULT 'Pendiente',
    fecha_reporte      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT chk_student_report_categoria CHECK (categoria IN (
        'Conducta inapropiada',
        'Falsificación de documentos',
        'Agresión verbal o física',
        'Robo o daño a instalaciones',
        'Otro'
    )),
    CONSTRAINT chk_student_report_estado CHECK (estado IN ('Pendiente','Resuelto','Descartado')),
    CONSTRAINT student_reports_sesion_fkey
        FOREIGN KEY (id_sesion, id_estudiante, id_tutor)
        REFERENCES sesion (id_sesion, id_estudiante, id_tutor)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6) Restricciones adicionales sobre sesion (evitan duplicados/traslapes)

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
