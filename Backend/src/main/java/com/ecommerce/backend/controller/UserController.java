package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.dto.request.AdminUpdateUserRequest;
import com.ecommerce.backend.model.entity.User;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println(userDetails.getUsername() + " " + userDetails.toString());
        return ResponseEntity.ok(userService.findByEmail(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AdminUpdateUserRequest updateRequest
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        // Prevent role/enabled/locked updates for self
        updateRequest.setRole(null);
        updateRequest.setEnabled(null);
        updateRequest.setLocked(null);
        
        return ResponseEntity.ok(userService.updateUser(user.getId(), updateRequest));
    }
}
