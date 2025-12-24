package com.finki.icare.controller;

import com.finki.icare.dto.LoginRequest;
import com.finki.icare.dto.LoginResponse;
import com.finki.icare.dto.RegisterPatientRequest;
import com.finki.icare.dto.RegisterTherapistRequest;
import com.finki.icare.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/patient")
    public ResponseEntity<LoginResponse> registerPatient(@RequestBody RegisterPatientRequest request) {
        LoginResponse response = authService.registerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/therapist")
    public ResponseEntity<LoginResponse> registerTherapist(@RequestBody RegisterTherapistRequest request) {
        LoginResponse response = authService.registerTherapist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
