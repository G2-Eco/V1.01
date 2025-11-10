package com.ecommerce.backend.service;

import com.ecommerce.backend.config.EmailConfig;
import com.ecommerce.backend.model.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.EmailService;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling email verification logic including token generation, validation, and user
 * verification.
 *
 * @author Taoufiq
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final EmailConfig emailConfig;

    /**
     * Generates a new verification token for the user and sends verification email.
     *
     * @param user the user to generate token for
     */
    public void generateAndSendVerificationToken(User user) {
        // Generate new verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user);
        } catch (Exception e) {
            log.warn(
                    "Failed to send HTML verification email: {}",
                    user.getEmail());
        }

        log.info("Verification token generated and email sent for user: {}", user.getEmail());
    }

    /**
     * Verifies a user's email using the provided token.
     *
     * @param token the verification token
     * @return true if verification successful, false otherwise
     */
    public boolean verifyEmailToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.warn("Empty verification token provided");
            return false;
        }

        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            log.warn("Invalid verification token: {}", token);
            return false;
        }

        User user = userOpt.get();

        // Check if already verified
        if (user.isEmailVerified()) {
            log.info("Email already verified for user: {}", user.getEmail());
            return true;
        }

        // Check token expiration
        if (isTokenExpired(user)) {
            log.warn("Verification token expired for user: {}", user.getEmail());
            return false;
        }

        // Mark email as verified
        user.setEmailVerifiedAt(LocalDateTime.now());
        user.setVerificationToken(null); // Clear the token
        user.setUpdatedAt(LocalDateTime.now());
        user.setEnabled(true);

        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user);
        } catch (Exception e) {
            log.warn(
                    "Failed to send HTML welcome email: {}", user.getEmail());

        }

        log.info("Email verified successfully for user: {}", user.getEmail());
        return true;
    }

    /**
     * Resends verification email to a user.
     *
     * @param email the user's email address
     */
    public void resendVerificationEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required");
        }

        User user =
                userRepository
                        .findByEmail(email.trim())
                        .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        generateAndSendVerificationToken(user);
    }

    /**
     * Checks if a verification token has expired.
     *
     * @param user the user whose token to check
     * @return true if token is expired, false otherwise
     */
    public boolean isTokenExpired(User user) {
        if (user.getUpdatedAt() == null) {
            return false;
        }

        LocalDateTime tokenCreation = user.getUpdatedAt();
        LocalDateTime expirationTime =
                tokenCreation.plusSeconds(emailConfig.getTokenExpiration() / 1000);

        return LocalDateTime.now().isAfter(expirationTime);
    }

}

