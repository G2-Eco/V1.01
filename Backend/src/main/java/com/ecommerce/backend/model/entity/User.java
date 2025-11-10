package com.ecommerce.backend.model.entity;

import com.ecommerce.backend.model.enums.Role;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    /**
     * BCrypt hashed password for email/password users. Null for OAuth-only users who authenticate
     * through external providers.
     */
    @Column private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "role", nullable = false)
    private Role role;

    /**
     * Timestamp when email verification was completed. Null indicates unverified email. Used to
     * determine account status.
     */
    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    /**
     * Random token used for email verification links. Generated during registration or email change.
     */
    @Column(name = "verification_token")
    private String verificationToken;


    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "last_login")
    private Instant lastLogin;


    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    /**
     * Returns email as the username for authentication.
     *
     * @return user's email address
     */
    @Override
    public String getUsername() {
        return email; // Using email as username
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Account is enabled only if email has been verified. Prevents unverified users from accessing
     * protected resources.
     *
     * @return true if email is verified, false otherwise
     */
    @Override
    public boolean isEnabled() {

        return enabled;
    }

    /**
     * Checks if the user's email has been verified.
     *
     * @return true if email verification is complete
     */
    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }


    /**
     * Returns the user's full name for display purposes.
     *
     * @return concatenated first and last name
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
