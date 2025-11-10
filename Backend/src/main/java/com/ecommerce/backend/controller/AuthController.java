package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.dto.request.*;
import com.ecommerce.backend.model.dto.response.ApiResponse;
import com.ecommerce.backend.model.dto.response.AuthResponse;
import com.ecommerce.backend.service.AuthService;
import com.ecommerce.backend.service.EmailVerificationService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling user authentication endpoints including registration, login, email
 * verification, and token refresh.
 *
 * @author Taoufiq
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final Environment environment;
    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Registration successful", authResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest refreshRequest) {
        AuthResponse authResponse = authService.refreshToken(refreshRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logoutUser(request.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful", null));
    }

    /**
     * Verifies user email using the provided token.
     *
     * @param token the verification token from the email
     * @return success or error response
     */
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam("token") String token) {
        // Validate token parameter
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Verification token is required.", null));
        }

        try {
            boolean verified = emailVerificationService.verifyEmailToken(token);

            if (verified) {
                // Use configurable redirect URL (e.g., from application.properties)
                String redirectUrl =
                        environment.getProperty(
                                "frontend.email-verification-url", "http://localhost:4200/email-verification");
                HttpHeaders headers = new HttpHeaders();
                headers.setLocation(URI.create(redirectUrl));
                // Consider using 302 Found for redirect
                return ResponseEntity.status(HttpStatus.FOUND)
                        .headers(headers)
                        .body(
                                new ApiResponse<>(
                                        true, "Email verified successfully! You can now login to your account.", null));
            } else {
                return ResponseEntity.badRequest()
                        .body(
                                new ApiResponse<>(
                                        false,
                                        "Invalid or expired verification token. Please request a new verification email.",
                                        null));
            }
        } catch (IllegalArgumentException e) {
            log.error("Invalid token during email verification", e); // Avoid logging token
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Invalid verification token.", null));
        } catch (IllegalStateException e) {
            log.error("Expired token during email verification", e); // Avoid logging token
            return ResponseEntity.badRequest()
                    .body(
                            new ApiResponse<>(
                                    false, "Verification token has expired. Please request a new one.", null));
        } catch (Exception e) {
            log.error("Unexpected error during email verification", e); // Avoid logging token
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            new ApiResponse<>(
                                    false,
                                    "Email verification failed due to a server error. Please try again later.",
                                    null));
        }
    }

    /**
     * Resends verification email to the specified email address.
     *
     * @param email the user's email address
     * @return success or error response
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(
            @RequestParam("email") String email) {
        try {
            emailVerificationService.resendVerificationEmail(email);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true, "Verification email sent successfully. Please check your email.", null));
        } catch (RuntimeException e) {
            log.warn("Failed to resend verification email to: {} - {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error while resending verification email to: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            new ApiResponse<>(
                                    false, "Failed to send verification email. Please try again later.", null));
        }
    }

}
