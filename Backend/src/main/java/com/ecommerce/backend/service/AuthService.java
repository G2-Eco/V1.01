package com.ecommerce.backend.service;


import com.ecommerce.backend.config.JwtConfig;
import com.ecommerce.backend.model.dto.request.LoginRequest;
import com.ecommerce.backend.model.dto.request.RefreshTokenRequest;
import com.ecommerce.backend.model.dto.request.RegisterRequest;
import com.ecommerce.backend.model.dto.response.AuthResponse;
import com.ecommerce.backend.model.dto.response.UserResponse;
import com.ecommerce.backend.model.entity.RefreshToken;
import com.ecommerce.backend.model.entity.User;
import com.ecommerce.backend.model.enums.Role;
import com.ecommerce.backend.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final JwtConfig jwtConfig;
    private final EmailVerificationService emailVerificationService;

    @Autowired
    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService,
            JwtConfig jwtConfig,
            EmailVerificationService emailVerificationService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.jwtConfig = jwtConfig;
        this.emailVerificationService = emailVerificationService;
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (user == null) {
                user =
                        userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
            }

            if (!user.isAccountNonLocked()) {
                throw new LockedException("Account is locked due to multiple failed attempts");
            }

            user.setLastLogin(Instant.now());
            userRepository.save(user);

            String accessToken = tokenService.generateAccessToken(user.getEmail());
            RefreshToken refreshToken = tokenService.createRefreshToken(user);

            logger.info("User {} logged in successfully", user.getEmail());

            return new AuthResponse(accessToken, refreshToken.getToken(), new UserResponse(user));

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (DisabledException e) {
            throw new RuntimeException("Account is disabled");
        }  catch (AuthenticationException e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.CLIENT);
        user.setAccountNonLocked(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Generate and send verification email
        try {
            emailVerificationService.generateAndSendVerificationToken(savedUser);
        } catch (Exception e) {
            logger.error("Failed to send verification email for user: {}", savedUser.getEmail(), e);
            // Continue with registration even if email fails - user can request resend
        }

        // Generate tokens
        String accessToken = tokenService.generateAccessToken(savedUser.getEmail());
        RefreshToken refreshToken = tokenService.createRefreshToken(savedUser);

        logger.info("New user registered with email: {}", savedUser.getEmail());

        return new AuthResponse(accessToken, refreshToken.getToken(), new UserResponse(savedUser));
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenStr = request.getRefreshToken();

        return tokenService
                .findByToken(refreshTokenStr)
                .map(tokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(
                        user -> {
                            String accessToken = tokenService.generateAccessToken(user.getEmail());
                            return new AuthResponse(
                                    accessToken, request.getRefreshToken(), new UserResponse(user));
                        })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @Transactional // Ensures atomicity for DB ops
    public void logoutUser(String refreshToken) {
        Optional<RefreshToken> optionalRefreshToken = tokenService.findByToken(refreshToken);

        if (optionalRefreshToken.isPresent()) {
            RefreshToken token = optionalRefreshToken.get();
            User user = token.getUser();
            System.out.println(user.getFullName());

            // Delete all user tokens (or just this one if multi-device: tokenService.delete(token))
            tokenService.deleteByUser(user);

            // Clear SecurityContext if in a filter/context
            SecurityContextHolder.clearContext();

            logger.info("User {} logged out successfully", user.getEmail());
        } else {
            logger.warn("Refresh token {} not found or already expired", refreshToken);
            throw new InsufficientAuthenticationException(
                    "Unauthorized - Refresh token not found or expired");
        }
    }
}

