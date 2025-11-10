package com.ecommerce.backend.repository;


import com.ecommerce.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByEmail(String email);

    public boolean existsByEmail(String email);

    public Optional<User> findByVerificationToken(String verificationToken);


}
