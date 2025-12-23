package com.finki.icare.service;

import com.finki.icare.dto.LoginRequest;
import com.finki.icare.dto.LoginResponse;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.User;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import com.finki.icare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final TherapistRepository therapistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PatientRepository patientRepository,
                       TherapistRepository therapistRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.therapistRepository = therapistRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> ICareException.unauthorized("Invalid credentials"));

//        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw ICareException.unauthorized("Invalid credentials");
//        }

        String userType;
        if (patientRepository.existsById(user.getIdUser())) {
            userType = "PATIENT";
        } else if (therapistRepository.existsById(user.getIdUser())) {
            userType = "THERAPIST";
        } else {
            throw ICareException.unauthorized("Invalid user.");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getIdUser(), userType);

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                userType,
                user.getIdUser()
        );
    }
}
