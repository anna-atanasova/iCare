-- ========== TABLES ==========

-- USER
CREATE TABLE IF NOT EXISTS "user" (
    id_user       SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    surname       VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL
);

-- THERAPIST (extends USER)
CREATE TABLE IF NOT EXISTS therapist (
    id_user              INTEGER PRIMARY KEY,
    office_location      VARCHAR(255) NOT NULL,
    degree               VARCHAR(100) NOT NULL,
    years_exp            INTEGER      NOT NULL CHECK (years_exp >= 0),
    consultation_slots   DATE[],
    CONSTRAINT fk_therapist_user
        FOREIGN KEY (id_user) REFERENCES "user"(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- PATIENT (extends USER)
CREATE TABLE IF NOT EXISTS patient (
    id_user      INTEGER PRIMARY KEY,
    id_therapist INTEGER,
    CONSTRAINT fk_patient_user
        FOREIGN KEY (id_user) REFERENCES "user"(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_patient_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE SET NULL
);

-- BLOG
CREATE TABLE IF NOT EXISTS blog (
    id_blog      SERIAL PRIMARY KEY,
    id_patient   INTEGER        NOT NULL,
    content      TEXT           NOT NULL,
    title        VARCHAR(200)   NOT NULL,
    date_of_post TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_blog_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- COMMENT
CREATE TABLE IF NOT EXISTS comment (
    id_comment       SERIAL PRIMARY KEY,
    id_blog          INTEGER        NOT NULL,
    id_patient       INTEGER        NOT NULL,
    content          TEXT           NOT NULL,
    date_of_comment  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_comment_blog
        FOREIGN KEY (id_blog) REFERENCES blog(id_blog)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_comment_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- DIARY
CREATE TABLE IF NOT EXISTS diary (
    id_diary     SERIAL PRIMARY KEY,
    id_patient   INTEGER   NOT NULL,
    date         DATE      NOT NULL,
    daily_rating SMALLINT  NOT NULL CHECK (daily_rating BETWEEN 1 AND 10),
    content      TEXT      NOT NULL,
    CONSTRAINT uq_diary_patient_date UNIQUE (id_patient, date),
    CONSTRAINT fk_diary_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- CONSULTATION
CREATE TABLE IF NOT EXISTS consultation (
    id_consultation  SERIAL PRIMARY KEY,
    id_patient       INTEGER        NOT NULL,
    id_therapist     INTEGER        NOT NULL,
    date             DATE           NOT NULL,
    date_of_payment  DATE           NULL,
    price            DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
    advice           TEXT,
    CONSTRAINT fk_consultation_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_consultation_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- THERAPY
CREATE TABLE IF NOT EXISTS therapy (
    id_therapy SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    dose            VARCHAR(50)     NOT NULL,
    exp_date        DATE            NOT NULL,
    id_consultation INTEGER         NOT NULL,
    CONSTRAINT fk_therapy_consultation
       FOREIGN KEY (id_consultation) REFERENCES consultation(id_consultation)
           ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========== RELATIONS ==========

-- Likes: patients <-> blogs
CREATE TABLE IF NOT EXISTS patient_likes_blog (
    id_patient INTEGER NOT NULL,
    id_blog    INTEGER NOT NULL,
    PRIMARY KEY (id_patient, id_blog),
    CONSTRAINT fk_plb_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_plb_blog
        FOREIGN KEY (id_blog) REFERENCES blog(id_blog)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_patient_therapist
    ON patient (id_therapist);

CREATE INDEX IF NOT EXISTS idx_blog_patient_date
    ON blog (id_patient, date_of_post DESC);

CREATE INDEX IF NOT EXISTS idx_comment_blog_date
    ON comment (id_blog, date_of_comment DESC);

CREATE INDEX IF NOT EXISTS idx_consultation_patient_date
    ON consultation (id_patient, date DESC);

CREATE INDEX IF NOT EXISTS idx_consultation_therapist_date
    ON consultation (id_therapist, date DESC);

