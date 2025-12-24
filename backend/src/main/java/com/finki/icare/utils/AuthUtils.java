package com.finki.icare.utils;

import com.finki.icare.exceptions.ICareException;
import com.finki.icare.config.JwtAuthenticationToken;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;

@UtilityClass
public class AuthUtils {

    public static Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    public static String getUserType(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserType();
        }
        throw ICareException.unauthorized("Authentication required");
    }
}
