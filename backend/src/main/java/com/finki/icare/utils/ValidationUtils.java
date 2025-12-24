package com.finki.icare.utils;

import com.finki.icare.exceptions.ICareException;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ValidationUtils {


    public static void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw ICareException.badRequest("Password must be at least 8 characters long");
        }

        if (password.length() > 128) {
            throw ICareException.badRequest("Password must not exceed 128 characters");
        }

        boolean hasUppercase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLowercase = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);

        if (!hasUppercase) {
            throw ICareException.badRequest("Password must contain at least one uppercase letter");
        }

        if (!hasLowercase) {
            throw ICareException.badRequest("Password must contain at least one lowercase letter");
        }

        if (!hasDigit) {
            throw ICareException.badRequest("Password must contain at least one number");
        }

        if (!hasSpecial) {
            throw ICareException.badRequest("Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)");
        }
    }

    public static void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw ICareException.badRequest("Username is required");
        }

        if (username.length() < 3) {
            throw ICareException.badRequest("Username must be at least 3 characters long");
        }

        if (username.length() > 50) {
            throw ICareException.badRequest("Username must not exceed 50 characters");
        }

        if (!username.matches("^[a-zA-Z0-9_.-]+$")) {
            throw ICareException.badRequest("Username can only contain letters, numbers, dots, hyphens, and underscores");
        }
    }
}

