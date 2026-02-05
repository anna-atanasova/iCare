CREATE OR REPLACE FUNCTION fn_validate_consultation_slots()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
DECLARE
    d date;
BEGIN
    IF NEW.consultation_slots IS NULL THEN
        RETURN NEW;
    END IF;

    FOREACH d IN ARRAY NEW.consultation_slots
        LOOP
            IF d < CURRENT_DATE THEN
                RAISE EXCEPTION 'consultation_slots contains past date %', d;
            END IF;
        END LOOP;

    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_consultation_slots
    BEFORE INSERT OR UPDATE
    ON therapist
    FOR EACH ROW
EXECUTE FUNCTION fn_validate_consultation_slots();


CREATE OR REPLACE FUNCTION fn_validate_therapy_exp_date()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
DECLARE
    consult_date DATE;
BEGIN
    SELECT date INTO consult_date FROM consultation WHERE id_consultation = NEW.id_consultation;
    IF consult_date IS NOT NULL AND NEW.exp_date < consult_date THEN
        RAISE EXCEPTION 'therapy.exp_date (%) cannot be before consultation date (%)', NEW.exp_date, consult_date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_therapy_exp_date
    BEFORE INSERT OR UPDATE
    ON therapy
    FOR EACH ROW
EXECUTE FUNCTION fn_validate_therapy_exp_date();


CREATE OR REPLACE FUNCTION fn_validate_diary_not_future()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.date > CURRENT_DATE THEN
        RAISE EXCEPTION 'diary.date (%) cannot be in the future', NEW.date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_diary_not_future
    BEFORE INSERT OR UPDATE
    ON diary
    FOR EACH ROW
EXECUTE FUNCTION fn_validate_diary_not_future();


CREATE OR REPLACE FUNCTION fn_validate_consultation_payment_date()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.date_of_payment IS NOT NULL AND NEW.date_of_payment < NEW.date THEN
        RAISE EXCEPTION 'consultation.date_of_payment (%) cannot be before consultation.date (%)', NEW.date_of_payment, NEW.date;
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_consultation_payment_date
    BEFORE INSERT OR UPDATE
    ON consultation
    FOR EACH ROW
EXECUTE FUNCTION fn_validate_consultation_payment_date();
