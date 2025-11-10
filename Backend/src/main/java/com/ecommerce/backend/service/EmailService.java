package com.ecommerce.backend.service;


import com.ecommerce.backend.config.EmailConfig;
import com.ecommerce.backend.model.entity.User;
import com.ecommerce.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


/**
 * Service for sending various types of emails including verification and welcome emails.
 *
 * @author Taoufiq
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailConfig emailConfig;
    private final UserRepository userRepository;


    /**
     * Sends a welcome email to newly verified users.
     *
     * @param user the user to send welcome email to
     */
    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailConfig.getFrom());
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Link Tracker!");

            String content =
                    String.format(
                            "Hi %s,\n\n"
                                    + "Welcome to Link Tracker! Your email has been successfully verified.\n\n"
                                    + "You can now start creating and managing your shortened links.\n\n"
                                    + "Best regards,\n"
                                    + "The Link Tracker Team",
                            user.getFirstName());

            message.setText(content);

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Sends a simple text-based verification email (fallback).
     *
     * @param user the user to send verification email to
     */
    public void sendVerificationEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailConfig.getFrom());
            message.setTo(user.getEmail());
            message.setSubject("Verify Your Email Address - Link Tracker");

            String verificationUrl =
                    emailConfig.getVerificationUrl() + "?token=" + user.getVerificationToken();

            String content =
                    String.format(
                            "Hi %s,\n\n"
                                    + "Thank you for registering!\n\n"
                                    + "Please click the following link to verify your email address:\n"
                                    + "%s\n\n"
                                    + "This verification link will expire in 24 hours.\n\n"
                                    + "If you didn't create an account with us, please ignore this email.\n\n"
                                    + "Best regards,\n"
                                    + "The Link Tracker Team",
                            user.getFirstName(), verificationUrl);

            message.setText(content);

            mailSender.send(message);
            log.info("Simple verification email sent successfully to: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Failed to send simple verification email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

}

