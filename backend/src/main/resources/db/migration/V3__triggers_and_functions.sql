CREATE OR REPLACE FUNCTION project.fn_validate_consultation_slots()
    RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = project, public
AS $$
DECLARE
    d date;
BEGIN
    IF NEW.consultation_slots IS NULL THEN
        RETURN NEW;
    END IF;

    FOREACH d IN ARRAY NEW.consultation_slots
        LOOP
            IF d < CURRENT_DATE AND (TG_OP = 'INSERT' OR OLD.consultation_slots IS NULL OR NOT (d = ANY(OLD.consultation_slots))) THEN
                RAISE EXCEPTION 'consultation_slots contains past date %', d;
            END IF;
        END LOOP;

    RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER trg_validate_consultation_slots
    BEFORE INSERT OR UPDATE
    ON project.therapist
    FOR EACH ROW
EXECUTE FUNCTION project.fn_validate_consultation_slots();


CREATE OR REPLACE FUNCTION project.fn_validate_therapy_exp_date()
    RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = project, public
AS $$
DECLARE
    consult_date DATE;
BEGIN
    SELECT date INTO consult_date FROM project.consultation WHERE id_consultation = NEW.id_consultation;
    IF consult_date IS NOT NULL AND NEW.exp_date < consult_date THEN
        RAISE EXCEPTION 'therapy.exp_date (%) cannot be before consultation date (%)', NEW.exp_date, consult_date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER trg_validate_therapy_exp_date
    BEFORE INSERT OR UPDATE
    ON project.therapy
    FOR EACH ROW
EXECUTE FUNCTION project.fn_validate_therapy_exp_date();


CREATE OR REPLACE FUNCTION project.fn_validate_diary_not_future()
    RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = project, public
AS $$
BEGIN
    IF NEW.date > CURRENT_DATE THEN
        RAISE EXCEPTION 'diary.date (%) cannot be in the future', NEW.date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER trg_validate_diary_not_future
    BEFORE INSERT OR UPDATE
    ON project.diary
    FOR EACH ROW
EXECUTE FUNCTION project.fn_validate_diary_not_future();


CREATE OR REPLACE FUNCTION project.fn_validate_consultation_payment_date()
    RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = project, public
AS $$
BEGIN
    IF NEW.date_of_payment IS NOT NULL AND NEW.date_of_payment < NEW.date THEN
        RAISE EXCEPTION 'consultation.date_of_payment (%) cannot be before consultation.date (%)', NEW.date_of_payment, NEW.date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER trg_validate_consultation_payment_date
    BEFORE INSERT OR UPDATE
    ON project.consultation
    FOR EACH ROW
EXECUTE FUNCTION project.fn_validate_consultation_payment_date();
