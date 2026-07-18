package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.LoginRequest;
import org.example.dto.request.SignupRequest;
import org.example.dto.response.JwtResponse;
import org.example.entity.RefreshToken;
import org.example.entity.User;
import org.example.enums.Role;
import org.example.exception.ResourceAlreadyExistsException;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.admin.invitation-key}")
    private String adminSecret;

    @Value("${app.company.invitation-key}")
    private String companySecret;

    public JwtResponse signup(SignupRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        Role assignedRole;

        switch (request.getRole()) {

            case ROLE_STUDENT:
                assignedRole = Role.ROLE_STUDENT;
                break;

            case ROLE_COMPANY:
                if (!companySecret.equals(request.getInvitationKey())) {
                    throw new RuntimeException("Invalid company invitation key");
                }
                assignedRole = Role.ROLE_COMPANY;
                break;

            case ROLE_ADMIN:
                if (!adminSecret.equals(request.getInvitationKey())) {
                    throw new RuntimeException("Invalid admin invitation key");
                }
                assignedRole = Role.ROLE_ADMIN;
                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .branch(request.getBranch())
                .batchYear(request.getBatchYear())
                .role(assignedRole)
                .companyName(request.getCompanyName())
                .website(request.getWebsite())
                .location(request.getLocation())
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(user.getUsername());

        String refreshToken = refreshTokenService
                .createRefreshToken(user.getUsername())
                .getToken();

        return new JwtResponse(accessToken, refreshToken, user.getRole().name());
    }

    public JwtResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String accessToken = jwtService.generateToken(request.getUsername());

        String refreshToken = refreshTokenService
                .createRefreshToken(request.getUsername())
                .getToken();

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtResponse(accessToken, refreshToken, user.getRole().name());
    }

    public JwtResponse refreshToken(String requestToken) {

        RefreshToken refreshToken = refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        String accessToken = jwtService.generateToken(refreshToken.getUser().getUsername());

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(requestToken)
                .build();
    }
}