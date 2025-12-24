package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPatientRequest {
    private String username;
    private String password;
    private String name;
    private String surname;
    private String email;
}
