package com.ecommerce.backend.model.entity;


import jakarta.persistence.*;
import java.time.Instant;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * @author Taoufiq
 */
@Entity
@Data
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    // Constructors
    public RefreshToken() {
        this.createdDate = Instant.now();
    }

    public RefreshToken(String token, User user, Instant expiryDate) {
        this();
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
    }

    // Helper method
    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }
}

