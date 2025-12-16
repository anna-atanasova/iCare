CREATE SCHEMA IF NOT EXISTS mental_health_app;
SET search_path = mental_health_app, public;

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
    id_user         INTEGER PRIMARY KEY,
    office_location VARCHAR(255) NOT NULL,
    degree          VARCHAR(100) NOT NULL,
    years_exp       INTEGER      NOT NULL CHECK (years_exp >= 0),
    CONSTRAINT fk_therapist_user
        FOREIGN KEY (id_user) REFERENCES "user"(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- PATIENT (extends USER)
CREATE TABLE IF NOT EXISTS patient (
    id_user      INTEGER PRIMARY KEY,
    id_therapist INTEGER NOT NULL,
    CONSTRAINT fk_patient_user
        FOREIGN KEY (id_user) REFERENCES "user"(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_patient_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE RESTRICT
);

-- BLOG
CREATE TABLE IF NOT EXISTS blog (
    id_blog      SERIAL PRIMARY KEY,
    id_patient   INTEGER NOT NULL,
    content      TEXT    NOT NULL,
    title        VARCHAR(200) NOT NULL,
    date_of_post TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_blog_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- COMMENT
CREATE TABLE IF NOT EXISTS comment (
    id_comment       SERIAL PRIMARY KEY,
    id_blog          INTEGER NOT NULL,
    id_patient       INTEGER NOT NULL,
    content          TEXT    NOT NULL,
    date_of_comment  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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

-- PAYMENT
CREATE TABLE IF NOT EXISTS payment (
    id_payment      SERIAL      PRIMARY KEY,
    id_patient      INTEGER     NOT NULL,
    date_of_payment DATE        NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payment_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- THERAPY
CREATE TABLE IF NOT EXISTS therapy (
    id_therapy SERIAL PRIMARY KEY,
    price      DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    name       VARCHAR(100) NOT NULL,
    dose       VARCHAR(50)  NOT NULL,
    exp_date   DATE         NOT NULL
);

-- CONSULTATION
CREATE TABLE IF NOT EXISTS consultation (
    id_consultations SERIAL PRIMARY KEY,
    id_therapist     INTEGER      NOT NULL,
    date             DATE  NOT NULL,
    price            DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    CONSTRAINT fk_consultation_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE RESTRICT
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

-- Therapist reviews patient with periodic advice
CREATE TABLE IF NOT EXISTS therapist_reviews_patient (
    id_review    SERIAL PRIMARY KEY,
    id_therapist INTEGER NOT NULL,
    id_patient   INTEGER NOT NULL,
    advice       TEXT NOT NULL,
    review_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_trp_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_trp_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_trp_patient_date
    ON therapist_reviews_patient (id_patient, review_date DESC);

-- Therapist prescribes therapy
CREATE TABLE IF NOT EXISTS therapist_prescribes_therapy (
    id_therapist    INTEGER NOT NULL,
    id_therapy      INTEGER NOT NULL,
    PRIMARY KEY (id_therapist, id_therapy),
    CONSTRAINT fk_tpt_therapist
        FOREIGN KEY (id_therapist) REFERENCES therapist(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_tpt_therapy
        FOREIGN KEY (id_therapy) REFERENCES therapy(id_therapy)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- Patient is prescribed therapy
CREATE TABLE IF NOT EXISTS patient_is_prescribed_therapy (
    id_patient  INTEGER NOT NULL,
    id_therapy  INTEGER NOT NULL,
    PRIMARY KEY (id_patient, id_therapy),
    CONSTRAINT fk_pipt_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pipt_therapy
        FOREIGN KEY (id_therapy) REFERENCES therapy(id_therapy)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- Payments applied to therapies
CREATE TABLE IF NOT EXISTS therapy_is_paid_by_payment (
    id_therapy INTEGER NOT NULL,
    id_payment INTEGER NOT NULL,
    PRIMARY KEY (id_therapy, id_payment),
        CONSTRAINT fk_tipbp_therapy
            FOREIGN KEY (id_therapy) REFERENCES therapy(id_therapy)
    ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_tipbp_payment
            FOREIGN KEY (id_payment) REFERENCES payment(id_payment)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- Payments applied to consultations
CREATE TABLE IF NOT EXISTS payment_for_consultation (
    id_payment       INTEGER NOT NULL,
    id_consultations INTEGER NOT NULL,
    PRIMARY KEY (id_payment, id_consultations),
    CONSTRAINT fk_pfc_payment
        FOREIGN KEY (id_payment) REFERENCES payment(id_payment)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pfc_consultation
        FOREIGN KEY (id_consultations) REFERENCES consultation(id_consultations)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- Attendance (allows group sessions)
CREATE TABLE IF NOT EXISTS patient_attends_consultation (
    id_patient       INTEGER NOT NULL,
    id_consultations INTEGER NOT NULL,
    PRIMARY KEY (id_patient, id_consultations),
    CONSTRAINT fk_pac_patient
        FOREIGN KEY (id_patient) REFERENCES patient(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pac_consultation
        FOREIGN KEY (id_consultations) REFERENCES consultation(id_consultations)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- Therapies discussed/prescribed during a specific consultation
CREATE TABLE IF NOT EXISTS consultation_prescribed_therapy (
    id_consultations INTEGER NOT NULL,
    id_therapy       INTEGER NOT NULL,
    PRIMARY KEY (id_consultations, id_therapy),
    CONSTRAINT fk_cpt_consultation
        FOREIGN KEY (id_consultations) REFERENCES consultation(id_consultations)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cpt_therapy
        FOREIGN KEY (id_therapy) REFERENCES therapy(id_therapy)
            ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_patient_therapist
    ON patient (id_therapist);

CREATE INDEX IF NOT EXISTS idx_blog_patient_date
    ON blog (id_patient, date_of_post DESC);

CREATE INDEX IF NOT EXISTS idx_comment_blog_date
    ON comment (id_blog, date_of_comment DESC);

CREATE INDEX IF NOT EXISTS idx_payment_patient_date
    ON payment (id_patient, date_of_payment DESC);

CREATE INDEX IF NOT EXISTS idx_consultation_therapist_date
    ON consultation (id_therapist, date DESC);
