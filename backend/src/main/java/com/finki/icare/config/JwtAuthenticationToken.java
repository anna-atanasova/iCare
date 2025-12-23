package com.finki.icare.config;

import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Objects;

@Getter
public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private final Integer userId;
    private final String userType;

    public JwtAuthenticationToken(
            Object principal,
            Object credentials,
            Collection<? extends GrantedAuthority> authorities,
            Integer userId,
            String userType
    ) {
        super(principal, credentials, authorities);
        this.userId = userId;
        this.userType = userType;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof JwtAuthenticationToken other)) {
            return false;
        }
        if (!super.equals(obj)) {
            return false;
        }
        return Objects.equals(this.userId, other.userId) && Objects.equals(this.userType, other.userType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId, userType);
    }
}
