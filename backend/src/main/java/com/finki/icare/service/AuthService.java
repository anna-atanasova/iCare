package com.finki.icare.service;

import com.finki.icare.dto.LoginRequest;
import com.finki.icare.dto.LoginResponse;
import com.finki.icare.dto.RegisterPatientRequest;
import com.finki.icare.dto.RegisterTherapistRequest;
import com.finki.icare.enums.UserType;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.Patient;
import com.finki.icare.model.Therapist;
import com.finki.icare.model.User;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import com.finki.icare.repository.UserRepository;
import com.finki.icare.utils.ValidationUtils;
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

    public LoginResponse registerPatient(RegisterPatientRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : null;
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String name = request.getName() != null ? request.getName().trim() : null;
        String surname = request.getSurname() != null ? request.getSurname().trim() : null;

        ValidationUtils.validateUsername(username);

        if (userRepository.findByUsername(username).isPresent()) {
            throw ICareException.conflict("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw ICareException.conflict("Email already exists");
        }

        ValidationUtils.validatePassword(request.getPassword());

        Patient patient = new Patient();
        patient.setUsername(username);
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setName(name);
        patient.setSurname(surname);
        patient.setEmail(email);

        Patient savedPatient = patientRepository.save(patient);

        String token = jwtService.generateToken(savedPatient.getUsername(), savedPatient.getIdUser(), "PATIENT");

        return new LoginResponse(
                token,
                savedPatient.getUsername(),
                savedPatient.getEmail(),
                "PATIENT",
                savedPatient.getIdUser()
        );
    }

    public LoginResponse registerTherapist(RegisterTherapistRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : null;
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String name = request.getName() != null ? request.getName().trim() : null;
        String surname = request.getSurname() != null ? request.getSurname().trim() : null;
        String officeLocation = request.getOfficeLocation() != null ? request.getOfficeLocation().trim() : null;
        String degree = request.getDegree() != null ? request.getDegree().trim() : null;
        String phoneNumber = request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null;

        ValidationUtils.validateUsername(username);

        if (userRepository.findByUsername(username).isPresent()) {
            throw ICareException.conflict("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw ICareException.conflict("Email already exists");
        }

        ValidationUtils.validatePassword(request.getPassword());

        Therapist therapist = new Therapist();
        therapist.setUsername(username);
        therapist.setPassword(passwordEncoder.encode(request.getPassword()));
        therapist.setName(name);
        therapist.setSurname(surname);
        therapist.setEmail(email);
        therapist.setOfficeLocation(officeLocation);
        therapist.setDegree(degree);
        therapist.setYearsExp(request.getYearsExp());
        therapist.setPhoneNumber(phoneNumber);

        Therapist savedTherapist = therapistRepository.save(therapist);

        String token = jwtService.generateToken(savedTherapist.getUsername(), savedTherapist.getIdUser(), UserType.THERAPIST);

        return new LoginResponse(
                token,
                savedTherapist.getUsername(),
                savedTherapist.getEmail(),
                UserType.THERAPIST,
                savedTherapist.getIdUser()
        );
    }
}
