package com.ecommerce.backend.model.dto.response;


import com.ecommerce.backend.model.entity.User;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Taoufiq
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean emailVerified;
    private Instant lastLogin;
    private LocalDateTime createdAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.emailVerified = user.isEmailVerified();
        this.lastLogin = user.getLastLogin();
        this.createdAt = user.getCreatedAt();
    }
}

